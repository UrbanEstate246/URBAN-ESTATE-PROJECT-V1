"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AlertCircle, Check, ImagePlus, Loader2, RotateCw, X } from "lucide-react";
import AuthShell, { fieldClass, labelClass } from "../components/AuthShell";
import { countiesByRegion, placesInCounty } from "../data/kenyaLocations";
import { AMENITIES, PROPERTY_TYPES } from "../data/propertyTypes";
import { clearSession } from "../utils/session";
import { uploadPhoto } from "../utils/uploadPhoto";

const MAX_PHOTOS = 10;
const PARALLEL_UPLOADS = 3;

function redirectToLogin() {
  clearSession();
  window.location.href = "/login?next=/addProperty";
}

export default function AddPropertyPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [propertyId, setPropertyId] = useState(null);
  const [photos, setPhotos] = useState([]); // { id, file, preview, status: queued|uploading|done|error, progress, result, error }
  const [county, setCounty] = useState("");
  const [type, setType] = useState("Bedsitter");
  const [category, setCategory] = useState("rent");
  const [contactPhone, setContactPhone] = useState("");
  const [contactName, setContactName] = useState("");
  const fileInput = useRef(null);
  const photosRef = useRef(photos);
  photosRef.current = photos;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) window.location.replace("/login?next=/addProperty");
    else {
      // Prefill the contact details from the account so most people just confirm them.
      fetch("/api/User/getProfile", { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          const profile = data?.userProfile;
          if (!profile) return;
          setContactPhone((current) => current || String(profile.phoneNumber || "").replace(/[\s-]/g, ""));
          setContactName((current) => current || profile.name || "");
        })
        .catch(() => {});
    }
    return () => photosRef.current.forEach((p) => URL.revokeObjectURL(p.preview));
  }, []);

  const patchPhoto = (id, patch) => setPhotos((list) => list.map((p) => (p.id === id ? { ...p, ...patch } : p)));

  // Start queued uploads, at most PARALLEL_UPLOADS at a time.
  useEffect(() => {
    const active = photos.filter((p) => p.status === "uploading").length;
    photos
      .filter((p) => p.status === "queued")
      .slice(0, Math.max(0, PARALLEL_UPLOADS - active))
      .forEach((photo) => {
        patchPhoto(photo.id, { status: "uploading", progress: 0, error: "" });
        uploadPhoto(photo.file, (progress) => patchPhoto(photo.id, { progress }))
          .then((result) => patchPhoto(photo.id, { status: "done", result }))
          .catch((err) => {
            if (err.status === 401) return redirectToLogin();
            patchPhoto(photo.id, { status: "error", error: err.message });
          });
      });
  }, [photos]);

  function addFiles(event) {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    const room = MAX_PHOTOS - photos.length;
    if (files.length > room) setMessage(`You can add up to ${MAX_PHOTOS} photos. Extra photos were skipped.`);
    else setMessage("");
    const added = files.slice(0, room).map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file,
      preview: URL.createObjectURL(file),
      status: "queued",
      progress: 0,
    }));
    setPhotos((list) => [...list, ...added]);
  }

  function removePhoto(id) {
    setPhotos((list) => {
      const photo = list.find((p) => p.id === id);
      if (photo) URL.revokeObjectURL(photo.preview);
      return list.filter((p) => p.id !== id);
    });
  }

  function chooseType(value) {
    setType(value);
    if (value === "Land") setCategory("land");
  }

  const uploading = photos.some((p) => p.status === "queued" || p.status === "uploading");
  const failed = photos.some((p) => p.status === "error");
  const ready = photos.filter((p) => p.status === "done");

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    if (ready.length === 0) return setMessage("Add at least one photo of the property.");
    if (uploading) return setMessage("Please wait for your photos to finish uploading.");
    if (failed) return setMessage("Some photos failed to upload. Retry or remove them first.");

    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    payload.amenities = form.getAll("amenities");
    payload.photos = ready.map((p) => ({ public_id: p.result.public_id, version: p.result.version }));

    setLoading(true);
    try {
      const response = await fetch("/api/property/createProperty", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify(payload),
      });
      if (response.status === 401) return redirectToLogin();
      const data = await response.json();
      if (data.success) {
        photos.forEach((p) => URL.revokeObjectURL(p.preview));
        setPhotos([]);
        setPropertyId(data.newProperty.id);
        window.scrollTo({ top: 0 });
      } else {
        setMessage(data.message || "Could not add your property.");
      }
    } catch {
      setMessage("We couldn't reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  if (propertyId) {
    return (
      <AuthShell title="Your listing is live" subtitle="People can now find it in search and on its county page.">
        <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
          <p className="text-[#1E7F4B]">Property added successfully.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link className="rounded-xl bg-[#0B1F33] px-5 py-3 font-semibold text-white" href={`/properties/${propertyId}`}>View my listing</Link>
            <button className="rounded-xl border border-[#0B1F33] px-5 py-3 font-semibold text-[#0B1F33]" onClick={() => setPropertyId(null)}>List another</button>
          </div>
        </div>
      </AuthShell>
    );
  }

  const isLand = type === "Land";
  return (
    <AuthShell title="List your property free" subtitle="Add accurate details and current photos so people can find the right place.">
      <form onSubmit={handleSubmit} className="space-y-8">
        <Section title="Basics">
          <Field label="Title"><input className={fieldClass} name="title" required maxLength={200} placeholder="e.g. Bedsitter near Kasarani station" /></Field>
          <Field label="Description"><textarea className={`${fieldClass} min-h-28`} name="description" required placeholder="Describe the property and what is nearby" /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Property type">
              <select className={fieldClass} name="type" value={type} onChange={(e) => chooseType(e.target.value)}>
                {PROPERTY_TYPES.map((item) => <option key={item}>{item}</option>)}
              </select>
            </Field>
            <Field label="Category">
              <select className={fieldClass} name="category" value={isLand ? "land" : category} disabled={isLand} onChange={(e) => setCategory(e.target.value)}>
                <option value="rent">Rent</option>
                <option value="sale">Sale</option>
                <option value="land">Land</option>
              </select>
              {isLand && <input type="hidden" name="category" value="land" />}
            </Field>
          </div>
          <Field label={category === "rent" && !isLand ? "Monthly rent (KES)" : "Price (KES)"}>
            <input className={fieldClass} name="price" min="1" type="number" required />
          </Field>
        </Section>

        <Section title="Location">
          <Field label="County">
            <select id="county" className={fieldClass} name="state" required value={county} onChange={(e) => setCounty(e.target.value)}>
              <option value="">Select county</option>
              {countiesByRegion().map(({ region, counties }) => (
                <optgroup key={region} label={region}>
                  {counties.map((item) => <option key={item.code} value={item.name}>{item.name}</option>)}
                </optgroup>
              ))}
            </select>
          </Field>
          <Field label="Town / estate">
            <input className={fieldClass} name="city" required list="area-options" autoComplete="off" placeholder={county ? `e.g. ${placesInCounty(county).slice(0, 2).join(" or ")}` : "Pick a county first"} />
            <datalist id="area-options">{placesInCounty(county).map((place) => <option key={place} value={place} />)}</datalist>
          </Field>
          <Field label="Road / landmark"><input className={fieldClass} name="address" required placeholder="e.g. Near the market" /></Field>
        </Section>

        <Section title="Details">
          {!isLand && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Bedrooms"><input className={fieldClass} name="bedrooms" min="0" type="number" /></Field>
              <Field label="Bathrooms"><input className={fieldClass} name="bathrooms" min="0" type="number" /></Field>
            </div>
          )}
          <fieldset>
            <legend className={labelClass}>Amenities</legend>
            <div className="grid grid-cols-2 gap-3">
              {AMENITIES.map((item) => (
                <label key={item} className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" name="amenities" value={item} className="accent-[#1E7F4B]" />{item}
                </label>
              ))}
            </div>
          </fieldset>
        </Section>

        <Section title="Contact">
          <p className="text-sm text-gray-600">
            Buyers and tenants will call this number directly. Use the phone you answer for this property.
          </p>
          <Field label="Phone number">
            <input
              className={fieldClass}
              name="contactPhone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required
              pattern="^(\+?254|0)[71]\d{8}$"
              title="A Kenyan number, e.g. 0712 345 678 or +254 712 345 678"
              placeholder="e.g. 0712 345 678"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              onBlur={(e) => setContactPhone(e.target.value.replace(/[\s-]/g, ""))}
            />
          </Field>
          <Field label="Contact name">
            <input className={fieldClass} name="contactName" maxLength={100} placeholder="e.g. Mary (caretaker)" value={contactName} onChange={(e) => setContactName(e.target.value)} />
          </Field>
        </Section>

        <Section title="Photos">
          <p className="text-sm text-gray-600">
            Add up to {MAX_PHOTOS} photos straight from your phone. They upload while you fill in the form. The first photo is the cover.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {photos.map((photo, index) => (
              <div key={photo.id} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview */}
                <img src={photo.preview} alt={`Photo ${index + 1}`} className="h-full w-full object-cover" />
                {index === 0 && <span className="absolute left-2 top-2 rounded-md bg-[#0B1F33] px-2 py-0.5 text-[11px] font-bold text-white">Cover</span>}
                <button
                  type="button"
                  onClick={() => removePhoto(photo.id)}
                  aria-label={`Remove photo ${index + 1}`}
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                >
                  <X className="h-4 w-4" />
                </button>
                {(photo.status === "queued" || photo.status === "uploading") && (
                  <div className="absolute inset-x-0 bottom-0 bg-black/55 p-2 text-white">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold">
                      <Loader2 className="h-3 w-3 animate-spin" /> {photo.status === "queued" ? "Waiting…" : `${photo.progress}%`}
                    </div>
                    <div className="mt-1 h-1 overflow-hidden rounded bg-white/30">
                      <div className="h-full bg-[#D4AF37] transition-all" style={{ width: `${photo.progress}%` }} />
                    </div>
                  </div>
                )}
                {photo.status === "done" && (
                  <span className="absolute bottom-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#1E7F4B] text-white">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                )}
                {photo.status === "error" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-red-900/75 p-2 text-center text-[11px] font-semibold text-white">
                    <AlertCircle className="h-4 w-4" />
                    <span className="line-clamp-2">{photo.error}</span>
                    <button type="button" onClick={() => patchPhoto(photo.id, { status: "queued" })} className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 text-red-800">
                      <RotateCw className="h-3 w-3" /> Retry
                    </button>
                  </div>
                )}
              </div>
            ))}
            {photos.length < MAX_PHOTOS && (
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                className="flex aspect-[4/3] flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-gray-300 text-sm font-semibold text-gray-600 hover:border-[#1E7F4B] hover:text-[#1E7F4B]"
              >
                <ImagePlus className="h-6 w-6" /> Add photos
              </button>
            )}
          </div>
          <input ref={fileInput} type="file" accept="image/*" multiple onChange={addFiles} className="sr-only" tabIndex={-1} aria-hidden="true" />
        </Section>

        {message && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{message}</p>}
        <button
          disabled={loading || uploading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1E7F4B] px-5 py-3 font-semibold text-white disabled:opacity-60"
        >
          {(loading || uploading) && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Publishing…" : uploading ? "Uploading photos…" : "Publish listing"}
        </button>
      </form>
    </AuthShell>
  );
}

function Section({ title, children }) {
  return (
    <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="font-bricolage text-xl font-bold text-[#0B1F33]">{title}</h2>
      {children}
    </section>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      {children}
    </label>
  );
}
