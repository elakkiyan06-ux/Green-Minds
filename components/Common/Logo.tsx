import React from 'react';
import Link from 'next/link';

interface LogoProps {
  collapsed?: boolean;
  showTagline?: boolean;
}

export default function Logo({ collapsed = false, showTagline = false }: LogoProps) {
  return (
    <Link href="/dashboard" className="flex items-center gap-3 group focus:outline-none">
      {/* Icon: Leaf + AI Spark + Connected Circle */}
      <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#16A34A] to-[#14532D] shadow-md shadow-green-900/20 group-hover:scale-105 transition-transform duration-200">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 text-white"
        >
          {/* Leaf outline */}
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
          {/* Leaf vein */}
          <path d="M2 21c0-3 1.85-5.36 5.08-6" />
          {/* AI Spark element */}
          <circle cx="15.5" cy="8.5" r="1.5" fill="#DCFCE7" stroke="none" />
        </svg>
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
      </div>

      {!collapsed && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xl tracking-tight text-[#14532D]">
              GREEN<span className="text-[#16A34A]">MIND</span>
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#DCFCE7] text-[#14532D] border border-green-200">
              Campus AI
            </span>
          </div>
          <span className="text-xs text-gray-500 font-medium">
            Green Campus Assistant
          </span>
          {showTagline && (
            <span className="text-[11px] text-emerald-700 italic mt-0.5 font-medium">
              &quot;From Campus Problems to Sustainable Actions.&quot;
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
