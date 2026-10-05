'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { EnvironmentalIssue } from '@/lib/types';
import { deriveScoresFromIssues } from '@/lib/green-score';
import KPICard from '@/components/Dashboard/KPICard';
import GreenScoreCard from '@/components/Dashboard/GreenScoreCard';
import RecentIssuesTable from '@/components/Dashboard/RecentIssuesTable';
import AICampusInsightCard from '@/components/Dashboard/AICampusInsightCard';
import { 
  PlusCircle, 
  Award, 
  AlertCircle, 
  CheckCircle2, 
  BellRing,
  Sparkles,
  Trophy,
  Coins,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function DashboardPage() {
  const [issues, setIssues] = useState<EnvironmentalIssue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/issues')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setIssues(data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const scores = deriveScoresFromIssues(issues);

  const openCount = issues.filter(i => i.status === 'open' || i.status === 'in_progress').length;
  const highRiskCount = issues.filter(i => (i.severity === 'high' || i.severity === 'critical') && i.status !== 'resolved').length;
  const resolvedCount = issues.filter(i => i.status === 'resolved').length;
  const resolutionPercentage = issues.length > 0 ? Math.round((resolvedCount / issues.length) * 100) : 86;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            Good Morning 👋
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Monitor environmental issues and turn them into sustainable actions.
          </p>
        </div>

        <div>
          <Link
            href="/report"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#16A34A] hover:bg-[#14532D] text-white text-sm font-bold shadow-md shadow-green-700/25 transition-all duration-150 hover:scale-[1.02]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Report Environmental Issue</span>
          </Link>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <KPICard
          title="Green Score"
          value={`${scores.greenScore} / 100`}
          change="+4 this week"
          isPositiveChange={true}
          icon={Award}
          iconColor="text-emerald-700"
          iconBg="bg-emerald-100"
        />

        <KPICard
          title="Open Issues"
          value={openCount}
          subtext={`${highRiskCount} high risk`}
          icon={AlertCircle}
          iconColor="text-red-700"
          iconBg="bg-red-100"
        />

        <KPICard
          title="Resolved"
          value={`${resolutionPercentage}%`}
          change="+8% this week"
          isPositiveChange={true}
          icon={CheckCircle2}
          iconColor="text-emerald-700"
          iconBg="bg-emerald-100"
        />

        <KPICard
          title="Resource Alerts"
          value="4"
          subtext="Facilities notified"
          icon={BellRing}
          iconColor="text-amber-700"
          iconBg="bg-amber-100"
        />
      </div>

      {/* AI Campus Insight Banner */}
      <AICampusInsightCard
        insight="Most recent environmental reports are related to waste management around Block 3. Consider increasing collection frequency during high-traffic hours."
        onViewAnalysisHref="/analytics"
      />

      {/* Grid: Green Score Card + Recent Issues Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Campus Green Score & Eco-Bounty Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <GreenScoreCard
            score={scores.greenScore}
            wasteScore={scores.wasteScore}
            waterScore={scores.waterScore}
            energyScore={scores.energyScore}
            greenCoverScore={scores.greenCoverScore}
            changeText="↑ 4 points this week"
          />

          {/* Eco-Bounty Compact Dashboard Card */}
          <div className="bg-white rounded-2xl p-5 border border-[#E5EBE5] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
                  <Trophy className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block">
                    Campus Crowd-Sourcing
                  </span>
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">
                    ECO-BOUNTY
                  </h3>
                </div>
              </div>

              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-[#14532D]">
                Active Network
              </span>
            </div>

            <p className="text-xs text-gray-600 leading-snug">
              &ldquo;Students are helping monitor your campus.&rdquo;
            </p>

            <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-gray-50 border border-gray-100 text-center">
              <div>
                <span className="text-xs font-black text-gray-900 block font-mono">12</span>
                <span className="text-[10px] text-gray-500 font-medium">Reports</span>
              </div>
              <div className="border-x border-gray-200">
                <span className="text-xs font-black text-[#16A34A] block font-mono">9</span>
                <span className="text-[10px] text-gray-500 font-medium">AI Verified</span>
              </div>
              <div>
                <span className="text-xs font-black text-blue-600 block font-mono">6</span>
                <span className="text-[10px] text-gray-500 font-medium">Resolved</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <div className="text-gray-600">
                <span className="text-[10px] text-gray-400 block font-bold uppercase">Top Contributor</span>
                <span className="font-bold text-gray-900">Elakkiyan</span>
                <span className="text-emerald-700 font-semibold ml-1">— 120 pts this week</span>
              </div>

              <Link
                href="/eco-bounty"
                className="px-3.5 py-2 rounded-xl bg-[#DCFCE7] hover:bg-[#bbf7d0] text-[#14532D] text-xs font-extrabold transition-colors flex items-center gap-1.5 shrink-0"
              >
                <span>View Eco-Bounty</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Environmental Issues Table (7 cols) */}
        <div className="lg:col-span-7">
          <RecentIssuesTable issues={issues} />
        </div>
      </div>
    </div>
  );
}
