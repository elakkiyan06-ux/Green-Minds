import React from 'react';
import { IssueStatus } from '@/lib/types';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: IssueStatus | string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const norm = (status || 'open').toLowerCase();

  const config: Record<string, { label: string; bg: string; text: string; border: string; icon: React.ReactNode }> = {
    open: {
      label: 'Open',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      icon: <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
    },
    in_progress: {
      label: 'In Progress',
      bg: 'bg-blue-50',
      text: 'text-blue-800',
      border: 'border-blue-200',
      icon: <Clock className="w-3.5 h-3.5 text-blue-600" />
    },
    resolved: {
      label: 'Resolved',
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
    }
  };

  const curr = config[norm] || config.open;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${curr.bg} ${curr.text} ${curr.border}`}
    >
      {curr.icon}
      <span>{curr.label}</span>
    </span>
  );
}
