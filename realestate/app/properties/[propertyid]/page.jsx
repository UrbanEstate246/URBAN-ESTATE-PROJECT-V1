"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
} from "lucide-react";
import Loading from "@/app/components/Loading";
import { formatPhoneDisplay, telHref, whatsappHref } from "@/app/utils/phone";

// Direct line to whoever owns the listing: one tap to call or WhatsApp, no middleman.
function ContactCard({ contact, title }) {
    if (!contact?.phone) return null;
    const message = `Hello, I saw "${title}" on UrbanEstate and I'm interested.`;

    return (
        <div className="p-6 bg-white rounded-xl shadow-md">
            <h3 className="text-lg font-bold mb-4">
                {contact.direct ? "Contact the owner" : "Contact UrbanEstate about this listing"}
            </h3>

            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex justify-center items-center">
                    <User />
                </div>
                <div>
                    <p className="font-semibold">{contact.name}</p>
                    <p className="text-sm text-gray-600">
                        {contact.direct ? "Listed by" : "Listing support"}
                    </p>
                </div>
            </div>

            <a
                href={telHref(contact.phone)}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1B8C66] py-3 text-lg font-semibold text-white hover:bg-[#157a58]"
            >
                <Phone size={20} /> Call {formatPhoneDisplay(contact.phone)}
            </a>
            <a
                href={whatsappHref(contact.phone, message)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-lg font-semibold text-white hover:bg-[#1fb355]"
            >
                <MessageCircle size={20} /> WhatsApp
            </a>
        </div>
    );
}

export default function PropertyDetailsPage() {
    const { propertyid } = useParams();
    const router = useRouter();

    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFavourite, setIsFavourite] = useState(false);

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
            console.log(err);
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

            if (data.success) {
                const exists = data.favouriteProperty.some(
                    (f) => f.property?._id === propertyid
                );
                setIsFavourite(exists);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getProperty();
        checkFavourite();
    }, [propertyid]);

    // Toggle favourite
    const toggleFavourite = async () => {
        try {
            if (isFavourite) {
                const res = await fetch(
                    `/api/favourite/deleteFavourite?pid=${propertyid}`,
                    { method: "DELETE", headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                );
                const data = await res.json();

                if (data.success) setIsFavourite(false);
            } else {
                const res = await fetch(
                    `/api/favourite/addFavourite?pid=${propertyid}`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
                        body: JSON.stringify({
                            visitDate: "2025-01-01",
                            status: "favourite",
                        }),
                    }
                );

                const data = await res.json();
                if (data.success) setIsFavourite(true);
            }
        } catch (err) {
            console.log(err);
        }
    };

    if (loading)
        return (
          <Loading />
        );

    if (!property)
        return (
            <div className="w-full h-screen flex justify-center items-center text-xl font-semibold">
                Property not found
            </div>
        );

    // Only this listing's own photos (the API supplies a placeholder when there are none).
    const images = property.images;

    return (
        <div className="bg-white min-h-screen text-[#102A23]">
            <Navbar theme="white" />
            <hr className="bg-gray-200" />

            <div className="max-w-[1400px] mx-auto px-6 md:px-16 mt-10 relative">
                {/* ❤️ Floating Favourite */}
                <button
                    onClick={toggleFavourite}
                    className="absolute top-2 right-2 md:top-6 md:right-6 z-50 bg-white shadow-xl rounded-full p-3 hover:scale-110 transition"
                >
                    <Heart
                        size={30}
                        className={
                            isFavourite
                                ? "text-red-500 fill-red-500"
                                : "text-gray-400"
                        }
                    />
                </button>

                {/* TITLE */}
                <h1 className="text-3xl md:text-4xl font-bold font-bricolage">
                    {property.title}
                </h1>
                <p className="text-gray-600 text-lg mt-1">
                    {property.city}, {property.state}
                </p>

                {/* DESKTOP LAYOUT */}
                <div className="mt-10 hidden md:flex gap-10">
                    {/* LEFT SIDE */}
                    <div className="w-[60%]">
                        <ImageGallery images={images} />

                        <div className="mt-6 space-y-5">
                            <div className="text-3xl font-bold text-green-700">
                                KES {property.price.toLocaleString()}{property.category === "rent" ? " / month" : ""}
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-gray-700">
                                {property.bedrooms > 0 && <span className="flex gap-2 items-center">
                                    <Bed size={20} /> {property.bedrooms} Bedrooms
                                </span>}
                                {property.bathrooms > 0 && <span className="flex gap-2 items-center">
                                    <Bath size={20} /> {property.bathrooms} Bathrooms
                                </span>}
                                {property.areaSqFt > 0 && <span className="flex gap-2 items-center">
                                    <Square size={20} /> {property.areaSqFt} sq.ft
                                </span>}
                                <span className="flex gap-2 items-center">
                                    <MapPin size={20} /> {property.address}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDEBAR */}
                    <div className="w-[40%] flex flex-col gap-6">

                        {/* BOX WITHOUT BORDER */}
                        <div className="p-6 bg-white rounded-xl shadow-md">
                            <h1 className="text-3xl font-bold text-[#1B8C66]">
                                KES {property.price.toLocaleString()}{property.category === "rent" ? " / month" : ""}
                            </h1>

                            <button
                                onClick={() =>
                                    router.push(`/properties/${propertyid}/booking`)
                                }
                                className="mt-6 w-full bg-[#1B8C66] hover:bg-[#157a58] text-white py-3 rounded-xl text-lg"
                            >
                                Book Now
                            </button>
                        </div>

                        <ContactCard contact={property.contact} title={property.title} />
                    </div>
                </div>

                {/* MOBILE LAYOUT */}
                <div className="md:hidden mt-6">
                    <ImageGallery images={images} />

                    <div className="mt-6 space-y-4">
                        <div className="text-2xl font-bold text-green-700">
                            KES {property.price.toLocaleString()}{property.category === "rent" ? " / month" : ""}
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-gray-800">
                            {property.bedrooms > 0 && <span className="flex gap-2 items-center">
                                <Bed size={18} /> {property.bedrooms} Beds
                            </span>}
                            {property.bathrooms > 0 && <span className="flex gap-2 items-center">
                                <Bath size={18} /> {property.bathrooms} Baths
                            </span>}
                            {property.areaSqFt > 0 && <span className="flex gap-2 items-center">
                                <Square size={18} /> {property.areaSqFt} sq.ft
                            </span>}
                            <span className="flex gap-2 items-center">
                                <MapPin size={18} /> {property.address}
                            </span>
                        </div>

                        <button
                            onClick={() =>
                                router.push(`/properties/${propertyid}/booking`)
                            }
                            className="w-full mt-4 bg-[#1B8C66] text-white py-3 rounded-lg shadow hover:bg-[#157a58]"
                        >
                            Book Now
                        </button>

                        <ContactCard contact={property.contact} title={property.title} />
                    </div>
                </div>

                {/* DESCRIPTION */}
                <div className="mt-16">
                    <h2 className="text-2xl font-bold mb-2">Description</h2>
                    <p className="text-gray-700 leading-relaxed">
                        {property.description}
                    </p>
                </div>

                {/* MORE DETAILS */}
                {property.moredetails && (
                    <div className="mt-10">
                        <h2 className="text-2xl font-bold mb-2">More Details</h2>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                            {property.moredetails}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
