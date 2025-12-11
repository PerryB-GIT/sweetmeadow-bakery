import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookings = await prisma.eventBooking.findMany({
      where: { userId: session.user.id },
      orderBy: { eventDate: "desc" },
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("Bookings error:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}
