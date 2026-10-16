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
  Coins,
  Calculator,
  Sparkles
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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white border border-[#E5EBE5] p-6 rounded-3xl text-gray-900 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
            Campus Administration & Facilities Operations
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Admin Sustainability Command Center
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Real-time oversight of campus environmental issues, maintenance dispatch, and sustainability metrics.
          </p>
        </div>

        {/* 4 Required Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/issues"
            className="px-3.5 py-2.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
          >
            <Layers className="w-4 h-4" />
            <span>Review Issues</span>
          </Link>

          <Link
            href="/admin/recurring-problems"
            className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Recurring Problems</span>
          </Link>

          <Link
            href="/admin/resource-impact"
            className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <Zap className="w-4 h-4 text-[#16A34A]" />
            <span>Resource Impact</span>
          </Link>

          <Link
            href="/admin/budget-planner"
            className="px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <Calculator className="w-4 h-4 text-[#16A34A]" />
            <span>Budget Planner</span>
          </Link>

          <Link
            href="/admin/analytics"
            className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <BarChart3 className="w-4 h-4 text-teal-600" />
            <span>Analytics</span>
          </Link>
        </div>
      </div>

      {/* 8 Required Admin Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total Issues */}
        <div className="bg-white border border-[#E5EBE5] shadow-xs p-4 sm:p-5 rounded-2xl">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Total Issues</span>
          <div className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">{totalIssues}</div>
          <span className="text-[11px] text-gray-500 font-medium">Campus-wide reports</span>
        </div>

        {/* Open Issues */}
        <div className="bg-white border border-[#E5EBE5] shadow-xs p-4 sm:p-5 rounded-2xl">
          <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">Open Issues</span>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">{openIssues}</div>
          <span className="text-[11px] text-gray-500 font-medium">Requiring resolution</span>
        </div>

        {/* AI Verified Issues */}
        <div className="bg-white border border-[#E5EBE5] shadow-xs p-4 sm:p-5 rounded-2xl">
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">AI Verified</span>
          <div className="text-2xl sm:text-3xl font-black text-[#16A34A] mt-1">{aiVerifiedIssues}</div>
          <span className="text-[11px] text-gray-500 font-medium">Gemini vision checked</span>
        </div>

        {/* Resolved Issues */}
        <div className="bg-white border border-[#E5EBE5] shadow-xs p-4 sm:p-5 rounded-2xl">
          <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider block">Resolved Issues</span>
          <div className="text-2xl sm:text-3xl font-black text-teal-700 mt-1">{resolvedIssues}</div>
          <span className="text-[11px] text-gray-500 font-medium">
            {totalIssues > 0 ? Math.round((resolvedIssues / totalIssues) * 100) : 0}% resolution rate
          </span>
        </div>

        {/* High/Critical Issues */}
        <div className="bg-white border border-red-200 shadow-xs p-4 sm:p-5 rounded-2xl">
          <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider block">High / Critical</span>
          <div className="text-2xl sm:text-3xl font-black text-red-600 mt-1">{criticalHighIssues}</div>
          <span className="text-[11px] text-gray-500 font-medium">Priority maintenance</span>
        </div>

        {/* Recurring Problems */}
        <div className="bg-white border border-amber-200 shadow-xs p-4 sm:p-5 rounded-2xl">
          <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">Recurring Problems</span>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">{recurringProblemsCount}</div>
          <span className="text-[11px] text-gray-500 font-medium">Detected hot-spots</span>
        </div>

        {/* Resource Impact */}
        <div className="bg-white border border-[#E5EBE5] shadow-xs p-4 sm:p-5 rounded-2xl">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Resource Impact</span>
          <div className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">₹{estimatedCost.toLocaleString()}</div>
          <span className="text-[11px] text-gray-500 font-medium">Estimated cost impact</span>
        </div>

        {/* Green Score */}
        <div className="bg-white border border-emerald-200 shadow-xs p-4 sm:p-5 rounded-2xl">
          <span className="text-[11px] font-bold text-[#16A34A] uppercase tracking-wider block">Green Score</span>
          <div className="text-2xl sm:text-3xl font-black text-[#16A34A] mt-1">{greenScore} / 100</div>
          <span className="text-[11px] text-emerald-700 font-medium">+4 pts this week</span>
        </div>
      </div>

      {/* Sustainability Budget Planner Spotlight Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-white to-amber-50/50 border border-emerald-200/90 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white border border-emerald-300 text-[#16A34A] flex items-center justify-center shrink-0 shadow-xs">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#16A34A]">
              <Sparkles className="w-3.5 h-3.5" />
              NEW: Sustainability Budget Planner Active
            </div>
            <h3 className="text-base font-bold text-gray-900 mt-0.5">
              Optimize Campus Capital Allocation for Highest Environmental ROI
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Enter available budget (e.g., ₹50,000) to receive AI recommendations on water leak repairs, LED replacements, and waste infrastructure.
            </p>
          </div>
        </div>

        <Link
          href="/admin/budget-planner"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold shadow-xs transition-all shrink-0"
        >
          <span>Open Budget Planner</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Distributions: Category & Severity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="bg-white border border-[#E5EBE5] shadow-xs rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Category Distribution
            </h3>
            <span className="text-xs text-gray-500 font-mono">By Incident Volume</span>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Water Conservation', count: issues.filter(i => i.category === 'water').length, color: 'bg-blue-500' },
              { label: 'Energy Efficiency', count: issues.filter(i => i.category === 'energy').length, color: 'bg-amber-500' },
              { label: 'Waste Management', count: issues.filter(i => i.category === 'waste').length, color: 'bg-[#16A34A]' },
              { label: 'Air Quality & Green Cover', count: issues.filter(i => i.category === 'air_quality' || i.category === 'green_cover').length, color: 'bg-teal-500' },
            ].map((cat, idx) => {
              const pct = totalIssues > 0 ? Math.round((cat.count / totalIssues) * 100) : 0;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-700">
                    <span>{cat.label}</span>
                    <span className="font-mono text-gray-900 font-semibold">{cat.count} reports ({pct}%)</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Severity Distribution */}
        <div className="bg-white border border-[#E5EBE5] shadow-xs rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Severity Distribution
            </h3>
            <span className="text-xs text-gray-500 font-mono">Risk Profile</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-red-50/60 p-4 rounded-2xl border border-red-200">
              <span className="text-xs font-bold text-red-700 uppercase">Critical</span>
              <div className="text-2xl font-black text-red-600 mt-1">
                {issues.filter(i => i.severity === 'critical').length}
              </div>
              <span className="text-[10px] text-red-600/80">Immediate safety/resource risk</span>
            </div>

            <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200">
              <span className="text-xs font-bold text-amber-700 uppercase">High</span>
              <div className="text-2xl font-black text-amber-600 mt-1">
                {issues.filter(i => i.severity === 'high').length}
              </div>
              <span className="text-[10px] text-amber-600/80">Substantial resource waste</span>
            </div>

            <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200">
              <span className="text-xs font-bold text-emerald-800 uppercase">Medium</span>
              <div className="text-2xl font-black text-[#16A34A] mt-1">
                {issues.filter(i => i.severity === 'medium').length}
              </div>
              <span className="text-[10px] text-emerald-700/80">Moderate priority</span>
            </div>

            <div className="bg-teal-50/60 p-4 rounded-2xl border border-teal-200">
              <span className="text-xs font-bold text-teal-800 uppercase">Low</span>
              <div className="text-2xl font-black text-teal-700 mt-1">
                {issues.filter(i => i.severity === 'low').length}
              </div>
              <span className="text-[10px] text-teal-700/80">Minor maintenance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Maintenance Actions */}
      <div className="bg-white border border-[#E5EBE5] shadow-xs rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900">Pending Maintenance Actions</h3>
            <p className="text-xs text-gray-500">Unresolved incidents prioritized for department assignment and resolution</p>
          </div>
          <Link
            href="/admin/issues"
            className="text-xs font-bold text-[#16A34A] hover:text-[#15803D] flex items-center gap-1"
          >
            <span>View All ({openIssues})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAF8] text-gray-500 uppercase text-[10px] tracking-wider border-b border-gray-100">
              <tr>
                <th className="p-3 rounded-l-xl">Ticket & Title</th>
                <th className="p-3">Location</th>
                <th className="p-3">Severity</th>
                <th className="p-3">Assigned Dept</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right rounded-r-xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pendingMaintenance.map((issue) => (
                <tr key={issue.id} className="hover:bg-[#F8FAF8] transition-colors">
                  <td className="p-3 font-semibold text-gray-900">
                    <div className="font-mono text-[10px] text-[#16A34A] font-bold">{issue.id}</div>
                    <div className="text-xs truncate max-w-xs">{issue.title}</div>
                  </td>
                  <td className="p-3 text-gray-600">{issue.location}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      issue.severity === 'critical' ? 'bg-red-50 text-red-700 border border-red-200' :
                      issue.severity === 'high' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}>
                      {issue.severity.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3 text-gray-700 font-medium">
                    {issue.assigned_department || 'Unassigned'}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      {issue.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <Link
                      href={`/admin/issues/${issue.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-[11px] shadow-2xs transition-colors"
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
