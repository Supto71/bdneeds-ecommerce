import { NextResponse } from 'next/server';
import { getUsers, getOrders } from '@/lib/db';

export async function GET() {
  try {
    const users = await getUsers();
    const customers = users.filter((u) => u.role === 'CUSTOMER');
    const allOrders = await getOrders();

    const customerSummaries = customers.map((c) => {
      const orders = allOrders.filter((o) => o.userId === c.id);
      const totalSpent = orders
        .filter((o) => o.orderStatus !== 'CANCELLED')
        .reduce((sum, o) => sum + o.total, 0);
      const lastOrder = orders[0]?.createdAt || null;

      const now = new Date();
      const accountAgeDays = (now.getTime() - new Date(c.createdAt).getTime()) / (1000 * 60 * 60 * 24);
      
      let clientTag = 'Regular Client';
      
      if (c.isFraud) {
        clientTag = 'Fraud Client';
      } else if (accountAgeDays < 30) {
        clientTag = 'New Client';
      } else {
        const recentOrders = orders.filter(o => (now.getTime() - new Date(o.createdAt).getTime()) / (1000 * 60 * 60 * 24) <= 30);
        if (recentOrders.length >= 3) {
          clientTag = 'VIP Client';
        } else if (orders.length >= 2) {
          const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          const gapDays = (new Date(sortedOrders[0].createdAt).getTime() - new Date(sortedOrders[1].createdAt).getTime()) / (1000 * 60 * 60 * 24);
          if (gapDays > 60) {
            clientTag = 'Return Client';
          }
        }
      }

      const { password: _, ...safeCustomer } = c;
      return {
        ...safeCustomer,
        ordersCount: orders.length,
        totalSpent: Number(totalSpent.toFixed(2)),
        lastOrder,
        clientTag,
      };
    });

    return NextResponse.json(customerSummaries);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}
