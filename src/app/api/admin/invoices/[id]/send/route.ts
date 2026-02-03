import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, email: true } },
        items: true,
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const recipientEmail = invoice.user?.email || invoice.guestEmail;
    const recipientName = invoice.user?.name || invoice.guestName || "Customer";

    if (!recipientEmail) {
      return NextResponse.json({ error: "No email address for invoice recipient" }, { status: 400 });
    }

    // Generate invoice HTML for email
    const itemsHtml = invoice.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.description}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">$${item.unitPrice.toFixed(2)}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">$${item.total.toFixed(2)}</td>
        </tr>
      `
      )
      .join("");

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Invoice #${invoice.invoiceNumber}</title>
      </head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #8B4513; font-family: Georgia, serif; margin: 0;">Sweet Meadow Bakery</h1>
          <p style="color: #666; margin: 5px 0;">Beverly, MA | {BUSINESS_PHONE}</p>
        </div>

        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="margin: 0 0 10px 0;">Invoice #${invoice.invoiceNumber}</h2>
          <p style="margin: 0; color: #666;">Date: ${new Date(invoice.createdAt).toLocaleDateString()}</p>
          ${invoice.dueDate ? `<p style="margin: 0; color: #666;">Due: ${new Date(invoice.dueDate).toLocaleDateString()}</p>` : ""}
        </div>

        <div style="margin-bottom: 20px;">
          <p style="margin: 0;"><strong>Bill To:</strong></p>
          <p style="margin: 5px 0;">${recipientName}</p>
          <p style="margin: 0; color: #666;">${recipientEmail}</p>
          ${invoice.guestAddress ? `<p style="margin: 0; color: #666;">${invoice.guestAddress}</p>` : ""}
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background: #8B4513; color: white;">
              <th style="padding: 12px; text-align: left;">Description</th>
              <th style="padding: 12px; text-align: center;">Qty</th>
              <th style="padding: 12px; text-align: right;">Price</th>
              <th style="padding: 12px; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="text-align: right; margin-bottom: 20px;">
          <p style="margin: 5px 0;"><strong>Subtotal:</strong> $${invoice.subtotal.toFixed(2)}</p>
          <p style="margin: 5px 0;"><strong>Tax (6.25%):</strong> $${invoice.tax.toFixed(2)}</p>
          <p style="margin: 10px 0; font-size: 18px;"><strong>Total:</strong> <span style="color: #8B4513;">$${invoice.total.toFixed(2)}</span></p>
        </div>

        ${invoice.notes ? `<div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 15px;"><strong>Notes:</strong><br>${invoice.notes}</div>` : ""}
        ${invoice.terms ? `<div style="color: #666; font-size: 12px; border-top: 1px solid #eee; padding-top: 15px;"><strong>Terms:</strong><br>${invoice.terms}</div>` : ""}

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #666; margin: 0;">Thank you for your business!</p>
          <p style="color: #8B4513; margin: 5px 0;">Sweet Meadow Bakery</p>
        </div>
      </body>
      </html>
    `;

    // For now, log the email (in production, use a service like Resend, SendGrid, etc.)
    console.log(`
      ========== INVOICE EMAIL ==========
      To: ${recipientEmail}
      Subject: Invoice #${invoice.invoiceNumber} from Sweet Meadow Bakery

      Dear ${recipientName},

      Please find your invoice #${invoice.invoiceNumber} attached.

      Total Amount: $${invoice.total.toFixed(2)}
      ${invoice.dueDate ? `Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}` : ""}

      Thank you for your business!
      Sweet Meadow Bakery
      ===================================
    `);

    // TODO: Integrate with email service like Resend
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: "Sweet Meadow Bakery <invoices@sweetmeadow-bakery.com>",
    //   to: recipientEmail,
    //   subject: `Invoice #${invoice.invoiceNumber} from Sweet Meadow Bakery`,
    //   html: emailHtml,
    // });

    // Update invoice status to SENT
    await prisma.invoice.update({
      where: { id },
      data: {
        status: "SENT",
        sentAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, message: "Invoice sent successfully" });
  } catch (error) {
    console.error("Send invoice error:", error);
    return NextResponse.json({ error: "Failed to send invoice" }, { status: 500 });
  }
}
