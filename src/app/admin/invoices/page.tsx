"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface InvoiceItem {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  status: string;
  subtotal: number;
  tax: number;
  total: number;
  dueDate: string | null;
  paidDate: string | null;
  sentAt: string | null;
  createdAt: string;
  guestName: string | null;
  guestEmail: string | null;
  guestPhone: string | null;
  guestAddress: string | null;
  notes: string | null;
  terms: string | null;
  user: { name: string | null; email: string } | null;
  items: InvoiceItem[];
}

interface Customer {
  id: string;
  name: string | null;
  email: string;
}

const statuses = ["DRAFT", "SENT", "PAID", "OVERDUE", "CANCELLED"];

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [sending, setSending] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    userId: "",
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    guestAddress: "",
    dueDate: "",
    notes: "",
    terms: "Payment due within 30 days of invoice date.",
    items: [{ description: "", quantity: 1, unitPrice: 0, total: 0 }] as InvoiceItem[],
  });

  useEffect(() => {
    fetchInvoices();
    fetchCustomers();
  }, []);

  async function fetchInvoices() {
    try {
      const res = await fetch("/api/admin/invoices");
      if (res.ok) {
        const data = await res.json();
        setInvoices(data.invoices || []);
      }
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
    } finally {
      setLoading(false);
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

  function openModal(invoice?: Invoice) {
    if (invoice) {
      setEditingInvoice(invoice);
      setFormData({
        userId: invoice.user?.email || "",
        guestName: invoice.guestName || "",
        guestEmail: invoice.guestEmail || "",
        guestPhone: invoice.guestPhone || "",
        guestAddress: invoice.guestAddress || "",
        dueDate: invoice.dueDate ? invoice.dueDate.split("T")[0] : "",
        notes: invoice.notes || "",
        terms: invoice.terms || "Payment due within 30 days of invoice date.",
        items: invoice.items.length > 0 ? invoice.items : [{ description: "", quantity: 1, unitPrice: 0, total: 0 }],
      });
    } else {
      setEditingInvoice(null);
      setFormData({
        userId: "",
        guestName: "",
        guestEmail: "",
        guestPhone: "",
        guestAddress: "",
        dueDate: "",
        notes: "",
        terms: "Payment due within 30 days of invoice date.",
        items: [{ description: "", quantity: 1, unitPrice: 0, total: 0 }],
      });
    }
    setShowModal(true);
  }

  function handleCustomerChange(value: string) {
    const customer = customers.find((c) => c.id === value);
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

  function updateItem(index: number, field: keyof InvoiceItem, value: string | number) {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    if (field === "quantity" || field === "unitPrice") {
      newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
    }
    setFormData({ ...formData, items: newItems });
  }

  function addItem() {
    setFormData({
      ...formData,
      items: [...formData.items, { description: "", quantity: 1, unitPrice: 0, total: 0 }],
    });
  }

  function removeItem(index: number) {
    if (formData.items.length > 1) {
      setFormData({ ...formData, items: formData.items.filter((_, i) => i !== index) });
    }
  }

  const subtotal = formData.items.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.0625; // 6.25% MA sales tax
  const total = subtotal + tax;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const url = editingInvoice ? `/api/admin/invoices/${editingInvoice.id}` : "/api/admin/invoices";
      const method = editingInvoice ? "PATCH" : "POST";

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
        fetchInvoices();
      }
    } catch (error) {
      console.error("Failed to save invoice:", error);
    }
  }

  async function deleteInvoice(id: string) {
    if (!confirm("Are you sure you want to delete this invoice?")) return;
    try {
      const res = await fetch(`/api/admin/invoices/${id}`, { method: "DELETE" });
      if (res.ok) {
        setInvoices(invoices.filter((inv) => inv.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete invoice:", error);
    }
  }

  async function sendInvoice(invoice: Invoice) {
    setSending(invoice.id);
    try {
      const res = await fetch(`/api/admin/invoices/${invoice.id}/send`, { method: "POST" });
      if (res.ok) {
        fetchInvoices();
        alert("Invoice sent successfully!");
      } else {
        alert("Failed to send invoice");
      }
    } catch (error) {
      console.error("Failed to send invoice:", error);
      alert("Failed to send invoice");
    } finally {
      setSending(null);
    }
  }

  async function markAsPaid(id: string) {
    try {
      const res = await fetch(`/api/admin/invoices/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "PAID", paidDate: new Date().toISOString() }),
      });
      if (res.ok) {
        fetchInvoices();
      }
    } catch (error) {
      console.error("Failed to mark as paid:", error);
    }
  }

  const filteredInvoices = filter === "all" ? invoices : invoices.filter((inv) => inv.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "SENT": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "DRAFT": return "bg-gray-500/10 text-gray-400 border-gray-500/20";
      case "OVERDUE": return "bg-red-500/10 text-red-400 border-red-500/20";
      case "CANCELLED": return "bg-red-500/10 text-red-400 border-red-500/20";
      default: return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl text-[var(--accent-light)]" style={{ fontFamily: "var(--font-dancing-script), cursive" }}>
          Invoices
        </h1>
        <button onClick={() => openModal()} className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-4 py-2 rounded-lg transition-colors">
          + New Invoice
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <button onClick={() => setFilter("all")} className={`px-4 py-2 rounded-lg text-sm transition-colors ${filter === "all" ? "bg-[var(--accent)] text-white" : "bg-[var(--background-card)] text-[var(--foreground-muted)] border border-[var(--border)]"}`}>
          All
        </button>
        {statuses.map((status) => (
          <button key={status} onClick={() => setFilter(status)} className={`px-4 py-2 rounded-lg text-sm transition-colors ${filter === status ? "bg-[var(--accent)] text-white" : "bg-[var(--background-card)] text-[var(--foreground-muted)] border border-[var(--border)]"}`}>
            {status}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-[var(--foreground-muted)]">Loading invoices...</div>
      ) : filteredInvoices.length === 0 ? (
        <div className="bg-[var(--background-card)] rounded-xl p-12 text-center border border-[var(--border)]">
          <p className="text-[var(--foreground-muted)]">No invoices found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInvoices.map((invoice) => (
            <div key={invoice.id} className="bg-[var(--background-card)] rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="p-4 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="font-semibold text-[var(--foreground)]">Invoice #{invoice.invoiceNumber}</div>
                  <div className="text-sm text-[var(--foreground-muted)]">
                    {invoice.user?.name || invoice.guestName || "Guest"} · {invoice.user?.email || invoice.guestEmail}
                  </div>
                  <div className="text-sm text-[var(--foreground-muted)]">
                    Created: {new Date(invoice.createdAt).toLocaleDateString()}
                    {invoice.dueDate && ` · Due: ${new Date(invoice.dueDate).toLocaleDateString()}`}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-lg text-sm border ${getStatusColor(invoice.status)}`}>
                    {invoice.status}
                  </span>
                  <span className="text-xl font-bold text-[var(--foreground)]">${invoice.total.toFixed(2)}</span>
                </div>
              </div>
              <div className="px-4 pb-4 flex flex-wrap gap-2">
                <button onClick={() => openModal(invoice)} className="text-sm px-3 py-1 rounded bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--border)] transition-colors">
                  Edit
                </button>
                {invoice.status === "DRAFT" && (
                  <button onClick={() => sendInvoice(invoice)} disabled={sending === invoice.id} className="text-sm px-3 py-1 rounded bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors disabled:opacity-50">
                    {sending === invoice.id ? "Sending..." : "Send Invoice"}
                  </button>
                )}
                {(invoice.status === "SENT" || invoice.status === "OVERDUE") && (
                  <button onClick={() => markAsPaid(invoice.id)} className="text-sm px-3 py-1 rounded bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors">
                    Mark as Paid
                  </button>
                )}
                <Link href={`/admin/invoices/${invoice.id}`} className="text-sm px-3 py-1 rounded bg-[var(--accent)]/10 text-[var(--accent-light)] hover:bg-[var(--accent)]/20 transition-colors">
                  View
                </Link>
                <button onClick={() => deleteInvoice(invoice.id)} className="text-sm px-3 py-1 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invoice Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[var(--background-card)] rounded-xl border border-[var(--border)] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-[var(--border)]">
              <h2 className="text-xl font-semibold text-[var(--foreground)]">
                {editingInvoice ? "Edit Invoice" : "New Invoice"}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm text-[var(--foreground-muted)] mb-1">Customer</label>
                  <select value={formData.userId} onChange={(e) => handleCustomerChange(e.target.value)} className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]">
                    <option value="">Select existing customer or enter guest info below</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>{c.name || c.email}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-[var(--foreground-muted)] mb-1">Name</label>
                  <input type="text" value={formData.guestName} onChange={(e) => setFormData({ ...formData, guestName: e.target.value })} className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]" required />
                </div>
                <div>
                  <label className="block text-sm text-[var(--foreground-muted)] mb-1">Email</label>
                  <input type="email" value={formData.guestEmail} onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })} className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]" required />
                </div>
                <div>
                  <label className="block text-sm text-[var(--foreground-muted)] mb-1">Phone</label>
                  <input type="tel" value={formData.guestPhone} onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })} className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]" />
                </div>
                <div>
                  <label className="block text-sm text-[var(--foreground-muted)] mb-1">Due Date</label>
                  <input type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm text-[var(--foreground-muted)] mb-1">Address</label>
                  <input type="text" value={formData.guestAddress} onChange={(e) => setFormData({ ...formData, guestAddress: e.target.value })} className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]" placeholder="Street, City, State ZIP" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm text-[var(--foreground-muted)]">Line Items</label>
                  <button type="button" onClick={addItem} className="text-sm text-[var(--accent-light)] hover:underline">+ Add Item</button>
                </div>
                <div className="space-y-2">
                  {formData.items.map((item, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <input type="text" placeholder="Description" value={item.description} onChange={(e) => updateItem(index, "description", e.target.value)} className="flex-1 px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)] text-sm" required />
                      <input type="number" placeholder="Qty" value={item.quantity} onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value) || 0)} className="w-20 px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)] text-sm" min="1" required />
                      <input type="number" placeholder="Price" step="0.01" value={item.unitPrice} onChange={(e) => updateItem(index, "unitPrice", parseFloat(e.target.value) || 0)} className="w-24 px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)] text-sm" required />
                      <div className="w-24 px-3 py-2 text-right text-sm text-[var(--foreground)]">${item.total.toFixed(2)}</div>
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
                <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={2} className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)] resize-none" placeholder="Thank you for your business!" />
              </div>

              <div>
                <label className="block text-sm text-[var(--foreground-muted)] mb-1">Terms</label>
                <textarea value={formData.terms} onChange={(e) => setFormData({ ...formData, terms: e.target.value })} rows={2} className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)] resize-none" />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 rounded-lg bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--border)] transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2 rounded-lg bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors">
                  {editingInvoice ? "Save Changes" : "Create Invoice"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
