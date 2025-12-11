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
    const data = await request.json();

    // Build update data
    const updateData: Record<string, unknown> = {};

    if (data.status !== undefined) {
      const validStatuses = ["INQUIRY", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];
      if (!validStatuses.includes(data.status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      updateData.status = data.status;
    }

    if (data.guestName !== undefined) updateData.guestName = data.guestName;
    if (data.guestEmail !== undefined) updateData.guestEmail = data.guestEmail;
    if (data.guestPhone !== undefined) updateData.guestPhone = data.guestPhone;
    if (data.eventType !== undefined) updateData.eventType = data.eventType;
    if (data.eventDate !== undefined) updateData.eventDate = new Date(data.eventDate);
    if (data.guestCount !== undefined) updateData.guestCount = data.guestCount;
    if (data.message !== undefined) updateData.message = data.message;
    if (data.adminNotes !== undefined) updateData.adminNotes = data.adminNotes;

    const event = await prisma.eventBooking.update({
      where: { id },
      data: updateData,
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json({ event });
  } catch (error) {
    console.error("Update event error:", error);
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.eventBooking.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete event error:", error);
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}
