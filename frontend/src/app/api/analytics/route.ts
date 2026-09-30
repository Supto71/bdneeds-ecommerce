import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "today";

    const now = new Date();
    let startDate: Date;
    if (period === "today") {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    } else if (period === "week") {
      startDate = new Date(now); startDate.setDate(now.getDate() - 7);
    } else if (period === "month") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (period === "year") {
      startDate = new Date(now.getFullYear(), 0, 1);
    } else {
      startDate = new Date(0);
    }

    const [
      periodRevenueResult,
      periodOrderCount,
      totalOrders,
      activeProductCount,
      regularCustomerCount,
      recentOrders,
      allPaidOrders,
      categoryItems,
      lowStockCount,
      pendingOrders,
      completedOrders,
    ] = await Promise.all([
      prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: "PAID", createdAt: { gte: startDate } } }),
      prisma.order.count({ where: { createdAt: { gte: startDate } } }),
      prisma.order.count(),
      prisma.product.count({ where: { isPublished: true } }),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 10, include: { items: true } }),
      prisma.order.findMany({ where: { paymentStatus: "PAID" }, select: { createdAt: true, total: true } }),
      prisma.orderItem.findMany({ include: { product: { select: { categoryName: true } } } }),
      prisma.product.count({ where: { stock: { lte: 5, gt: 0 } } }),
      prisma.order.count({ where: { orderStatus: "PENDING" } }),
      prisma.order.count({ where: { orderStatus: "DELIVERED" } }),
    ]);

    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const monthlyMap: Record<string, number> = {};
    allPaidOrders.forEach((row) => {
      const m = monthNames[new Date(row.createdAt).getMonth()];
      monthlyMap[m] = (monthlyMap[m] || 0) + Number(row.total || 0);
    });
    const revenueHistory = Object.entries(monthlyMap).map(([month, revenue]) => ({ month, revenue }));

    const catMap: Record<string, number> = {};
    categoryItems.forEach((item: any) => {
      const cat = item.product?.categoryName || "Other";
      catMap[cat] = (catMap[cat] || 0) + Number(item.price || 0) * Number(item.quantity || 1);
    });

    return NextResponse.json({
      period,
      periodRevenue: periodRevenueResult._sum.total || 0,
      periodOrders: periodOrderCount,
      totalRevenue: periodRevenueResult._sum.total || 0,
      totalOrders,
      activeProducts: activeProductCount,
      totalCustomers: regularCustomerCount,
      lowStockCount,
      pendingOrders,
      completedOrders,
      revenueHistory,
      categorySales: catMap,
      recentOrders,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
