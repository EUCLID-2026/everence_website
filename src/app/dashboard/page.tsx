"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  LogOut,
  User,
  Building,
  Key,
  Database,
  ArrowRight,
  Shield,
  Layers,
  Cpu,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  organisation: string | null;
  role: string;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            setUser(data.user);
          } else {
            router.push("/login");
          }
        } else {
          router.push("/login");
        }
      } catch {
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center font-sans">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#FF6700] border-t-transparent mb-4" />
        <p className="text-xs font-medium text-slate-500">Verifying session with PostgreSQL...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-[#FF6700] selection:text-white">
      <Header />

      <main className="flex-1 py-12 md:py-16 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl space-y-8">
          {/* Top Banner / Welcome with subtle tunnel.png background */}
          <div className="relative overflow-hidden rounded-3xl bg-white text-slate-900 p-8 sm:p-10 shadow-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="absolute inset-0 z-0 pointer-events-none">
              <Image
                src="/assets/tunnel.png"
                alt="Tunnel"
                fill
                className="object-cover object-center opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-white/40"></div>
            </div>

            <div className="relative z-10 space-y-2">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#FF6700]/30 bg-[#FF6700]/10 px-3 py-1 text-xs font-semibold text-[#FF6700]">
                <ShieldCheck className="h-3.5 w-3.5 text-[#FF6700]" />
                Active Authenticated Session
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900">
                Welcome back, {user.fullName}
              </h1>
              <p className="text-[13px] sm:text-[14px] text-slate-600 max-w-xl">
                SecuraApps Workspace telemetry and security inspection modules.
              </p>
            </div>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="relative z-10 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 hover:bg-white px-5 py-2.5 text-xs font-semibold text-slate-900 transition-colors shadow-sm disabled:opacity-50"
            >
              <LogOut className="h-3.5 w-3.5 text-[#FF6700]" />
              {isLoggingOut ? "Signing out..." : "Sign Out"}
            </button>
          </div>

          {/* Session & Database Verification Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Account
                </span>
                <User className="h-4 w-4 text-[#FF6700]" />
              </div>
              <p className="text-base font-bold text-slate-900 truncate">{user.email}</p>
              <p className="text-xs text-slate-500">Role: <span className="font-semibold uppercase text-slate-700">{user.role}</span></p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Organisation
                </span>
                <Building className="h-4 w-4 text-[#FF6700]" />
              </div>
              <p className="text-base font-bold text-slate-900 truncate">
                {user.organisation || "Not specified"}
              </p>
              <p className="text-xs text-slate-500">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Storage & Token
                </span>
                <Database className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                PostgreSQL · JWT Session Verified
              </div>
              <p className="text-xs text-slate-500">HTTP-Only secure cookie signed via HS256</p>
            </div>
          </div>

          {/* Product Quick-Access Portals */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight mb-4">
              Available Product Suites
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                href="/products/droidscan"
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-[#FF6700] hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="h-8 w-8 rounded-lg bg-[#FF6700]/10 flex items-center justify-center text-[#FF6700] font-bold">
                    📱
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-[#FF6700] group-hover:translate-x-0.5 transition-all" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">DroidScan</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Mobile application package inspection, reverse engineering, and MASVS security triage.
                </p>
              </Link>

              <Link
                href="/products/chainbreak"
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-[#FF6700] hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="h-8 w-8 rounded-lg bg-[#FF6700]/10 flex items-center justify-center text-[#FF6700] font-bold">
                    ⛓
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-[#FF6700] group-hover:translate-x-0.5 transition-all" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">ChainBreak</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Bitcoin wallet intelligence, transaction ledgers, counterparty mapping, and forensic reports.
                </p>
              </Link>

              <Link
                href="/products/webstrike"
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-[#FF6700] hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="h-8 w-8 rounded-lg bg-[#FF6700]/10 flex items-center justify-center text-[#FF6700] font-bold">
                    ⚡
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-[#FF6700] group-hover:translate-x-0.5 transition-all" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">WebStrike</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  24/7 defacement sentinel, perimeter & port recon, phishing detection, and executive scorecards.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

