"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface DashboardStats {
  todayOrders: number;
  pendingOrders: number;
  todayRevenue: number;
  weekRevenue: number;
  totalCustomers: number;
  lowStockItems: number;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    guestName: string | null;
    user: { name: string | null } | null;
    status: string;
    total: number;
    createdAt: string;
  }>;
  popularProducts: Array<{ name: string; count: number }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/analytics");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED": return "bg-green-500/10 text-green-400";
      case "READY": return "bg-blue-500/10 text-blue-400";
      case "IN_PROGRESS": return "bg-yellow-500/10 text-yellow-400";
      case "CONFIRMED": return "bg-purple-500/10 text-purple-400";
      case "CANCELLED": return "bg-red-500/10 text-red-400";
      default: return "bg-gray-500/10 text-gray-400";
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-3xl text-[var(--accent-light)] mb-8" style={{ fontFamily: "var(--font-dancing-script), cursive" }}>
        Dashboard
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[var(--background-card)] rounded-xl p-6 border border-[var(--border)]">
          <div className="text-sm text-[var(--foreground-muted)] mb-1">Today&apos;s Orders</div>
          <div className="text-3xl font-bold text-[var(--foreground)]">{loading ? "..." : stats?.todayOrders || 0}</div>
        </div>
        <div className="bg-[var(--background-card)] rounded-xl p-6 border border-[var(--border)]">
          <div className="text-sm text-[var(--foreground-muted)] mb-1">Pending Orders</div>
          <div className="text-3xl font-bold text-yellow-400">{loading ? "..." : stats?.pendingOrders || 0}</div>
        </div>
        <div className="bg-[var(--background-card)] rounded-xl p-6 border border-[var(--border)]">
          <div className="text-sm text-[var(--foreground-muted)] mb-1">Today&apos;s Revenue</div>
          <div className="text-3xl font-bold text-green-400">${loading ? "..." : (stats?.todayRevenue || 0).toFixed(2)}</div>
        </div>
        <div className="bg-[var(--background-card)] rounded-xl p-6 border border-[var(--border)]">
          <div className="text-sm text-[var(--foreground-muted)] mb-1">Low Stock Items</div>
          <div className="text-3xl font-bold text-red-400">{loading ? "..." : stats?.lowStockItems || 0}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-[var(--background-card)] rounded-xl border border-[var(--border)] overflow-hidden">
          <div className="p-4 border-b border-[var(--border)] flex justify-between items-center">
            <h2 className="font-semibold text-[var(--foreground)]">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-[var(--accent-light)] hover:underline">View All</Link>
          </div>
          {loading ? (
            <div className="p-8 text-center text-[var(--foreground-muted)]">Loading...</div>
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {stats?.recentOrders?.slice(0, 5).map((order) => (
                <div key={order.id} className="p-4 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-[var(--foreground)]">#{order.orderNumber}</div>
                    <div className="text-sm text-[var(--foreground-muted)]">
                      {order.user?.name || order.guestName || "Guest"}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 rounded text-xs ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <div className="text-sm text-[var(--foreground)] mt-1">${order.total.toFixed(2)}</div>
                  </div>
                </div>
              ))}
              {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
                <div className="p-8 text-center text-[var(--foreground-muted)]">No orders yet</div>
              )}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <div className="bg-[var(--background-card)] rounded-xl p-6 border border-[var(--border)]">
            <h2 className="font-semibold text-[var(--foreground)] mb-4">Weekly Revenue</h2>
            <div className="text-4xl font-bold text-[var(--accent-light)]">
              ${loading ? "..." : (stats?.weekRevenue || 0).toFixed(2)}
            </div>
          </div>
          <div className="bg-[var(--background-card)] rounded-xl p-6 border border-[var(--border)]">
            <h2 className="font-semibold text-[var(--foreground)] mb-4">Total Customers</h2>
            <div className="text-4xl font-bold text-[var(--foreground)]">
              {loading ? "..." : stats?.totalCustomers || 0}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/admin/orders" className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-xl p-4 text-center transition-colors">
              <div className="text-2xl mb-1">📋</div>
              <div className="text-sm font-medium">Manage Orders</div>
            </Link>
            <Link href="/admin/products" className="bg-[var(--background-light)] hover:bg-[var(--border)] rounded-xl p-4 text-center transition-colors border border-[var(--border)]">
              <div className="text-2xl mb-1">🎂</div>
              <div className="text-sm font-medium text-[var(--foreground)]">Add Product</div>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
