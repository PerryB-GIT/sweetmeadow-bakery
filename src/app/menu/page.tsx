"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { products, categories } from "@/lib/products";

const productImages: Record<string, string> = {
  "Classic Vanilla Bean": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop",
  "Dark Chocolate Truffle": "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=400&h=400&fit=crop",
  "Strawberry Dream": "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop",
  "Autumn Spice": "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400&h=400&fit=crop",
  "Salted Caramel": "https://images.unsplash.com/photo-1562440499-64c9a111f713?w=400&h=400&fit=crop",
  "Lemon Lavender": "https://images.unsplash.com/photo-1519869325930-281384f7f2e4?w=400&h=400&fit=crop",
  "Red Velvet Classic": "https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=400&h=400&fit=crop",
  "Halloween Spooky Treat": "https://images.unsplash.com/photo-1509461399763-ae67a981b254?w=400&h=400&fit=crop",
  "Custom Creation": "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=400&h=400&fit=crop",
};

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
                <div className="aspect-square bg-[var(--background-light)] relative overflow-hidden">
                  <Image
                    src={productImages[product.name] || "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop"}
                    alt={`${product.name} - ${product.description}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
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
