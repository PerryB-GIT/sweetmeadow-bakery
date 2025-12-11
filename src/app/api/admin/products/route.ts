import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Products error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description, price, categoryId, featured, available } = await request.json();

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        categoryId: categoryId || null,
        featured: featured || false,
        available: available !== false,
      },
      include: {
        category: { select: { id: true, name: true } },
      },
    });

    // Create inventory record
    await prisma.inventory.create({
      data: {
        productId: product.id,
        quantity: 0,
        lowStockAlert: 5,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
