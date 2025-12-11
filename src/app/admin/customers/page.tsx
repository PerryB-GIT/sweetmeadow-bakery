"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Customer {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  createdAt: string;
  _count: {
    orders: number;
  };
  loyaltyPoints: Array<{ points: number }>;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    try {
      const res = await fetch("/api/admin/customers");
      if (res.ok) {
        const data = await res.json();
        setCustomers(data.customers || []);
      }
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    } finally {
      setLoading(false);
    }
  }

  function openModal(customer?: Customer) {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({
        name: customer.name || "",
        email: customer.email,
        phone: customer.phone || "",
        password: "",
      });
    } else {
      setEditingCustomer(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
      });
    }
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const url = editingCustomer ? `/api/admin/customers/${editingCustomer.id}` : "/api/admin/customers";
      const method = editingCustomer ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowModal(false);
        fetchCustomers();
      } else {
        const error = await res.json();
        alert(error.error || "Failed to save customer");
      }
    } catch (error) {
      console.error("Failed to save customer:", error);
    }
  }

  async function deleteCustomer(id: string) {
    if (!confirm("Are you sure you want to delete this customer? This will also delete their orders and data.")) return;
    try {
      const res = await fetch(`/api/admin/customers/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCustomers(customers.filter((c) => c.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete customer:", error);
    }
  }

  const filteredCustomers = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  const getTotalPoints = (customer: Customer) => {
    return customer.loyaltyPoints.reduce((sum, lp) => sum + lp.points, 0);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl text-[var(--accent-light)]" style={{ fontFamily: "var(--font-dancing-script), cursive" }}>
          Customers
        </h1>
        <button onClick={() => openModal()} className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-4 py-2 rounded-lg transition-colors">
          + Add Customer
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2 bg-[var(--background-card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder-[var(--foreground-muted)] focus:outline-none focus:border-[var(--accent)]"
        />
      </div>

      {loading ? (
        <div className="text-center py-12 text-[var(--foreground-muted)]">Loading customers...</div>
      ) : filteredCustomers.length === 0 ? (
        <div className="bg-[var(--background-card)] rounded-xl p-12 text-center border border-[var(--border)]">
          <p className="text-[var(--foreground-muted)]">No customers found</p>
        </div>
      ) : (
        <div className="bg-[var(--background-card)] rounded-xl border border-[var(--border)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left p-4 text-sm font-medium text-[var(--foreground-muted)]">Customer</th>
                  <th className="text-left p-4 text-sm font-medium text-[var(--foreground-muted)]">Contact</th>
                  <th className="text-left p-4 text-sm font-medium text-[var(--foreground-muted)]">Orders</th>
                  <th className="text-left p-4 text-sm font-medium text-[var(--foreground-muted)]">Loyalty Points</th>
                  <th className="text-left p-4 text-sm font-medium text-[var(--foreground-muted)]">Joined</th>
                  <th className="text-left p-4 text-sm font-medium text-[var(--foreground-muted)]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--background-light)] transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-[var(--foreground)]">{customer.name || "No name"}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-[var(--foreground)]">{customer.email}</div>
                      {customer.phone && <div className="text-sm text-[var(--foreground-muted)]">{customer.phone}</div>}
                    </td>
                    <td className="p-4">
                      <span className="inline-block bg-[var(--accent)]/10 text-[var(--accent-light)] px-3 py-1 rounded-full text-sm">
                        {customer._count.orders} orders
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="inline-block bg-yellow-500/10 text-yellow-400 px-3 py-1 rounded-full text-sm">
                        {getTotalPoints(customer)} pts
                      </span>
                    </td>
                    <td className="p-4 text-sm text-[var(--foreground-muted)]">
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button onClick={() => openModal(customer)} className="text-sm px-3 py-1 rounded bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--border)] transition-colors">
                          Edit
                        </button>
                        <button onClick={() => deleteCustomer(customer.id)} className="text-sm px-3 py-1 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-4 text-sm text-[var(--foreground-muted)]">
        Total: {filteredCustomers.length} customers
      </div>

      {/* Customer Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[var(--background-card)] rounded-xl border border-[var(--border)] w-full max-w-md">
            <div className="p-4 border-b border-[var(--border)]">
              <h2 className="text-xl font-semibold text-[var(--foreground)]">
                {editingCustomer ? "Edit Customer" : "Add Customer"}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm text-[var(--foreground-muted)] mb-1">Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]" />
              </div>
              <div>
                <label className="block text-sm text-[var(--foreground-muted)] mb-1">Email *</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]" required />
              </div>
              <div>
                <label className="block text-sm text-[var(--foreground-muted)] mb-1">Phone</label>
                <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]" />
              </div>
              {!editingCustomer && (
                <div>
                  <label className="block text-sm text-[var(--foreground-muted)] mb-1">Password *</label>
                  <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]" required={!editingCustomer} minLength={6} />
                  <p className="text-xs text-[var(--foreground-muted)] mt-1">Minimum 6 characters</p>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 rounded-lg bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--border)] transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2 rounded-lg bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors">
                  {editingCustomer ? "Save Changes" : "Add Customer"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
