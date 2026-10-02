import { NextResponse } from 'next/server';
import { getOrders, createOrder } from '@/lib/db';

export const dynamic = 'force-dynamic';

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userIdParam = searchParams.get('userId') || undefined;
    
    // Normal users can only fetch their own orders
    if ((session.user as any).role !== 'ADMIN' && userIdParam && (session.user as any).id !== userIdParam) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Determine whose orders to fetch
    const effectiveUserId = (session.user as any).role === 'ADMIN' ? userIdParam : (session.user as any).id;

    const orders = await getOrders(effectiveUserId);
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.customerName || !body.customerEmail || !body.customerPhone) {
      return NextResponse.json(
        { error: 'Customer contact information is required' },
        { status: 400 }
      );
    }

    if (!body.shippingAddress || !body.shippingAddress.street || !body.shippingAddress.city) {
      return NextResponse.json(
        { error: 'Valid shipping address is required' },
        { status: 400 }
      );
    }

    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty, cannot place an empty order' },
        { status: 400 }
      );
    }

    const order = await createOrder({
      userId: body.userId,
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      customerPhone: body.customerPhone,
      shippingAddress: body.shippingAddress,
      deliveryNote: body.deliveryNote,
      items: body.items,
      couponCode: body.couponCode,
      paymentMethod: body.paymentMethod || 'COD',
    });

    if (body.paymentMethod === 'ONLINE') {
      const uddoktaPayApiKey = process.env.UDDOKTAPAY_API_KEY;
      const uddoktaPayBaseUrl = process.env.UDDOKTAPAY_BASE_URL;

      if (uddoktaPayApiKey && uddoktaPayBaseUrl) {
        const origin = request.headers.get('origin') || process.env.NEXTAUTH_URL || 'http://localhost:3000';
        const paymentData = {
          full_name: body.customerName,
          email: body.customerEmail,
          amount: order.total, // using total from DB, it's safer
          metadata: { order_id: order.id },
          redirect_url: `${origin}/api/uddoktapay/success?orderId=${order.id}`,
          cancel_url: `${origin}/api/uddoktapay/cancel`,
          webhook_url: `${origin}/api/uddoktapay/webhook`,
        };

        try {
          const upRes = await fetch(`${uddoktaPayBaseUrl}/api/checkout-v2`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'RT-UDDOKTAPAY-API-KEY': uddoktaPayApiKey,
            },
            body: JSON.stringify(paymentData),
          });

          const upData = await upRes.json();
          if (upData.status && upData.payment_url) {
            return NextResponse.json({ ...order, paymentUrl: upData.payment_url }, { status: 201 });
          }
        } catch (err) {
          console.error('UddoktaPay creation error:', err);
        }
      }
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to place order' },
      { status: 400 }
    );
  }
}
