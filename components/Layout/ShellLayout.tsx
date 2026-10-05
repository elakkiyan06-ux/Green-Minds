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

  // 2. Admin Portal routes: Dark professional management style
  if (pathname?.startsWith('/admin')) {
    return (
      <div className="flex min-h-screen bg-[#0A160F] text-gray-100 antialiased selection:bg-emerald-500 selection:text-black">
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

  // 3. User / Student Portal routes: Friendly, clean sustainability green theme
  return (
    <div className="flex min-h-screen bg-[#F7FAF7] text-[#172017] antialiased">
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
