"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Navbar from "../../../components/Navbar";
import ImageGallery from "@/app/components/ImageGallery";
import { Trash2, Edit3, AlertTriangle } from "lucide-react";
import { authHeaders, redirectIfUnauthorized } from "@/app/utils/session";

const inputClass =
    "w-full mb-5 px-4 py-3 rounded-xl border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

export default function UpdateDeletePage() {
    const { propertyid } = useParams();
    const router = useRouter();

    const [data, setData] = useState({
        title: "",
        price: "",
        status: "available",
        images: [],
        city: "",
        state: "",
        description: "",
        contactPhone: "",
        contactName: "",
    });

    const [loading, setLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        if (!localStorage.getItem("token")) window.location.replace(`/login?next=/myProperties/${propertyid}/updateanddelete`);
    }, [propertyid]);

    /* ---------------- FETCH PROPERTY ---------------- */
    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(
                    `/api/property/getsingleproperty?pid=${propertyid}`,
                    { cache: "no-store" }
                );
                const dt = await res.json();

                if (dt.success) {
                    setData({
                        title: dt.property.title,
                        price: dt.property.price,
                        status: dt.property.status,
                        images: dt.property.images || [],
                        city: dt.property.city,
                        state: dt.property.state,
                        description: dt.property.description || "",
                        contactPhone: dt.property.contact?.direct ? dt.property.contact.phone : "",
                        contactName: dt.property.contact?.direct ? dt.property.contact.name : "",
                    });
                }
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, [propertyid]);

    /* ---------------- UPDATE PROPERTY ---------------- */
    async function updateHandler(e) {
        e.preventDefault();
        setLoading(true);

        const body = {
            title: data.title,
            price: data.price,
            description: data.description,
        };
        // Owners can switch between live and hidden; other states (e.g. suspended by an admin) are left alone.
        if (data.status === "available" || data.status === "hidden") body.status = data.status;
        if (data.contactPhone) {
            body.contactPhone = data.contactPhone;
            body.contactName = data.contactName;
        }

        try {
            const res = await fetch(
                `/api/property/updatepropertysatus?pid=${propertyid}`,
                {
                    method: "PUT",
                    headers: authHeaders({ "Content-Type": "application/json" }),
                    body: JSON.stringify(body),
                }
            );

            if (redirectIfUnauthorized(res)) return;
            const out = await res.json();
            setLoading(false);

            if (out.success) {
                toast.success("Listing updated.");
                router.push("/myProperties");
            } else {
                toast.error(out.message || "Could not update the listing.");
            }
        } catch (err) {
            setLoading(false);
            toast.error("We couldn't reach the server. Try again.");
        }
    }

    /* ---------------- DELETE PROPERTY ---------------- */
    async function confirmDelete() {
        try {
            const res = await fetch(
                `/api/property/deleteProperty?pid=${propertyid}`,
                {
                    method: "DELETE",
                    headers: authHeaders(),
                }
            );

            if (redirectIfUnauthorized(res)) return;
            const out = await res.json();

            if (out.success) {
                toast.success("Listing deleted.");
                router.push("/myProperties");
            } else {
                setShowDeleteModal(false);
                toast.error(out.message || "Could not delete the listing.");
            }
        } catch (err) {
            console.log(err);
            toast.error("We couldn't reach the server. Try again.");
        }
    }

    const editableStatus = data.status === "available" || data.status === "hidden";

    return (
        <div className="w-full bg-gray-50 min-h-screen">
            <Navbar theme="light" />

            {/* -------- DELETE MODAL -------- */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl animate-scaleIn">
                        <div className="mx-auto mb-4 h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
                            <AlertTriangle className="text-red-600" size={30} />
                        </div>

                        <h2 className="text-2xl font-bold text-red-600 mb-3">
                            Delete Property?
                        </h2>
                        <p className="text-gray-600 mb-6">
                            This action cannot be undone. All data related to
                            this property will be permanently removed.
                        </p>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="w-full py-3 rounded-lg border font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="w-full py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* -------- MAIN CONTENT -------- */}
            <div className="max-w-5xl mx-auto px-6 py-10">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">
                    Manage Property
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* PROPERTY PREVIEW */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-md p-6 border">
                            <h2 className="text-2xl font-bold text-black mb-2">
                                {data.title}
                            </h2>
                            <p className="text-gray-600 text-lg mt-1">
                                {data.city}, {data.state}
                            </p>

                            <ImageGallery images={data.images} />

                            <p className="mt-4 text-gray-700 whitespace-pre-line">
                                {data.description}
                            </p>

                            <p className="mt-3 text-2xl font-bold text-green-600">
                                KES {Number(data.price || 0).toLocaleString()}
                            </p>

                            <p className="mt-2 font-semibold text-gray-700">
                                Status: {data.status === "available" ? "Live" : data.status}
                            </p>
                        </div>
                    </div>

                    {/* UPDATE FORM */}
                    <div>
                        <form
                            onSubmit={updateHandler}
                            className="bg-white rounded-2xl shadow-xl p-6 border sticky top-24 text-black"
                        >
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Edit3 size={22} /> Update Details
                            </h3>

                            <label className="block mb-2 font-medium">Title</label>
                            <input
                                value={data.title}
                                onChange={(e) => setData({ ...data, title: e.target.value })}
                                required
                                maxLength={200}
                                className={inputClass}
                            />

                            <label className="block mb-2 font-medium">Price (KES)</label>
                            <input
                                type="number"
                                min="1"
                                value={data.price}
                                onChange={(e) => setData({ ...data, price: e.target.value })}
                                required
                                className={inputClass}
                            />

                            <label className="block mb-2 font-medium">Phone buyers call</label>
                            <input
                                type="tel"
                                inputMode="tel"
                                value={data.contactPhone}
                                onChange={(e) => setData({ ...data, contactPhone: e.target.value })}
                                pattern={String.raw`^(\+?254|0)[\s\-]?[71](?:[\s\-]?\d){8}$`}
                                title="A Kenyan number, e.g. 0712 345 678"
                                placeholder="e.g. 0712 345 678"
                                className={inputClass}
                            />

                            <label className="block mb-2 font-medium">Contact name</label>
                            <input
                                value={data.contactName}
                                onChange={(e) => setData({ ...data, contactName: e.target.value })}
                                maxLength={100}
                                className={inputClass}
                            />

                            <label className="block mb-2 font-medium">
                                Visibility
                            </label>
                            <select
                                value={editableStatus ? data.status : ""}
                                disabled={!editableStatus}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        status: e.target.value,
                                    })
                                }
                                className="w-full mb-6 px-4 py-3 rounded-xl border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                            >
                                {!editableStatus && <option value="">{data.status} (set by UrbanEstate)</option>}
                                <option value="available">Live — shown in search</option>
                                <option value="hidden">Hidden — not shown</option>
                            </select>

                            <button
                                type="submit"
                                className="w-full py-3 bg-blue-600 text-white rounded-lg text-lg font-medium hover:bg-blue-700 transition"
                            >
                                {loading ? "Updating..." : "Update Property"}
                            </button>

                            {/* DELETE CTA */}
                            <button
                                type="button"
                                onClick={() => setShowDeleteModal(true)}
                                className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-lg border-2 border-red-200 text-red-600 font-medium hover:bg-red-50 transition"
                            >
                                <Trash2 size={18} /> Delete Property
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
