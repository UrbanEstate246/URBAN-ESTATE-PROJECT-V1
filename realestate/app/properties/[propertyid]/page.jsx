"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";
import ImageGallery from "@/app/components/ImageGallery";

import {
    Bed,
    Bath,
    Square,
    MapPin,
    Phone,
    MessageCircle,
    User,
    Heart,
    Share2,
    ShieldCheck,
    CheckCircle2,
    Building2,
    Home,
    Calendar,
    Car,
    Droplets,
    Zap,
    Wifi,
    Armchair,
    Dog,
    Waves,
    ChevronRight,
    Check,
    CheckCheck,
    Lock,
    ArrowLeft,
    Clock,
} from "lucide-react";
import Loading from "@/app/components/Loading";
import { formatPhoneDisplay, telHref, whatsappHref } from "@/app/utils/phone";

// Map amenities to appropriate Lucide icons
function getAmenityIcon(name = "") {
    const lower = name.toLowerCase();
    if (lower.includes("parking")) return <Car size={18} className="text-[#1E7F4B]" />;
    if (lower.includes("water") || lower.includes("borehole")) return <Droplets size={18} className="text-[#1E7F4B]" />;
    if (lower.includes("electric") || lower.includes("power") || lower.includes("generator") || lower.includes("token")) return <Zap size={18} className="text-[#1E7F4B]" />;
    if (lower.includes("security") || lower.includes("guard") || lower.includes("cctv")) return <ShieldCheck size={18} className="text-[#1E7F4B]" />;
    if (lower.includes("wifi") || lower.includes("internet")) return <Wifi size={18} className="text-[#1E7F4B]" />;
    if (lower.includes("pool") || lower.includes("swim")) return <Waves size={18} className="text-[#1E7F4B]" />;
    if (lower.includes("furnish")) return <Armchair size={18} className="text-[#1E7F4B]" />;
    if (lower.includes("pet")) return <Dog size={18} className="text-[#1E7F4B]" />;
    return <CheckCircle2 size={18} className="text-[#1E7F4B]" />;
}

