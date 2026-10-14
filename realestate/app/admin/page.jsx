"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { BadgeCheck, EyeOff, Eye, ExternalLink, Loader2, Phone, Search, ShieldCheck, Trash2 } from "lucide-react";
import Navbar from "../components/Navbar";
import { authHeaders, clearSession, redirectIfUnauthorized } from "../utils/session";
import { formatPhoneDisplay, telHref } from "../utils/phone";

const FILTERS = [
  ["all", "All"],
  ["available", "Live"],
  ["hidden", "Hidden"],
  ["unverified", "Not verified"],
];

export default function AdminPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      window.location.replace("/login?next=/admin");
      return;
    }
    (async () => {
      try {
        const res = await fetch("/api/admin/properties", { headers: authHeaders(), cache: "no-store" });
        if (redirectIfUnauthorized(res, "/admin")) return;
        if (res.status === 403) return setDenied(true);
        const data = await res.json();
        if (data.success) setProperties(data.properties);
        else toast.error(data.message || "Could not load listings.");
      } catch {
        toast.error("We couldn't reach the server.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return properties.filter((p) => {
      if (filter === "available" && p.status !== "available") return false;
      if (filter === "hidden" && p.status !== "hidden") return false;
      if (filter === "unverified" && p.verificationStatus === "verified") return false;
      if (!q) return true;
      return [p.title, p.state, p.city, p.contact?.phone, p.contact?.name].some((v) => String(v || "").toLowerCase().includes(q));
    });
  }, [properties, query, filter]);

  async function update(id, body, done) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/property/updatepropertysatus?pid=${id}`, {
        method: "PUT",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(body),
      });
      if (redirectIfUnauthorized(res, "/admin")) return;
      const data = await res.json();
      if (!data.success) return toast.error(data.message || "Update failed.");
      setProperties((list) => list.map((p) => (p.id === id ? { ...p, ...done } : p)));
      toast.success("Updated.");
    } finally {
      setBusyId(null);
    }
  }

  async function remove(property) {
    if (!window.confirm(`Delete "${property.title}" permanently? This also removes its photos.`)) return;
    setBusyId(property.id);
    try {
      const res = await fetch(`/api/property/deleteProperty?pid=${property.id}`, { method: "DELETE", headers: authHeaders() });
      if (redirectIfUnauthorized(res, "/admin")) return;
      const data = await res.json();
      if (!data.success) return toast.error(data.message || "Delete failed.");
      setProperties((list) => list.filter((p) => p.id !== property.id));
      toast.success("Listing deleted.");
    } finally {
      setBusyId(null);
    }
  }

  if (denied) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar theme="white" />
        <div className="mx-auto mt-24 max-w-md px-6 text-center">
          <h1 className="font-bricolage text-2xl font-bold text-[#0B1F33]">Admins only</h1>
          <p className="mt-2 text-sm text-gray-600">This account doesn&apos;t have admin access.</p>
          <button
            onClick={() => { clearSession(); window.location.href = "/login?next=/admin"; }}
            className="mt-6 rounded-xl bg-[#0B1F33] px-5 py-3 text-sm font-bold text-white"
          >
            Sign in with another account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Navbar theme="white" />
      <hr className="border-gray-200" />

      <main className="mx-auto max-w-[1200px] px-6 py-10 font-bricolage">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0B1F33]/10 px-3 py-1 text-xs font-bold text-[#0B1F33]">
              <ShieldCheck className="h-3.5 w-3.5" /> Admin
            </span>
            <h1 className="mt-2 text-3xl font-bold text-[#0B1F33]">All listings</h1>
            <p className="text-sm text-gray-600">{properties.length} total · hide, verify or remove anything that breaks the listing standards.</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title, county, phone…"
              className="w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-9 pr-3 text-sm focus:border-[#0B1F33] focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {FILTERS.map(([value, label]) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
                filter === value ? "border-[#0B1F33] bg-[#0B1F33] text-white" : "border-gray-300 bg-white text-gray-700 hover:border-[#0B1F33]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="mt-16 flex justify-center text-gray-500"><Loader2 className="h-6 w-6 animate-spin" /></div>
        ) : visible.length === 0 ? (
          <p className="mt-16 text-center text-gray-600">No listings match.</p>
        ) : (
          <ul className="mt-6 space-y-4">
            {visible.map((p) => {
              const busy = busyId === p.id;
              const live = p.status === "available";
              const verified = p.verificationStatus === "verified";
              return (
                <li key={p.id} className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:flex-row md:items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element -- remote Cloudinary thumbnail */}
                  <img src={p.images[0]} alt="" className="h-24 w-full rounded-xl object-cover md:w-36" />
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-lg font-semibold text-[#12342A]">{p.title}</h2>
                    <p className="text-sm text-gray-600">{p.city}, {p.state} · KES {Number(p.price).toLocaleString()}{p.category === "rent" ? " / month" : ""}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-semibold">
                      <span className={`rounded-full px-2.5 py-1 ${live ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"}`}>{live ? "Live" : p.status}</span>
                      <span className={`rounded-full px-2.5 py-1 ${verified ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-800"}`}>{verified ? "Verified" : p.verificationStatus}</span>
                      {p.contact?.direct && (
                        <a href={telHref(p.contact.phone)} className="inline-flex items-center gap-1 text-gray-700 hover:text-[#1E7F4B]">
                          <Phone className="h-3.5 w-3.5" /> {p.contact.name} · {formatPhoneDisplay(p.contact.phone)}
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      disabled={busy}
                      onClick={() => update(p.id, { status: live ? "hidden" : "available" }, { status: live ? "hidden" : "available" })}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                      {live ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />} {live ? "Hide" : "Show"}
                    </button>
                    <button
                      disabled={busy}
                      onClick={() => update(p.id, { verificationStatus: verified ? "unverified" : "verified" }, { verificationStatus: verified ? "unverified" : "verified" })}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
                    >
                      <BadgeCheck className="h-4 w-4" /> {verified ? "Unverify" : "Verify"}
                    </button>
                    <Link href={`/properties/${p.id}`} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                      <ExternalLink className="h-4 w-4" /> View
                    </Link>
                    <button
                      disabled={busy}
                      onClick={() => remove(p)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <ChangePassword />
      </main>
    </div>
  );
}

function ChangePassword() {
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event) {
    event.preventDefault();
    if (value.length < 8) return toast.error("Use at least 8 characters.");
    setSaving(true);
    try {
      const res = await fetch("/api/User/changePassword", {
        method: "POST",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ newPassword: value }),
      });
      if (redirectIfUnauthorized(res, "/admin")) return;
      const data = await res.json();
      if (data.success) {
        setValue("");
        toast.success("Password changed.");
      } else {
        toast.error(data.message || "Could not change password.");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-12 max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-[#0B1F33]">Change your password</h2>
      <p className="mt-1 text-sm text-gray-600">Replace the temporary password you were given.</p>
      <input
        type="password"
        autoComplete="new-password"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="New password (8+ characters)"
        className="mt-4 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-[#0B1F33] focus:outline-none"
      />
      <button
        disabled={saving}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B1F33] px-5 py-3 text-sm font-bold text-white hover:bg-[#1E7F4B] disabled:opacity-60"
      >
        {saving && <Loader2 className="h-4 w-4 animate-spin" />} Update password
      </button>
    </form>
  );
}
