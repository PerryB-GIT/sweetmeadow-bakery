"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      if (res.ok) { setStatus("success"); setFormData({ name: "", email: "", message: "" }); }
      else { setStatus("error"); }
    } catch { setStatus("error"); }
  };

  return (
    <div className="pt-20">
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-5xl sm:text-6xl text-[var(--accent-light)] mb-4" style={{ fontFamily: "var(--font-dancing-script), cursive" }}>Contact Us</h1>
            <p className="text-[var(--foreground-muted)]">We would love to hear from you</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <div className="bg-[var(--background-card)] rounded-2xl p-8 border border-[var(--border)] mb-6">
                <h2 className="text-2xl text-[var(--accent-light)] mb-6" style={{ fontFamily: "var(--font-dancing-script), cursive" }}>Get in Touch</h2>
                <div className="space-y-4">
                  <div><p className="text-[var(--foreground-muted)] text-sm">Location</p><p className="text-[var(--foreground)]">Beverly, MA</p></div>
                  <div><p className="text-[var(--foreground-muted)] text-sm">Phone</p><a href="tel:4782991604" className="text-[var(--accent-light)] hover:text-[var(--accent-hover)]">(478) 299-1604</a></div>
                  <div><p className="text-[var(--foreground-muted)] text-sm">Email</p><a href="mailto:sweetmeadowbakery@gmail.com" className="text-[var(--accent-light)] hover:text-[var(--accent-hover)]">sweetmeadowbakery@gmail.com</a></div>
                  <div><p className="text-[var(--foreground-muted)] text-sm">Hours</p><p className="text-[var(--foreground)]">Daily 9am - 5pm</p></div>
                </div>
              </div>
              <div className="bg-[var(--background-card)] rounded-2xl p-8 border border-[var(--border)]">
                <h3 className="text-xl text-[var(--accent-light)] mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  <a href="https://instagram.com/sweet_meadow_2025" target="_blank" rel="noopener noreferrer" className="text-[var(--foreground-muted)] hover:text-[var(--accent-light)]">Instagram</a>
                  <a href="https://facebook.com/profile.php?id=61581843576438" target="_blank" rel="noopener noreferrer" className="text-[var(--foreground-muted)] hover:text-[var(--accent-light)]">Facebook</a>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              {status === "success" ? (
                <div className="bg-green-900/20 border border-green-500/30 rounded-2xl p-8 text-center h-full flex items-center justify-center">
                  <div><h2 className="text-2xl text-green-400 mb-4">Message Sent\!</h2><p className="text-[var(--foreground-muted)]">We will get back to you soon.</p></div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-[var(--background-card)] rounded-2xl p-8 border border-[var(--border)]">
                  <h2 className="text-2xl text-[var(--accent-light)] mb-6" style={{ fontFamily: "var(--font-dancing-script), cursive" }}>Send a Message</h2>
                  <div className="grid gap-6">
                    <div><label className="block text-[var(--foreground)] mb-2">Name *</label><input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]" /></div>
                    <div><label className="block text-[var(--foreground)] mb-2">Email *</label><input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]" /></div>
                    <div><label className="block text-[var(--foreground)] mb-2">Message *</label><textarea rows={4} required value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)] resize-none" /></div>
                    <button type="submit" disabled={status === "loading"} className="btn btn-primary w-full">{status === "loading" ? "Sending..." : "Send Message"}</button>
                    {status === "error" && <p className="text-red-400 text-center">Something went wrong. Please try again.</p>}
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
