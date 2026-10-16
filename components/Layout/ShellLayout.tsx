'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import UserSidebar from './UserSidebar';
import UserHeader from './UserHeader';
import UserMobileNav from './UserMobileNav';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import AdminMobileNav from './AdminMobileNav';

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // 1. Standalone auth pages: Clean canvas without sidebars or headers
  if (pathname === '/login' || pathname === '/admin/login') {
    return <>{children}</>;
  }

  // 2. Admin Portal routes: Clean white student portal theme with emerald accents
  if (pathname?.startsWith('/admin')) {
    return (
      <div className="flex min-h-screen bg-[#F8FAF8] text-gray-900 antialiased selection:bg-[#16A34A] selection:text-white">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
          <AdminHeader />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
        <AdminMobileNav />
      </div>
    );
  }

  // 3. User / Student Portal routes: Clean white student portal theme with emerald accents
  return (
    <div className="flex min-h-screen bg-[#F8FAF8] text-gray-900 antialiased selection:bg-[#16A34A] selection:text-white">
      <UserSidebar />
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        <UserHeader />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
      <UserMobileNav />
    </div>
  );
}
