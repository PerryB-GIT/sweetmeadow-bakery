import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const [
      todayOrders,
      pendingOrders,
      todayRevenueAgg,
      weekRevenueAgg,
      totalCustomers,
      lowStockItems,
      recentOrders,
    ] = await Promise.all([
      prisma.order.count({ where: { createdAt: { gte: today } } }),
      prisma.order.count({ where: { status: { in: ["PENDING", "CONFIRMED"] } } }),
      prisma.order.aggregate({
        where: { createdAt: { gte: today }, status: { not: "CANCELLED" } },
        _sum: { total: true },
      }),
      prisma.order.aggregate({
        where: { createdAt: { gte: weekAgo }, status: { not: "CANCELLED" } },
        _sum: { total: true },
      }),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.inventory.count({ where: { quantity: { lte: 5 } } }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { user: { select: { name: true } } },
      }),
    ]);

    return NextResponse.json({
      todayOrders,
      pendingOrders,
      todayRevenue: todayRevenueAgg._sum.total || 0,
      weekRevenue: weekRevenueAgg._sum.total || 0,
      totalCustomers,
      lowStockItems,
      recentOrders,
      popularProducts: [],
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
