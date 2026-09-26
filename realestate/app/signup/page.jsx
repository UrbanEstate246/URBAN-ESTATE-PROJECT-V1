"use client";
import { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { Building2, Eye, EyeOff, Home, Loader2 } from "lucide-react";
import AuthShell, { fieldClass, labelClass } from "../components/AuthShell";
import { countiesByRegion } from "../data/kenyaLocations";
import { saveSession, safeNext } from "../utils/session";

const ROLES = [
  { value: "user", icon: Home, title: "I'm looking", text: "Buy, rent or invest" },
  { value: "agent", icon: Building2, title: "I'm listing", text: "Agent, landlord or developer" },
];

const KENYAN_PHONE = /^(?:\+?254|0)(7|1)\d{8}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(f) {
  const errors = {};
  if (f.name.trim().length < 2) errors.name = "Enter your full name.";
  if (!EMAIL.test(f.email.trim())) errors.email = "Enter a valid email address.";
  if (!KENYAN_PHONE.test(f.phoneNumber.replace(/[\s-]/g, "")))
    errors.phoneNumber = "Use a Kenyan number, e.g. 0712 345 678 or +254 712 345 678.";
  if (f.password.length < 8) errors.password = "Use at least 8 characters.";
  if (!f.agree) errors.agree = "Please accept the terms to continue.";
  return errors;
}

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    county: "",
    role: "user",
    password: "",
    agree: false,
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const createAccount = async (e) => {
    e.preventDefault();
    setServerError("");
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) return;

    setLoading(true);
    try {
      const response = await fetch("/api/User/UserCreate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          phoneNumber: form.phoneNumber.replace(/[\s-]/g, ""),
          county: form.county,
          role: form.role,
          password: form.password,
        }),
      });
      const data = await response.json();

      if (!data.success) {
        setServerError(data.message || "We couldn't create your account. Please try again.");
        return;
      }

      saveSession(data);
      toast.success(`Welcome to UrbanEstate, ${data.user.name.split(" ")[0]}!`);
      window.location.href = safeNext(form.role === "agent" ? "/addProperty" : "/properties");
    } catch {
      setServerError("We couldn't reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const fieldError = (key) =>
    errors[key] && <p className="mt-1.5 text-xs font-medium text-red-600">{errors[key]}</p>;

  return (
    <AuthShell
      title="Create your account"
      subtitle="Free for buyers and tenants. Takes under a minute."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-[#1E7F4B] hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={createAccount} className="space-y-5" noValidate>
        {/* Role */}
        <fieldset>
          <legend className={labelClass}>How will you use UrbanEstate?</legend>
          <div className="grid grid-cols-2 gap-3">
            {ROLES.map(({ value, icon: Icon, title, text }) => {
              const active = form.role === value;
              return (
                <label
                  key={value}
                  className={`cursor-pointer rounded-xl border-2 p-4 transition ${
                    active ? "border-[#1E7F4B] bg-[#1E7F4B]/5" : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={value}
                    checked={active}
                    onChange={() => set("role", value)}
                    className="sr-only"
                  />
                  <Icon className={`h-5 w-5 ${active ? "text-[#1E7F4B]" : "text-gray-400"}`} />
                  <p className="mt-2 text-sm font-bold text-[#0B1F33]">{title}</p>
                  <p className="text-xs text-gray-500">{text}</p>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div>
          <label htmlFor="name" className={labelClass}>Full name</label>
          <input
            id="name"
            autoComplete="name"
            placeholder="e.g. Wanjiru Kamau"
            className={fieldClass}
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
          />
          {fieldError("name")}
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>Email address</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={fieldClass}
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
          />
          {fieldError("email")}
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="phone" className={labelClass}>Phone number</label>
            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              placeholder="0712 345 678"
              className={fieldClass}
              value={form.phoneNumber}
              onChange={(e) => set("phoneNumber", e.target.value)}
            />
            {fieldError("phoneNumber")}
          </div>
          <div>
            <label htmlFor="county" className={labelClass}>
              County <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <select
              id="county"
              className={fieldClass}
              value={form.county}
              onChange={(e) => set("county", e.target.value)}
            >
              <option value="">Select county</option>
              {countiesByRegion().map(({ region, counties }) => (
                <optgroup key={region} label={region}>
                  {counties.map((c) => (
                    <option key={c.code} value={c.name}>{c.name}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="password" className={labelClass}>Password</label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              className={`${fieldClass} pr-12`}
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-gray-500 hover:text-[#0B1F33]"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {fieldError("password")}
        </div>

        <div>
          <label className="flex items-start gap-3 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={form.agree}
              onChange={(e) => set("agree", e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-[#1E7F4B]"
            />
            <span>
              I agree to the{" "}
              <Link href="/commonrules" className="font-semibold text-[#0B1F33] underline">
                terms and listing standards
              </Link>
              .
            </span>
          </label>
          {fieldError("agree")}
        </div>

        {serverError && (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {serverError}{" "}
            {/already/i.test(serverError) && (
              <Link href="/login" className="font-bold underline">Sign in instead</Link>
            )}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B1F33] py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-[#1E7F4B] disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Creating your account…" : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
}
