"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "Our Story" },
  { href: "/order", label: "Order" },
  { href: "/events", label: "Events" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)]/95 backdrop-blur-sm border-b border-[var(--border)]">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/images/logo.png" alt="Sweet Meadow Bakery" width={50} height={50} className="rounded-full" />
            <span className="text-2xl text-[var(--accent-light)]" style={{ fontFamily: "var(--font-dancing-script), cursive" }}>
              Sweet Meadow
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-[var(--foreground-muted)] hover:text-[var(--accent-light)] transition-colors text-sm tracking-wide uppercase">
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <a href="tel:4782991604" className="text-[var(--accent-light)] hover:text-[var(--accent-hover)] transition-colors">(478) 299-1604</a>
            {status === "loading" ? (
              <span className="text-[var(--foreground-muted)] text-sm">...</span>
            ) : session ? (
              <div className="flex items-center gap-3">
                {isAdmin && (
                  <Link href="/admin" className="text-sm text-[var(--accent)] hover:text-[var(--accent-light)] transition-colors">
                    Admin
                  </Link>
                )}
                <Link href="/account" className="text-sm text-[var(--foreground-muted)] hover:text-[var(--accent-light)] transition-colors">
                  My Account
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-sm text-[var(--foreground-muted)] hover:text-[var(--accent-light)] transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link href="/login" className="btn btn-primary text-sm px-4 py-2">
                Sign In
              </Link>
            )}
          </div>

          <button className="md:hidden p-2 text-[var(--foreground)]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:hidden overflow-hidden">
              <div className="py-4 space-y-2">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="block py-2 text-[var(--foreground-muted)] hover:text-[var(--accent-light)] transition-colors" onClick={() => setMobileMenuOpen(false)}>
                    {link.label}
                  </Link>
                ))}
                <a href="tel:4782991604" className="block py-2 text-[var(--accent-light)]">(478) 299-1604</a>
                <div className="pt-4 border-t border-[var(--border)]">
                  {session ? (
                    <>
                      {isAdmin && (
                        <Link href="/admin" className="block py-2 text-[var(--accent)]" onClick={() => setMobileMenuOpen(false)}>
                          Admin Dashboard
                        </Link>
                      )}
                      <Link href="/account" className="block py-2 text-[var(--foreground-muted)]" onClick={() => setMobileMenuOpen(false)}>
                        My Account
                      </Link>
                      <button
                        onClick={() => { signOut({ callbackUrl: "/" }); setMobileMenuOpen(false); }}
                        className="block py-2 text-[var(--foreground-muted)]"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <Link href="/login" className="block py-2 text-[var(--accent-light)]" onClick={() => setMobileMenuOpen(false)}>
                      Sign In
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
