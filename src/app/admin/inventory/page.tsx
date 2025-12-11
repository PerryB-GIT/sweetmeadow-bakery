"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface InventoryItem {
  id: string;
  quantity: number;
  lowStockAlert: number;
  product: {
    id: string;
    name: string;
    price: number;
  };
}

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState("");
  const [editAlert, setEditAlert] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  async function fetchInventory() {
    try {
      const res = await fetch("/api/admin/inventory");
      if (res.ok) {
        const data = await res.json();
        setInventory(data.inventory || []);
      }
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
    } finally {
      setLoading(false);
    }
  }

  async function updateQuantity(id: string) {
    try {
      const res = await fetch(`/api/admin/inventory/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: parseInt(editQuantity) }),
      });
      if (res.ok) {
        setInventory(inventory.map((i) => i.id === id ? { ...i, quantity: parseInt(editQuantity) } : i));
        setEditingId(null);
        setEditQuantity("");
      }
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  }

  function openSettings(item: InventoryItem) {
    setSelectedItem(item);
    setEditAlert(item.lowStockAlert.toString());
    setShowModal(true);
  }

  async function saveSettings() {
    if (!selectedItem) return;
    try {
      const res = await fetch(`/api/admin/inventory/${selectedItem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lowStockAlert: parseInt(editAlert) }),
      });
      if (res.ok) {
        setInventory(inventory.map((i) => i.id === selectedItem.id ? { ...i, lowStockAlert: parseInt(editAlert) } : i));
        setShowModal(false);
        setSelectedItem(null);
      }
    } catch (error) {
      console.error("Failed to update settings:", error);
    }
  }

  async function quickRestock(id: string, amount: number) {
    const item = inventory.find(i => i.id === id);
    if (!item) return;
    const newQuantity = item.quantity + amount;
    try {
      const res = await fetch(`/api/admin/inventory/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      if (res.ok) {
        setInventory(inventory.map((i) => i.id === id ? { ...i, quantity: newQuantity } : i));
      }
    } catch (error) {
      console.error("Failed to restock:", error);
    }
  }

  const filteredInventory = filter === "all" ? inventory : filter === "low" ? inventory.filter((i) => i.quantity <= i.lowStockAlert) : inventory.filter((i) => i.quantity === 0);

  const lowStockCount = inventory.filter((i) => i.quantity <= i.lowStockAlert && i.quantity > 0).length;
  const outOfStockCount = inventory.filter((i) => i.quantity === 0).length;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-3xl text-[var(--accent-light)] mb-6" style={{ fontFamily: "var(--font-dancing-script), cursive" }}>
        Inventory
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-[var(--background-card)] rounded-xl p-4 border border-[var(--border)]">
          <div className="text-sm text-[var(--foreground-muted)] mb-1">Total Products</div>
          <div className="text-2xl font-bold text-[var(--foreground)]">{inventory.length}</div>
        </div>
        <div className="bg-[var(--background-card)] rounded-xl p-4 border border-[var(--border)]">
          <div className="text-sm text-[var(--foreground-muted)] mb-1">Low Stock</div>
          <div className="text-2xl font-bold text-yellow-400">{lowStockCount}</div>
        </div>
        <div className="bg-[var(--background-card)] rounded-xl p-4 border border-[var(--border)]">
          <div className="text-sm text-[var(--foreground-muted)] mb-1">Out of Stock</div>
          <div className="text-2xl font-bold text-red-400">{outOfStockCount}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button onClick={() => setFilter("all")} className={`px-4 py-2 rounded-lg text-sm transition-colors ${filter === "all" ? "bg-[var(--accent)] text-white" : "bg-[var(--background-card)] text-[var(--foreground-muted)] border border-[var(--border)]"}`}>
          All
        </button>
        <button onClick={() => setFilter("low")} className={`px-4 py-2 rounded-lg text-sm transition-colors ${filter === "low" ? "bg-yellow-500 text-white" : "bg-[var(--background-card)] text-[var(--foreground-muted)] border border-[var(--border)]"}`}>
          Low Stock ({lowStockCount})
        </button>
        <button onClick={() => setFilter("out")} className={`px-4 py-2 rounded-lg text-sm transition-colors ${filter === "out" ? "bg-red-500 text-white" : "bg-[var(--background-card)] text-[var(--foreground-muted)] border border-[var(--border)]"}`}>
          Out of Stock ({outOfStockCount})
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-[var(--foreground-muted)]">Loading inventory...</div>
      ) : filteredInventory.length === 0 ? (
        <div className="bg-[var(--background-card)] rounded-xl p-12 text-center border border-[var(--border)]">
          <p className="text-[var(--foreground-muted)]">No inventory items found</p>
        </div>
      ) : (
        <div className="bg-[var(--background-card)] rounded-xl border border-[var(--border)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left p-4 text-sm font-medium text-[var(--foreground-muted)]">Product</th>
                  <th className="text-left p-4 text-sm font-medium text-[var(--foreground-muted)]">Price</th>
                  <th className="text-left p-4 text-sm font-medium text-[var(--foreground-muted)]">Quantity</th>
                  <th className="text-left p-4 text-sm font-medium text-[var(--foreground-muted)]">Alert Threshold</th>
                  <th className="text-left p-4 text-sm font-medium text-[var(--foreground-muted)]">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-[var(--foreground-muted)]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item) => (
                  <tr key={item.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--background-light)] transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-[var(--foreground)]">{item.product.name}</div>
                    </td>
                    <td className="p-4 text-[var(--foreground)]">${item.product.price.toFixed(2)}</td>
                    <td className="p-4">
                      {editingId === item.id ? (
                        <input type="number" value={editQuantity} onChange={(e) => setEditQuantity(e.target.value)} className="w-20 px-2 py-1 bg-[var(--background)] border border-[var(--border)] rounded text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]" autoFocus />
                      ) : (
                        <span className="text-[var(--foreground)]">{item.quantity}</span>
                      )}
                    </td>
                    <td className="p-4 text-[var(--foreground-muted)]">{item.lowStockAlert}</td>
                    <td className="p-4">
                      {item.quantity === 0 ? (
                        <span className="inline-block bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-sm">Out of Stock</span>
                      ) : item.quantity <= item.lowStockAlert ? (
                        <span className="inline-block bg-yellow-500/10 text-yellow-400 px-3 py-1 rounded-full text-sm">Low Stock</span>
                      ) : (
                        <span className="inline-block bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-sm">In Stock</span>
                      )}
                    </td>
                    <td className="p-4">
                      {editingId === item.id ? (
                        <div className="flex gap-2">
                          <button onClick={() => updateQuantity(item.id)} className="text-sm px-3 py-1 rounded bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors">
                            Save
                          </button>
                          <button onClick={() => { setEditingId(null); setEditQuantity(""); }} className="text-sm px-3 py-1 rounded bg-[var(--background)] text-[var(--foreground-muted)] hover:bg-[var(--border)] transition-colors">
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2 flex-wrap">
                          <button onClick={() => { setEditingId(item.id); setEditQuantity(item.quantity.toString()); }} className="text-sm px-3 py-1 rounded bg-[var(--accent)]/10 text-[var(--accent-light)] hover:bg-[var(--accent)]/20 transition-colors">
                            Edit
                          </button>
                          <button onClick={() => quickRestock(item.id, 10)} className="text-sm px-2 py-1 rounded bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors">
                            +10
                          </button>
                          <button onClick={() => openSettings(item)} className="text-sm px-3 py-1 rounded bg-[var(--background)] text-[var(--foreground-muted)] hover:bg-[var(--border)] transition-colors">
                            Settings
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[var(--background-card)] rounded-xl border border-[var(--border)] w-full max-w-sm">
            <div className="p-4 border-b border-[var(--border)]">
              <h2 className="text-xl font-semibold text-[var(--foreground)]">Inventory Settings</h2>
              <p className="text-sm text-[var(--foreground-muted)]">{selectedItem.product.name}</p>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm text-[var(--foreground-muted)] mb-1">Low Stock Alert Threshold</label>
                <input type="number" value={editAlert} onChange={(e) => setEditAlert(e.target.value)} className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]" min="0" />
                <p className="text-xs text-[var(--foreground-muted)] mt-1">Alert when quantity falls to or below this number</p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 rounded-lg bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--border)] transition-colors">
                  Cancel
                </button>
                <button type="button" onClick={saveSettings} className="flex-1 py-2 rounded-lg bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors">
                  Save
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
