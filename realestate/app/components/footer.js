import { ArrowUpRight, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Logo from "./Logo";
import { COUNTIES, countySlug } from "../data/kenyaLocations";
import { BRAND } from "../config/brand";

export default function Footer() {
  return (
    <footer className="bg-[#0B1F33] text-white border-t border-white/10">
      <div className="mx-auto max-w-[1400px] px-6 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="grid gap-12 border-b border-white/10 pb-14 lg:grid-cols-[1.5fr_1fr_1fr]">
          {/* Column 1: Brand & Direct Hotline */}
          <div className="space-y-6">
            <Logo tone="light" size={44} />

            <p className="max-w-md text-sm text-gray-300 leading-relaxed">
              Search homes, everyday rentals, commercial property and land across all 47 counties. Free to search and free to list.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href={BRAND.phoneHref}
                className="inline-flex items-center gap-2 rounded-xl bg-[#1E7F4B] hover:bg-[#18683d] px-5 py-3 text-sm font-bold text-white shadow-md transition"
              >
                <Phone className="h-4 w-4" /> Call {BRAND.phoneDisplay}
              </a>
              <a
                href={BRAND.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white hover:text-[#0B1F33] transition"
              >
                WhatsApp Concierge
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
              Property links
            </p>
            <div className="flex flex-col gap-3 text-sm text-gray-300">
              <Link href="/properties" className="hover:text-white transition">
                Explore All Listings
              </Link>
              <Link href="/commonrules" className="hover:text-white transition">
                Listing standards
              </Link>
              <Link href="/addProperty" className="hover:text-white transition">
                List a property free
              </Link>
              <Link href="/booking" className="hover:text-white transition">
                Schedule a Site Visit
              </Link>
              <Link href="/login" className="hover:text-white transition">
                Agent / Client Portal
              </Link>
            </div>
          </div>

          {/* Column 3: Contact & Support */}
          <div>
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
              Customer Support
            </p>
            <div className="flex flex-col gap-4 text-sm text-gray-300">
              <a
                href={BRAND.phoneHref}
                className="flex items-center gap-3 hover:text-white transition group"
              >
                <Phone className="h-4 w-4 text-[#1E7F4B]" />
                <span className="font-semibold text-white group-hover:underline">{BRAND.phoneDisplay}</span>
              </a>

              <a
                href={BRAND.emailHref}
                className="flex items-center gap-3 hover:text-white transition group"
              >
                <Mail className="h-4 w-4 text-[#1E7F4B]" />
                <span className="group-hover:underline">{BRAND.email}</span>
              </a>

              <div className="flex items-start gap-3 text-gray-300">
                <MapPin className="h-4 w-4 text-[#1E7F4B] shrink-0 mt-0.5" />
                <span>{BRAND.officeAddress}</span>
              </div>

            </div>
          </div>
        </div>

        {/* All 47 counties */}
        <div className="border-b border-white/10 py-10">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
            Property in all 47 counties
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2.5 text-sm text-gray-400">
            {COUNTIES.map((c) => (
              <Link
                key={c.code}
                href={`/counties/${countySlug(c.name)}`}
                className="hover:text-white transition"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Legal & Copyright */}
        <div className="flex flex-col gap-4 pt-8 text-xs text-gray-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} UrbanEstate Kenya. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-white transition">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-white transition">
              Privacy Policy
            </Link>
            <Link href="/commonrules" className="hover:text-white transition">
              Listing standards
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
