import React from 'react';
import { SeverityLevel } from '@/lib/types';
import { AlertCircle, AlertTriangle, ShieldCheck, Flame } from 'lucide-react';

interface SeverityBadgeProps {
  severity: SeverityLevel | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | string;
  size?: 'sm' | 'md' | 'lg';
}

export default function SeverityBadge({ severity, size = 'sm' }: SeverityBadgeProps) {
  const norm = (severity || 'medium').toLowerCase();

  const styles: Record<string, { bg: string; text: string; border: string; icon: React.ReactNode; label: string }> = {
    low: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      icon: <ShieldCheck className="w-3.5 h-3.5" />,
      label: 'LOW'
    },
    medium: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      icon: <AlertTriangle className="w-3.5 h-3.5" />,
      label: 'MEDIUM'
    },
    high: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
      icon: <AlertCircle className="w-3.5 h-3.5" />,
      label: 'HIGH'
    },
    critical: {
      bg: 'bg-rose-950',
      text: 'text-rose-100',
      border: 'border-rose-800',
      icon: <Flame className="w-3.5 h-3.5 text-rose-300" />,
      label: 'CRITICAL'
    }
  };

  const current = styles[norm] || styles.medium;
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-semibold',
    lg: 'px-3 py-1.5 text-sm font-bold'
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-md border tracking-wide uppercase ${current.bg} ${current.text} ${current.border} ${sizeClasses}`}
    >
      {current.icon}
      <span>{current.label}</span>
    </span>
  );
}
