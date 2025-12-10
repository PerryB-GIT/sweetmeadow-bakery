import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // For now, log the submission
    console.log("Contact form submission:", { name, email, message });

    // TODO: Add email sending with Resend
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: "Sweet Meadow <noreply@sweetmeadow-bakery.com>",
    //   to: "sweetmeadowbakery@gmail.com",
    //   subject: `New Contact: ${name}`,
    //   text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
