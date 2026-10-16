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
  CheckCircle2,
  Calculator
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
    { label: 'Environmental Issues', href: '/admin/issues', icon: FileSpreadsheet },
    { label: 'Recurring Problems', href: '/admin/recurring-problems', icon: AlertTriangle, highlight: true },
    { label: 'Resource Impact', href: '/admin/resource-impact', icon: Zap },
    { label: 'Budget Planner', href: '/admin/budget-planner', icon: Calculator, badge: 'AI Plan' },
    { label: 'Campus Analytics', href: '/admin/analytics', icon: BarChart3 },
    { label: 'Campus Users', href: '/admin/users', icon: Users },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-[#E5EBE5] text-gray-800 min-h-screen p-4 justify-between sticky top-0 h-screen z-20 shadow-xs">
      <div>
        {/* Brand Header */}
        <div className="pb-5 pt-2 border-b border-gray-100 flex items-center justify-between">
          <Logo href="/admin/dashboard" showTagline={false} size="sm" />
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            Admin
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="mt-6 space-y-1.5">
          <div className="px-3 pb-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Management & Operations
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-[#16A34A] text-white shadow-sm font-bold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-[#F2F7F2]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-white' : 'text-gray-400 group-hover:text-[#16A34A]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && !isActive && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {item.badge}
                  </span>
                )}
                {item.highlight && !isActive && (
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Operational Scope Card */}
        <div className="mt-8 p-3.5 rounded-2xl bg-[#F7FAF7] border border-[#E5EBE5]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
              Live Telemetry
            </span>
            <span className="text-[10px] font-mono font-bold text-[#16A34A]">RBAC Active</span>
          </div>
          <p className="text-[11px] text-gray-500 leading-relaxed">
            Full permissions to review issues, assign maintenance departments, and update incident statuses.
          </p>
        </div>
      </div>

      {/* Settings & Admin Profile */}
      <div className="pt-4 border-t border-gray-100 space-y-2">
        <Link
          href="/admin/settings"
          className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
            pathname === '/admin/settings'
              ? 'bg-[#16A34A] text-white font-bold'
              : 'text-gray-600 hover:text-gray-900 hover:bg-[#F2F7F2]'
          }`}
        >
          <Settings className="w-4 h-4 text-gray-400" />
          <span>System Settings</span>
        </Link>

        {/* Admin Profile & Logout */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-200">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#16A34A] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
              AT
            </div>
            <div className="min-w-0 truncate">
              <div className="text-xs font-bold text-gray-900 truncate">Dr. Aris Thorne</div>
              <div className="text-[10px] text-gray-500 truncate">Campus Administrator</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log Out of Admin Portal"
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOutIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
