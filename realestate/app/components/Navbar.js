"use client";

import { useEffect, useState } from "react";
import { Heart, Menu, Phone, X, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { BRAND } from "../config/brand";
import Logo from "./Logo";
import { clearSession } from "../utils/session";

export default function Navbar({ theme = "dark" }) {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const light = theme === "dark";

  useEffect(() => {
    setIsLoggedIn(Boolean(localStorage.getItem("token")));
    setRole(localStorage.getItem("userRole") || localStorage.getItem("role"));
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);
  const logout = () => {
    clearSession();
    setIsLoggedIn(false);
    setRole(null);
    close();
    window.location.href = "/";
  };

  return (
    <>
      <header className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-6 py-5 sm:px-8 lg:px-12">
        {/* Brand Logo & Name */}
        <Logo tone={light ? "light" : "dark"} />

        {/* Desktop Navigation */}
        <nav
          className={`hidden items-center gap-8 text-sm font-semibold lg:flex ${
            light ? "text-white/90" : "text-[#1A1A1A]"
          }`}
          aria-label="Primary navigation"
        >
          <Link
            href="/properties"
            className="transition hover:text-[#1E7F4B] hover:-translate-y-0.5"
          >
            Explore Properties
          </Link>
          <Link
            href="/blog"
            className="transition hover:text-[#1E7F4B] hover:-translate-y-0.5"
          >
            Guides
          </Link>
          <Link
            href="/addProperty"
            className="transition hover:text-[#1E7F4B] hover:-translate-y-0.5"
          >
            List Property
          </Link>
          {isLoggedIn && (
            <Link
              href="/Favourite"
              className="transition hover:text-[#1E7F4B] hover:-translate-y-0.5"
            >
              Saved Homes
            </Link>
          )}
          {isLoggedIn && role === "agent" && (
            <Link
              href="/myProperties"
              className="transition hover:text-[#1E7F4B] hover:-translate-y-0.5"
            >
              My Listings
            </Link>
          )}
        </nav>

        {/* Header Right Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          <a
            href={BRAND.phoneHref}
            className={`hidden xl:inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs sm:text-sm font-semibold transition ${
              light
                ? "border-white/25 text-white hover:bg-white/10"
                : "border-gray-200 text-[#0B1F33] hover:bg-gray-100"
            }`}
          >
            <Phone className="h-3.5 w-3.5 text-[#1E7F4B]" />
            <span>{BRAND.phoneDisplay}</span>
          </a>

          {!isLoggedIn ? (
            <>
              <Link
                href="/login"
                className={`hidden sm:inline-flex items-center px-2 py-2.5 text-sm font-semibold transition ${
                  light ? "text-white/90 hover:text-white" : "text-[#0B1F33] hover:text-[#1E7F4B]"
                }`}
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className={`hidden sm:inline-flex items-center rounded-xl px-5 py-2.5 text-sm font-bold transition shadow-sm ${
                  light
                    ? "bg-white text-[#0B1F33] hover:bg-[#D4AF37]"
                    : "bg-[#0B1F33] text-white hover:bg-[#1E7F4B]"
                }`}
              >
                Get started
              </Link>
            </>
          ) : (
            <button
              onClick={logout}
              className={`hidden sm:inline-flex items-center rounded-xl px-4 py-2 text-xs font-semibold border ${
                light
                  ? "border-white/30 text-white hover:bg-white/10"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              Log Out
            </button>
          )}

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className={`inline-flex lg:hidden h-10 w-10 items-center justify-center rounded-xl border transition ${
              light
                ? "border-white/25 bg-white/10 text-white hover:bg-white/20"
                : "border-gray-200 bg-white text-[#0B1F33] hover:bg-gray-100"
            }`}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[90] bg-[#0B1F33]/70 backdrop-blur-sm transition-opacity ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={close}
      />

      {/* Drawer */}
      <aside
        className={`fixed right-0 top-0 z-[100] flex h-dvh w-full max-w-md flex-col bg-white p-6 shadow-2xl transition-transform duration-300 sm:p-8 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between pb-6 border-b border-gray-100">
          <Logo tone="dark" size={36} href={null} />
          <button
            onClick={close}
            aria-label="Close menu"
            className="h-10 w-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="mt-8 flex flex-col space-y-4" aria-label="Menu navigation">
          {[
            ["Explore Properties", "/properties"],
            ["List a Property", "/addProperty"],
            ["Guides", "/blog"],
            ["Listing Standards", "/commonrules"],
            ["My Bookings", "/booking"],
            ["Saved Properties", "/Favourite"],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              onClick={close}
              className="text-lg font-semibold text-[#1A1A1A] hover:text-[#1E7F4B] transition py-2 border-b border-gray-50 flex items-center justify-between"
            >
              <span>{label}</span>
              <span className="text-gray-400">→</span>
            </Link>
          ))}
          {role === "agent" && (
            <Link
              href="/myProperties"
              onClick={close}
              className="text-lg font-semibold text-[#1E7F4B] py-2 border-b border-gray-50"
            >
              Agent Listings Dashboard
            </Link>
          )}
        </nav>

        {/* Direct Contact Card */}
        <div className="mt-auto rounded-2xl bg-[#0B1F33] p-6 text-white space-y-3">
          <p className="text-xs uppercase font-bold tracking-wider text-[#D4AF37]">
            Direct Concierge Assistance
          </p>
          <a href={BRAND.phoneHref} className="block text-2xl font-bold tracking-tight text-white hover:underline">
            {BRAND.phoneDisplay}
          </a>
          <a href={BRAND.emailHref} className="block text-sm text-gray-300 hover:underline">
            {BRAND.email}
          </a>
          <a
            href={BRAND.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-sm font-bold text-white shadow-md hover:bg-[#1fb355] transition"
          >
            Chat with Ann on WhatsApp
          </a>
        </div>

        {/* Auth Buttons */}
        <div className="mt-6 flex gap-3">
          {!isLoggedIn ? (
            <>
              <Link
                href="/login"
                onClick={close}
                className="flex-1 rounded-xl border border-gray-300 py-3 text-center text-sm font-bold text-[#0B1F33] hover:bg-gray-50"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={close}
                className="flex-1 rounded-xl bg-[#0B1F33] py-3 text-center text-sm font-bold text-white hover:bg-[#071524]"
              >
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={logout}
              className="w-full rounded-xl border border-red-200 py-3 text-center text-sm font-bold text-red-600 hover:bg-red-50"
            >
              Log Out
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
