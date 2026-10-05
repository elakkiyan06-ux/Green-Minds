'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Logo from '@/components/Common/Logo';
import { 
  LayoutDashboard, 
  FileSpreadsheet, 
  AlertTriangle, 
  Zap, 
  BarChart3, 
  Users, 
  Settings, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

const LogOutIcon = ({ className }: { className?: string }) => (
  <svg className={className || "w-4 h-4"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export default function AdminSidebar() {
  const pathname = usePathname();
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

  const navItems = [
    { label: 'Admin Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Environmental Issues', href: '/admin/issues', icon: FileSpreadsheet, badge: 'All Reports' },
    { label: 'Recurring Problems', href: '/admin/recurring-problems', icon: AlertTriangle, highlight: true },
    { label: 'Resource Impact', href: '/admin/resource-impact', icon: Zap },
    { label: 'Campus Analytics', href: '/admin/analytics', icon: BarChart3 },
    { label: 'Campus Users', href: '/admin/users', icon: Users },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-[#0F2015] border-r border-emerald-900/40 text-gray-200 min-h-screen p-4 justify-between sticky top-0 h-screen z-20">
      <div>
        {/* Brand Header */}
        <div className="pb-5 pt-2 border-b border-emerald-900/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-black text-white tracking-wide">GREENMIND</div>
              <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Admin Portal</div>
            </div>
          </div>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
            Admin
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="mt-6 space-y-1.5">
          <div className="px-3 pb-2 text-[11px] font-bold text-emerald-500/70 uppercase tracking-wider">
            Management & Operations
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-emerald-500 text-gray-950 shadow-md shadow-emerald-500/20 font-bold'
                    : 'text-emerald-100/80 hover:text-white hover:bg-emerald-900/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-gray-950' : 'text-emerald-400/70'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && !isActive && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    {item.badge}
                  </span>
                )}
                {item.highlight && !isActive && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Operational Scope Card */}
        <div className="mt-8 p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-800/40">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Telemetry
            </span>
            <span className="text-[10px] font-mono text-emerald-400">RBAC Active</span>
          </div>
          <p className="text-[11px] text-emerald-200/70 leading-relaxed">
            Full permissions to review issues, assign maintenance departments, and update incident statuses.
          </p>
        </div>
      </div>

      {/* Settings & Admin Profile */}
      <div className="pt-4 border-t border-emerald-900/50 space-y-2">
        <Link
          href="/admin/settings"
          className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
            pathname === '/admin/settings'
              ? 'bg-emerald-500 text-gray-950 font-bold'
              : 'text-emerald-200/80 hover:text-white hover:bg-emerald-900/40'
          }`}
        >
          <Settings className="w-4 h-4 text-emerald-400/70" />
          <span>System Settings</span>
        </Link>

        {/* Admin Profile & Logout */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/90 border border-emerald-800/40">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-gray-950 flex items-center justify-center font-black text-xs shrink-0">
              AT
            </div>
            <div className="min-w-0 truncate">
              <div className="text-xs font-bold text-white truncate">Dr. Aris Thorne</div>
              <div className="text-[10px] text-emerald-400/80 truncate">Campus Administrator</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log Out of Admin Portal"
            className="p-1.5 rounded-lg text-emerald-400 hover:text-red-400 hover:bg-red-950/40 transition-colors"
          >
            <LogOutIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
