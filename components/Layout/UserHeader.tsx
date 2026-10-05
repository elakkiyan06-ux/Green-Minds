'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Common/Logo';
import { Plus, Sparkles, Trophy, Shield } from 'lucide-react';

const LogOutIcon = ({ className }: { className?: string }) => (
  <svg className={className || "w-4 h-4"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export default function UserHeader() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch {
      router.push('/login');
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E5EBE5] px-4 lg:px-8 py-3.5 transition-all">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left: Mobile Logo & Tagline */}
        <div className="flex items-center gap-4">
          <div className="lg:hidden">
            <Logo showTagline={false} />
          </div>

          <div className="hidden md:flex flex-col">
            <span className="text-xs font-bold text-[#14532D] tracking-wide flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#16A34A]" />
              GreenMind Student Portal
            </span>
            <span className="text-[11px] text-gray-500 italic">
              Report environmental problems & contribute to campus sustainability.
            </span>
          </div>
        </div>

        {/* Right: Eco-Points + Report Button + Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Eco-Points Badge */}
          <Link
            href="/user/eco-bounty"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#DCFCE7] border border-green-200 text-xs font-bold text-[#14532D] hover:bg-[#bbf7d0] transition-colors"
          >
            <Trophy className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>1,240 Eco-Points</span>
          </Link>

          {/* Report Button */}
          <Link
            href="/user/report"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#16A34A] hover:bg-[#14532D] text-white text-xs sm:text-sm font-bold shadow-sm shadow-green-700/20 transition-all duration-150"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden xs:inline">Report Issue</span>
          </Link>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
            <div className="w-8 h-8 rounded-full bg-[#16A34A] text-white flex items-center justify-center font-bold text-xs shadow-inner">
              ER
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-gray-100 transition-colors"
            >
              <LogOutIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
