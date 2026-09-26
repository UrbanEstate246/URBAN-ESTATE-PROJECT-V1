"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import AuthShell, { fieldClass, labelClass } from "../components/AuthShell";
import { countiesByRegion, placesInCounty } from "../data/kenyaLocations";
import { AMENITIES, PROPERTY_TYPES } from "../data/propertyTypes";
import { clearSession } from "../utils/session";

export default function AddPropertyPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [propertyId, setPropertyId] = useState(null);
  const [previews, setPreviews] = useState([]);
  const [county, setCounty] = useState("");
  const [type, setType] = useState("Bedsitter");
  const [category, setCategory] = useState("rent");

  useEffect(() => {
    if (!localStorage.getItem("token")) window.location.replace("/login?next=/addProperty");
    return () => previews.forEach((preview) => URL.revokeObjectURL(preview.url));
  }, [previews]);

  function chooseType(value) {
    setType(value);
    if (value === "Land") setCategory("land");
  }

  function handleImages(event) {
    previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    const files = Array.from(event.target.files || []);
    if (files.length > 10 || files.some((file) => file.size > 8 * 1024 * 1024 || !["image/jpeg", "image/png", "image/webp"].includes(file.type))) {
      setMessage("Choose up to 10 JPEG, PNG or WebP images, each no larger than 8 MB.");
      event.target.value = "";
      setPreviews([]);
      return;
    }
    setMessage("");
    setPreviews(files.map((file) => ({ file, url: URL.createObjectURL(file) })));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const response = await fetch("/api/property/createProperty", {
      method: "POST",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: new FormData(event.currentTarget),
    });
    if (response.status === 401) {
      clearSession();
      window.location.href = "/login?next=/addProperty";
      return;
    }
    const data = await response.json();
    setLoading(false);
    if (data.success) setPropertyId(data.newProperty.id);
    else setMessage(data.message || "Could not add your property.");
  }

  if (propertyId) {
    return <AuthShell title="Your listing is live" subtitle="People can now find it in search and on its county page.">
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
        <p className="text-[#1E7F4B]">Property added successfully.</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link className="rounded-xl bg-[#0B1F33] px-5 py-3 font-semibold text-white" href={`/properties/${propertyId}`}>View my listing</Link>
          <button className="rounded-xl border border-[#0B1F33] px-5 py-3 font-semibold text-[#0B1F33]" onClick={() => { setPropertyId(null); setPreviews([]); }}>List another</button>
        </div>
      </div>
    </AuthShell>;
  }

  const isLand = type === "Land";
  return <AuthShell title="List your property free" subtitle="Add accurate details and current photos so people can find the right place.">
    <form onSubmit={handleSubmit} className="space-y-8">
      <Section title="Basics">
        <Field label="Title"><input className={fieldClass} name="title" required placeholder="e.g. Bedsitter near Kasarani station" /></Field>
        <Field label="Description"><textarea className={`${fieldClass} min-h-28`} name="description" required placeholder="Describe the property and what is nearby" /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Property type"><select className={fieldClass} name="type" value={type} onChange={(e) => chooseType(e.target.value)}>{PROPERTY_TYPES.map((item) => <option key={item}>{item}</option>)}</select></Field>
          <Field label="Category"><select className={fieldClass} name="category" value={isLand ? "land" : category} disabled={isLand} onChange={(e) => setCategory(e.target.value)}><option value="rent">Rent</option><option value="sale">Sale</option><option value="land">Land</option></select>{isLand && <input type="hidden" name="category" value="land" />}</Field>
        </div>
        <Field label={category === "rent" && !isLand ? "Monthly rent (KES)" : "Price (KES)"}><input className={fieldClass} name="price" min="1" type="number" required /></Field>
      </Section>

      <Section title="Location">
        <Field label="County"><select id="county" className={fieldClass} name="state" required value={county} onChange={(e) => setCounty(e.target.value)}><option value="">Select county</option>{countiesByRegion().map(({ region, counties }) => <optgroup key={region} label={region}>{counties.map((item) => <option key={item.code} value={item.name}>{item.name}</option>)}</optgroup>)}</select></Field>
        <Field label="Town / estate"><input className={fieldClass} name="city" required list="area-options" placeholder={county ? `e.g. ${placesInCounty(county).slice(0, 2).join(" or ")}` : "Pick a county first"} /><datalist id="area-options">{placesInCounty(county).map((place) => <option key={place} value={place} />)}</datalist></Field>
        <Field label="Road / landmark"><input className={fieldClass} name="address" required placeholder="e.g. Near the market" /></Field>
      </Section>

      <Section title="Details">
        {!isLand && <div className="grid gap-4 sm:grid-cols-2"><Field label="Bedrooms"><input className={fieldClass} name="bedrooms" min="0" type="number" /></Field><Field label="Bathrooms"><input className={fieldClass} name="bathrooms" min="0" type="number" /></Field></div>}
        <fieldset><legend className={labelClass}>Amenities</legend><div className="grid grid-cols-2 gap-3">{AMENITIES.map((item) => <label key={item} className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" name="amenities" value={item} className="accent-[#1E7F4B]" />{item}</label>)}</div></fieldset>
      </Section>

      <Section title="Photos">
        <Field label="Property photos"><input className={fieldClass} type="file" name="images" accept="image/jpeg,image/png,image/webp" multiple required onChange={handleImages} /><p className="mt-2 text-xs text-gray-500">Up to 10 JPEG, PNG or WebP images. Maximum 8 MB each.</p></Field>
        {previews.length > 0 && <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{previews.map((preview, index) => <div key={preview.url} className="relative aspect-[4/3] overflow-hidden rounded-xl"><Image src={preview.url} alt={`Property photo preview ${index + 1}`} fill className="object-cover" /></div>)}</div>}
      </Section>

      {message && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{message}</p>}
      <button disabled={loading} className="w-full rounded-xl bg-[#1E7F4B] px-5 py-3 font-semibold text-white disabled:opacity-60">{loading ? "Uploading…" : "Publish listing"}</button>
    </form>
  </AuthShell>;
}

function Section({ title, children }) { return <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"><h2 className="font-bricolage text-xl font-bold text-[#0B1F33]">{title}</h2>{children}</section>; }
function Field({ label, children }) { return <label className="block"><span className={labelClass}>{label}</span>{children}</label>; }
