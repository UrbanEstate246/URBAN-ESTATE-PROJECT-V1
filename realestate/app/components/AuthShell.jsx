import Image from "next/image";
import { Bookmark, MapPinned, Phone, Home } from "lucide-react";
import Logo from "./Logo";
import { BRAND } from "../config/brand";
import { TOTALS } from "../data/kenyaLocations";

const POINTS = [
  { icon: MapPinned, text: `Search homes, rentals and land in all ${TOTALS.counties} counties` },
  { icon: Bookmark, text: "Save listings and pick up where you left off" },
  { icon: Home, text: "List your property free" },
];

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-[1.05fr_1fr] bg-[#F8F9FA]">
      {/* Brand panel */}
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-[#0B1F33] p-12 text-white">
        <Image
          src="/images/kenya/westlands-apartments.jpg"
          alt="Modern apartment building"
          fill
          priority
          sizes="50vw"
          className="object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B1F33]/95 via-[#0B1F33]/80 to-[#1E7F4B]/40" />

        <div className="relative z-10">
          <Logo tone="light" size={44} />
        </div>

        <div className="relative z-10 max-w-md space-y-8">
          <h2 className="font-bricolage text-4xl font-bold leading-tight tracking-tight">
            Find your place in Kenya — <span className="text-[#D4AF37]">from any county.</span>
          </h2>
          <ul className="space-y-4">
            {POINTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3 text-sm text-white/85">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <Icon className="h-4 w-4 text-[#D4AF37]" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <a
          href={BRAND.phoneHref}
          className="relative z-10 inline-flex items-center gap-2 text-sm text-white/70 hover:text-white"
        >
          <Phone className="h-4 w-4 text-[#1E7F4B]" /> Need help? Call {BRAND.phoneDisplay}
        </a>
      </aside>

      {/* Form panel */}
      <main className="flex flex-col px-5 py-8 sm:px-10">
        <div className="lg:hidden">
          <Logo tone="dark" size={38} />
        </div>
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-md">
            <h1 className="font-bricolage text-3xl font-bold tracking-tight text-[#0B1F33]">{title}</h1>
            {subtitle && <p className="mt-2 text-sm text-gray-600">{subtitle}</p>}
            <div className="mt-8">{children}</div>
            {footer && <div className="mt-8 text-center text-sm text-gray-600">{footer}</div>}
          </div>
        </div>
      </main>
    </div>
  );
}

export const fieldClass =
  "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-[#1A1A1A] placeholder-gray-400 shadow-sm transition focus:border-[#0B1F33] focus:outline-none focus:ring-4 focus:ring-[#0B1F33]/10";

export const labelClass = "mb-1.5 block text-sm font-semibold text-gray-800";
