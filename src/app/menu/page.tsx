"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { products, categories } from "@/lib/products";

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const filteredProducts = activeCategory === "all" ? products : products.filter((p) => p.category === activeCategory);

  return (
    <div className="pt-20">
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-5xl sm:text-6xl text-[var(--accent-light)] mb-4" style={{ fontFamily: "var(--font-dancing-script), cursive" }}>Our Menu</h1>
            <p className="text-[var(--foreground-muted)] max-w-xl mx-auto">Handcrafted individual cakes, each made with premium ingredients and artisan care</p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-6 py-2 rounded-full transition-colors ${activeCategory === cat.id ? "bg-[var(--accent)] text-white" : "bg-[var(--background-card)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] border border-[var(--border)]"}`}>
                {cat.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="bg-[var(--background-card)] rounded-2xl overflow-hidden border border-[var(--border)] hover:border-[var(--accent)] transition-colors">
                <div className="aspect-square bg-[var(--background-light)] flex items-center justify-center"><span className="text-7xl">🎂</span></div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-medium text-[var(--foreground)]">{product.name}</h3>
                    <span className="text-[var(--accent-light)] font-semibold">{product.price}</span>
                  </div>
                  <p className="text-[var(--foreground-muted)] mb-4">{product.description}</p>
                  <Link href={`/order?item=${product.name}`} className="btn btn-primary w-full">Order This</Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
