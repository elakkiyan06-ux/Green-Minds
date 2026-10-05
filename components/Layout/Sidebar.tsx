'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/components/Common/Logo';
import { 
  LayoutDashboard, 
  PlusCircle, 
  FileSpreadsheet, 
  Bot, 
  BarChart3, 
  Settings,
  Sparkles,
  ExternalLink,
  Trophy,
  Coins
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Report Issue', href: '/report', icon: PlusCircle, highlight: true },
    { label: 'Issues', href: '/issues', icon: FileSpreadsheet },
    { label: 'Green Assistant', href: '/assistant', icon: Bot, badge: 'AI' },
    { label: 'Eco-Bounty', href: '/eco-bounty', icon: Trophy, badge: '1,240 pts' },
    { label: 'Analytics', href: '/analytics', icon: BarChart3 },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-[#E5EBE5] min-h-screen p-4 justify-between sticky top-0 h-screen z-20">
      <div>
        {/* Brand Header */}
        <div className="pb-6 pt-2 border-b border-gray-100">
          <Logo showTagline={false} />
        </div>

        {/* Navigation Items */}
        <nav className="mt-6 space-y-1.5">
          <div className="px-3 pb-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-[#DCFCE7] text-[#14532D] shadow-sm font-semibold'
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

        {/* Eco-Bounty Quick Callout Card */}
        <div className="mt-8 p-3.5 rounded-xl bg-gradient-to-br from-[#F7FAF7] to-[#DCFCE7]/60 border border-emerald-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-[#16A34A]" />
              <span className="text-xs font-bold text-[#14532D]">Eco-Bounty</span>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
              Active
            </span>
          </div>
          <p className="text-[11px] text-gray-600 leading-relaxed">
            Spot resource waste, let AI verify it, and earn Eco Points for verified reports.
          </p>
          <Link
            href="/eco-bounty"
            className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-bold text-[#16A34A] hover:text-[#14532D]"
          >
            Open Eco-Bounty Hub <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Bottom Settings & Status */}
      <div className="pt-4 border-t border-gray-100 space-y-2">
        <Link
          href="/settings"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            pathname === '/settings'
              ? 'bg-[#DCFCE7] text-[#14532D] font-semibold'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <Settings className="w-4 h-4 text-gray-400" />
          <span>Settings</span>
        </Link>

        {/* Demo Mode Badge */}
        <div className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-between text-xs">
          <span className="text-gray-500 font-medium">Status</span>
          <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Demo Mode
          </span>
        </div>
      </div>
    </aside>
  );
}
