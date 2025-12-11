import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events & Catering",
  description: "Book Sweet Meadow Bakery for your special event. Wedding cakes, birthday parties, corporate events, baby showers, and more. Serving Beverly, Salem, and the North Shore.",
  keywords: [
    "wedding cakes Beverly MA", "event catering North Shore", "birthday cake order",
    "corporate event cakes", "baby shower cakes Massachusetts", "custom event cakes"
  ],
  openGraph: {
    title: "Events & Catering | Sweet Meadow Bakery",
    description: "Book Sweet Meadow Bakery for your special event. Wedding cakes, birthday parties, and more.",
    url: "https://sweetmeadow-bakery.com/events",
  },
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
