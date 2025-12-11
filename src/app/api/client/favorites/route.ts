import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          select: { id: true, name: true, description: true, price: true, image: true },
        },
      },
    });

    return NextResponse.json({ favorites });
  } catch (error) {
    console.error("Favorites error:", error);
    return NextResponse.json({ error: "Failed to fetch favorites" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await request.json();

    const favorite = await prisma.favorite.create({
      data: {
        userId: session.user.id,
        productId,
      },
    });

    return NextResponse.json({ favorite });
  } catch (error) {
    console.error("Favorites error:", error);
    return NextResponse.json({ error: "Failed to add favorite" }, { status: 500 });
  }
}
