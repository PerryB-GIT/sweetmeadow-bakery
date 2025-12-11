"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface EventBooking {
  id: string;
  eventType: string;
  eventDate: string;
  guestCount: number | null;
  status: string;
  message: string | null;
  adminNotes: string | null;
  createdAt: string;
  user: { id: string; name: string | null; email: string } | null;
  userId: string | null;
  guestName: string | null;
  guestEmail: string | null;
  guestPhone: string | null;
}

interface Customer {
  id: string;
  name: string | null;
  email: string;
}

const statuses = ["INQUIRY", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];
const eventTypes = ["wedding", "birthday", "corporate", "baby_shower", "anniversary", "other"];

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventBooking[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventBooking | null>(null);
  const [formData, setFormData] = useState({
    userId: "",
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    eventType: "wedding",
    eventDate: "",
    guestCount: "",
    message: "",
    adminNotes: "",
  });

  useEffect(() => {
    fetchEvents();
    fetchCustomers();
  }, []);

  async function fetchEvents() {
    try {
      const res = await fetch("/api/admin/events");
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
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

  function openModal(event?: EventBooking) {
    if (event) {
      setEditingEvent(event);
      setFormData({
        userId: event.userId || "",
        guestName: event.guestName || "",
        guestEmail: event.guestEmail || "",
        guestPhone: event.guestPhone || "",
        eventType: event.eventType,
        eventDate: event.eventDate.split("T")[0],
        guestCount: event.guestCount?.toString() || "",
        message: event.message || "",
        adminNotes: event.adminNotes || "",
      });
    } else {
      setEditingEvent(null);
      setFormData({
        userId: "",
        guestName: "",
        guestEmail: "",
        guestPhone: "",
        eventType: "wedding",
        eventDate: "",
        guestCount: "",
        message: "",
        adminNotes: "",
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const url = editingEvent ? `/api/admin/events/${editingEvent.id}` : "/api/admin/events";
      const method = editingEvent ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          guestCount: formData.guestCount ? parseInt(formData.guestCount) : null,
        }),
      });

      if (res.ok) {
        setShowModal(false);
        fetchEvents();
      }
    } catch (error) {
      console.error("Failed to save event:", error);
    }
  }

  async function updateStatus(eventId: string, newStatus: string) {
    try {
      const res = await fetch(`/api/admin/events/${eventId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setEvents(events.map((e) => (e.id === eventId ? { ...e, status: newStatus } : e)));
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  }

  async function deleteEvent(id: string) {
    if (!confirm("Are you sure you want to delete this event booking?")) return;
    try {
      const res = await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
      if (res.ok) {
        setEvents(events.filter((e) => e.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
  }

  const filteredEvents = filter === "all" ? events : events.filter((e) => e.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "CONFIRMED": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "CANCELLED": return "bg-red-500/10 text-red-400 border-red-500/20";
      case "PENDING": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      default: return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const getEventTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      wedding: "Wedding",
      birthday: "Birthday Party",
      corporate: "Corporate Event",
      baby_shower: "Baby Shower",
      anniversary: "Anniversary",
      other: "Other",
    };
    return labels[type] || type;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl text-[var(--accent-light)]" style={{ fontFamily: "var(--font-dancing-script), cursive" }}>
          Event Bookings
        </h1>
        <button onClick={() => openModal()} className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-4 py-2 rounded-lg transition-colors">
          + New Booking
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
        <div className="text-center py-12 text-[var(--foreground-muted)]">Loading events...</div>
      ) : filteredEvents.length === 0 ? (
        <div className="bg-[var(--background-card)] rounded-xl p-12 text-center border border-[var(--border)]">
          <p className="text-[var(--foreground-muted)]">No event bookings found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <div key={event.id} className="bg-[var(--background-card)] rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="p-4 border-b border-[var(--border)] flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="font-semibold text-[var(--foreground)]">{getEventTypeLabel(event.eventType)}</div>
                  <div className="text-sm text-[var(--foreground-muted)]">
                    {event.user?.name || event.guestName || "Guest"} · {event.user?.email || event.guestEmail}
                  </div>
                  {event.guestPhone && <div className="text-sm text-[var(--foreground-muted)]">Phone: {event.guestPhone}</div>}
                </div>
                <div className="flex items-center gap-4">
                  <select value={event.status} onChange={(e) => updateStatus(event.id, e.target.value)} className={`px-3 py-1 rounded-lg text-sm border ${getStatusColor(event.status)} bg-transparent cursor-pointer focus:outline-none`}>
                    {statuses.map((s) => (<option key={s} value={s}>{s}</option>))}
                  </select>
                </div>
              </div>
              <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-[var(--foreground-muted)] mb-1">Event Date</div>
                  <div className="text-[var(--foreground)]">
                    {new Date(event.eventDate).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[var(--foreground-muted)] mb-1">Guest Count</div>
                  <div className="text-[var(--foreground)]">{event.guestCount ? `${event.guestCount} guests` : "TBD"}</div>
                </div>
                <div>
                  <div className="text-xs text-[var(--foreground-muted)] mb-1">Booked On</div>
                  <div className="text-[var(--foreground)]">{new Date(event.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
              {event.message && (
                <div className="px-4 pb-2">
                  <div className="text-xs text-[var(--foreground-muted)] mb-1">Message</div>
                  <div className="bg-[var(--background)] p-3 rounded-lg text-sm text-[var(--foreground)]">{event.message}</div>
                </div>
              )}
              <div className="px-4 pb-4 flex gap-2">
                <button onClick={() => openModal(event)} className="text-sm px-3 py-1 rounded bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--border)] transition-colors">
                  Edit
                </button>
                <button onClick={() => deleteEvent(event.id)} className="text-sm px-3 py-1 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Event Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[var(--background-card)] rounded-xl border border-[var(--border)] w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-[var(--border)]">
              <h2 className="text-xl font-semibold text-[var(--foreground)]">
                {editingEvent ? "Edit Event Booking" : "New Event Booking"}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm text-[var(--foreground-muted)] mb-1">Customer</label>
                <select value={formData.userId} onChange={(e) => handleCustomerChange(e.target.value)} className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]">
                  <option value="">Select existing customer or enter guest info</option>
                  {customers.map(c => (<option key={c.id} value={c.id}>{c.name || c.email}</option>))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[var(--foreground-muted)] mb-1">Name</label>
                  <input type="text" value={formData.guestName} onChange={(e) => setFormData({ ...formData, guestName: e.target.value })} className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]" required />
                </div>
                <div>
                  <label className="block text-sm text-[var(--foreground-muted)] mb-1">Email</label>
                  <input type="email" value={formData.guestEmail} onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })} className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]" required />
                </div>
              </div>
              <div>
                <label className="block text-sm text-[var(--foreground-muted)] mb-1">Phone</label>
                <input type="tel" value={formData.guestPhone} onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })} className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[var(--foreground-muted)] mb-1">Event Type</label>
                  <select value={formData.eventType} onChange={(e) => setFormData({ ...formData, eventType: e.target.value })} className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]">
                    {eventTypes.map(type => (<option key={type} value={type}>{getEventTypeLabel(type)}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-[var(--foreground-muted)] mb-1">Event Date</label>
                  <input type="date" value={formData.eventDate} onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })} className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]" required />
                </div>
              </div>
              <div>
                <label className="block text-sm text-[var(--foreground-muted)] mb-1">Guest Count</label>
                <input type="number" value={formData.guestCount} onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })} className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]" min="1" placeholder="Number of guests" />
              </div>
              <div>
                <label className="block text-sm text-[var(--foreground-muted)] mb-1">Message / Special Requests</label>
                <textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} rows={2} className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)] resize-none" />
              </div>
              <div>
                <label className="block text-sm text-[var(--foreground-muted)] mb-1">Admin Notes</label>
                <textarea value={formData.adminNotes} onChange={(e) => setFormData({ ...formData, adminNotes: e.target.value })} rows={2} className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)] resize-none" placeholder="Internal notes..." />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 rounded-lg bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--border)] transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2 rounded-lg bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors">
                  {editingEvent ? "Save Changes" : "Create Booking"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
