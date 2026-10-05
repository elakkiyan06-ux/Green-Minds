'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, SlidersHorizontal, BarChart3, AlertTriangle, Layers } from 'lucide-react';

const LogOutIcon = ({ className }: { className?: string }) => (
  <svg className={className || "w-4 h-4"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export default function AdminHeader() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch {
      router.push('/admin/login');
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#0F2015]/95 backdrop-blur-md border-b border-emerald-900/40 px-4 lg:px-8 py-3.5 transition-all text-white">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left: Mobile Title & Scope */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center lg:hidden">
            <ShieldCheck className="w-5 h-5" />
          </div>

          <div className="flex flex-col">
            <span className="text-xs font-black tracking-wide text-emerald-400 flex items-center gap-1.5 uppercase">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 hidden sm:inline" />
              GreenMind Admin Portal
            </span>
            <span className="text-[11px] text-emerald-200/70 hidden sm:inline">
              Campus Environmental Management & Operations
            </span>
          </div>
        </div>

        {/* Right: Quick Navigation Badges + Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Quick Actions */}
          <Link
            href="/admin/issues"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950 border border-emerald-800 text-xs font-bold text-emerald-300 hover:bg-emerald-900 transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Manage Issues</span>
          </Link>

          <Link
            href="/admin/analytics"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 text-xs font-black shadow-sm transition-colors"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Analytics</span>
          </Link>

          {/* Admin User Pill & Logout */}
          <div className="flex items-center gap-2 pl-2 border-l border-emerald-800/60">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-gray-950 flex items-center justify-center font-black text-xs">
              AT
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out of Admin Portal"
              className="p-1.5 rounded-lg text-emerald-400 hover:text-red-400 hover:bg-emerald-900/40 transition-colors"
            >
              <LogOutIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
