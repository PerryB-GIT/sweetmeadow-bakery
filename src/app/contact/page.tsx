"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "", honeypot: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.honeypot) return;
    setStatus("loading");
    try {
      const { honeypot, ...submitData } = formData;
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(submitData) });
      if (res.ok) { setStatus("success"); setFormData({ name: "", email: "", message: "", honeypot: "" }); }
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
                  <div><p className="text-[var(--foreground-muted)] text-sm">Phone</p><a href="tel:{BUSINESS_PHONE}" className="text-[var(--accent-light)] hover:text-[var(--accent-hover)]">{BUSINESS_PHONE}</a></div>
                  <div><p className="text-[var(--foreground-muted)] text-sm">Email</p><a href="mailto:sweetmeadowbakery@gmail.com" className="text-[var(--accent-light)] hover:text-[var(--accent-hover)]">sweetmeadowbakery@gmail.com</a></div>
                  <div><p className="text-[var(--foreground-muted)] text-sm">Hours</p><p className="text-[var(--foreground)]">Daily 9am - 5pm</p></div>
                </div>
              </div>

              <div className="bg-[var(--background-card)] rounded-2xl overflow-hidden border border-[var(--border)] mb-6">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d23456.76590742!2d-70.88!3d42.558!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e31513bd825d4f%3A0x3de35e0d1f0d3e69!2sBeverly%2C%20MA!5e0!3m2!1sen!2sus!4v1702300000000!5m2!1sen!2sus"
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Sweet Meadow Bakery location in Beverly, MA"
                />
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
                  <div><h2 className="text-2xl text-green-400 mb-4">Message Sent!</h2><p className="text-[var(--foreground-muted)]">We will get back to you soon.</p></div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-[var(--background-card)] rounded-2xl p-8 border border-[var(--border)]">
                  <h2 className="text-2xl text-[var(--accent-light)] mb-6" style={{ fontFamily: "var(--font-dancing-script), cursive" }}>Send a Message</h2>
                  <div className="grid gap-6">
                    <div><label htmlFor="name" className="block text-[var(--foreground)] mb-2">Name *</label><input id="name" type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]" /></div>
                    <div><label htmlFor="email" className="block text-[var(--foreground)] mb-2">Email *</label><input id="email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]" /></div>
                    <div><label htmlFor="message" className="block text-[var(--foreground)] mb-2">Message *</label><textarea id="message" rows={4} required value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)] resize-none" /></div>
                    <input type="text" name="website" value={formData.honeypot} onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })} className="absolute -left-[9999px]" tabIndex={-1} autoComplete="off" aria-hidden="true" />
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
