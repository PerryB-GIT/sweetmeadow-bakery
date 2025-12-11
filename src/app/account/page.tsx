"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface DashboardData {
  recentOrders: Array<{ id: string; orderNumber: string; status: string; total: number; createdAt: string }>;
  loyaltyPoints: number;
  favoritesCount: number;
}

export default function AccountDashboard() {
  const { data: session } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch("/api/client/dashboard");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED": return "text-green-400";
      case "READY": return "text-blue-400";
      case "IN_PROGRESS": return "text-yellow-400";
      case "CONFIRMED": return "text-purple-400";
      case "CANCELLED": return "text-red-400";
      default: return "text-[var(--foreground-muted)]";
    }
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl text-[var(--accent-light)] mb-2" style={{ fontFamily: "var(--font-dancing-script), cursive" }}>
          Welcome back, {session?.user?.name?.split(" ")[0] || "Friend"}!
        </h1>
        <p className="text-[var(--foreground-muted)] mb-8">Here&apos;s what&apos;s happening with your Sweet Meadow account.</p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-[var(--background-card)] rounded-xl p-6 border border-[var(--border)]">
            <div className="text-3xl font-bold text-[var(--accent-light)]">{loading ? "..." : data?.loyaltyPoints || 0}</div>
            <div className="text-sm text-[var(--foreground-muted)]">Loyalty Points</div>
          </div>
          <div className="bg-[var(--background-card)] rounded-xl p-6 border border-[var(--border)]">
            <div className="text-3xl font-bold text-[var(--accent-light)]">{loading ? "..." : data?.recentOrders?.length || 0}</div>
            <div className="text-sm text-[var(--foreground-muted)]">Total Orders</div>
          </div>
          <div className="bg-[var(--background-card)] rounded-xl p-6 border border-[var(--border)]">
            <div className="text-3xl font-bold text-[var(--accent-light)]">{loading ? "..." : data?.favoritesCount || 0}</div>
            <div className="text-sm text-[var(--foreground-muted)]">Favorites</div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-[var(--background-card)] rounded-xl border border-[var(--border)] overflow-hidden">
          <div className="p-4 border-b border-[var(--border)] flex justify-between items-center">
            <h2 className="text-lg font-medium text-[var(--foreground)]">Recent Orders</h2>
            <Link href="/account/orders" className="text-sm text-[var(--accent-light)] hover:underline">
              View all
            </Link>
          </div>
          {loading ? (
            <div className="p-8 text-center text-[var(--foreground-muted)]">Loading...</div>
          ) : data?.recentOrders && data.recentOrders.length > 0 ? (
            <div className="divide-y divide-[var(--border)]">
              {data.recentOrders.slice(0, 5).map((order) => (
                <div key={order.id} className="p-4 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-[var(--foreground)]">Order #{order.orderNumber}</div>
                    <div className="text-sm text-[var(--foreground-muted)]">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${getStatusColor(order.status)}`}>{order.status}</div>
                    <div className="text-[var(--foreground)]">${order.total.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-[var(--foreground-muted)] mb-4">No orders yet</p>
              <Link href="/order" className="btn btn-primary">Place Your First Order</Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/order" className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-xl p-6 text-center transition-colors">
            <span className="text-2xl mb-2 block">🎂</span>
            <span className="font-medium">Order Now</span>
          </Link>
          <Link href="/menu" className="bg-[var(--background-card)] hover:bg-[var(--background-light)] border border-[var(--border)] rounded-xl p-6 text-center transition-colors">
            <span className="text-2xl mb-2 block">📋</span>
            <span className="font-medium text-[var(--foreground)]">Browse Menu</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
