"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface Favorite {
  id: string;
  product: { id: string; name: string; description: string; price: number; image: string | null };
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  async function fetchFavorites() {
    try {
      const res = await fetch("/api/client/favorites");
      if (res.ok) {
        const data = await res.json();
        setFavorites(data.favorites || []);
      }
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
    } finally {
      setLoading(false);
    }
  }

  async function removeFavorite(productId: string) {
    try {
      await fetch(`/api/client/favorites/${productId}`, { method: "DELETE" });
      setFavorites(favorites.filter(f => f.product.id !== productId));
    } catch (error) {
      console.error("Failed to remove favorite:", error);
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-3xl text-[var(--accent-light)] mb-6" style={{ fontFamily: "var(--font-dancing-script), cursive" }}>
        Your Favorites
      </h1>

      {loading ? (
        <div className="text-center py-12 text-[var(--foreground-muted)]">Loading...</div>
      ) : favorites.length === 0 ? (
        <div className="bg-[var(--background-card)] rounded-xl p-12 text-center border border-[var(--border)]">
          <p className="text-[var(--foreground-muted)] mb-4">No favorites yet. Start exploring our menu!</p>
          <Link href="/menu" className="btn btn-primary">Browse Menu</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {favorites.map((fav) => (
            <div key={fav.id} className="bg-[var(--background-card)] rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="aspect-video bg-[var(--background-light)] flex items-center justify-center">
                <span className="text-5xl">🎂</span>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-[var(--foreground)]">{fav.product.name}</h3>
                  <span className="text-[var(--accent-light)] font-semibold">${fav.product.price}</span>
                </div>
                <p className="text-sm text-[var(--foreground-muted)] mb-4 line-clamp-2">{fav.product.description}</p>
                <div className="flex gap-2">
                  <Link href={`/order?item=${encodeURIComponent(fav.product.name)}`} className="flex-1 btn btn-primary text-sm py-2 text-center">
                    Order
                  </Link>
                  <button onClick={() => removeFavorite(fav.product.id)} className="px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
