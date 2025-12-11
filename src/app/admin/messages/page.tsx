"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    try {
      const res = await fetch("/api/admin/messages");
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead(id: string) {
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });
      if (res.ok) {
        setMessages(messages.map((m) => (m.id === id ? { ...m, read: true } : m)));
      }
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  }

  async function deleteMessage(id: string) {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      const res = await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessages(messages.filter((m) => m.id !== id));
        if (selectedMessage?.id === id) setSelectedMessage(null);
      }
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  }

  function viewMessage(message: Message) {
    setSelectedMessage(message);
    if (!message.read) {
      markAsRead(message.id);
    }
  }

  const filteredMessages =
    filter === "all"
      ? messages
      : filter === "unread"
      ? messages.filter((m) => !m.read)
      : messages.filter((m) => m.read);

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1
        className="text-3xl text-[var(--accent-light)] mb-6"
        style={{ fontFamily: "var(--font-dancing-script), cursive" }}
      >
        Messages
        {unreadCount > 0 && (
          <span className="ml-3 text-base bg-red-500 text-white px-2 py-1 rounded-full">
            {unreadCount} unread
          </span>
        )}
      </h1>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
            filter === "all"
              ? "bg-[var(--accent)] text-white"
              : "bg-[var(--background-card)] text-[var(--foreground-muted)] border border-[var(--border)]"
          }`}
        >
          All ({messages.length})
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
            filter === "unread"
              ? "bg-[var(--accent)] text-white"
              : "bg-[var(--background-card)] text-[var(--foreground-muted)] border border-[var(--border)]"
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setFilter("read")}
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
            filter === "read"
              ? "bg-[var(--accent)] text-white"
              : "bg-[var(--background-card)] text-[var(--foreground-muted)] border border-[var(--border)]"
          }`}
        >
          Read ({messages.length - unreadCount})
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Message List */}
        <div className="bg-[var(--background-card)] rounded-xl border border-[var(--border)] overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-[var(--foreground-muted)]">Loading messages...</div>
          ) : filteredMessages.length === 0 ? (
            <div className="p-8 text-center text-[var(--foreground-muted)]">No messages found</div>
          ) : (
            <div className="divide-y divide-[var(--border)] max-h-[600px] overflow-y-auto">
              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => viewMessage(message)}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedMessage?.id === message.id
                      ? "bg-[var(--accent)]/10"
                      : "hover:bg-[var(--background-light)]"
                  } ${!message.read ? "border-l-4 border-l-[var(--accent)]" : ""}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className={`font-medium ${!message.read ? "text-[var(--foreground)]" : "text-[var(--foreground-muted)]"}`}>
                      {message.name}
                    </div>
                    <div className="text-xs text-[var(--foreground-muted)]">
                      {new Date(message.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-sm text-[var(--foreground-muted)] mb-1">{message.email}</div>
                  <div className="text-sm text-[var(--foreground-muted)] line-clamp-2">
                    {message.message}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message Detail */}
        <div className="bg-[var(--background-card)] rounded-xl border border-[var(--border)] overflow-hidden">
          {selectedMessage ? (
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-[var(--foreground)]">
                    {selectedMessage.name}
                  </h2>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="text-[var(--accent-light)] hover:underline"
                  >
                    {selectedMessage.email}
                  </a>
                </div>
                <button
                  onClick={() => deleteMessage(selectedMessage.id)}
                  className="text-sm px-3 py-1 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  Delete
                </button>
              </div>
              <div className="text-sm text-[var(--foreground-muted)] mb-4">
                Received: {new Date(selectedMessage.createdAt).toLocaleString()}
              </div>
              <div className="bg-[var(--background)] p-4 rounded-lg text-[var(--foreground)] whitespace-pre-wrap">
                {selectedMessage.message}
              </div>
              <div className="mt-4">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: Your message to Sweet Meadow Bakery`}
                  className="inline-block bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Reply via Email
                </a>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-[var(--foreground-muted)]">
              Select a message to view
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
