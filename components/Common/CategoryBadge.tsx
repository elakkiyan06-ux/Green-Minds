import React from 'react';
import { EnvironmentalCategory } from '@/lib/types';
import { Trash2, Droplet, Zap, Wind, Trees, ShieldAlert, Layers } from 'lucide-react';

interface CategoryBadgeProps {
  category: EnvironmentalCategory | string;
}

export default function CategoryBadge({ category }: CategoryBadgeProps) {
  const norm = (category || 'other').toLowerCase();

  const config: Record<string, { label: string; icon: React.ReactNode; bg: string; text: string; border: string }> = {
    waste: {
      label: 'Waste Management',
      icon: <Trash2 className="w-3.5 h-3.5" />,
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200'
    },
    'waste management': {
      label: 'Waste Management',
      icon: <Trash2 className="w-3.5 h-3.5" />,
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200'
    },
    water: {
      label: 'Water Conservation',
      icon: <Droplet className="w-3.5 h-3.5" />,
      bg: 'bg-blue-50',
      text: 'text-blue-800',
      border: 'border-blue-200'
    },
    'water conservation': {
      label: 'Water Conservation',
      icon: <Droplet className="w-3.5 h-3.5" />,
      bg: 'bg-blue-50',
      text: 'text-blue-800',
      border: 'border-blue-200'
    },
    energy: {
      label: 'Energy Efficiency',
      icon: <Zap className="w-3.5 h-3.5" />,
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200'
    },
    'energy efficiency': {
      label: 'Energy Efficiency',
      icon: <Zap className="w-3.5 h-3.5" />,
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200'
    },
    plastic: {
      label: 'Plastic Pollution',
      icon: <ShieldAlert className="w-3.5 h-3.5" />,
      bg: 'bg-rose-50',
      text: 'text-rose-800',
      border: 'border-rose-200'
    },
    'plastic pollution': {
      label: 'Plastic Pollution',
      icon: <ShieldAlert className="w-3.5 h-3.5" />,
      bg: 'bg-rose-50',
      text: 'text-rose-800',
      border: 'border-rose-200'
    },
    green_cover: {
      label: 'Green Cover',
      icon: <Trees className="w-3.5 h-3.5" />,
      bg: 'bg-teal-50',
      text: 'text-teal-800',
      border: 'border-teal-200'
    },
    'green cover': {
      label: 'Green Cover',
      icon: <Trees className="w-3.5 h-3.5" />,
      bg: 'bg-teal-50',
      text: 'text-teal-800',
      border: 'border-teal-200'
    },
    air_quality: {
      label: 'Air Quality',
      icon: <Wind className="w-3.5 h-3.5" />,
      bg: 'bg-indigo-50',
      text: 'text-indigo-800',
      border: 'border-indigo-200'
    },
    'air quality': {
      label: 'Air Quality',
      icon: <Wind className="w-3.5 h-3.5" />,
      bg: 'bg-indigo-50',
      text: 'text-indigo-800',
      border: 'border-indigo-200'
    },
    other: {
      label: 'Other',
      icon: <Layers className="w-3.5 h-3.5" />,
      bg: 'bg-gray-50',
      text: 'text-gray-800',
      border: 'border-gray-200'
    }
  };

  const current = config[norm] || config.other;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${current.bg} ${current.text} ${current.border}`}
    >
      {current.icon}
      <span>{current.label}</span>
    </span>
  );
}
