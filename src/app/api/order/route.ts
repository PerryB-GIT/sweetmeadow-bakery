import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, item, quantity, pickupDate, message } = body;

    console.log("Order submission:", { name, email, phone, item, quantity, pickupDate, message });

    // TODO: Add email sending with Resend
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Order form error:", error);
    return NextResponse.json({ error: "Failed to submit order" }, { status: 500 });
  }
}
