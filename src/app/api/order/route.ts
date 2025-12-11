import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function generateOrderNumber(): string {
  const prefix = "SMB";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, items, pickupDate, message } = body;

    if (!name || !email || !items || items.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if user is logged in
    const session = await auth();
    const userId = session?.user?.id || null;

    // Calculate total from items
    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (product) {
        total += product.price * item.quantity;
        orderItems.push({
          productId: product.id,
          quantity: item.quantity,
          unitPrice: product.price,
        });
      }
    }

    // Create order with items
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId,
        guestName: userId ? null : name,
        guestEmail: userId ? null : email,
        guestPhone: userId ? null : phone,
        status: "PENDING",
        subtotal: total,
        total,
        pickupDate: pickupDate ? new Date(pickupDate) : null,
        notes: message || null,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Award loyalty points if logged in (1 point per dollar spent)
    if (userId) {
      await prisma.loyaltyPoint.create({
        data: {
          userId,
          points: Math.floor(total),
          type: "EARNED",
          description: `Order #${order.orderNumber}`,
        },
      });
    }

    // TODO: Add email sending with Resend
    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      total: order.total,
    });
  } catch (error) {
    console.error("Order form error:", error);
    return NextResponse.json({ error: "Failed to submit order" }, { status: 500 });
  }
}
