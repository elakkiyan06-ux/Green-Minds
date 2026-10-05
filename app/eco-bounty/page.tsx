'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Trophy, 
  Coins, 
  Sparkles, 
  Camera, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Gift, 
  Medal, 
  Star, 
  Zap, 
  Droplet, 
  Trash2, 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  MapPin, 
  AlertTriangle,
  ExternalLink,
  Info,
  Check
} from 'lucide-react';
import { EcoBountyStats, EcoAuditor, EnvironmentalIssue } from '@/lib/types';
import SeverityBadge from '@/components/Common/SeverityBadge';
import CategoryBadge from '@/components/Common/CategoryBadge';

interface EcoBountyData {
  stats: EcoBountyStats;
  leaderboard: EcoAuditor[];
  myReports: EnvironmentalIssue[];
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    unlocked: boolean;
    unlockedAt?: string;
  }>;
  rewards: Array<{
    id: string;
    title: string;
    pointsCost: number;
    description: string;
    category: string;
    isDemo: boolean;
    available: boolean;
  }>;
}

export default function EcoBountyPage() {
  const [data, setData] = useState<EcoBountyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'reports' | 'leaderboard' | 'achievements' | 'rewards'>('reports');
  const [leaderboardPeriod, setLeaderboardPeriod] = useState<'week' | 'month' | 'all'>('week');
  const [redeemedReward, setRedeemedReward] = useState<string | null>(null);
  const [redeemSuccessModal, setRedeemSuccessModal] = useState<{ title: string; points: number } | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`/api/eco-bounty?period=${leaderboardPeriod}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error('Failed to load Eco-Bounty data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [leaderboardPeriod]);

  if (loading || !data) {
    return (
      <div className="py-24 text-center space-y-4">
        <div className="animate-spin w-8 h-8 border-4 border-[#16A34A] border-t-transparent rounded-full mx-auto"></div>
        <p className="text-sm text-gray-500 font-medium">Loading Eco-Bounty Hub & Campus Champions...</p>
      </div>
    );
  }

  const { stats, leaderboard, myReports, achievements, rewards } = data;

  const handleClaimDemoReward = (reward: (typeof rewards)[0]) => {
    if (stats.myPoints < reward.pointsCost) {
      alert(`You need ${reward.pointsCost} Eco Points to redeem this reward. Current balance: ${stats.myPoints} pts.`);
      return;
    }
    setRedeemedReward(reward.id);
    setRedeemSuccessModal({ title: reward.title, points: reward.pointsCost });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Demo Redemption Success Modal */}
      {redeemSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-emerald-100">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-[#14532D] mx-auto flex items-center justify-center text-3xl">
              🎁
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#16A34A] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Demo Reward Claimed
              </span>
              <h3 className="text-xl font-black text-gray-900 pt-1">
                {redeemSuccessModal.title}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Thank you for your sustainability contributions! In this prototype, demo rewards showcase how campus partners and cafeterias can incentivize real student auditing.
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-600 font-mono">
              Points applied: -{redeemSuccessModal.points} pts (Simulated)
            </div>
            <button
              onClick={() => setRedeemSuccessModal(null)}
              className="w-full py-3 rounded-xl bg-[#14532D] text-white text-xs font-bold hover:bg-[#0F391E] transition-colors"
            >
              Close & Keep Auditing
            </button>
          </div>
        </div>
      )}

      {/* 1. Header & Breadcrumb */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase tracking-wide flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-[#16A34A]" />
            Eco-Bounty Platform
          </span>
          <span className="text-xs text-gray-500">• Campus Crowd-Sourced Auditing</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Eco-Bounty
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Turn everyday observations into sustainable action.
        </p>
      </div>

      {/* 2. Hero Section */}
      <div className="bg-gradient-to-br from-[#14532D] via-[#166534] to-[#14532D] text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-green-950/15 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-200 text-xs font-bold border border-emerald-300/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Turn Students Into Sustainability Auditors</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Every student can become a sustainability auditor.
          </h2>

          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
            Spot resource waste, let AI verify it, help maintenance act faster, and earn Eco Points for verified reports.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/report?bounty=true"
              className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-gray-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-400/20 transition-all flex items-center gap-2"
            >
              <Camera className="w-4 h-4 text-gray-900" />
              <span>Report an Issue</span>
            </Link>

            <button
              onClick={() => {
                setActiveTab('rewards');
                const el = document.getElementById('bounty-tabs');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition-colors flex items-center gap-2"
            >
              <Gift className="w-4 h-4 text-emerald-200" />
              <span>My Rewards</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. ECO-BOUNTY SUMMARY KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* My Eco Points */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5EBE5] shadow-xs flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
              My Eco Points
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-[#14532D] font-mono">
              {stats.myPoints.toLocaleString()}
            </div>
            <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1 mt-0.5">
              <TrendingUp className="w-3 h-3" />
              +{stats.weeklyEarned} this week
            </span>
          </div>
        </div>

        {/* Reports Submitted */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5EBE5] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Reports Submitted
            </span>
            <div className="p-2 rounded-xl bg-gray-50 text-gray-600">
              <Camera className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-gray-900 font-mono">
              {stats.reportsSubmitted}
            </div>
            <span className="text-[10px] font-semibold text-gray-500 block mt-0.5">
              Campus observations
            </span>
          </div>
        </div>

        {/* Verified Reports */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5EBE5] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Verified Reports
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-[#16A34A] font-mono">
              {stats.verifiedReports}
            </div>
            <span className="text-[10px] font-semibold text-emerald-700 block mt-0.5">
              {Math.round((stats.verifiedReports / (stats.reportsSubmitted || 1)) * 100)}% verification rate
            </span>
          </div>
        </div>

        {/* Issues Resolved */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5EBE5] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Issues Resolved
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-blue-700 font-mono">
              {stats.issuesResolved}
            </div>
            <span className="text-[10px] font-semibold text-blue-600 block mt-0.5">
              Fixed by maintenance
            </span>
          </div>
        </div>

        {/* Campus Impact */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5EBE5] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Campus Impact
            </span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Star className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-purple-900 font-mono">
              {stats.campusImpact}
            </div>
            <span className="text-[10px] font-semibold text-purple-600 block mt-0.5">
              Impact index score
            </span>
          </div>
        </div>
      </div>

      {/* 4. QUICK REPORT FEATURE CARD */}
      <div className="bg-gradient-to-r from-emerald-50 via-white to-emerald-50/40 rounded-3xl p-6 sm:p-7 border border-emerald-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-ping"></span>
            <h3 className="text-lg sm:text-xl font-black text-gray-900">
              Spot a Problem?
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 max-w-xl">
            See something wasting energy, water, or resources? Report it in seconds.
          </p>
        </div>

        <Link
          href="/report?bounty=true"
          className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#16A34A] to-[#14532D] hover:from-[#15803D] hover:to-[#0F391E] text-white font-extrabold text-sm shadow-md shadow-green-700/20 transition-all flex items-center justify-center gap-2.5 shrink-0"
        >
          <Camera className="w-5 h-5 text-emerald-200" />
          <span>Report Environmental Issue</span>
        </Link>
      </div>

      {/* 5. TABS NAVIGATION */}
      <div id="bounty-tabs" className="border-b border-gray-200">
        <div className="flex items-center gap-6 text-sm font-bold overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('reports')}
            className={`pb-3 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'reports'
                ? 'border-[#16A34A] text-[#14532D]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>My Reports ({myReports.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`pb-3 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'leaderboard'
                ? 'border-[#16A34A] text-[#14532D]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Campus Leaderboard</span>
          </button>

          <button
            onClick={() => setActiveTab('achievements')}
            className={`pb-3 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'achievements'
                ? 'border-[#16A34A] text-[#14532D]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Medal className="w-4 h-4" />
            <span>Achievements ({achievements.filter(a => a.unlocked).length}/{achievements.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('rewards')}
            className={`pb-3 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'rewards'
                ? 'border-[#16A34A] text-[#14532D]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>Rewards ({rewards.length})</span>
          </button>
        </div>
      </div>

      {/* 6. TAB CONTENT PANELS */}

      {/* TAB 1: MY REPORTS */}
      {activeTab === 'reports' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
              Auditor Submission Log
            </h3>
            <span className="text-xs text-gray-500">
              Showing verified campus audits
            </span>
          </div>

          <div className="space-y-3">
            {myReports.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-[#E5EBE5] space-y-3">
                <Camera className="w-10 h-10 text-gray-300 mx-auto" />
                <p className="text-sm font-semibold text-gray-700">No student audits recorded yet.</p>
                <Link
                  href="/report?bounty=true"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#16A34A] hover:underline"
                >
                  Submit your first audit report <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              myReports.map((report) => (
                <div
                  key={report.id}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E5EBE5] shadow-xs hover:border-emerald-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#14532D] flex items-center justify-center font-bold text-lg shrink-0 border border-emerald-100">
                      {report.category === 'energy' ? '⚡' : report.category === 'water' ? '💧' : '♻️'}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-black text-gray-900">
                          {report.id}
                        </span>
                        <CategoryBadge category={report.category} />
                        <SeverityBadge severity={report.severity} size="sm" />
                        {report.ai_verified && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> AI Verified
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-gray-900">
                        {report.title}
                      </h4>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#16A34A]" />
                          {report.location}
                        </span>
                        {report.assigned_department && (
                          <span>Dept: <strong className="text-gray-700">{report.assigned_department}</strong></span>
                        )}
                        <span>{new Date(report.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    <div className="text-right">
                      <span className="text-xs font-black text-amber-600 block">
                        +{report.eco_bounty_points || 50} pts
                      </span>
                      <span className="text-[10px] text-gray-400 capitalize">
                        {report.status}
                      </span>
                    </div>

                    <Link
                      href={`/issues/${report.id}`}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors flex items-center gap-1"
                    >
                      <span>Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: LEADERBOARD */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E5EBE5] shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  Campus Eco Champions
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Top student sustainability auditors recognized across college departments.
                </p>
              </div>

              {/* Timeframe Filter Tabs */}
              <div className="inline-flex rounded-xl bg-gray-100 p-1 text-xs font-bold text-gray-600 self-start sm:self-auto">
                <button
                  onClick={() => setLeaderboardPeriod('week')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    leaderboardPeriod === 'week' ? 'bg-white text-gray-900 shadow-xs' : 'hover:text-gray-900'
                  }`}
                >
                  This Week
                </button>
                <button
                  onClick={() => setLeaderboardPeriod('month')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    leaderboardPeriod === 'month' ? 'bg-white text-gray-900 shadow-xs' : 'hover:text-gray-900'
                  }`}
                >
                  This Month
                </button>
                <button
                  onClick={() => setLeaderboardPeriod('all')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    leaderboardPeriod === 'all' ? 'bg-white text-gray-900 shadow-xs' : 'hover:text-gray-900'
                  }`}
                >
                  All Time
                </button>
              </div>
            </div>

            {/* Leaderboard Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase text-[10px] tracking-wider">
                    <th className="pb-3 pl-2">Rank</th>
                    <th className="pb-3">Student Auditor</th>
                    <th className="pb-3 text-right">Eco Points</th>
                    <th className="pb-3 text-right">Verified Reports</th>
                    <th className="pb-3 text-right pr-2">Issues Resolved</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {leaderboard.map((student, idx) => {
                    const isSelf = student.name.includes('Elakkiyan');
                    const rankMedal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`;

                    return (
                      <tr
                        key={student.id}
                        className={`hover:bg-gray-50/80 transition-colors ${
                          isSelf ? 'bg-emerald-50/70 font-semibold' : ''
                        }`}
                      >
                        <td className="py-3.5 pl-2 font-black text-gray-700">
                          <span className="text-sm">{rankMedal}</span>
                        </td>
                        <td className="py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#14532D] flex items-center justify-center font-bold text-xs">
                              {student.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900 flex items-center gap-1.5">
                                <span>{student.name}</span>
                                {isSelf && (
                                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-200 text-emerald-900">
                                    You
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-gray-500 block">
                                {student.department}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 text-right font-black text-[#14532D] font-mono">
                          {leaderboardPeriod === 'week' ? student.weekly_points.toLocaleString() : student.points.toLocaleString()} pts
                        </td>
                        <td className="py-3.5 text-right text-gray-600 font-semibold">
                          {student.verified_reports}
                        </td>
                        <td className="py-3.5 text-right pr-2 text-blue-600 font-semibold">
                          {student.resolved_issues ?? student.issues_resolved ?? 0}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-500 flex items-center gap-2">
              <Info className="w-4 h-4 text-gray-400 shrink-0" />
              <span>Leaderboard updates automatically when maintenance confirms resolved issues or when reports are verified by AI.</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ACHIEVEMENTS */}
      {activeTab === 'achievements' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
              Sustainability Auditor Badges
            </h3>
            <span className="text-xs text-[#16A34A] font-bold">
              {achievements.filter(a => a.unlocked).length} of {achievements.length} Unlocked
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className={`p-5 rounded-2xl border transition-all ${
                  ach.unlocked
                    ? 'bg-white border-emerald-200 shadow-xs'
                    : 'bg-gray-50/70 border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                    ach.unlocked ? 'bg-emerald-100 shadow-inner' : 'bg-gray-200'
                  }`}>
                    {ach.icon}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-gray-900">
                        {ach.title}
                      </h4>
                      {ach.unlocked && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" /> Earned
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 leading-snug">
                      {ach.description}
                    </p>
                    {ach.unlockedAt && (
                      <span className="text-[10px] text-gray-400 block pt-1">
                        Unlocked on {new Date(ach.unlockedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: REWARDS */}
      {activeTab === 'rewards' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-3">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-amber-950">Campus Partner Demonstration:</strong> Rewards below are labeled <span className="font-bold uppercase tracking-wider text-[10px] bg-amber-200/60 px-1.5 py-0.5 rounded text-amber-950">Demo Reward</span> for this hackathon prototype to illustrate how institutional campus partners (e.g., student cafeteria, campus store, Dean of Student Affairs) can offer real incentives.
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {rewards.map((reward) => {
              const canAfford = stats.myPoints >= reward.pointsCost;
              const isClaimed = redeemedReward === reward.id;

              return (
                <div
                  key={reward.id}
                  className="bg-white rounded-2xl p-5 border border-[#E5EBE5] shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-300 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                        Demo Reward
                      </span>
                      <span className="text-sm font-black text-[#14532D] font-mono">
                        {reward.pointsCost} pts
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-gray-900 pt-1">
                      {reward.title}
                    </h4>

                    <p className="text-xs text-gray-600 leading-relaxed">
                      {reward.description}
                    </p>
                  </div>

                  <button
                    onClick={() => handleClaimDemoReward(reward)}
                    disabled={!canAfford || isClaimed}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      isClaimed
                        ? 'bg-emerald-100 text-emerald-800 cursor-default'
                        : canAfford
                        ? 'bg-[#14532D] hover:bg-[#0F391E] text-white shadow-xs'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isClaimed ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Redeemed</span>
                      </>
                    ) : canAfford ? (
                      <>
                        <Gift className="w-3.5 h-3.5" />
                        <span>Redeem Reward</span>
                      </>
                    ) : (
                      <span>Need {reward.pointsCost - stats.myPoints} more pts</span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
