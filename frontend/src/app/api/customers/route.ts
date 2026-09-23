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

      const { password: _, ...safeCustomer } = c;
      return {
        ...safeCustomer,
        ordersCount: orders.length,
        totalSpent: Number(totalSpent.toFixed(2)),
        lastOrder,
      };
    });

    return NextResponse.json(customerSummaries);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}
