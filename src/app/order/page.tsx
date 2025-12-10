"use client";

import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

function OrderFormContent() {
  const searchParams = useSearchParams();
  const preselectedItem = searchParams.get("item") || "";
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    item: preselectedItem,
    quantity: "1",
    pickupDate: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      if (res.ok) { setStatus("success"); setFormData({ name: "", email: "", phone: "", item: "", quantity: "1", pickupDate: "", message: "" }); }
      else { setStatus("error"); }
    } catch { setStatus("error"); }
  };

  return (
    <>
      {status === "success" ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-green-900/20 border border-green-500/30 rounded-2xl p-8 text-center">
          <h2 className="text-2xl text-green-400 mb-4">Order Request Received\!</h2>
          <p className="text-[var(--foreground-muted)]">We will be in touch soon to confirm your order.</p>
        </motion.div>
      ) : (
        <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} onSubmit={handleSubmit} className="bg-[var(--background-card)] rounded-2xl p-8 border border-[var(--border)]">
          <div className="grid gap-6">
            <div><label className="block text-[var(--foreground)] mb-2">Your Name *</label><input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]" /></div>
            <div><label className="block text-[var(--foreground)] mb-2">Email *</label><input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]" /></div>
            <div><label className="block text-[var(--foreground)] mb-2">Phone</label><input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]" /></div>
            <div><label className="block text-[var(--foreground)] mb-2">What would you like? *</label><input type="text" required value={formData.item} onChange={(e) => setFormData({ ...formData, item: e.target.value })} placeholder="e.g., Classic Vanilla Bean, Custom cake..." className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-[var(--foreground)] mb-2">Quantity</label><input type="number" min="1" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]" /></div>
              <div><label className="block text-[var(--foreground)] mb-2">Pickup Date</label><input type="date" value={formData.pickupDate} onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })} className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]" /></div>
            </div>
            <div><label className="block text-[var(--foreground)] mb-2">Special Instructions</label><textarea rows={4} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="Tell us about your vision..." className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)] resize-none" /></div>
            <button type="submit" disabled={status === "loading"} className="btn btn-primary w-full text-lg py-4">{status === "loading" ? "Sending..." : "Submit Order Request"}</button>
            {status === "error" && <p className="text-red-400 text-center">Something went wrong. Please try again.</p>}
          </div>
        </motion.form>
      )}
    </>
  );
}

export default function OrderPage() {
  return (
    <div className="pt-20">
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-5xl sm:text-6xl text-[var(--accent-light)] mb-4" style={{ fontFamily: "var(--font-dancing-script), cursive" }}>Place an Order</h1>
            <p className="text-[var(--foreground-muted)]">Tell us about your sweet treat request</p>
          </motion.div>
          <Suspense fallback={<div className="text-center text-[var(--foreground-muted)]">Loading...</div>}>
            <OrderFormContent />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
