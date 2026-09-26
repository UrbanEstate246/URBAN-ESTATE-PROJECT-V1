"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "./components/Navbar";
import {
  ArrowRight,
  BadgeCheck,
  Calendar,
  CheckCircle2,
  Compass,
  FileCheck2,
  Landmark,
  MapPin,
  MessageSquare,
  Phone,
  Search,
  ShieldCheck,
  Star,
} from "lucide-react";
import { BRAND } from "./config/brand";
import { COUNTIES, REGIONS, TOTALS, countiesByRegion, placesInCounty, countySlug } from "./data/kenyaLocations";

const TRUST_METRICS = [
  { value: String(TOTALS.counties), label: "Counties covered" },
  { value: String(TOTALS.subCounties), label: "Sub-counties mapped" },
  { value: `${Math.floor(TOTALS.towns / 50) * 50}+`, label: "Towns & estates searchable" },
  { value: "Free", label: "To search and to list" },
];

const CURATED_REGIONS = [
  {
    title: "Affordable rentals",
    subtitle: "Bedsitters and 1-bedroom homes in every county.",
    image: "/images/kenya/westlands-apartments.jpg",
    county: "Nairobi",
    tag: "Apartments",
  },
  {
    title: "Gated family homes",
    subtitle: "Karen, Lavington and Runda townhouses and maisonettes with gardens.",
    image: "/images/kenya/karen-villa.jpg",
    county: "Nairobi",
    tag: "Family living",
  },
  {
    title: "The coast",
    subtitle: "Nyali, Diani and Watamu ocean-facing apartments and beach villas.",
    image: "/images/kenya/diani-villa.jpg",
    county: "Mombasa",
    tag: "Holiday & Airbnb",
  },
  {
    title: "Land across Kenya",
    subtitle: "Plots in Kiambu, Kitengela, Ruiru and Nakuru, ready for building or investment.",
    image: "/images/kenya/kiambu-land.jpg",
    county: "Kiambu",
    tag: "Land & plots",
  },
];

const POPULAR_AREAS = [
  ["Westlands", "Nairobi"], ["Kilimani", "Nairobi"], ["Karen", "Nairobi"], ["Ruaka", "Kiambu"],
  ["Syokimau", "Machakos"], ["Kitengela", "Kajiado"], ["Ongata Rongai", "Kajiado"], ["Thika", "Kiambu"],
  ["Ruiru", "Kiambu"], ["Nyali", "Mombasa"], ["Diani", "Kwale"], ["Watamu", "Kilifi"],
  ["Milimani", "Kisumu"], ["Elgon View", "Uasin Gishu"], ["Naivasha", "Nakuru"], ["Nanyuki", "Laikipia"],
];

const PILLARS = [
  {
    icon: MapPin,
    title: "Every county, down to the town",
    text: "Search by county, sub-county or town across Kenya.",
  },
  {
    icon: Landmark,
    title: "Free to list",
    text: "Agents, landlords and owners can list property at no cost.",
  },
  {
    icon: Phone,
    title: "Real people, real support",
    text: `Talk to our team on ${BRAND.phoneDisplay} or ${BRAND.email}. We answer, and we follow up.`,
  },
];

const STEPS = [
  { icon: Search, title: "Search by county and town", text: "Filter by county, sub-county, town and property type." },
  { icon: BadgeCheck, title: "Shortlist", text: "Save the listings you want to come back to." },
  { icon: Calendar, title: "Request a viewing or contact us", text: "Choose a viewing date or talk to the UrbanEstate team." },
  { icon: ArrowRight, title: "Move in or buy", text: "Choose the place that works for you." },
];

// Commuter belt around the capital: how buyers actually search, shown first.
const METRO = "Nairobi Metro";
const METRO_COUNTIES = ["Nairobi", "Kiambu", "Kajiado", "Machakos", "Murang'a"];
const REGION_TABS = [METRO, ...REGIONS.filter((r) => r !== "Nairobi")];
const countiesInTab = (tab) =>
  tab === METRO
    ? METRO_COUNTIES.map((n) => COUNTIES.find((c) => c.name === n))
    : COUNTIES.filter((c) => c.region === tab);

const selectClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm font-semibold text-gray-800 focus:border-[#0B1F33] focus:outline-none disabled:bg-gray-50 disabled:text-gray-400";

export default function HomePage() {
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCategory, setSearchCategory] = useState("all");
  const [selectedCounty, setSelectedCounty] = useState("all");
  const [selectedArea, setSelectedArea] = useState("");
  const [activeRegion, setActiveRegion] = useState(METRO);

  useEffect(() => {
    async function loadProperties() {
      try {
        const res = await fetch("/api/property/showallProperty", { cache: "no-store" });
        const data = await res.json();
        if (data.success && Array.isArray(data.properties)) setProperties(data.properties);
      } catch (err) {
        console.error("Failed to load featured properties:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProperties();
  }, []);

  const areaOptions = useMemo(
    () => (selectedCounty === "all" ? [] : placesInCounty(selectedCounty)),
    [selectedCounty]
  );

  const listingsByCounty = useMemo(() => {
    const counts = {};
    properties.forEach((p) => {
      const key = String(p.state || "").toLowerCase();
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [properties]);

  const runSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchCategory !== "all") params.set("category", searchCategory);
    if (selectedCounty !== "all") params.set("county", selectedCounty);
    if (selectedArea) params.set("area", selectedArea);
    const qs = params.toString();
    router.push(qs ? `/properties?${qs}` : "/properties");
  };

  const featured = properties.slice(0, 6);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] antialiased selection:bg-[#0B1F33] selection:text-white">
      {/* ================================================================ */}
      {/* HERO                                                             */}
      {/* ================================================================ */}
      <section className="relative min-h-[85vh] lg:min-h-[92vh] flex flex-col justify-between overflow-hidden bg-[#0B1F33] text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/kenya/karen-villa.jpg"
            alt="Modern family home at dusk"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071524]/95 via-[#0B1F33]/85 to-[#0B1F33]/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F33] via-transparent to-transparent opacity-90" />
        </div>

        <div className="relative z-30">
          <Navbar theme="dark" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 py-12 lg:py-16 sm:px-8 lg:px-12 flex-1 flex flex-col justify-center">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md text-white/95">
              <span className="flex h-2 w-2 rounded-full bg-[#1E7F4B] animate-pulse" />
              <span>Search property across all {TOTALS.counties} counties</span>
            </div>

            <h1 className="font-bricolage text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] text-white">
              Homes, rentals and land — <br />
              <span className="text-[#D4AF37]">anywhere in Kenya.</span>
            </h1>

            <p className="max-w-2xl text-lg sm:text-xl text-white/85 leading-relaxed">
              From bedsitters in Kasarani and single rooms in Kisumu to family homes in Nakuru and plots in Kitengela. Search all 47 counties, free.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/properties"
                className="inline-flex items-center justify-center gap-3 rounded-xl bg-[#1E7F4B] hover:bg-[#18683d] px-7 py-4 text-base font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5"
              >
                Browse properties <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href={BRAND.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-white/30 bg-white/10 px-6 py-4 text-base font-semibold text-white backdrop-blur-md hover:bg-white hover:text-[#0B1F33] transition-all"
              >
                <MessageSquare className="h-5 w-5 text-[#25D366]" /> Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Search */}
          <form
            onSubmit={runSearch}
            className="mt-12 w-full max-w-5xl rounded-2xl border border-white/20 bg-white/95 p-4 sm:p-5 shadow-2xl backdrop-blur-xl text-[#1A1A1A]"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1.3fr_1.3fr_auto] lg:items-end">
              <div>
                <label htmlFor="hero-purpose" className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Looking to
                </label>
                <select
                  id="hero-purpose"
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className={selectClass}
                >
                  <option value="all">Buy, rent or invest</option>
                  <option value="rent">Rent</option>
                  <option value="sale">Buy</option>
                  <option value="land">Buy land</option>
                </select>
              </div>

              <div>
                <label htmlFor="hero-county" className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  County
                </label>
                <select
                  id="hero-county"
                  value={selectedCounty}
                  onChange={(e) => {
                    setSelectedCounty(e.target.value);
                    setSelectedArea("");
                  }}
                  className={selectClass}
                >
                  <option value="all">All {TOTALS.counties} counties</option>
                  {countiesByRegion().map(({ region, counties }) => (
                    <optgroup key={region} label={region}>
                      {counties.map((c) => (
                        <option key={c.code} value={c.name}>{c.name}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="hero-area" className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Town / sub-county
                </label>
                <select
                  id="hero-area"
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  disabled={selectedCounty === "all"}
                  className={selectClass}
                >
                  <option value="">
                    {selectedCounty === "all" ? "Choose a county first" : `Anywhere in ${selectedCounty}`}
                  </option>
                  {areaOptions.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0B1F33] hover:bg-[#1E7F4B] px-7 py-3 text-sm font-bold text-white transition-colors"
              >
                <Search className="h-4 w-4" /> Search
              </button>
            </div>
          </form>
        </div>

        {/* Metrics strip */}
        <div className="relative z-20 border-t border-white/10 bg-[#071524]/85 backdrop-blur-md">
          <div className="mx-auto grid max-w-[1400px] grid-cols-2 sm:grid-cols-4 sm:divide-x sm:divide-white/10 px-6 sm:px-8 lg:px-12 py-5">
            {TRUST_METRICS.map((metric) => (
              <div key={metric.label} className="p-3 sm:px-6 text-center sm:text-left">
                <p className="text-2xl sm:text-3xl font-bold text-[#D4AF37]">{metric.value}</p>
                <p className="text-xs sm:text-sm text-white/70 font-medium mt-0.5">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* WHY URBANESTATE                                                  */}
      {/* ================================================================ */}
      <section className="py-20 border-b border-[#E3E6E8] bg-white">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1E7F4B]">
              <ShieldCheck className="h-4 w-4" /> Why UrbanEstate
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0B1F33] mt-2">
              Property search you can actually trust
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mt-4 leading-relaxed">
              Fake titles, ghost listings and surprise broker fees cost Kenyans billions every year.
              We check the paperwork first so you can focus on finding the right place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14">
            {PILLARS.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="p-8 rounded-2xl border border-[#E3E6E8] bg-[#F8F9FA] hover:shadow-xl transition-all duration-300 group"
              >
                <div className="h-12 w-12 rounded-xl bg-[#0B1F33] text-white flex items-center justify-center mb-6 group-hover:bg-[#1E7F4B] transition-colors">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-[#0B1F33]">{title}</h3>
                <p className="text-sm text-gray-600 mt-3 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* CURATED COLLECTIONS                                              */}
      {/* ================================================================ */}
      <section className="py-24 bg-[#F8F9FA]">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#E3E6E8]">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#C28F2C]">Collections</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#0B1F33] mt-2">
                Where Kenyans are buying and renting
              </h2>
            </div>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 font-bold text-[#0B1F33] hover:text-[#1E7F4B] transition"
            >
              View all listings <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {CURATED_REGIONS.map((col) => (
              <Link
                key={col.title}
                href={`/counties/${countySlug(col.county)}`}
                className="group relative h-[380px] rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col justify-end p-6 text-white"
              >
                <Image
                  src={col.image}
                  alt={col.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F33] via-[#0B1F33]/40 to-transparent" />
                <div className="relative z-10 space-y-2">
                  <span className="inline-block rounded-full bg-[#1E7F4B] px-3 py-1 text-xs font-bold uppercase tracking-wider">
                    {col.tag}
                  </span>
                  <h3 className="text-xl font-bold">{col.title}</h3>
                  <p className="text-xs text-white/80 line-clamp-2 leading-relaxed">{col.subtitle}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* FEATURED LISTINGS (live from Supabase)                            */}
      {/* ================================================================ */}
      <section className="py-24 bg-white border-t border-[#E3E6E8]">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1E7F4B]">
                <BadgeCheck className="h-4 w-4" /> Latest listings
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#0B1F33] mt-2">Featured listings</h2>
              <p className="text-gray-600 mt-2 text-base">
                The newest homes, apartments, rentals and land across Kenya.
              </p>
            </div>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0B1F33] hover:bg-[#1E7F4B] px-6 py-3 text-sm font-bold text-white transition"
            >
              All listings{properties.length ? ` (${properties.length})` : ""}
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-96 rounded-2xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : featured.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-gray-500 text-lg">New listings are on the way.</p>
              <Link href="/signup" className="mt-4 inline-block text-sm font-bold text-[#0B1F33] underline">
                Be the first to list yours
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featured.map((p) => (
                <Link
                  key={p._id || p.id}
                  href={`/properties/${p._id || p.id}`}
                  className="group rounded-2xl overflow-hidden border border-[#E3E6E8] bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  <div className="relative h-64 w-full bg-gray-100 overflow-hidden">
                    <Image
                      src={p.images?.[0] || "/images/kenya/karen-villa.jpg"}
                      alt={p.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {p.verificationStatus === "verified" && <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1E7F4B] px-3 py-1 text-xs font-bold text-white shadow-md">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                      </span>}
                      {p.category && (
                        <span className="inline-block rounded-full bg-[#0B1F33]/80 backdrop-blur-md px-3 py-0.5 text-[11px] font-semibold text-white uppercase tracking-wider">
                          For {p.category}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-[#C28F2C]" />
                          {p.city || "Nairobi"}, {p.state || "Kenya"}
                        </span>
                        <span className="capitalize font-semibold text-gray-700">{p.type || "Apartment"}</span>
                      </div>
                      <h3 className="text-lg font-bold text-[#0B1F33] group-hover:text-[#1E7F4B] transition line-clamp-1">
                        {p.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">{p.description}</p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400">
                          {p.category === "rent" ? "Per month" : "Price"}
                        </span>
                        <p className="text-xl font-bold text-[#0B1F33]">KES {Number(p.price).toLocaleString()}</p>
                      </div>
                      <span className="text-xs font-semibold text-[#1E7F4B] group-hover:underline">View details →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================================================================ */}
      {/* EXPLORE BY COUNTY — ALL 47                                       */}
      {/* ================================================================ */}
      <section id="counties" className="py-24 bg-[#F8F9FA] border-t border-[#E3E6E8]">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C28F2C]">Explore by county</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0B1F33] mt-2">
              {TOTALS.counties} counties. {TOTALS.subCounties} sub-counties. One trusted search.
            </h2>
            <p className="text-gray-600 mt-3 text-base sm:text-lg">
              Whether it&apos;s a bedsitter in Roysambu, a maisonette in Syokimau or an acre in Eldama
              Ravine, start with the county and drill down to the town.
            </p>
          </div>

          <div className="mt-10 -mx-6 px-6 sm:mx-0 sm:px-0 overflow-x-auto">
            <div role="tablist" aria-label="Regions" className="flex gap-2 w-max sm:w-auto sm:flex-wrap">
              {REGION_TABS.map((region) => {
                const n = countiesInTab(region).length;
                const active = activeRegion === region;
                return (
                  <button
                    key={region}
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveRegion(region)}
                    className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      active
                        ? "border-[#0B1F33] bg-[#0B1F33] text-white"
                        : "border-[#E3E6E8] bg-white text-gray-700 hover:border-[#0B1F33]"
                    }`}
                  >
                    {region} <span className={active ? "text-[#D4AF37]" : "text-gray-400"}>· {n}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {countiesInTab(activeRegion).map((c) => {
              const count = listingsByCounty[c.name.toLowerCase()] || 0;
              return (
                <div
                  key={c.code}
                  className="group rounded-2xl border border-[#E3E6E8] bg-white p-5 transition hover:border-[#1E7F4B] hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-3">
                    <Link href={`/counties/${countySlug(c.name)}`} className="min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        County {String(c.code).padStart(3, "0")} · HQ {c.hq}
                      </p>
                      <h3 className="mt-1 text-lg font-bold text-[#0B1F33] group-hover:text-[#1E7F4B] transition">
                        {c.name}
                      </h3>
                    </Link>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                        count ? "bg-[#1E7F4B]/10 text-[#1E7F4B]" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {count ? `${count} listing${count > 1 ? "s" : ""}` : "Coming soon"}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">{c.subCounties.length} sub-counties</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {c.towns.slice(0, 5).map((t) => (
                      <Link
                        key={t}
                        href={`/properties?county=${encodeURIComponent(c.name)}&area=${encodeURIComponent(t)}`}
                        className="rounded-md bg-[#F8F9FA] px-2 py-1 text-xs font-medium text-gray-700 hover:bg-[#0B1F33] hover:text-white transition"
                      >
                        {t}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-14 rounded-2xl border border-[#E3E6E8] bg-white p-6 sm:p-8">
            <div className="flex items-center gap-2 text-sm font-bold text-[#0B1F33]">
              <MapPin className="h-4 w-4 text-[#C28F2C]" /> Popular right now
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {POPULAR_AREAS.map(([area, county]) => (
                <Link
                  key={area}
                  href={`/properties?county=${encodeURIComponent(county)}&area=${encodeURIComponent(area)}`}
                  className="rounded-full border border-[#E3E6E8] px-4 py-2 text-sm font-medium text-gray-700 hover:border-[#1E7F4B] hover:text-[#1E7F4B] transition"
                >
                  {area} <span className="text-gray-400">· {county}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* HOW IT WORKS + FOR AGENTS                                        */}
      {/* ================================================================ */}
      <section className="py-24 bg-white border-t border-[#E3E6E8]">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1E7F4B]">
              <Compass className="h-4 w-4" /> How it works
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0B1F33] mt-2">
              From search to keys, without the guesswork
            </h2>
          </div>

          <ol className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="relative rounded-2xl border border-[#E3E6E8] bg-[#F8F9FA] p-6">
                <span className="absolute right-5 top-5 font-bricolage text-4xl font-bold text-[#0B1F33]/10">
                  {i + 1}
                </span>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0B1F33] text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-[#0B1F33]">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{text}</p>
              </li>
            ))}
          </ol>

          <div className="mt-14 grid gap-8 overflow-hidden rounded-3xl bg-[#0B1F33] p-8 text-white sm:p-12 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
                For agents, landlords & developers
              </span>
              <h3 className="mt-3 text-2xl sm:text-3xl font-bold">Reach serious buyers and tenants in every county</h3>
              <p className="mt-3 max-w-xl text-white/75">
                Listing is free. Add photos, set your price, and reach people searching in your county.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row lg:justify-end">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-6 py-3.5 text-sm font-bold text-[#0B1F33] hover:bg-white transition"
              >
                Create an agent account <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/commonrules"
                className="inline-flex items-center justify-center rounded-xl border border-white/30 px-6 py-3.5 text-sm font-bold text-white hover:bg-white/10 transition"
              >
                Listing standards
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* CTA                                                              */}
      {/* ================================================================ */}
      <section className="py-20 bg-[#1E7F4B] text-white">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl text-center lg:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-green-200">Talk to a person</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2">Ready to find your place in Kenya?</h2>
            <p className="text-white/85 text-base sm:text-lg mt-3">
              Call or email our team for viewings or help listing your property.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={BRAND.phoneHref}
              className="inline-flex items-center gap-3 rounded-xl bg-white px-8 py-4 text-base font-bold text-[#0B1F33] hover:bg-gray-100 transition shadow-lg"
            >
              <Phone className="h-5 w-5 text-[#1E7F4B]" /> Call {BRAND.phoneDisplay}
            </a>
            <a
              href={BRAND.emailHref}
              className="inline-flex items-center gap-3 rounded-xl border border-white bg-white/10 px-8 py-4 text-base font-bold text-white hover:bg-white hover:text-[#0B1F33] transition"
            >
              Email us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
