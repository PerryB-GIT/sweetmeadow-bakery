import type { Metadata } from "next";
import { Dancing_Script, EB_Garamond } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
  display: "swap",
});

const gentium = EB_Garamond({
  variable: "--font-gentium",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Sweet Meadow Bakery | Artisan Cakes in Beverly, MA",
    template: "%s | Sweet Meadow Bakery",
  },
  description: "Handcrafted artisan cakes and treats in Beverly, Massachusetts. Custom orders for weddings, birthdays, and special occasions.",
  keywords: ["bakery", "cakes", "Beverly MA", "artisan bakery", "custom cakes", "wedding cakes", "North Shore Massachusetts"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sweetmeadow-bakery.com",
    siteName: "Sweet Meadow Bakery",
    title: "Sweet Meadow Bakery | Artisan Cakes in Beverly, MA",
    description: "Handcrafted artisan cakes and treats in Beverly, Massachusetts.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Bakery",
              name: "Sweet Meadow Bakery",
              description: "Handcrafted artisan cakes and treats in Beverly, Massachusetts",
              url: "https://sweetmeadow-bakery.com",
              telephone: "(478) 299-1604",
              email: "sweetmeadowbakery@gmail.com",
              address: { "@type": "PostalAddress", addressLocality: "Beverly", addressRegion: "MA", addressCountry: "US" },
              openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                opens: "09:00",
                closes: "17:00",
              },
              sameAs: ["https://instagram.com/sweet_meadow_2025"],
            }),
          }}
        />
      </head>
      <body className={`${dancingScript.variable} ${gentium.variable} antialiased min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
