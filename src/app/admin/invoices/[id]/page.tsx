"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

interface InvoiceItem {
  id: string;
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

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchInvoice();
    }
  }, [params.id]);

  async function fetchInvoice() {
    try {
      const res = await fetch(`/api/admin/invoices/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setInvoice(data.invoice);
      }
    } catch (error) {
      console.error("Failed to fetch invoice:", error);
    } finally {
      setLoading(false);
    }
  }

  async function sendInvoice() {
    if (!invoice) return;
    setSending(true);
    try {
      const res = await fetch(`/api/admin/invoices/${invoice.id}/send`, { method: "POST" });
      if (res.ok) {
        fetchInvoice();
        alert("Invoice sent successfully!");
      } else {
        alert("Failed to send invoice");
      }
    } catch (error) {
      console.error("Failed to send invoice:", error);
      alert("Failed to send invoice");
    } finally {
      setSending(false);
    }
  }

  async function markAsPaid() {
    if (!invoice) return;
    try {
      const res = await fetch(`/api/admin/invoices/${invoice.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "PAID", paidDate: new Date().toISOString() }),
      });
      if (res.ok) {
        fetchInvoice();
      }
    } catch (error) {
      console.error("Failed to mark as paid:", error);
    }
  }

  async function deleteInvoice() {
    if (!invoice || !confirm("Are you sure you want to delete this invoice?")) return;
    try {
      const res = await fetch(`/api/admin/invoices/${invoice.id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/admin/invoices");
      }
    } catch (error) {
      console.error("Failed to delete invoice:", error);
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID": return "bg-green-500/10 text-green-400";
      case "SENT": return "bg-blue-500/10 text-blue-400";
      case "DRAFT": return "bg-gray-500/10 text-gray-400";
      case "OVERDUE": return "bg-red-500/10 text-red-400";
      case "CANCELLED": return "bg-red-500/10 text-red-400";
      default: return "bg-gray-500/10 text-gray-400";
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-[var(--foreground-muted)]">Loading invoice...</div>
    );
  }

  if (!invoice) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--foreground-muted)] mb-4">Invoice not found</p>
        <Link href="/admin/invoices" className="text-[var(--accent-light)] hover:underline">
          Back to Invoices
        </Link>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link href="/admin/invoices" className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] mb-2 inline-block">
            &larr; Back to Invoices
          </Link>
          <h1 className="text-3xl text-[var(--accent-light)]" style={{ fontFamily: "var(--font-dancing-script), cursive" }}>
            Invoice #{invoice.invoiceNumber}
          </h1>
        </div>
        <div className="flex gap-2">
          {invoice.status === "DRAFT" && (
            <button onClick={sendInvoice} disabled={sending} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50">
              {sending ? "Sending..." : "Send Invoice"}
            </button>
          )}
          {(invoice.status === "SENT" || invoice.status === "OVERDUE") && (
            <button onClick={markAsPaid} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors">
              Mark as Paid
            </button>
          )}
          <button onClick={deleteInvoice} className="bg-red-500/10 text-red-400 hover:bg-red-500/20 px-4 py-2 rounded-lg transition-colors">
            Delete
          </button>
        </div>
      </div>

      {/* Invoice Preview */}
      <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden text-gray-900">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-bold text-[#8B4513]" style={{ fontFamily: "var(--font-dancing-script), cursive" }}>
                Sweet Meadow Bakery
              </h2>
              <p className="text-gray-600 mt-1">Beverly, MA</p>
              <p className="text-gray-600">(478) 299-1604</p>
              <p className="text-gray-600">sweetmeadowbakery@gmail.com</p>
            </div>
            <div className="text-right">
              <div className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${getStatusColor(invoice.status)}`}>
                {invoice.status}
              </div>
              <h3 className="text-2xl font-bold mt-2">INVOICE</h3>
              <p className="text-gray-600">#{invoice.invoiceNumber}</p>
            </div>
          </div>

          {/* Bill To & Dates */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h4 className="text-sm font-semibold text-gray-500 mb-2">BILL TO</h4>
              <p className="font-semibold">{invoice.user?.name || invoice.guestName}</p>
              <p className="text-gray-600">{invoice.user?.email || invoice.guestEmail}</p>
              {invoice.guestPhone && <p className="text-gray-600">{invoice.guestPhone}</p>}
              {invoice.guestAddress && <p className="text-gray-600">{invoice.guestAddress}</p>}
            </div>
            <div className="text-right">
              <div className="mb-2">
                <span className="text-sm text-gray-500">Invoice Date:</span>
                <span className="ml-2 font-medium">{new Date(invoice.createdAt).toLocaleDateString()}</span>
              </div>
              {invoice.dueDate && (
                <div className="mb-2">
                  <span className="text-sm text-gray-500">Due Date:</span>
                  <span className="ml-2 font-medium">{new Date(invoice.dueDate).toLocaleDateString()}</span>
                </div>
              )}
              {invoice.sentAt && (
                <div className="mb-2">
                  <span className="text-sm text-gray-500">Sent:</span>
                  <span className="ml-2 font-medium">{new Date(invoice.sentAt).toLocaleDateString()}</span>
                </div>
              )}
              {invoice.paidDate && (
                <div className="mb-2">
                  <span className="text-sm text-gray-500">Paid:</span>
                  <span className="ml-2 font-medium text-green-600">{new Date(invoice.paidDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Line Items */}
          <table className="w-full mb-8">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 text-sm font-semibold text-gray-500">DESCRIPTION</th>
                <th className="text-center py-3 text-sm font-semibold text-gray-500 w-20">QTY</th>
                <th className="text-right py-3 text-sm font-semibold text-gray-500 w-28">PRICE</th>
                <th className="text-right py-3 text-sm font-semibold text-gray-500 w-28">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <tr key={item.id} className="border-b border-gray-100">
                  <td className="py-4">{item.description}</td>
                  <td className="py-4 text-center">{item.quantity}</td>
                  <td className="py-4 text-right">${item.unitPrice.toFixed(2)}</td>
                  <td className="py-4 text-right font-medium">${item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">${invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Tax (6.25%):</span>
                <span className="font-medium">${invoice.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-3 border-t-2 border-gray-200">
                <span className="text-lg font-bold">Total:</span>
                <span className="text-lg font-bold text-[#8B4513]">${invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Notes & Terms */}
          {(invoice.notes || invoice.terms) && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              {invoice.notes && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-500 mb-1">NOTES</h4>
                  <p className="text-gray-600">{invoice.notes}</p>
                </div>
              )}
              {invoice.terms && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-1">TERMS</h4>
                  <p className="text-gray-600 text-sm">{invoice.terms}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
