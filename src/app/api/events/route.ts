import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, eventType, eventDate, guestCount, message } = body;

    console.log("Event inquiry:", { name, email, phone, eventType, eventDate, guestCount, message });

    // TODO: Add email sending with Resend
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Events form error:", error);
    return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 });
  }
}
