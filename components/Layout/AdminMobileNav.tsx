'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileSpreadsheet, 
  AlertTriangle, 
  BarChart3, 
  Users 
} from 'lucide-react';

export default function AdminMobileNav() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Issues', href: '/admin/issues', icon: FileSpreadsheet },
    { label: 'Recurring', href: '/admin/recurring-problems', icon: AlertTriangle },
    { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { label: 'Users', href: '/admin/users', icon: Users },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0F2015]/95 backdrop-blur-md border-t border-emerald-900/60 px-2 py-1.5 shadow-xl text-gray-300">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-1 px-2 rounded-lg text-[11px] font-medium transition-colors ${
                isActive
                  ? 'text-emerald-400 font-black'
                  : 'text-emerald-200/60 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
