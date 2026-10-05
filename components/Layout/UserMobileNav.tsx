'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  PlusCircle, 
  FileText, 
  Bot, 
  Trophy 
} from 'lucide-react';

export default function UserMobileNav() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/user/dashboard', icon: LayoutDashboard },
    { label: 'My Reports', href: '/user/issues', icon: FileText },
    { label: 'Report', href: '/user/report', icon: PlusCircle, isMain: true },
    { label: 'Bounty', href: '/user/eco-bounty', icon: Trophy },
    { label: 'Assistant', href: '/user/assistant', icon: Bot },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5EBE5] px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/user/dashboard' && pathname?.startsWith(item.href));

          if (item.isMain) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center -mt-5 group focus:outline-none"
              >
                <div className="w-12 h-12 rounded-full bg-[#16A34A] text-white flex items-center justify-center shadow-lg shadow-green-700/30 group-hover:scale-105 transition-transform duration-150">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-[#14532D] mt-1">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-1 px-2 rounded-lg text-[11px] font-medium transition-colors ${
                isActive
                  ? 'text-[#16A34A] font-bold'
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
