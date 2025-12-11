"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  pickupDate: string | null;
  items: Array<{ product: { name: string }; quantity: number; unitPrice: number }>;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/client/orders");
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "READY": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "IN_PROGRESS": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "CONFIRMED": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "CANCELLED": return "bg-red-500/10 text-red-400 border-red-500/20";
      default: return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-3xl text-[var(--accent-light)] mb-6" style={{ fontFamily: "var(--font-dancing-script), cursive" }}>
        Your Orders
      </h1>

      {loading ? (
        <div className="text-center py-12 text-[var(--foreground-muted)]">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="bg-[var(--background-card)] rounded-xl p-12 text-center border border-[var(--border)]">
          <p className="text-[var(--foreground-muted)] mb-4">You haven&apos;t placed any orders yet.</p>
          <Link href="/order" className="btn btn-primary">Place Your First Order</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-[var(--background-card)] rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="p-4 border-b border-[var(--border)] flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="font-medium text-[var(--foreground)]">Order #{order.orderNumber}</div>
                  <div className="text-sm text-[var(--foreground-muted)]">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                    {order.pickupDate && (
                      <span> · Pickup: {new Date(order.pickupDate).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <span className="text-lg font-semibold text-[var(--foreground)]">${order.total.toFixed(2)}</span>
                </div>
              </div>
              <div className="p-4">
                <div className="text-sm text-[var(--foreground-muted)] mb-2">Items:</div>
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-[var(--foreground)]">{item.quantity}x {item.product.name}</span>
                      <span className="text-[var(--foreground-muted)]">${(item.quantity * item.unitPrice).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
