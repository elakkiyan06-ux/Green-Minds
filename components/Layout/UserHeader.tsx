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

import { getStudentPoints } from '@/lib/student-points';

export default function UserHeader() {
  const router = useRouter();
  const [ecoPoints, setEcoPoints] = React.useState<number>(1240);

  React.useEffect(() => {
    setEcoPoints(getStudentPoints());
    const handleUpdate = () => setEcoPoints(getStudentPoints());
    window.addEventListener('eco_points_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('eco_points_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

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
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E5EBE5] px-4 lg:px-8 py-3.5 transition-all text-gray-900 shadow-2xs">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left: Mobile Title & Scope */}
        <div className="flex items-center gap-3">
          <div className="lg:hidden">
            <Logo href="/user/dashboard" showTagline={false} size="sm" />
          </div>

          <div className="hidden sm:flex flex-col">
            <span className="text-xs font-black tracking-tight text-gray-900 flex items-center gap-1.5 uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#16A34A]" />
              GreenMind Student Portal
            </span>
            <span className="text-[11px] text-gray-500">
              Student Environmental Action & Eco-Bounty Platform
            </span>
          </div>
        </div>

        {/* Right: Eco-Points + Report Button + Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Eco-Points Badge */}
          <Link
            href="/user/eco-bounty"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-colors shadow-2xs"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>{ecoPoints.toLocaleString()} Eco-Points</span>
          </Link>

          {/* Report Button */}
          <Link
            href="/user/report"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs sm:text-sm font-bold shadow-xs transition-all duration-150"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden xs:inline">Report Issue</span>
          </Link>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
            <div className="w-8 h-8 rounded-full bg-[#16A34A] text-white flex items-center justify-center font-black text-xs shadow-2xs">
              ER
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOutIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
