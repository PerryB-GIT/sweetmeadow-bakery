import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menu | Artisan Cakes & Treats",
  description: "Browse our selection of handcrafted individual cakes, seasonal treats, and custom creations. Fresh-baked daily in Beverly, MA. Order online for pickup.",
  keywords: [
    "bakery menu Beverly MA", "artisan cakes menu", "individual cakes",
    "custom cakes North Shore", "Beverly bakery treats", "dessert menu Massachusetts"
  ],
  openGraph: {
    title: "Menu | Sweet Meadow Bakery",
    description: "Browse our selection of handcrafted individual cakes and treats. Fresh-baked daily in Beverly, MA.",
    url: "https://sweetmeadow-bakery.com/menu",
  },
};

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  return children;
}
