"use client";

import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Link from "next/link";
import { Bed, Bath } from "lucide-react";
import Loading from "../components/Loading";
import { BRAND } from "../config/brand";
import { TOTALS, countiesByRegion, placesInCounty } from "../data/kenyaLocations";
import { PROPERTY_TYPES } from "../data/propertyTypes";

const norm = (v) => String(v || "").toLowerCase().trim();
const EMPTY_FILTERS = { category: "", county: "", area: "", type: "" };

export default function PropertyPage() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState(EMPTY_FILTERS);

    // Read filters from the URL (links from the home page search, county cards and footer).
    useEffect(() => {
        const q = new URLSearchParams(window.location.search);
        setFilters({ category: q.get("category") || "", county: q.get("county") || "", area: q.get("area") || "", type: q.get("type") || "" });
    }, []);

    const applyFilters = (next) => {
        setFilters(next);
        const q = new URLSearchParams(Object.entries(next).filter(([, v]) => v));
        window.history.replaceState(null, "", q.toString() ? `?${q}` : window.location.pathname);
    };

    const updateFilter = (key, value) =>
        applyFilters({ ...filters, [key]: value, ...(key === "county" ? { area: "" } : {}) });

    const visible = useMemo(
        () =>
            properties.filter((p) => {
                if (filters.category && norm(p.category) !== norm(filters.category)) return false;
                if (filters.county && norm(p.state) !== norm(filters.county)) return false;
                if (filters.type && norm(p.type) !== norm(filters.type)) return false;
                if (filters.area) {
                    const a = norm(filters.area);
                    if (!norm(p.city).includes(a) && !norm(p.address).includes(a)) return false;
                }
                return true;
            }),
        [properties, filters]
    );

    const areaOptions = filters.county ? placesInCounty(filters.county) : [];
    const heading = filters.area
        ? `Property in ${filters.area}, ${filters.county}`
        : filters.county
        ? `Property in ${filters.county} County`
        : "Explore property across Kenya";

    const fallbackImage =
        "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?q=80";

    const getProperties = async () => {
        try {
            const res = await fetch("/api/property/showallProperty", {
                method: "GET",
                cache: "no-store",
            });

            const data = await res.json();
            setProperties(data.properties || []);
        } catch (err) {
            console.log("Error fetching properties:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getProperties();
    }, []);

    return (
        <div className="w-full bg-white relative overflow-hidden">

            {/* NAVBAR */}
            <div className="w-full z-10 relative top-0">
                <Navbar theme="white" />
            </div>

            <hr className="bg-gray-300" />

            {/* PAGE TITLE */}
            <div className="text-center mt-20 mb-10">
                <h1 className="px-6 text-[clamp(2rem,4vw,3rem)] font-bold font-bricolage text-[#0B1F33]">
                    {heading}
                </h1>
                <p className="text-gray-600 mt-2 font-bricolage font-semibold">
                    Homes, apartments, bedsitters and land in all {TOTALS.counties} counties.
                </p>
            </div>

            {/* FILTERS */}
            <div className="mx-auto mb-12 grid max-w-6xl grid-cols-1 gap-3 px-6 sm:grid-cols-2 lg:grid-cols-4">
                <select
                    aria-label="Purpose"
                    value={filters.category}
                    onChange={(e) => updateFilter("category", e.target.value)}
                    className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-800 focus:border-[#0B1F33] focus:outline-none"
                >
                    <option value="">Buy, rent or invest</option>
                    <option value="rent">Rent</option>
                    <option value="sale">Buy</option>
                    <option value="land">Land</option>
                </select>
                <select aria-label="Property type" value={filters.type} onChange={(e) => updateFilter("type", e.target.value)} className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-800 focus:border-[#0B1F33] focus:outline-none">
                    <option value="">All property types</option>
                    {PROPERTY_TYPES.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
                <select
                    aria-label="County"
                    value={filters.county}
                    onChange={(e) => updateFilter("county", e.target.value)}
                    className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-800 focus:border-[#0B1F33] focus:outline-none"
                >
                    <option value="">All {TOTALS.counties} counties</option>
                    {countiesByRegion().map(({ region, counties }) => (
                        <optgroup key={region} label={region}>
                            {counties.map((c) => (
                                <option key={c.code} value={c.name}>{c.name}</option>
                            ))}
                        </optgroup>
                    ))}
                </select>
                <select
                    aria-label="Town or sub-county"
                    value={filters.area}
                    disabled={!filters.county}
                    onChange={(e) => updateFilter("area", e.target.value)}
                    className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-800 focus:border-[#0B1F33] focus:outline-none disabled:bg-gray-50 disabled:text-gray-400"
                >
                    <option value="">{filters.county ? `Anywhere in ${filters.county}` : "Choose a county first"}</option>
                    {areaOptions.map((a) => (
                        <option key={a} value={a}>{a}</option>
                    ))}
                    {filters.area && !areaOptions.includes(filters.area) && (
                        <option value={filters.area}>{filters.area}</option>
                    )}
                </select>
            </div>

            {/* PROPERTY GRID */}
            <div className="w-full px-6 md:px-16 pb-20">
                {loading ? (
                    <Loading />
                ) : visible.length === 0 ? (
                    <div className="mx-auto max-w-lg rounded-2xl border border-dashed border-gray-300 p-10 text-center">
                        <p className="text-lg font-semibold text-[#0B1F33]">
                            No listings {filters.county ? `in ${filters.area || filters.county} ` : ""}yet
                        </p>
                        <p className="mt-2 text-sm text-gray-600">
                            Try a nearby town, another property type, or all of Kenya.
                        </p>
                        <div className="mt-5 flex flex-wrap justify-center gap-3">
                            <button
                                onClick={() => applyFilters(EMPTY_FILTERS)}
                                className="rounded-xl bg-[#0B1F33] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#1E7F4B]"
                            >
                                Show all listings
                            </button>
                            <a
                                href={BRAND.whatsappHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-bold text-[#0B1F33] hover:bg-gray-50"
                            >
                                Ask on WhatsApp
                            </a>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                        {visible.map((p) => (
                            <Link
                                key={p._id}
                                href={`/properties/${p._id}`}
                                className="rounded-2xl overflow-hidden shadow-lg bg-white border border-gray-200 hover:shadow-2xl transition-all duration-300 group"
                            >
                                {/* IMAGE */}
                                <div className="relative">

                                    {/* HEART ICON (future favourite toggle) */}


                                    <img
                                        src={p.images?.[0] || fallbackImage}
                                        alt={p.title}
                                        className="w-full h-56 object-cover group-hover:scale-105 transition-all duration-300"
                                    />
                                </div>

                                {/* CARD CONTENT */}
                                <div className="p-5 font-bricolage">
                                    <h2 className="text-xl font-semibold text-[#12342A]">
                                        {p.title}
                                    </h2>

                                    <p className="text-gray-600 mt-1">
                                        {p.city}, {p.state}
                                    </p>

                                    {/* PRICE */}
                                    <div className="mt-4 text-lg font-bold text-[#1B8C66]">
                                        KES {Number(p.price || 0).toLocaleString()}{p.category === "rent" ? " / month" : ""}
                                    </div>

                                    {/* FEATURES */}
                                    <div className="flex gap-5 mt-4 text-gray-700 text-sm">
                                        {p.bedrooms > 0 && <span className="flex gap-1 items-center"><Bed size={16} /> {p.bedrooms} Beds</span>}
                                        {p.bathrooms > 0 && <span className="flex gap-1 items-center"><Bath size={16} /> {p.bathrooms} Baths</span>}
                                    </div>

                                    {/* AGENT */}
                                    <div className="mt-4 text-sm font-semibold text-gray-600">Contact UrbanEstate about this listing</div>

                                    {/* STATUS BADGE */}
                                    <span
                                        className={`inline-block mt-4 px-3 py-1 rounded-full text-sm font-medium ${p.status?.toLowerCase() === "sold"
                                            ? "bg-red-100 text-red-600"
                                            : "bg-green-100 text-green-700"
                                            }`}
                                    >
                                        {p.status}
                                    </span>
                                    {p.verificationStatus === "verified" && <span className="ml-2 inline-block rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">Verified</span>}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* FIXED SCROLL TO TOP BUTTON */}
            <div className="fixed bottom-8 right-8">
                <button
                    onClick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg cursor-pointer"
                    aria-label="Scroll to top"
                >
                    <span className="text-4xl">↑</span>
                </button>
            </div>
        </div>
    );
}
