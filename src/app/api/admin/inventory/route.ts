import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const inventory = await prisma.inventory.findMany({
      orderBy: { quantity: "asc" },
      include: {
        product: { select: { id: true, name: true, price: true } },
      },
    });

    return NextResponse.json({ inventory });
  } catch (error) {
    console.error("Inventory error:", error);
    return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 });
  }
}
