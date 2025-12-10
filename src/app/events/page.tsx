"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function EventsPage() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", eventType: "", eventDate: "", guestCount: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      if (res.ok) { setStatus("success"); setFormData({ name: "", email: "", phone: "", eventType: "", eventDate: "", guestCount: "", message: "" }); }
      else { setStatus("error"); }
    } catch { setStatus("error"); }
  };

  return (
    <div className="pt-20">
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-5xl sm:text-6xl text-[var(--accent-light)] mb-4" style={{ fontFamily: "var(--font-dancing-script), cursive" }}>Events</h1>
            <p className="text-[var(--foreground-muted)]">Let us make your special occasion unforgettable</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-[var(--background-card)] rounded-2xl p-6 border border-[var(--border)]">
              <h3 className="text-xl text-[var(--accent-light)] mb-3">Private Events</h3>
              <p className="text-[var(--foreground-muted)]">Birthdays, anniversaries, baby showers, and intimate celebrations</p>
            </div>
            <div className="bg-[var(--background-card)] rounded-2xl p-6 border border-[var(--border)]">
              <h3 className="text-xl text-[var(--accent-light)] mb-3">Corporate Orders</h3>
              <p className="text-[var(--foreground-muted)]">Office parties, client gifts, team celebrations, and corporate events</p>
            </div>
            <div className="bg-[var(--background-card)] rounded-2xl p-6 border border-[var(--border)]">
              <h3 className="text-xl text-[var(--accent-light)] mb-3">Wedding Treats</h3>
              <p className="text-[var(--foreground-muted)]">Individual wedding cakes, dessert tables, and bridal party favors</p>
            </div>
            <div className="bg-[var(--background-card)] rounded-2xl p-6 border border-[var(--border)]">
              <h3 className="text-xl text-[var(--accent-light)] mb-3">Pop-Up Markets</h3>
              <p className="text-[var(--foreground-muted)]">Find us at local markets and events throughout the North Shore</p>
            </div>
          </div>

          {status === "success" ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-green-900/20 border border-green-500/30 rounded-2xl p-8 text-center">
              <h2 className="text-2xl text-green-400 mb-4">Inquiry Received\!</h2>
              <p className="text-[var(--foreground-muted)]">We will be in touch soon to discuss your event. Thank you\!</p>
            </motion.div>
          ) : (
            <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} onSubmit={handleSubmit} className="bg-[var(--background-card)] rounded-2xl p-8 border border-[var(--border)]">
              <h2 className="text-2xl text-[var(--accent-light)] mb-6" style={{ fontFamily: "var(--font-dancing-script), cursive" }}>Event Inquiry</h2>
              <div className="grid gap-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div><label className="block text-[var(--foreground)] mb-2">Your Name *</label><input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]" /></div>
                  <div><label className="block text-[var(--foreground)] mb-2">Email *</label><input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]" /></div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><label className="block text-[var(--foreground)] mb-2">Phone</label><input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]" /></div>
                  <div><label className="block text-[var(--foreground)] mb-2">Event Type</label><select value={formData.eventType} onChange={(e) => setFormData({ ...formData, eventType: e.target.value })} className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]"><option value="">Select...</option><option>Private Event</option><option>Corporate Order</option><option>Wedding</option><option>Other</option></select></div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><label className="block text-[var(--foreground)] mb-2">Event Date</label><input type="date" value={formData.eventDate} onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })} className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]" /></div>
                  <div><label className="block text-[var(--foreground)] mb-2">Estimated Guests</label><input type="number" value={formData.guestCount} onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })} className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]" /></div>
                </div>
                <div><label className="block text-[var(--foreground)] mb-2">Tell us about your event</label><textarea rows={4} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)] resize-none" /></div>
                <button type="submit" disabled={status === "loading"} className="btn btn-primary w-full text-lg py-4">{status === "loading" ? "Sending..." : "Submit Inquiry"}</button>
                {status === "error" && <p className="text-red-400 text-center">Something went wrong. Please try again or call us.</p>}
              </div>
            </motion.form>
          )}
        </div>
      </section>
    </div>
  );
}
