import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [history, aggregate] = await Promise.all([
      prisma.loyaltyPoint.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
      }),
      prisma.loyaltyPoint.aggregate({
        where: { userId: session.user.id },
        _sum: { points: true },
      }),
    ]);

    return NextResponse.json({
      history,
      total: aggregate._sum.points || 0,
    });
  } catch (error) {
    console.error("Loyalty error:", error);
    return NextResponse.json({ error: "Failed to fetch loyalty" }, { status: 500 });
  }
}
