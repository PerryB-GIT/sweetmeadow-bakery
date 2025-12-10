"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="pt-20">
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="text-5xl sm:text-6xl text-[var(--accent-light)] mb-4" style={{ fontFamily: "var(--font-dancing-script), cursive" }}>Our Story</h1>
            <p className="text-[var(--foreground-muted)]">The heart behind Sweet Meadow Bakery</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="prose prose-lg prose-invert max-w-none">
            <div className="bg-[var(--background-card)] rounded-2xl p-8 border border-[var(--border)] mb-8">
              <h2 className="text-3xl text-[var(--accent-light)] mb-6" style={{ fontFamily: "var(--font-dancing-script), cursive" }}>Welcome to Sweet Meadow</h2>
              <p className="text-[var(--foreground-muted)] mb-6 leading-relaxed">Sweet Meadow Bakery is an artisan pop-up bakery based in Beverly, Massachusetts, specializing in beautifully crafted single-serving individual cakes. Every creation is a labor of love, made with the finest ingredients and attention to detail.</p>
              <p className="text-[var(--foreground-muted)] mb-6 leading-relaxed">We believe that every celebration deserves something special. Whether it is a birthday, anniversary, holiday, or just because - our handcrafted cakes bring joy to every occasion.</p>
              <p className="text-[var(--foreground-muted)] leading-relaxed">Located in the heart of Beverly, we proudly serve the North Shore community including Salem and surrounding areas.</p>
            </div>

            <div className="bg-[var(--background-card)] rounded-2xl p-8 border border-[var(--border)] mb-8">
              <h2 className="text-3xl text-[var(--accent-light)] mb-6" style={{ fontFamily: "var(--font-dancing-script), cursive" }}>Our Philosophy</h2>
              <ul className="space-y-4 text-[var(--foreground-muted)]">
                <li className="flex items-start gap-3"><span className="text-[var(--accent)]">✦</span> Quality ingredients in every bite</li>
                <li className="flex items-start gap-3"><span className="text-[var(--accent)]">✦</span> Made fresh to order</li>
                <li className="flex items-start gap-3"><span className="text-[var(--accent)]">✦</span> Individual portions, crafted with care</li>
                <li className="flex items-start gap-3"><span className="text-[var(--accent)]">✦</span> Custom creations for your special moments</li>
              </ul>
            </div>

            <div className="text-center">
              <Link href="/order" className="btn btn-primary text-lg px-8 py-4">Place a Custom Order</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
