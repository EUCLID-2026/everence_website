"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Eye, EyeOff, Lock, Mail, ShieldCheck, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage("Please enter your work email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMessage("Please enter a valid work email format (name@company.com).");
      return;
    }

    if (!password) {
      setErrorMessage("Please enter your account password.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Authentication failed. Please check your credentials.");
        setIsLoading(false);
        return;
      }

      setInfoMessage("Signed in successfully. Redirecting to workspace...");
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 500);
    } catch {
      setErrorMessage("Network error connecting to auth service. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-7 sm:p-9 shadow-xl">
      {/* Card Header */}
      <div className="mb-6 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[#FF6700]/30 bg-[#FF6700]/10 px-3 py-1 text-[11px] font-medium text-slate-800">
          <ShieldCheck className="h-3.5 w-3.5 text-[#FF6700]" />
          SecuraApps Account
        </div>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
          Sign in to your account
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Enter your credentials to access security telemetry and reports.
        </p>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Info Notice */}
      {infoMessage && (
        <div
          role="status"
          className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800"
        >
          <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
          <p>{infoMessage}</p>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Work Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Work Email
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <Mail className="h-4 w-4" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="username email"
              required
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@organisation.com"
              className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-2.5 pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#FF6700] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#FF6700] disabled:opacity-50"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="password"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-[#FF6700] hover:text-[#e65c00] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <Lock className="h-4 w-4" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#FF6700] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#FF6700] disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Remember Me */}
        <div className="flex items-center pt-1">
          <input
            id="rememberMe"
            name="rememberMe"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-[#FF6700] focus:ring-[#FF6700]"
          />
          <label
            htmlFor="rememberMe"
            className="ml-2 block text-xs text-slate-600 cursor-pointer select-none"
          >
            Remember this device for 30 days
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center rounded-full bg-[#FF6700] hover:bg-[#e65c00] px-5 py-3 text-[14px] sm:text-[15px] font-semibold text-white shadow-[1.5px_1.5px_3px_rgba(174,174,192,0.30)] transition-all focus:outline-none focus:ring-2 focus:ring-[#FF6700] focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? "Authenticating..." : "Sign In ↗"}
          </button>
        </div>
      </form>

      {/* Switch to Registration */}
      <div className="mt-6 border-t border-slate-100 pt-5 text-center text-xs text-slate-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-bold text-[#FF6700] hover:text-[#e65c00] hover:underline"
        >
          Create an account
        </Link>
      </div>
    </div>
  );
}
