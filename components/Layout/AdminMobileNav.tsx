'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileSpreadsheet, 
  AlertTriangle, 
  BarChart3, 
  Users,
  Calculator 
} from 'lucide-react';

export default function AdminMobileNav() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Issues', href: '/admin/issues', icon: FileSpreadsheet },
    { label: 'Budget', href: '/admin/budget-planner', icon: Calculator },
    { label: 'Recurring', href: '/admin/recurring-problems', icon: AlertTriangle },
    { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { label: 'Users', href: '/admin/users', icon: Users },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5EBE5] px-2 py-1.5 shadow-lg text-gray-600">
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
                  ? 'text-[#16A34A] font-black'
                  : 'text-gray-500 hover:text-gray-900'
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
