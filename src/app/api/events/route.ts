import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, eventType, eventDate, guestCount, message } = body;

    if (!name || !email || !eventType || !eventDate || !guestCount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if user is logged in
    const session = await auth();
    const userId = session?.user?.id || null;

    // Save to database
    const booking = await prisma.eventBooking.create({
      data: {
        userId,
        guestName: userId ? null : name,
        guestEmail: userId ? null : email,
        guestPhone: userId ? null : phone,
        eventType,
        eventDate: new Date(eventDate),
        guestCount: parseInt(guestCount),
        message: message || null,
        status: "PENDING",
      },
    });

    // TODO: Add email sending with Resend
    return NextResponse.json({ success: true, bookingId: booking.id });
  } catch (error) {
    console.error("Events form error:", error);
    return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 });
  }
}
