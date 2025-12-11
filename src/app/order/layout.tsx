import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Online",
  description: "Place a custom cake order online with Sweet Meadow Bakery. Artisan cakes made fresh in Beverly, MA. Easy pickup for the North Shore community.",
  keywords: [
    "order cake online Beverly MA", "custom cake order", "bakery pickup North Shore",
    "cake delivery Massachusetts", "online cake ordering"
  ],
  openGraph: {
    title: "Order Online | Sweet Meadow Bakery",
    description: "Place a custom cake order online. Artisan cakes made fresh in Beverly, MA.",
    url: "https://sweetmeadow-bakery.com/order",
  },
};

export default function OrderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
