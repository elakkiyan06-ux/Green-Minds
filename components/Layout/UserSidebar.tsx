'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Logo from '@/components/Common/Logo';
import { 
  LayoutDashboard, 
  PlusCircle, 
  FileText, 
  Bot, 
  Trophy, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

const LogOutIcon = ({ className }: { className?: string }) => (
  <svg className={className || "w-4 h-4"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export default function UserSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (e) {
      console.error(e);
      router.push('/login');
    }
  };

  const navItems = [
    { label: 'My Dashboard', href: '/user/dashboard', icon: LayoutDashboard },
    { label: '+ Report Issue', href: '/user/report', icon: PlusCircle, highlight: true },
    { label: 'My Reports', href: '/user/issues', icon: FileText },
    { label: 'Eco-Bounty Hub', href: '/user/eco-bounty', icon: Trophy, badge: '1,240 pts' },
    { label: 'Green Assistant', href: '/user/assistant', icon: Bot, badge: 'AI' },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-[#E5EBE5] min-h-screen p-4 justify-between sticky top-0 h-screen z-20">
      <div>
        {/* Brand Header */}
        <div className="pb-5 pt-2 border-b border-gray-100 flex items-center justify-between">
          <Logo showTagline={false} />
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            Student
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="mt-6 space-y-1.5">
          <div className="px-3 pb-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Student Portal
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/user/dashboard' && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-[#DCFCE7] text-[#14532D] shadow-xs font-semibold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-[#16A34A]' : 'text-gray-400 group-hover:text-gray-600'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {item.badge}
                  </span>
                )}
                {item.highlight && !isActive && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Eco-Bounty Quick Callout */}
        <div className="mt-8 p-3.5 rounded-2xl bg-gradient-to-br from-[#F7FAF7] to-[#DCFCE7]/60 border border-emerald-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-[#16A34A]" />
              <span className="text-xs font-bold text-[#14532D]">Your Eco-Bounty</span>
            </div>
            <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
              1,240 pts
            </span>
          </div>
          <p className="text-[11px] text-gray-600 leading-relaxed">
            Report environmental issues on campus, verify with Gemini, and earn rewards!
          </p>
          <Link
            href="/user/eco-bounty"
            className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-bold text-[#16A34A] hover:text-[#14532D]"
          >
            View Leaderboard & Badges <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* User Profile & Logout */}
      <div className="pt-4 border-t border-gray-100 space-y-2">
        <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50 border border-gray-100">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#16A34A] text-white flex items-center justify-center font-bold text-xs shrink-0">
              ER
            </div>
            <div className="min-w-0 truncate">
              <div className="text-xs font-bold text-gray-900 truncate">Elakkiyan R.</div>
              <div className="text-[10px] text-gray-500 truncate">CSE • Student Auditor</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOutIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
