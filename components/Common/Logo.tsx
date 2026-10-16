import React from 'react';
import Link from 'next/link';

interface LogoProps {
  collapsed?: boolean;
  showTagline?: boolean;
  href?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ 
  collapsed = false, 
  showTagline = false,
  href = '/dashboard',
  className = '',
  size = 'md'
}: LogoProps) {
  const iconDimensions = size === 'lg' ? 'w-14 h-14' : size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';

  return (
    <Link href={href} className={`flex items-center gap-3 group focus:outline-none ${className}`}>
      {/* Official Uploaded GreenMind Logo */}
      <div className={`relative flex items-center justify-center ${iconDimensions} rounded-2xl overflow-hidden bg-white border border-[#E5EBE5] shadow-xs group-hover:scale-105 transition-transform duration-200 shrink-0`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/greenmind-logo.png"
          alt="GREENMIND AI Campus Assist Logo"
          className="w-full h-full object-cover"
        />
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#16A34A]"></span>
        </span>
      </div>

      {!collapsed && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xl tracking-tight text-[#14532D]">
              GREEN<span className="text-[#16A34A]">MIND</span>
            </span>
          </div>
          <span className="text-xs text-gray-500 font-medium tracking-tight">
            AI Green Campus Assistant
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
