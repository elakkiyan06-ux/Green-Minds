'use client';

import React, { useState } from 'react';
import { AnalyticsSummary } from '@/lib/types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
  Legend
} from 'recharts';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  TrendingUp, 
  Sparkles, 
  RefreshCw,
  Award,
  Layers,
  ShieldCheck
} from 'lucide-react';

interface AnalyticsChartsProps {
  data: AnalyticsSummary;
  onRefreshInsight?: () => void;
  isRefreshingInsight?: boolean;
  initialAiInsight?: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  waste: '#16A34A',
  water: '#2563EB',
  energy: '#F59E0B',
  plastic: '#DC2626',
  green_cover: '#0D9488',
  air_quality: '#6366F1',
  other: '#9CA3AF',
};

const SEVERITY_COLORS: Record<string, string> = {
  Low: '#10B981',
  Medium: '#F59E0B',
  High: '#EF4444',
  Critical: '#991B1B',
};

const STATUS_COLORS: Record<string, string> = {
  Resolved: '#16A34A',
  'In Progress': '#2563EB',
  Open: '#F59E0B',
};

export default function AnalyticsCharts({
  data,
  onRefreshInsight,
  isRefreshingInsight = false,
  initialAiInsight,
}: AnalyticsChartsProps) {
  const [insight, setInsight] = useState<string>(
    initialAiInsight ||
    'Waste-related incidents in Block 3 and plumbing leakages across the hostels represent the highest-priority operational concerns. Implementing proactive afternoon sanitation cycles and aerated faucet cartridges will yield the highest Green Score improvement.'
  );
  const [loadingInsight, setLoadingInsight] = useState(false);

  const handleRegenerateInsight = async () => {
    setLoadingInsight(true);
    try {
      const res = await fetch('/api/analytics/insight', { method: 'POST' });
      const json = await res.json();
      if (json.insight) {
        setInsight(json.insight);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingInsight(false);
    }
  };

  // Status donut data
  const statusData = [
    { name: 'Resolved', value: data.resolvedIssues, color: STATUS_COLORS.Resolved },
    { name: 'In Progress', value: data.inProgressIssues, color: STATUS_COLORS['In Progress'] },
    { name: 'Open', value: data.openIssues, color: STATUS_COLORS.Open },
  ];

  // Green Score breakdown bar data
  const scoreBreakdownData = [
    { name: 'Waste (25%)', score: data.scoreBreakdown.waste, fill: '#16A34A' },
    { name: 'Water (20%)', score: data.scoreBreakdown.water, fill: '#2563EB' },
    { name: 'Energy (20%)', score: data.scoreBreakdown.energy, fill: '#F59E0B' },
    { name: 'Green Cover (20%)', score: data.scoreBreakdown.greenCover, fill: '#0D9488' },
    { name: 'Resolution (15%)', score: data.scoreBreakdown.resolutionRate, fill: '#14532D' },
  ];

  return (
    <div className="space-y-8">
      {/* AI ANALYTICS INSIGHT CARD */}
      <div className="rounded-2xl bg-gradient-to-br from-[#14532D] via-[#166534] to-[#0F391E] p-6 text-white shadow-xl border border-emerald-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-200 border border-white/20 text-xs font-bold tracking-wider uppercase">
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>AI-GENERATED CAMPUS INSIGHT</span>
            </div>

            <p className="text-sm sm:text-base font-medium text-emerald-50 leading-relaxed">
              &quot;{insight}&quot;
            </p>

            <span className="text-[11px] text-emerald-300/80 block">
              Synthesized by Gemini 2.0 Flash from live aggregated campus database
            </span>
          </div>

          <div className="shrink-0">
            <button
              onClick={handleRegenerateInsight}
              disabled={loadingInsight || isRefreshingInsight}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-xs sm:text-sm font-semibold text-white backdrop-blur-sm transition-all duration-150 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loadingInsight ? 'animate-spin' : ''}`} />
              <span>{loadingInsight ? 'Synthesizing...' : 'Regenerate Insight'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid of 4 Core Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Issues by Category */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5EBE5] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-sm text-gray-900 tracking-wider uppercase">
                Issues by Category
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Distribution of reports across environmental sectors
              </p>
            </div>
            <div className="p-2 rounded-lg bg-emerald-50 text-[#16A34A]">
              <Layers className="w-4 h-4" />
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.categoryCounts} layout="vertical" margin={{ left: 10, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="label" type="category" width={110} tick={{ fontSize: 10, fill: '#4B5563' }} />
                <Tooltip
                  formatter={(value: any) => [`${value} incidents`, 'Reports']}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {data.categoryCounts.map((entry) => (
                    <Cell key={entry.category} fill={CATEGORY_COLORS[entry.category] || '#16A34A'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Issues by Severity */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5EBE5] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-sm text-gray-900 tracking-wider uppercase">
                Issues by Severity
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Priority allocation matrix
              </p>
            </div>
            <div className="p-2 rounded-lg bg-red-50 text-red-600">
              <PieIcon className="w-4 h-4" />
            </div>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.severityCounts}
                  dataKey="count"
                  nameKey="severity"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {data.severityCounts.map((entry) => (
                    <Cell key={entry.severity} fill={SEVERITY_COLORS[entry.severity] || entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any, name: any) => [`${value} issues`, `${name} Severity`]}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Weekly Issue Trend */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5EBE5] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-sm text-gray-900 tracking-wider uppercase">
                Weekly Issue Trend
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Reported incidents vs resolved actions (7-day timeline)
              </p>
            </div>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.weeklyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReported" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16A34A" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#16A34A" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Area type="monotone" dataKey="reported" name="New Reports" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorReported)" />
                <Area type="monotone" dataKey="resolved" name="Resolved" stroke="#16A34A" strokeWidth={2} fillOpacity={1} fill="url(#colorResolved)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Resolution Rate (Donut) */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5EBE5] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-sm text-gray-900 tracking-wider uppercase">
                Resolution Status
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Resolution progress ({data.resolutionRate}% completed)
              </p>
            </div>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                >
                  {statusData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any, name: any) => [`${value} issues`, name]}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Chart 5: Green Score Component Breakdown */}
      <div className="bg-white p-6 rounded-2xl border border-[#E5EBE5] shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-extrabold text-sm text-gray-900 tracking-wider uppercase">
              Green Score Component Scores (Formula Weights)
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Current performance per weighted evaluation vector (Target: 85+)
            </p>
          </div>
          <div className="p-2 rounded-lg bg-[#DCFCE7] text-[#14532D]">
            <Award className="w-4 h-4" />
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={scoreBreakdownData} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#374151' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(value: any) => [`${value} / 100`, 'Component Score']}
                contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
              />
              <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                {scoreBreakdownData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
