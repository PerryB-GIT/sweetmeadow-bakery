import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [orders, loyaltyPoints, favoritesCount] = await Promise.all([
      prisma.order.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          orderNumber: true,
          status: true,
          total: true,
          createdAt: true,
        },
      }),
      prisma.loyaltyPoint.aggregate({
        where: { userId: session.user.id },
        _sum: { points: true },
      }),
      prisma.favorite.count({
        where: { userId: session.user.id },
      }),
    ]);

    return NextResponse.json({
      recentOrders: orders,
      loyaltyPoints: loyaltyPoints._sum.points || 0,
      favoritesCount,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard" }, { status: 500 });
  }
}
