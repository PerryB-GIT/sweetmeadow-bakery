import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Sweet Meadow Bakery in Beverly, MA. Call (478) 299-1604 or email sweetmeadowbakery@gmail.com. Serving the North Shore community.",
  keywords: [
    "contact Beverly bakery", "bakery phone number", "cake order Beverly MA",
    "North Shore bakery contact", "Sweet Meadow phone"
  ],
  openGraph: {
    title: "Contact Us | Sweet Meadow Bakery",
    description: "Get in touch with Sweet Meadow Bakery in Beverly, MA. We'd love to hear from you!",
    url: "https://sweetmeadow-bakery.com/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
