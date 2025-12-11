"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface Booking {
  id: string;
  eventType: string;
  eventDate: string;
  guestCount: number | null;
  status: string;
  message: string | null;
  createdAt: string;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch("/api/client/bookings");
        if (res.ok) {
          const data = await res.json();
          setBookings(data.bookings || []);
        }
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "CONTACTED": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "COMPLETED": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "CANCELLED": return "bg-red-500/10 text-red-400 border-red-500/20";
      default: return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl text-[var(--accent-light)]" style={{ fontFamily: "var(--font-dancing-script), cursive" }}>
          Event Bookings
        </h1>
        <Link href="/events" className="btn btn-primary text-sm">New Inquiry</Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-[var(--foreground-muted)]">Loading...</div>
      ) : bookings.length === 0 ? (
        <div className="bg-[var(--background-card)] rounded-xl p-12 text-center border border-[var(--border)]">
          <p className="text-[var(--foreground-muted)] mb-4">No event bookings yet.</p>
          <Link href="/events" className="btn btn-primary">Plan an Event</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-[var(--background-card)] rounded-xl p-6 border border-[var(--border)]">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <div className="font-medium text-[var(--foreground)]">{booking.eventType}</div>
                  <div className="text-sm text-[var(--foreground-muted)]">
                    {new Date(booking.eventDate).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                    {booking.guestCount && ` · ${booking.guestCount} guests`}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                  {booking.status}
                </span>
              </div>
              {booking.message && (
                <p className="text-sm text-[var(--foreground-muted)] bg-[var(--background)] p-3 rounded-lg">
                  {booking.message}
                </p>
              )}
              <div className="text-xs text-[var(--foreground-muted)] mt-4">
                Submitted on {new Date(booking.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
