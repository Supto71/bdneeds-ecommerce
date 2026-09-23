import { NextResponse } from 'next/server';
import { getInventoryStatus, updateStock } from '@/lib/db';

export async function GET() {
  try {
    const inventory = await getInventoryStatus();
    return NextResponse.json(inventory);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { productId, variantId, stock } = await request.json();

    if (!productId || stock === undefined) {
      return NextResponse.json(
        { error: 'Product ID and stock quantity are required' },
        { status: 400 }
      );
    }

    const success = await updateStock(productId, variantId, Number(stock));
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update stock. Product or variant not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, stock: Number(stock) });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update stock' }, { status: 500 });
  }
}
