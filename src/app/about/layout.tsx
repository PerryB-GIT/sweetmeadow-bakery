import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Our Story",
  description: "Learn about Sweet Meadow Bakery, an artisan pop-up bakery in Beverly, Massachusetts. Handcrafted individual cakes made with love for the North Shore community.",
  keywords: [
    "Beverly MA bakery story", "artisan baker North Shore",
    "local bakery Massachusetts", "handcrafted cakes Beverly"
  ],
  openGraph: {
    title: "About Us | Sweet Meadow Bakery",
    description: "Learn about Sweet Meadow Bakery, an artisan pop-up bakery in Beverly, Massachusetts.",
    url: "https://sweetmeadow-bakery.com/about",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
