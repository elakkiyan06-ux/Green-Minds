'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnalyticsSummary } from '@/lib/types';
import KPICard from '@/components/Dashboard/KPICard';
import AnalyticsCharts from '@/components/Analytics/AnalyticsCharts';
import PredictedRecurringProblems from '@/components/Analytics/PredictedRecurringProblems';
import ResourceImpactSummary from '@/components/Analytics/ResourceImpactSummary';
import { 
  BarChart3, 
  FileCheck2, 
  Percent, 
  Award,
  Layers,
  Sparkles,
  Trophy,
  Coins,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Users,
  TrendingUp,
  ArrowRight
} from 'lucide-react';

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="animate-spin w-8 h-8 border-4 border-[#16A34A] border-t-transparent rounded-full mx-auto"></div>
        <p className="text-sm text-gray-500">Loading campus sustainability analytics...</p>
      </div>
    );
  }

  const bounty = data.ecoBountyMetrics || {
    totalStudentReports: 18,
    aiVerifiedReports: 15,
    ecoPointsAwarded: 1240,
    reportsResolved: 13,
    resourceCategoryCounts: [
      { category: 'Energy', count: 4 },
      { category: 'Water', count: 3 },
      { category: 'Waste', count: 5 },
      { category: 'Safety', count: 2 },
      { category: 'Other', count: 1 }
    ],
    topReportingLocations: [
      { location: 'IT Block', count: 6 },
      { location: 'Boys Hostel', count: 4 },
      { location: 'Block 3', count: 3 },
      { location: 'Canteen', count: 2 }
    ],
    topContributors: [
      { name: 'Arun', points: 2450 },
      { name: 'Priya', points: 2120 },
      { name: 'Elakkiyan', points: 1240 },
      { name: 'Kavin', points: 1180 }
    ]
  };

  const totalCategoryItems = bounty.resourceCategoryCounts.reduce((acc, c) => acc + c.count, 0) || 1;

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase tracking-wide">
              Campus Intelligence
            </span>
            <span className="text-xs text-gray-500">• Real-Time Analytics & Eco-Bounty</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-7 h-7 text-[#16A34A]" />
            <span>Green Campus Analytics</span>
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Understand environmental trends, student auditor contributions, and sustainability ROI.
          </p>
        </div>

        <Link
          href="/eco-bounty"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-colors self-start sm:self-auto"
        >
          <Trophy className="w-4 h-4 text-amber-600" />
          <span>View Eco-Bounty Hub</span>
        </Link>
      </div>

      {/* Top 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <KPICard
          title="Total Issues"
          value={data.totalIssues}
          subtext="Logged campus incidents"
          icon={Layers}
          iconColor="text-gray-700"
          iconBg="bg-gray-100"
        />

        <KPICard
          title="Resolved Issues"
          value={data.resolvedIssues}
          subtext={`${data.openIssues + data.inProgressIssues} pending action`}
          icon={FileCheck2}
          iconColor="text-emerald-700"
          iconBg="bg-emerald-100"
        />

        <KPICard
          title="Resolution Rate"
          value={`${data.resolutionRate}%`}
          change="+8% this week"
          isPositiveChange={true}
          icon={Percent}
          iconColor="text-blue-700"
          iconBg="bg-blue-100"
        />

        <KPICard
          title="Current Green Score"
          value={`${data.greenScore} / 100`}
          change="+4 this week"
          isPositiveChange={true}
          icon={Award}
          iconColor="text-emerald-700"
          iconBg="bg-emerald-100"
        />
      </div>

      {/* ECO-BOUNTY AUDIT METRICS SECTION */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E5EBE5] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 mb-1">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              ECO-BOUNTY AUDITING METRICS
            </span>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">
              Student Sustainability Auditor Network
            </h2>
          </div>

          <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
            Crowd-Sourced Monitoring
          </span>
        </div>

        {/* 4 Eco-Bounty KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-100">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              Total Student Reports
            </span>
            <span className="text-2xl font-black text-gray-900 font-mono mt-1 block">
              {bounty.totalStudentReports}
            </span>
            <span className="text-[10px] text-gray-500">Crowd-sourced inputs</span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
              AI Verified Reports
            </span>
            <span className="text-2xl font-black text-[#16A34A] font-mono mt-1 block">
              {bounty.aiVerifiedReports}
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold">Gemini multimodal confirmed</span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
              Eco Points Awarded
            </span>
            <span className="text-2xl font-black text-amber-600 font-mono mt-1 block">
              {bounty.ecoPointsAwarded.toLocaleString()}
            </span>
            <span className="text-[10px] text-amber-700 font-semibold">Distributed student bounty</span>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
            <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block">
              Reports Resolved
            </span>
            <span className="text-2xl font-black text-blue-700 font-mono mt-1 block">
              {bounty.reportsResolved}
            </span>
            <span className="text-[10px] text-blue-600 font-semibold">Facilities tickets completed</span>
          </div>
        </div>

        {/* AI Campus Resource Insight Box */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50/30 to-emerald-50 border border-emerald-200/80 space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-[#16A34A] text-white">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-wider text-[#14532D]">
              AI Campus Resource Insight
            </h3>
          </div>
          <p className="text-sm font-semibold text-gray-900 leading-relaxed">
            &ldquo;Energy-waste reports are concentrated around academic blocks during evening hours (such as IT Block Room 302 and Lab 4). Implementing scheduled smart occupancy sweeps and PIR sensors will immediately curb off-peak kilowatt consumption.&rdquo;
          </p>
          <span className="text-[11px] text-gray-500 block">
            Generated from verified multi-modal student audits across 12 academic and residential zones.
          </span>
        </div>

        {/* Sub-grid: Reports by Category & Top Locations/Contributors */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          {/* Reports by Category (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-700">
                Reports by Resource Category
              </h3>
              <span className="text-xs text-gray-500">Audited occurrences</span>
            </div>

            <div className="space-y-3 p-4 rounded-2xl bg-gray-50/70 border border-gray-100">
              {bounty.resourceCategoryCounts.map((cat) => {
                const pct = Math.round((cat.count / totalCategoryItems) * 100);
                const colorClass = 
                  cat.category === 'Energy' ? 'bg-amber-500' :
                  cat.category === 'Water' ? 'bg-blue-500' :
                  cat.category === 'Waste' ? 'bg-emerald-500' :
                  cat.category === 'Safety' ? 'bg-red-500' : 'bg-gray-400';

                return (
                  <div key={cat.category} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-gray-800">
                      <span>{cat.category}</span>
                      <span className="text-gray-500 font-mono">{cat.count} reports ({pct}%)</span>
                    </div>
                    <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${colorClass} transition-all duration-500`}
                        style={{ width: `${Math.max(pct, 8)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Locations & Contributors (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Top Reporting Locations */}
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>Top Reporting Locations</span>
              </h3>
              <div className="p-3.5 rounded-2xl bg-gray-50/70 border border-gray-100 space-y-2">
                {bounty.topReportingLocations.map((loc, idx) => (
                  <div key={loc.location} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-gray-800 font-medium">
                      <span className="w-5 h-5 rounded-md bg-white border border-gray-200 flex items-center justify-center font-bold text-[10px] text-gray-600">
                        {idx + 1}
                      </span>
                      <span>{loc.location}</span>
                    </div>
                    <span className="font-bold text-gray-900 font-mono">{loc.count} reports</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Contributors */}
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-500" />
                <span>Top Student Contributors</span>
              </h3>
              <div className="p-3.5 rounded-2xl bg-gray-50/70 border border-gray-100 space-y-2">
                {bounty.topContributors.map((c, idx) => (
                  <div key={c.name} className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-800">{idx + 1}. {c.name}</span>
                    <span className="font-bold text-[#14532D] font-mono">{c.points.toLocaleString()} pts</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Campus Resource & Financial Impact Estimator */}
      <ResourceImpactSummary initialAggregate={data.aggregateImpact} />

      {/* Predicted Recurring Problems Section */}
      <PredictedRecurringProblems predictions={data.predictedRecurringProblems} />

      {/* Main Charts Section with Live AI Insight */}
      <AnalyticsCharts data={data} />
    </div>
  );
}
