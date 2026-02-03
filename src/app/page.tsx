"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { products } from "@/lib/products";

const featuredProducts = products.filter((p) => p.featured).slice(0, 4);

export default function Home() {
  return (
    <div className="pt-20">
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <Image src="/images/hero-bg.jpg" alt="" fill className="object-cover opacity-30" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)] via-[var(--background)]/90 to-[var(--background)]" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--accent)_0%,_transparent_70%)]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-5xl sm:text-7xl lg:text-8xl text-[var(--accent-light)] mb-6" style={{ fontFamily: "var(--font-dancing-script), cursive" }}>Sweet Meadow Bakery</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-xl sm:text-2xl text-[var(--foreground-muted)] mb-8 max-w-2xl mx-auto">Handcrafted artisan cakes made with love in Beverly, Massachusetts</motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/menu" className="btn btn-primary text-lg px-8 py-4">View Our Menu</Link>
            <Link href="/order" className="btn btn-secondary text-lg px-8 py-4">Order Now</Link>
          </motion.div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }} className="mt-12 text-[var(--foreground-muted)]"><span className="text-[var(--accent)]">Now accepting</span> custom orders for all occasions</motion.p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl text-[var(--accent-light)] mb-4" style={{ fontFamily: "var(--font-dancing-script), cursive" }}>Our Favorites</h2>
            <p className="text-[var(--foreground-muted)] max-w-xl mx-auto">Single-serving individual cakes, each one baked fresh with quality ingredients</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="group bg-[var(--background-card)] rounded-2xl overflow-hidden border border-[var(--border)] hover:border-[var(--accent)] transition-colors">
                <div className="aspect-square relative bg-[var(--background-light)] flex items-center justify-center"><span className="text-6xl">🎂</span></div>
                <div className="p-5">
                  <h3 className="text-lg font-medium text-[var(--foreground)] mb-1">{product.name}</h3>
                  <p className="text-sm text-[var(--foreground-muted)] mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--accent-light)] font-semibold">{product.price}</span>
                    <Link href="/order" className="text-sm text-[var(--foreground-muted)] hover:text-[var(--accent-light)] transition-colors">Order</Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12"><Link href="/menu" className="btn btn-secondary">See Full Menu</Link></div>
        </div>
      </section>

      <section className="py-20 px-4 bg-[var(--background-light)]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl sm:text-5xl text-[var(--accent-light)] mb-6" style={{ fontFamily: "var(--font-dancing-script), cursive" }}>Our Story</h2>
            <p className="text-lg text-[var(--foreground-muted)] mb-8 leading-relaxed">Sweet Meadow Bakery is an artisan pop-up bakery specializing in beautifully crafted single-serving individual cakes. Every treat is made with passion, using only the finest ingredients.</p>
            <Link href="/about" className="btn btn-primary">Learn More About Us</Link>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
            <h2 className="text-4xl sm:text-5xl text-[var(--accent-light)] mb-4" style={{ fontFamily: "var(--font-dancing-script), cursive" }}>Follow Along</h2>
            <p className="text-[var(--foreground-muted)]">@sweet_meadow_2025 on Instagram</p>
          </motion.div>
          <div className="bg-[var(--background-card)] rounded-2xl p-8 border border-[var(--border)]">
            <p className="text-[var(--foreground-muted)] mb-4">Follow us on Instagram for the latest creations</p>
            <a href="https://instagram.com/sweet_meadow_2025" target="_blank" rel="noopener noreferrer" className="btn btn-primary">Visit Our Instagram</a>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-[var(--background-light)]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl sm:text-5xl text-[var(--accent-light)] mb-6" style={{ fontFamily: "var(--font-dancing-script), cursive" }}>Ready to Order?</h2>
            <p className="text-lg text-[var(--foreground-muted)] mb-8">Custom orders welcome for birthdays, weddings, holidays, and special celebrations</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/order" className="btn btn-primary text-lg px-8 py-4">Place an Order</Link>
              <a href="tel:{BUSINESS_PHONE}" className="btn btn-secondary text-lg px-8 py-4">Call Us: {BUSINESS_PHONE}</a>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-4 border-t border-[var(--border)]">
        <div className="max-w-xl mx-auto text-center">
          <h3 className="text-2xl text-[var(--accent-light)] mb-4" style={{ fontFamily: "var(--font-dancing-script), cursive" }}>Get 10% Off Your First Order</h3>
          <p className="text-[var(--foreground-muted)] mb-6">Sign up for updates on new flavors and seasonal specials</p>
          <form className="flex flex-col sm:flex-row gap-3">
            <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-3 bg-[var(--background-card)] border border-[var(--border)] rounded-full text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:outline-none focus:border-[var(--accent)]" />
            <button type="submit" className="btn btn-primary">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
}
