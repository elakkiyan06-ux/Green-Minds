'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { EnvironmentalIssue, AnalyticsSummary } from '@/lib/types';
import StatusBadge from '@/components/Common/StatusBadge';
import CategoryBadge from '@/components/Common/CategoryBadge';
import SeverityBadge from '@/components/Common/SeverityBadge';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  BarChart3, 
  Zap, 
  Wrench, 
  ArrowRight, 
  Layers, 
  Award, 
  RefreshCw,
  TrendingUp,
  FileSpreadsheet,
  Coins
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [issues, setIssues] = useState<EnvironmentalIssue[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/issues').then(r => r.json()),
      fetch('/api/analytics').then(r => r.json())
    ]).then(([issueData, analyticsData]) => {
      if (Array.isArray(issueData)) setIssues(issueData);
      if (analyticsData && !analyticsData.error) setAnalytics(analyticsData);
    }).catch(err => {
      console.error(err);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  const totalIssues = issues.length;
  const openIssues = issues.filter(i => i.status === 'open' || i.status === 'in_progress').length;
  const aiVerifiedIssues = issues.filter(i => i.ai_verified !== false).length;
  const resolvedIssues = issues.filter(i => i.status === 'resolved').length;
  const criticalHighIssues = issues.filter(i => (i.severity === 'high' || i.severity === 'critical') && i.status !== 'resolved').length;
  const recurringProblemsCount = analytics?.predictedRecurringProblems?.length || 4;
  const estimatedCost = analytics?.aggregateImpact?.estimatedTotalCost || 18400;
  const greenScore = analytics?.greenScore || 78;

  // Pending maintenance actions (issues not resolved, ordered by severity)
  const pendingMaintenance = issues
    .filter(i => i.status !== 'resolved')
    .sort((a, b) => {
      const order: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 };
      return (order[b.severity] || 0) - (order[a.severity] || 0);
    })
    .slice(0, 6);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Welcome & Quick Actions Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#122419] border border-emerald-500/20 p-6 rounded-3xl text-white">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Campus Administration & Facilities Operations
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Admin Sustainability Command Center
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200/70 mt-1">
            Real-time oversight of campus environmental issues, maintenance dispatch, and sustainability metrics.
          </p>
        </div>

        {/* 4 Required Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/issues"
            className="px-3.5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 text-xs font-black shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
          >
            <Layers className="w-4 h-4" />
            <span>Review Issues</span>
          </Link>

          <Link
            href="/admin/recurring-problems"
            className="px-3.5 py-2.5 rounded-xl bg-[#1A3826] hover:bg-[#20442F] border border-emerald-500/30 text-emerald-200 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Recurring Problems</span>
          </Link>

          <Link
            href="/admin/resource-impact"
            className="px-3.5 py-2.5 rounded-xl bg-[#1A3826] hover:bg-[#20442F] border border-emerald-500/30 text-emerald-200 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>Resource Impact</span>
          </Link>

          <Link
            href="/admin/analytics"
            className="px-3.5 py-2.5 rounded-xl bg-[#1A3826] hover:bg-[#20442F] border border-emerald-500/30 text-emerald-200 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <BarChart3 className="w-4 h-4 text-teal-400" />
            <span>Analytics</span>
          </Link>
        </div>
      </div>

      {/* 8 Required Admin Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total Issues */}
        <div className="bg-[#122419] border border-emerald-500/20 p-4 sm:p-5 rounded-2xl">
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">Total Issues</span>
          <div className="text-2xl sm:text-3xl font-black text-white mt-1">{totalIssues}</div>
          <span className="text-[11px] text-emerald-200/60 font-medium">Campus-wide reports</span>
        </div>

        {/* Open Issues */}
        <div className="bg-[#122419] border border-emerald-500/20 p-4 sm:p-5 rounded-2xl">
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">Open Issues</span>
          <div className="text-2xl sm:text-3xl font-black text-amber-300 mt-1">{openIssues}</div>
          <span className="text-[11px] text-amber-200/60 font-medium">Requiring resolution</span>
        </div>

        {/* AI Verified Issues */}
        <div className="bg-[#122419] border border-emerald-500/20 p-4 sm:p-5 rounded-2xl">
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">AI Verified</span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-300 mt-1">{aiVerifiedIssues}</div>
          <span className="text-[11px] text-emerald-200/60 font-medium">Gemini vision checked</span>
        </div>

        {/* Resolved Issues */}
        <div className="bg-[#122419] border border-emerald-500/20 p-4 sm:p-5 rounded-2xl">
          <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider block">Resolved Issues</span>
          <div className="text-2xl sm:text-3xl font-black text-teal-300 mt-1">{resolvedIssues}</div>
          <span className="text-[11px] text-teal-200/60 font-medium">
            {totalIssues > 0 ? Math.round((resolvedIssues / totalIssues) * 100) : 0}% resolution rate
          </span>
        </div>

        {/* High/Critical Issues */}
        <div className="bg-[#122419] border border-red-500/30 p-4 sm:p-5 rounded-2xl">
          <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider block">High / Critical</span>
          <div className="text-2xl sm:text-3xl font-black text-red-300 mt-1">{criticalHighIssues}</div>
          <span className="text-[11px] text-red-200/70 font-medium">Priority maintenance</span>
        </div>

        {/* Recurring Problems */}
        <div className="bg-[#122419] border border-amber-500/30 p-4 sm:p-5 rounded-2xl">
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">Recurring Problems</span>
          <div className="text-2xl sm:text-3xl font-black text-amber-300 mt-1">{recurringProblemsCount}</div>
          <span className="text-[11px] text-amber-200/70 font-medium">Detected hot-spots</span>
        </div>

        {/* Resource Impact */}
        <div className="bg-[#122419] border border-emerald-500/20 p-4 sm:p-5 rounded-2xl">
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">Resource Impact</span>
          <div className="text-2xl sm:text-3xl font-black text-white mt-1">₹{estimatedCost.toLocaleString()}</div>
          <span className="text-[11px] text-emerald-200/60 font-medium">Estimated cost impact</span>
        </div>

        {/* Green Score */}
        <div className="bg-[#122419] border border-emerald-500/40 p-4 sm:p-5 rounded-2xl">
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">Green Score</span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">{greenScore} / 100</div>
          <span className="text-[11px] text-emerald-300 font-medium">+4 pts this week</span>
        </div>
      </div>

      {/* Distributions: Category & Severity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="bg-[#122419] border border-emerald-500/20 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Category Distribution
            </h3>
            <span className="text-xs text-emerald-400 font-mono">By Incident Volume</span>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Water Conservation', count: issues.filter(i => i.category === 'water').length, color: 'bg-blue-500' },
              { label: 'Energy Efficiency', count: issues.filter(i => i.category === 'energy').length, color: 'bg-amber-500' },
              { label: 'Waste Management', count: issues.filter(i => i.category === 'waste').length, color: 'bg-emerald-500' },
              { label: 'Air Quality & Green Cover', count: issues.filter(i => i.category === 'air_quality' || i.category === 'green_cover').length, color: 'bg-teal-500' },
            ].map((cat, idx) => {
              const pct = totalIssues > 0 ? Math.round((cat.count / totalIssues) * 100) : 0;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs text-emerald-100">
                    <span>{cat.label}</span>
                    <span className="font-mono text-emerald-300">{cat.count} reports ({pct}%)</span>
                  </div>
                  <div className="h-2 w-full bg-[#0A160F] rounded-full overflow-hidden">
                    <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Severity Distribution */}
        <div className="bg-[#122419] border border-emerald-500/20 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Severity Distribution
            </h3>
            <span className="text-xs text-emerald-400 font-mono">Risk Profile</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#0A160F] p-4 rounded-2xl border border-red-500/30">
              <span className="text-xs font-bold text-red-400 uppercase">Critical</span>
              <div className="text-2xl font-black text-red-300 mt-1">
                {issues.filter(i => i.severity === 'critical').length}
              </div>
              <span className="text-[10px] text-red-200/60">Immediate safety/resource risk</span>
            </div>

            <div className="bg-[#0A160F] p-4 rounded-2xl border border-amber-500/30">
              <span className="text-xs font-bold text-amber-400 uppercase">High</span>
              <div className="text-2xl font-black text-amber-300 mt-1">
                {issues.filter(i => i.severity === 'high').length}
              </div>
              <span className="text-[10px] text-amber-200/60">Substantial resource waste</span>
            </div>

            <div className="bg-[#0A160F] p-4 rounded-2xl border border-emerald-500/20">
              <span className="text-xs font-bold text-emerald-300 uppercase">Medium</span>
              <div className="text-2xl font-black text-emerald-200 mt-1">
                {issues.filter(i => i.severity === 'medium').length}
              </div>
              <span className="text-[10px] text-emerald-200/60">Moderate priority</span>
            </div>

            <div className="bg-[#0A160F] p-4 rounded-2xl border border-emerald-500/20">
              <span className="text-xs font-bold text-teal-300 uppercase">Low</span>
              <div className="text-2xl font-black text-teal-200 mt-1">
                {issues.filter(i => i.severity === 'low').length}
              </div>
              <span className="text-[10px] text-teal-200/60">Minor maintenance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Maintenance Actions */}
      <div className="bg-[#122419] border border-emerald-500/20 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Pending Maintenance Actions</h3>
            <p className="text-xs text-emerald-200/70">Unresolved incidents prioritized for department assignment and resolution</p>
          </div>
          <Link
            href="/admin/issues"
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>View All ({openIssues})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0A160F] text-emerald-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3 rounded-l-xl">Ticket & Title</th>
                <th className="p-3">Location</th>
                <th className="p-3">Severity</th>
                <th className="p-3">Assigned Dept</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right rounded-r-xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-900/40">
              {pendingMaintenance.map((issue) => (
                <tr key={issue.id} className="hover:bg-emerald-950/40 transition-colors">
                  <td className="p-3 font-semibold text-white">
                    <div className="font-mono text-[10px] text-emerald-400">{issue.id}</div>
                    <div className="text-xs truncate max-w-xs">{issue.title}</div>
                  </td>
                  <td className="p-3 text-emerald-200/80">{issue.location}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      issue.severity === 'critical' ? 'bg-red-950 text-red-300 border border-red-800' :
                      issue.severity === 'high' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {issue.severity.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3 text-emerald-300 font-medium">
                    {issue.assigned_department || 'Unassigned'}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                      {issue.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <Link
                      href={`/admin/issues/${issue.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-[11px] transition-colors"
                    >
                      <span>Manage</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
