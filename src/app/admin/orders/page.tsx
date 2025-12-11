"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface OrderItem {
  id?: string;
  productId: string;
  productName?: string;
  quantity: number;
  unitPrice: number;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  tax: number;
  total: number;
  createdAt: string;
  pickupDate: string | null;
  pickupTime: string | null;
  notes: string | null;
  guestName: string | null;
  guestEmail: string | null;
  guestPhone: string | null;
  userId: string | null;
  user: { id: string; name: string | null; email: string } | null;
  items: Array<{ id: string; productId: string; product: { id: string; name: string; price: number }; quantity: number; unitPrice: number }>;
}

interface Product {
  id: string;
  name: string;
  price: number;
}

interface Customer {
  id: string;
  name: string | null;
  email: string;
}

const statuses = ["PENDING", "CONFIRMED", "IN_PROGRESS", "READY", "COMPLETED", "CANCELLED"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [formData, setFormData] = useState({
    userId: "",
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    pickupDate: "",
    pickupTime: "",
    notes: "",
    items: [{ productId: "", quantity: 1, unitPrice: 0 }] as OrderItem[],
  });

  useEffect(() => {
    fetchOrders();
    fetchProducts();
    fetchCustomers();
  }, []);

  async function fetchOrders() {
    try {
      const res = await fetch("/api/admin/orders");
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

  async function fetchProducts() {
    try {
      const res = await fetch("/api/admin/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  }

  async function fetchCustomers() {
    try {
      const res = await fetch("/api/admin/customers");
      if (res.ok) {
        const data = await res.json();
        setCustomers(data.customers || []);
      }
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    }
  }

  function openModal(order?: Order) {
    if (order) {
      setEditingOrder(order);
      setFormData({
        userId: order.userId || "",
        guestName: order.guestName || "",
        guestEmail: order.guestEmail || "",
        guestPhone: order.guestPhone || "",
        pickupDate: order.pickupDate ? order.pickupDate.split("T")[0] : "",
        pickupTime: order.pickupTime || "",
        notes: order.notes || "",
        items: order.items.map(item => ({
          productId: item.productId,
          productName: item.product.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      });
    } else {
      setEditingOrder(null);
      setFormData({
        userId: "",
        guestName: "",
        guestEmail: "",
        guestPhone: "",
        pickupDate: "",
        pickupTime: "",
        notes: "",
        items: [{ productId: "", quantity: 1, unitPrice: 0 }],
      });
    }
    setShowModal(true);
  }

  function handleCustomerChange(value: string) {
    const customer = customers.find(c => c.id === value);
    if (customer) {
      setFormData({
        ...formData,
        userId: customer.id,
        guestName: customer.name || "",
        guestEmail: customer.email,
      });
    } else {
      setFormData({ ...formData, userId: "" });
    }
  }

  function handleProductChange(index: number, productId: string) {
    const product = products.find(p => p.id === productId);
    const newItems = [...formData.items];
    newItems[index] = {
      ...newItems[index],
      productId,
      unitPrice: product?.price || 0,
    };
    setFormData({ ...formData, items: newItems });
  }

  function updateItem(index: number, field: keyof OrderItem, value: string | number) {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  }

  function addItem() {
    setFormData({
      ...formData,
      items: [...formData.items, { productId: "", quantity: 1, unitPrice: 0 }],
    });
  }

  function removeItem(index: number) {
    if (formData.items.length > 1) {
      setFormData({ ...formData, items: formData.items.filter((_, i) => i !== index) });
    }
  }

  const subtotal = formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const tax = subtotal * 0.0625;
  const total = subtotal + tax;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const url = editingOrder ? `/api/admin/orders/${editingOrder.id}` : "/api/admin/orders";
      const method = editingOrder ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          subtotal,
          tax,
          total,
        }),
      });

      if (res.ok) {
        setShowModal(false);
        fetchOrders();
      }
    } catch (error) {
      console.error("Failed to save order:", error);
    }
  }

  async function updateStatus(orderId: string, newStatus: string) {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  }

  async function deleteOrder(id: string) {
    if (!confirm("Are you sure you want to delete this order?")) return;
    try {
      const res = await fetch(`/api/admin/orders/${id}`, { method: "DELETE" });
      if (res.ok) {
        setOrders(orders.filter(o => o.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete order:", error);
    }
  }

  const filteredOrders = filter === "all" ? orders : orders.filter(o => o.status === filter);

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl text-[var(--accent-light)]" style={{ fontFamily: "var(--font-dancing-script), cursive" }}>
          Orders
        </h1>
        <button onClick={() => openModal()} className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-4 py-2 rounded-lg transition-colors">
          + New Order
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <button onClick={() => setFilter("all")} className={`px-4 py-2 rounded-lg text-sm transition-colors ${filter === "all" ? "bg-[var(--accent)] text-white" : "bg-[var(--background-card)] text-[var(--foreground-muted)] border border-[var(--border)]"}`}>
          All
        </button>
        {statuses.map(status => (
          <button key={status} onClick={() => setFilter(status)} className={`px-4 py-2 rounded-lg text-sm transition-colors ${filter === status ? "bg-[var(--accent)] text-white" : "bg-[var(--background-card)] text-[var(--foreground-muted)] border border-[var(--border)]"}`}>
            {status}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-[var(--foreground-muted)]">Loading orders...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-[var(--background-card)] rounded-xl p-12 text-center border border-[var(--border)]">
          <p className="text-[var(--foreground-muted)]">No orders found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-[var(--background-card)] rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="p-4 border-b border-[var(--border)] flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="font-semibold text-[var(--foreground)]">Order #{order.orderNumber}</div>
                  <div className="text-sm text-[var(--foreground-muted)]">
                    {order.user?.name || order.guestName || "Guest"} · {order.user?.email || order.guestEmail}
                  </div>
                  <div className="text-sm text-[var(--foreground-muted)]">
                    {new Date(order.createdAt).toLocaleString()}
                    {order.pickupDate && ` · Pickup: ${new Date(order.pickupDate).toLocaleDateString()}`}
                    {order.pickupTime && ` at ${order.pickupTime}`}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className={`px-3 py-1 rounded-lg text-sm border ${getStatusColor(order.status)} bg-transparent cursor-pointer focus:outline-none`}
                  >
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <span className="text-lg font-semibold text-[var(--foreground)]">${order.total.toFixed(2)}</span>
                </div>
              </div>
              <div className="p-4">
                <div className="text-sm text-[var(--foreground-muted)] mb-2">Items:</div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {order.items.map((item, idx) => (
                    <span key={idx} className="bg-[var(--background)] px-3 py-1 rounded-full text-sm text-[var(--foreground)]">
                      {item.quantity}x {item.product.name}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openModal(order)} className="text-sm px-3 py-1 rounded bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--border)] transition-colors">
                    Edit
                  </button>
                  <button onClick={() => deleteOrder(order.id)} className="text-sm px-3 py-1 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[var(--background-card)] rounded-xl border border-[var(--border)] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-[var(--border)]">
              <h2 className="text-xl font-semibold text-[var(--foreground)]">
                {editingOrder ? "Edit Order" : "New Order"}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm text-[var(--foreground-muted)] mb-1">Customer</label>
                  <select value={formData.userId} onChange={(e) => handleCustomerChange(e.target.value)} className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]">
                    <option value="">Select existing customer or enter guest info</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name || c.email}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-[var(--foreground-muted)] mb-1">Name</label>
                  <input type="text" value={formData.guestName} onChange={(e) => setFormData({ ...formData, guestName: e.target.value })} className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]" />
                </div>
                <div>
                  <label className="block text-sm text-[var(--foreground-muted)] mb-1">Email</label>
                  <input type="email" value={formData.guestEmail} onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })} className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]" />
                </div>
                <div>
                  <label className="block text-sm text-[var(--foreground-muted)] mb-1">Phone</label>
                  <input type="tel" value={formData.guestPhone} onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })} className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]" />
                </div>
                <div>
                  <label className="block text-sm text-[var(--foreground-muted)] mb-1">Pickup Date</label>
                  <input type="date" value={formData.pickupDate} onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })} className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]" />
                </div>
                <div>
                  <label className="block text-sm text-[var(--foreground-muted)] mb-1">Pickup Time</label>
                  <input type="time" value={formData.pickupTime} onChange={(e) => setFormData({ ...formData, pickupTime: e.target.value })} className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm text-[var(--foreground-muted)]">Order Items</label>
                  <button type="button" onClick={addItem} className="text-sm text-[var(--accent-light)] hover:underline">+ Add Item</button>
                </div>
                <div className="space-y-2">
                  {formData.items.map((item, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <select value={item.productId} onChange={(e) => handleProductChange(index, e.target.value)} className="flex-1 px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)] text-sm" required>
                        <option value="">Select product</option>
                        {products.map(p => (
                          <option key={p.id} value={p.id}>{p.name} - ${p.price.toFixed(2)}</option>
                        ))}
                      </select>
                      <input type="number" placeholder="Qty" value={item.quantity} onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value) || 1)} className="w-20 px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)] text-sm" min="1" required />
                      <div className="w-24 px-3 py-2 text-right text-sm text-[var(--foreground)]">${(item.quantity * item.unitPrice).toFixed(2)}</div>
                      {formData.items.length > 1 && (
                        <button type="button" onClick={() => removeItem(index)} className="text-red-400 hover:text-red-300 px-2">x</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[var(--background)] p-4 rounded-lg">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[var(--foreground-muted)]">Subtotal:</span>
                  <span className="text-[var(--foreground)]">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[var(--foreground-muted)]">Tax (6.25%):</span>
                  <span className="text-[var(--foreground)]">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold border-t border-[var(--border)] pt-2 mt-2">
                  <span className="text-[var(--foreground)]">Total:</span>
                  <span className="text-[var(--accent-light)]">${total.toFixed(2)}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm text-[var(--foreground-muted)] mb-1">Notes</label>
                <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={2} className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)] resize-none" placeholder="Special instructions..." />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 rounded-lg bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--border)] transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2 rounded-lg bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors">
                  {editingOrder ? "Save Changes" : "Create Order"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
