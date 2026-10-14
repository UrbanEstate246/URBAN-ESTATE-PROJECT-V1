"use client";
import { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import AuthShell, { fieldClass, labelClass } from "../components/AuthShell";
import { saveSession, safeNext } from "../utils/session";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/User/UserLogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      const data = await res.json();

      if (!data.success) {
        const message =
          data.message === "Invalid login credentials"
            ? "That email and password don't match. Check them and try again."
            : data.message || "Sign in failed. Please try again.";
        setError(message);
        return;
      }

      saveSession(data);
      toast.success(`Welcome back, ${data.user.name}!`);
      // Full navigation so the navbar re-reads the new session.
      window.location.href = safeNext(data.user.role === "admin" ? "/admin" : "/");
    } catch {
      setError("We couldn't reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to save homes, book viewings and manage your listings."
      footer={
        <>
          New to UrbanEstate?{" "}
          <Link href="/signup" className="font-bold text-[#1E7F4B] hover:underline">
            Create a free account
          </Link>
        </>
      }
    >
      <form onSubmit={handleLogin} className="space-y-5" noValidate>
        <div>
          <label htmlFor="email" className={labelClass}>Email address</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={fieldClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password" className={labelClass}>Password</label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Your password"
              className={`${fieldClass} pr-12`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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
        </div>

        {error && (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B1F33] py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-[#1E7F4B] disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </AuthShell>
  );
}