export default function PropertyDetailsPage() {
    const { propertyid } = useParams();
    const router = useRouter();

    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFavourite, setIsFavourite] = useState(false);
    const [copied, setCopied] = useState(false);

    // Fetch property
    const getProperty = async () => {
        try {
            const res = await fetch(
                `/api/property/getsingleproperty?pid=${propertyid}`,
                { cache: "no-store" }
            );

            const data = await res.json();

            if (data.success) {
                setProperty(data.property);
            }
        } catch (err) {
            console.error("Failed to load property:", err);
        } finally {
            setLoading(false);
        }
    };

    // Check favourite
    const checkFavourite = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
            const res = await fetch("/api/favourite/getFavourite", { headers: { Authorization: `Bearer ${token}` } });
            const data = await res.json();

            if (data.success && Array.isArray(data.favouriteProperty)) {
                const exists = data.favouriteProperty.some(
                    (f) => f.property?._id === propertyid || f.property?.id === propertyid
                );
                setIsFavourite(exists);
            }
        } catch (err) {
            console.error("Check favourite error:", err);
        }
    };

    useEffect(() => {
        getProperty();
        checkFavourite();
    }, [propertyid]);

    // Toggle favourite
    const toggleFavourite = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.info("Sign in to save properties to your saved homes.");
            router.push(`/login?next=/properties/${propertyid}`);
            return;
        }

        try {
            if (isFavourite) {
                const res = await fetch(
                    `/api/favourite/deleteFavourite?pid=${propertyid}`,
                    { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
                );
                const data = await res.json();
                if (data.success) {
                    setIsFavourite(false);
                    toast.info("Removed from saved homes");
                }
            } else {
                const res = await fetch(
                    `/api/favourite/addFavourite?pid=${propertyid}`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                        body: JSON.stringify({
                            visitDate: new Date().toISOString().split("T")[0],
                            status: "favourite",
                        }),
                    }
                );
                const data = await res.json();
                if (data.success) {
                    setIsFavourite(true);
                    toast.success("Saved to your favourite properties!");
                }
            }
        } catch (err) {
            console.error("Toggle favourite error:", err);
        }
    };

    const handleShare = () => {
        if (typeof window !== "undefined") {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            toast.success("Listing link copied to clipboard!");
            setTimeout(() => setCopied(false), 2500);
        }
    };

    if (loading) return <Loading />;

    if (!property) {
        return (
            <div className="bg-white min-h-screen text-[#0B1F33]">
                <Navbar theme="white" />
                <div className="max-w-xl mx-auto py-24 px-6 text-center">
                    <h2 className="text-2xl font-bold mb-3">Property not found</h2>
                    <p className="text-gray-600 mb-6">This listing may have been rented, sold, or unlisted by the owner.</p>
                    <Link
                        href="/properties"
                        className="inline-flex items-center gap-2 bg-[#0B1F33] text-white px-6 py-3 rounded-xl font-semibold hover:bg-black transition"
                    >
                        <ArrowLeft size={18} /> Explore other listings
                    </Link>
                </div>
            </div>
        );
    }

    const images = property.images && property.images.length > 0 ? property.images : [];
    const contact = property.contact || {
        name: "Ann (UrbanEstate Verified Agent)",
        phone: "0119524364",
        direct: true,
    };
    const inquiryMessage = `Hello, I'm interested in "${property.title}" listed on UrbanEstate (KES ${property.price.toLocaleString()}). Is it still available?`;

    const isCommercial = property.type === "Office" || property.type === "Shop / commercial" || property.type === "Warehouse";
    const isLand = property.category === "land" || property.type === "Land";

    return (
        <div className="bg-[#FAFBFB] min-h-screen text-[#0B1F33]">
            <Navbar theme="white" />

            <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-12 py-6">
                {/* BREADCRUMB NAVIGATION */}
                <nav className="flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-5 overflow-x-auto whitespace-nowrap pb-1">
                    <Link href="/" className="hover:text-[#1E7F4B] transition">Home</Link>
                    <ChevronRight size={14} className="shrink-0 text-gray-400" />
                    <Link href="/properties" className="hover:text-[#1E7F4B] transition">Properties</Link>
                    {property.state && (
                        <>
                            <ChevronRight size={14} className="shrink-0 text-gray-400" />
                            <Link href={`/counties/${property.state.toLowerCase()}`} className="hover:text-[#1E7F4B] transition">
                                {property.state}
                            </Link>
                        </>
                    )}
                    {property.city && (
                        <>
                            <ChevronRight size={14} className="shrink-0 text-gray-400" />
                            <span className="text-gray-700 font-medium">{property.city}</span>
                        </>
                    )}
                </nav>

                {/* HEADER ROW WITH TITLE, BADGES & ACTIONS */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                    <div className="space-y-2.5">
                        {/* BADGES ROW */}
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EBF7EE] text-[#1E7F4B] border border-[#C6EAD0]">
                                <ShieldCheck size={14} className="text-[#1E7F4B]" /> Verified Listing
                            </span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#0B1F33] text-white">
                                {property.category === "rent" ? "To Let" : property.category === "sale" ? "For Sale" : "Land"}
                            </span>
                            {property.type && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-200">
                                    {property.type}
                                </span>
                            )}
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 bg-white border border-gray-200 px-2.5 py-1 rounded-full">
                                <Clock size={12} className="text-gray-400" /> No Broker Fee
                            </span>
                        </div>

                        {/* TITLE */}
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0B1F33] tracking-tight leading-tight">
                            {property.title}
                        </h1>

                        {/* LOCATION */}
                        <p className="flex items-center gap-1.5 text-gray-600 text-sm sm:text-base">
                            <MapPin size={18} className="text-[#1E7F4B] shrink-0" />
                            <span>{property.address}</span>
                        </p>
                    </div>

                    {/* TOP ACTION BUTTONS (FAVOURITE & SHARE) */}
                    <div className="flex items-center gap-3 shrink-0 self-start">
                        <button
                            type="button"
                            onClick={handleShare}
                            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold shadow-sm transition active:scale-95"
                            title="Share listing"
                        >
                            {copied ? <Check size={16} className="text-green-600" /> : <Share2 size={16} />}
                            <span>{copied ? "Copied" : "Share"}</span>
                        </button>

                        <button
                            type="button"
                            onClick={toggleFavourite}
                            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-sm font-semibold shadow-sm transition active:scale-95 ${
                                isFavourite
                                    ? "bg-red-50 border-red-200 text-red-600"
                                    : "bg-white border-gray-200 hover:bg-gray-50 text-gray-700"
                            }`}
                            title={isFavourite ? "Saved in favourites" : "Save property"}
                        >
                            <Heart size={16} className={isFavourite ? "fill-red-500 text-red-500" : "text-gray-500"} />
                            <span>{isFavourite ? "Saved" : "Save"}</span>
                        </button>
                    </div>
                </div>

                {/* MAIN GRID LAYOUT */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* LEFT CONTENT COLUMN (8 of 12 cols) */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* IMAGE GALLERY */}
                        <ImageGallery images={images} />

                        {/* KEY SPECIFICATIONS GRID */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs">
                            <h2 className="text-lg font-bold text-[#0B1F33] mb-4">Key Specifications</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100 flex flex-col justify-between">
                                    <span className="text-xs text-gray-500 font-medium">Category</span>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Building2 size={20} className="text-[#1E7F4B]" />
                                        <span className="font-bold text-[#0B1F33] capitalize">
                                            {property.category === "rent" ? "To Let (Rent)" : property.category === "sale" ? "For Sale" : "Land"}
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100 flex flex-col justify-between">
                                    <span className="text-xs text-gray-500 font-medium">
                                        {isCommercial ? "Rooms / Office" : isLand ? "Size" : "Bedrooms"}
                                    </span>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Bed size={20} className="text-[#1E7F4B]" />
                                        <span className="font-bold text-[#0B1F33]">
                                            {isCommercial
                                                ? `${property.bedrooms || 1} Room`
                                                : isLand
                                                ? "Titled Plot"
                                                : `${property.bedrooms || 1} Bedrooms`}
                                        </span>
                                    </div>
                                </div>

                                {!isLand && (
                                    <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100 flex flex-col justify-between">
                                        <span className="text-xs text-gray-500 font-medium">Bathrooms</span>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Bath size={20} className="text-[#1E7F4B]" />
                                            <span className="font-bold text-[#0B1F33]">
                                                {property.bathrooms || 1} Bath{Number(property.bathrooms) > 1 ? "s" : ""}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100 flex flex-col justify-between">
                                    <span className="text-xs text-gray-500 font-medium">County / Town</span>
                                    <div className="flex items-center gap-2 mt-2">
                                        <MapPin size={20} className="text-[#1E7F4B]" />
                                        <span className="font-bold text-[#0B1F33] truncate">
                                            {property.city || property.state}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* AMENITIES & FEATURES SECTION */}
                        {property.amenities && property.amenities.length > 0 && (
                            <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-bold text-[#0B1F33]">Amenities & Features</h2>
                                    <span className="text-xs font-semibold px-2.5 py-1 bg-green-50 text-[#1E7F4B] rounded-full">
                                        {property.amenities.length} Verified Features
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {property.amenities.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50/80 border border-gray-100 hover:border-gray-200 transition"
                                        >
                                            <div className="p-1.5 rounded-lg bg-white shadow-2xs">
                                                {getAmenityIcon(item)}
                                            </div>
                                            <span className="text-sm font-semibold text-gray-800">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ABOUT THIS PROPERTY (DESCRIPTION) */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200/80 shadow-xs">
                            <h2 className="text-xl font-bold text-[#0B1F33] mb-4">About this Property</h2>
                            <div className="prose prose-slate max-w-none text-gray-700 leading-relaxed space-y-4 text-base whitespace-pre-line">
                                {property.description}
                            </div>
                        </div>

                        {/* TRUST & VERIFIED SAFETY GUARANTEE */}
                        <div className="rounded-2xl p-6 bg-gradient-to-br from-[#0B1F33] to-[#142e47] text-white shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck size={22} className="text-[#36B37E]" />
                                    <h3 className="font-bold text-lg text-white">UrbanEstate Verified Listing Guarantee</h3>
                                </div>
                                <p className="text-sm text-gray-300 max-w-xl leading-relaxed">
                                    Direct communication with verified owners and registered agents. No broker fees, no fake listing bait. Always visit and inspect the property in person before transferring any deposit.
                                </p>
                            </div>
                            <Link
                                href="/commonrules"
                                className="shrink-0 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-white/20 transition flex items-center gap-1.5"
                            >
                                Listing Standards <ChevronRight size={14} />
                            </Link>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: STICKY CONVERSION CARD & DIRECT CONTACT (4 of 12 cols) */}
                    <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
                        {/* PRIMARY PRICING & CONTACT CARD */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-200/90 shadow-md">
                            {/* PRICE */}
                            <div className="border-b border-gray-100 pb-5 mb-5">
                                <span className="text-xs uppercase font-bold text-gray-500 tracking-wider">
                                    {property.category === "rent" ? "Monthly Rent" : "Asking Price"}
                                </span>
                                <div className="mt-1 flex items-baseline gap-2">
                                    <span className="text-3xl font-extrabold text-[#0B1F33] tracking-tight">
                                        KES {property.price.toLocaleString()}
                                    </span>
                                    {property.category === "rent" && (
                                        <span className="text-sm font-semibold text-gray-500">/ month</span>
                                    )}
                                </div>
                                <p className="text-xs text-[#1E7F4B] font-semibold mt-1 flex items-center gap-1">
                                    <CheckCheck size={14} /> Direct owner rate · 0% agent fee
                                </p>
                            </div>

                            {/* PRIMARY ACTION BUTTONS */}
                            <div className="space-y-3">
                                {/* CALL DIRECT */}
                                <a
                                    href={telHref(contact.phone)}
                                    className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#1E7F4B] hover:bg-[#16643B] text-white py-3.5 text-base font-bold shadow-sm transition active:scale-[0.99]"
                                >
                                    <Phone size={19} /> Call {formatPhoneDisplay(contact.phone)}
                                </a>

                                {/* WHATSAPP DIRECT */}
                                <a
                                    href={whatsappHref(contact.phone, inquiryMessage)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#25D366] hover:bg-[#1fb355] text-white py-3.5 text-base font-bold shadow-sm transition active:scale-[0.99]"
                                >
                                    <MessageCircle size={19} /> Chat on WhatsApp
                                </a>

                                {/* SCHEDULE SITE VISIT */}
                                <button
                                    type="button"
                                    onClick={() => router.push(`/booking?propertyId=${propertyid}`)}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 hover:border-[#0B1F33] text-[#0B1F33] hover:bg-gray-50 py-3 text-sm font-semibold transition"
                                >
                                    <Calendar size={17} /> Schedule Site Viewing
                                </button>
                            </div>

                            {/* VERIFIED AGENT / OWNER INFO */}
                            <div className="mt-6 pt-5 border-t border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-[#EBF7EE] text-[#1E7F4B] font-bold flex items-center justify-center text-lg shrink-0 border border-[#C6EAD0]">
                                        {contact.name?.charAt(0) || "U"}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-bold text-[#0B1F33] text-sm truncate">{contact.name}</p>
                                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                            <ShieldCheck size={13} className="text-[#1E7F4B]" />
                                            <span>Verified Listing Host · Level 3</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 bg-gray-50 rounded-xl p-3 text-xs text-gray-600 space-y-1.5 border border-gray-100">
                                    <p className="flex items-center gap-1.5">
                                        <Check size={14} className="text-green-600 shrink-0" />
                                        <span>Direct phone verified with UrbanEstate</span>
                                    </p>
                                    <p className="flex items-center gap-1.5">
                                        <Check size={14} className="text-green-600 shrink-0" />
                                        <span>Instant WhatsApp concierge response</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* NEED ASSISTANCE CARD */}
                        <div className="bg-white rounded-2xl p-5 border border-gray-200/80 text-center space-y-2">
                            <p className="text-xs uppercase font-bold text-gray-400 tracking-wider">Have Questions?</p>
                            <p className="text-sm font-semibold text-gray-800">Need help verifying this title or viewing?</p>
                            <a
                                href="tel:+254119524364"
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E7F4B] hover:underline"
                            >
                                <Phone size={13} /> Call UrbanEstate Concierge: 0119 524 364
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* MOBILE STICKY BOTTOM ACTION BAR */}
            <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-gray-200 p-3 z-50 flex items-center justify-between gap-3 shadow-lg">
                <div>
                    <span className="text-[11px] uppercase font-bold text-gray-500">Price</span>
                    <p className="text-lg font-extrabold text-[#0B1F33] leading-tight">
                        KES {property.price.toLocaleString()}
                        {property.category === "rent" && <span className="text-xs font-normal text-gray-500">/mo</span>}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <a
                        href={telHref(contact.phone)}
                        className="px-4 py-2.5 rounded-xl bg-[#1E7F4B] text-white font-bold text-sm flex items-center gap-1.5 shadow-sm active:scale-95"
                    >
                        <Phone size={16} /> Call
                    </a>
                    <a
                        href={whatsappHref(contact.phone, inquiryMessage)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 rounded-xl bg-[#25D366] text-white font-bold text-sm flex items-center gap-1.5 shadow-sm active:scale-95"
                    >
                        <MessageCircle size={16} /> WhatsApp
                    </a>
                </div>
            </div>
        </div>
    );
}
