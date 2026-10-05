'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/Common/Logo';
import { Bell, Plus, Sparkles, User, Check, Shield } from 'lucide-react';

export default function Header() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);

  const notifications = [
    {
      id: 1,
      title: 'Water Leakage Alert',
      desc: 'Boys Hostel Wing B report elevated to HIGH severity.',
      time: '12m ago',
      unread: true
    },
    {
      id: 2,
      title: 'Waste Bin Capacity Warning',
      desc: 'Block 3 waste bin is near capacity.',
      time: '28m ago',
      unread: true
    },
    {
      id: 3,
      title: 'Green Score Update',
      desc: 'Campus score improved to 78 (+4 points this week).',
      time: '2h ago',
      unread: false
    }
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E5EBE5] px-4 lg:px-8 py-3.5 transition-all">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left: Mobile Logo & Tagline */}
        <div className="flex items-center gap-4">
          <div className="lg:hidden">
            <Logo showTagline={false} />
          </div>

          <div className="hidden md:flex flex-col">
            <span className="text-xs font-semibold text-[#14532D] tracking-wide flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#16A34A]" />
              AI-Powered Campus Sustainability
            </span>
            <span className="text-[11px] text-gray-500 italic">
              &quot;From Campus Problems to Sustainable Actions.&quot;
            </span>
          </div>
        </div>

        {/* Right Action Icons & User */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Demo Mode Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#DCFCE7] border border-green-200 text-xs font-semibold text-[#14532D]">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
            Demo Mode Active
          </div>

          {/* Quick Report Button */}
          <Link
            href="/report"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#16A34A] hover:bg-[#14532D] text-white text-xs sm:text-sm font-semibold shadow-sm shadow-green-700/20 transition-all duration-150"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden xs:inline">Report Issue</span>
          </Link>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (unreadCount > 0) setUnreadCount(0);
              }}
              className="relative p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors focus:outline-none"
              title="Campus Environmental Alerts"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white shadow-xl border border-gray-100 p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100">
                  <span className="font-bold text-sm text-gray-900">Campus Alerts</span>
                  <span className="text-[11px] text-gray-500">Real-time alerts</span>
                </div>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-lg text-xs transition-colors ${
                        n.unread ? 'bg-emerald-50/60 border border-emerald-100' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-gray-900">{n.title}</span>
                        <span className="text-[10px] text-gray-400">{n.time}</span>
                      </div>
                      <p className="text-gray-600 leading-snug">{n.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-2 pt-2 border-t border-gray-100 text-center">
                  <Link
                    href="/issues"
                    onClick={() => setShowNotifications(false)}
                    className="text-xs font-semibold text-[#16A34A] hover:underline"
                  >
                    View All Active Issues
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
            <div className="w-8 h-8 rounded-full bg-[#14532D] text-white flex items-center justify-center font-bold text-xs shadow-inner">
              GM
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-bold text-gray-900 leading-tight">Campus Admin</span>
              <span className="text-[10px] text-gray-500">Sustainability Cell</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
