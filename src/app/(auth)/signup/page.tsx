"use client";

import Link from "next/link";
import React, { useMemo, useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Building2,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function SignUpPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const passwordCriteria = useMemo(() => {
    return {
      minLength: password.length >= 10,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSymbol: /[^A-Za-z0-9]/.test(password),
    };
  }, [password]);

  const isPasswordValid =
    passwordCriteria.minLength &&
    passwordCriteria.hasUpper &&
    passwordCriteria.hasLower &&
    passwordCriteria.hasNumber &&
    passwordCriteria.hasSymbol;

  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);

    if (!fullName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage("Please enter your work email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMessage("Please enter a valid work email address (name@company.com).");
      return;
    }

    if (!isPasswordValid) {
      setErrorMessage("Please ensure your password meets all security criteria below.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please re-enter.");
      return;
    }

    if (!agreeTerms) {
      setErrorMessage("You must accept the terms of service and privacy agreement to register.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: trimmedEmail,
          organisation: organisation.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Registration failed. Please check your details.");
        setIsLoading(false);
        return;
      }

      setInfoMessage("Account created successfully. Redirecting to workspace...");
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 500);
    } catch {
      setErrorMessage("Network error connecting to registration service. Please try again.");
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
          Create your account
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Deploy security intelligence and monitor assets across your organisation.
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

      {/* Info Alert */}
      {infoMessage && (
        <div
          role="status"
          className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
          <p>{infoMessage}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Full Name */}
        <div>
          <label
            htmlFor="fullName"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Full Name <span className="text-[#FF6700]">*</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <User className="h-4 w-4" />
            </div>
            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              required
              disabled={isLoading}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Jane Doe"
              className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-2.5 pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#FF6700] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#FF6700] disabled:opacity-50"
            />
          </div>
        </div>

        {/* Work Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Work Email <span className="text-[#FF6700]">*</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <Mail className="h-4 w-4" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@organisation.com"
              className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-2.5 pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#FF6700] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#FF6700] disabled:opacity-50"
            />
          </div>
        </div>

        {/* Organisation */}
        <div>
          <label
            htmlFor="organisation"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Organisation <span className="text-slate-400 normal-case">(optional)</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <Building2 className="h-4 w-4" />
            </div>
            <input
              id="organisation"
              name="organisation"
              type="text"
              autoComplete="organization"
              disabled={isLoading}
              value={organisation}
              onChange={(e) => setOrganisation(e.target.value)}
              placeholder="Acme Corp"
              className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-2.5 pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#FF6700] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#FF6700] disabled:opacity-50"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Password <span className="text-[#FF6700]">*</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <Lock className="h-4 w-4" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
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

          {/* Password Security Criteria */}
          {password.length > 0 && (
            <div className="mt-2.5 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-[11px] text-slate-600">
              <div className="font-semibold text-slate-800 mb-1.5">Password requirements:</div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                <li className="flex items-center gap-1.5">
                  {passwordCriteria.minLength ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <XCircle className="h-3.5 w-3.5 text-slate-400" />
                  )}
                  <span className={passwordCriteria.minLength ? "text-slate-900 font-medium" : ""}>
                    10+ characters
                  </span>
                </li>
                <li className="flex items-center gap-1.5">
                  {passwordCriteria.hasUpper ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <XCircle className="h-3.5 w-3.5 text-slate-400" />
                  )}
                  <span className={passwordCriteria.hasUpper ? "text-slate-900 font-medium" : ""}>
                    Uppercase letter
                  </span>
                </li>
                <li className="flex items-center gap-1.5">
                  {passwordCriteria.hasLower ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <XCircle className="h-3.5 w-3.5 text-slate-400" />
                  )}
                  <span className={passwordCriteria.hasLower ? "text-slate-900 font-medium" : ""}>
                    Lowercase letter
                  </span>
                </li>
                <li className="flex items-center gap-1.5">
                  {passwordCriteria.hasNumber ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <XCircle className="h-3.5 w-3.5 text-slate-400" />
                  )}
                  <span className={passwordCriteria.hasNumber ? "text-slate-900 font-medium" : ""}>
                    Number (0-9)
                  </span>
                </li>
                <li className="flex items-center gap-1.5">
                  {passwordCriteria.hasSymbol ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <XCircle className="h-3.5 w-3.5 text-slate-400" />
                  )}
                  <span className={passwordCriteria.hasSymbol ? "text-slate-900 font-medium" : ""}>
                    Special character
                  </span>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Confirm Password <span className="text-[#FF6700]">*</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <Lock className="h-4 w-4" />
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              disabled={isLoading}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#FF6700] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#FF6700] disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {confirmPassword.length > 0 && (
            <div className="mt-1 text-[11px]">
              {passwordsMatch ? (
                <span className="text-emerald-600 flex items-center gap-1 font-medium">
                  <CheckCircle2 className="h-3 w-3" /> Passwords match
                </span>
              ) : (
                <span className="text-[#FF6700] flex items-center gap-1">
                  <XCircle className="h-3 w-3" /> Passwords do not match yet
                </span>
              )}
            </div>
          )}
        </div>

        {/* Terms and Privacy Checkbox */}
        <div className="flex items-start pt-1">
          <input
            id="agreeTerms"
            name="agreeTerms"
            type="checkbox"
            required
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#FF6700] focus:ring-[#FF6700]"
          />
          <label
            htmlFor="agreeTerms"
            className="ml-2 block text-xs text-slate-600 cursor-pointer select-none leading-relaxed"
          >
            I agree to the{" "}
            <a href="#terms" className="text-[#FF6700] font-medium hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#privacy" className="text-[#FF6700] font-medium hover:underline">
              Privacy Policy
            </a>
            .
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center rounded-full bg-[#FF6700] hover:bg-[#e65c00] px-5 py-3 text-[14px] sm:text-[15px] font-semibold text-white shadow-[1.5px_1.5px_3px_rgba(174,174,192,0.30)] transition-all focus:outline-none focus:ring-2 focus:ring-[#FF6700] focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? "Creating account..." : "Create Account ↗"}
          </button>
        </div>
      </form>

      {/* Switch to Login */}
      <div className="mt-6 border-t border-slate-100 pt-5 text-center text-xs text-slate-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-bold text-[#FF6700] hover:text-[#e65c00] hover:underline"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
