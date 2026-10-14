"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { Bed, Bath, ExternalLink, Pencil, Phone, Plus, Trash2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";
import { authHeaders, redirectIfUnauthorized } from "../utils/session";
import { formatPhoneDisplay } from "../utils/phone";

const fallbackImage = "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?q=80";

export default function MyProperties() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            window.location.replace("/login?next=/myProperties");
            return;
        }
        (async () => {
            try {
                const res = await fetch(`/api/property/myproperties`, {
                    method: "GET",
                    headers: authHeaders(),
                    cache: "no-store",
                });
                if (redirectIfUnauthorized(res, "/myProperties")) return;
                const data = await res.json();
                setProperties(data.properties || []);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    async function deleteProperty(property) {
        if (!window.confirm(`Delete "${property.title}"? This permanently removes the listing and its photos.`)) return;
        setDeletingId(property._id);
        try {
            const res = await fetch(`/api/property/deleteProperty?pid=${property._id}`, {
                method: "DELETE",
                headers: authHeaders(),
            });
            if (redirectIfUnauthorized(res, "/myProperties")) return;
            const out = await res.json();
            if (out.success) {
                setProperties((list) => list.filter((p) => p._id !== property._id));
                toast.success("Listing deleted.");
            } else {
                toast.error(out.message || "Could not delete the listing.");
            }
        } catch {
            toast.error("We couldn't reach the server. Try again.");
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div className="w-full bg-white relative overflow-hidden">

            {/* NAVBAR */}
            <div className="w-full z-10 relative top-0">
                <Navbar theme="white" />
            </div>

            <hr className="bg-gray-300" />

            {/* PAGE TITLE */}
            <div className="text-center mt-20 mb-10 px-6">
                <h1 className="text-[clamp(2rem,4vw,3rem)] font-bold font-bricolage text-[#102A23]">
                    My Listings
                </h1>
                <p className="text-gray-600 mt-2 font-bricolage font-semibold">
                    Edit, hide or delete the properties you have listed.
                </p>
                <Link
                    href="/addProperty"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#1E7F4B] px-5 py-3 text-sm font-bold text-white hover:bg-[#18683d]"
                >
                    <Plus className="h-4 w-4" /> List a property
                </Link>
            </div>

            {/* PROPERTY GRID */}
            <div className="w-full px-6 md:px-16 pb-20">
                {loading ? (
                  <Loading />
                ) : properties.length === 0 ? (
                    <p className="text-center text-gray-600">
                        You haven&apos;t listed anything yet.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                        {properties.map((p) => (
                            <div
                                key={p._id}
                                className="rounded-2xl overflow-hidden shadow-lg bg-white border border-gray-200 flex flex-col"
                            >
                                <Link href={`/myProperties/${p._id}`} className="relative block">
                                    {/* eslint-disable-next-line @next/next/no-img-element -- remote Cloudinary photo */}
                                    <img
                                        src={p.images?.[0] || fallbackImage}
                                        alt={p.title}
                                        className="w-full h-56 object-cover"
                                    />
                                </Link>

                                {/* CARD CONTENT */}
                                <div className="p-5 font-bricolage flex-1 flex flex-col">
                                    <h2 className="text-xl font-semibold text-[#12342A]">
                                        {p.title}
                                    </h2>

                                    <p className="text-gray-600 mt-1">
                                        {p.city}, {p.state}
                                    </p>

                                    {/* PRICE */}
                                    <div className="mt-4 text-lg font-bold text-[#1B8C66]">
                                        KES {p.price.toLocaleString()}{p.category === "rent" ? " / month" : ""}
                                    </div>

                                    {/* FEATURES */}
                                    {(p.bedrooms > 0 || p.bathrooms > 0) && (
                                        <div className="flex gap-5 mt-4 text-gray-700 text-sm">
                                            {p.bedrooms > 0 && <span className="flex gap-1 items-center"><Bed size={16} /> {p.bedrooms} Beds</span>}
                                            {p.bathrooms > 0 && <span className="flex gap-1 items-center"><Bath size={16} /> {p.bathrooms} Baths</span>}
                                        </div>
                                    )}

                                    {/* CONTACT BUYERS SEE */}
                                    {p.contact?.direct && (
                                        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                                            <Phone size={14} /> Buyers call {formatPhoneDisplay(p.contact.phone)}
                                        </div>
                                    )}

                                    {/* STATUS BADGES */}
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${p.status === "available"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-200 text-gray-700"
                                                }`}
                                        >
                                            {p.status === "available" ? "Live" : p.status}
                                        </span>
                                        {p.verificationStatus === "verified" && (
                                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-700">Verified</span>
                                        )}
                                    </div>

                                    {/* ACTIONS */}
                                    <div className="mt-5 flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                                        <Link
                                            href={`/properties/${p._id}`}
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                                        >
                                            <ExternalLink size={14} /> View
                                        </Link>
                                        <Link
                                            href={`/myProperties/${p._id}/updateanddelete`}
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                                        >
                                            <Pencil size={14} /> Edit
                                        </Link>
                                        <button
                                            onClick={() => deleteProperty(p)}
                                            disabled={deletingId === p._id}
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                                        >
                                            <Trash2 size={14} /> {deletingId === p._id ? "Deleting…" : "Delete"}
                                        </button>
                                    </div>
                                </div>
                            </div>
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
