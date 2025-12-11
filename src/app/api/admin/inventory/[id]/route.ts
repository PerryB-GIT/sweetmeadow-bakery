import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { quantity, lowStockAlert } = await request.json();

    // Get current inventory for logging
    const current = await prisma.inventory.findUnique({ where: { id } });
    if (!current) {
      return NextResponse.json({ error: "Inventory not found" }, { status: 404 });
    }

    const updateData: { quantity?: number; lowStockAlert?: number } = {};
    if (quantity !== undefined) updateData.quantity = quantity;
    if (lowStockAlert !== undefined) updateData.lowStockAlert = lowStockAlert;

    const inventory = await prisma.inventory.update({
      where: { id },
      data: updateData,
    });

    // Log the change if quantity changed
    if (quantity !== undefined && quantity !== current.quantity) {
      await prisma.inventoryLog.create({
        data: {
          inventoryId: inventory.id,
          change: quantity - current.quantity,
          reason: "Manual adjustment",
          createdBy: session.user.id,
        },
      });
    }

    return NextResponse.json({ inventory });
  } catch (error) {
    console.error("Update inventory error:", error);
    return NextResponse.json({ error: "Failed to update inventory" }, { status: 500 });
  }
}
