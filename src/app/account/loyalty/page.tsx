"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface LoyaltyPoint {
  id: string;
  points: number;
  type: string;
  description: string | null;
  createdAt: string;
}

export default function LoyaltyPage() {
  const [points, setPoints] = useState<LoyaltyPoint[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLoyalty() {
      try {
        const res = await fetch("/api/client/loyalty");
        if (res.ok) {
          const data = await res.json();
          setPoints(data.history || []);
          setTotalPoints(data.total || 0);
        }
      } catch (error) {
        console.error("Failed to fetch loyalty:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLoyalty();
  }, []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "EARNED": return "text-green-400";
      case "REDEEMED": return "text-red-400";
      case "BONUS": return "text-purple-400";
      default: return "text-gray-400";
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-3xl text-[var(--accent-light)] mb-6" style={{ fontFamily: "var(--font-dancing-script), cursive" }}>
        Loyalty Points
      </h1>

      <div className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] rounded-xl p-8 mb-8 text-white">
        <div className="text-sm opacity-80 mb-1">Your Balance</div>
        <div className="text-5xl font-bold">{loading ? "..." : totalPoints}</div>
        <div className="text-sm opacity-80 mt-2">points available</div>
      </div>

      <div className="bg-[var(--background-card)] rounded-xl p-6 border border-[var(--border)] mb-8">
        <h2 className="text-lg font-medium text-[var(--foreground)] mb-4">How It Works</h2>
        <ul className="space-y-2 text-sm text-[var(--foreground-muted)]">
          <li>• Earn 1 point for every $1 spent</li>
          <li>• Get 50 bonus points when you sign up</li>
          <li>• Redeem 100 points for $5 off your order</li>
          <li>• Points never expire!</li>
        </ul>
      </div>

      <div className="bg-[var(--background-card)] rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="p-4 border-b border-[var(--border)]">
          <h2 className="text-lg font-medium text-[var(--foreground)]">Points History</h2>
        </div>
        {loading ? (
          <div className="p-8 text-center text-[var(--foreground-muted)]">Loading...</div>
        ) : points.length === 0 ? (
          <div className="p-8 text-center text-[var(--foreground-muted)]">No points history yet</div>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {points.map((point) => (
              <div key={point.id} className="p-4 flex justify-between items-center">
                <div>
                  <div className="text-[var(--foreground)]">{point.description || point.type}</div>
                  <div className="text-sm text-[var(--foreground-muted)]">
                    {new Date(point.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className={`font-semibold ${getTypeColor(point.type)}`}>
                  {point.type === "REDEEMED" ? "-" : "+"}{point.points}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
