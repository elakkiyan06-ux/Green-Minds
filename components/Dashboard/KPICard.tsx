import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtext?: string;
  change?: string;
  isPositiveChange?: boolean;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
}

export default function KPICard({
  title,
  value,
  subtext,
  change,
  isPositiveChange = true,
  icon: Icon,
  iconColor = 'text-[#16A34A]',
  iconBg = 'bg-[#DCFCE7]',
}: KPICardProps) {
  return (
    <div className="bg-white rounded-xl p-5 border border-[#E5EBE5] shadow-xs hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {title}
        </span>
        <div className={`p-2.5 rounded-lg ${iconBg} ${iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          {value}
        </span>
      </div>

      <div className="mt-2 flex items-center justify-between text-xs">
        {change && (
          <span
            className={`font-semibold flex items-center gap-1 ${
              isPositiveChange ? 'text-emerald-700' : 'text-amber-700'
            }`}
          >
            {isPositiveChange ? '↑' : '↓'} {change}
          </span>
        )}
        {subtext && (
          <span className="text-gray-500 font-medium">
            {subtext}
          </span>
        )}
      </div>
    </div>
  );
}
