import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function generateInvoiceNumber(): string {
  const prefix = "INV";
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${year}-${random}`;
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const invoices = await prisma.invoice.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        items: true,
      },
    });

    return NextResponse.json({ invoices });
  } catch (error) {
    console.error("Invoices error:", error);
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { userId, guestName, guestEmail, guestPhone, guestAddress, dueDate, notes, terms, subtotal, tax, total, items } = data;

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber: generateInvoiceNumber(),
        userId: userId || null,
        guestName,
        guestEmail,
        guestPhone: guestPhone || null,
        guestAddress: guestAddress || null,
        status: "DRAFT",
        subtotal,
        tax,
        total,
        dueDate: dueDate ? new Date(dueDate) : null,
        notes: notes || null,
        terms: terms || null,
        items: {
          create: items.map((item: { description: string; quantity: number; unitPrice: number; total: number }) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.total,
          })),
        },
      },
      include: {
        user: { select: { name: true, email: true } },
        items: true,
      },
    });

    return NextResponse.json({ invoice }, { status: 201 });
  } catch (error) {
    console.error("Create invoice error:", error);
    return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 });
  }
}
