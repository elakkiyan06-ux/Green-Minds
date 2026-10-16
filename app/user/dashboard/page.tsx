'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { EnvironmentalIssue, EcoBountyStats } from '@/lib/types';
import StatusBadge from '@/components/Common/StatusBadge';
import CategoryBadge from '@/components/Common/CategoryBadge';
import SeverityBadge from '@/components/Common/SeverityBadge';
import { 
  PlusCircle, 
  Trophy, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Bot, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle,
  Award,
  Coins
} from 'lucide-react';

import { getStudentPoints } from '@/lib/student-points';
import { getClientIssues, getClientReportedIssues } from '@/lib/client-environmental';

function UserDashboardContent() {
  const searchParams = useSearchParams();
  const accessError = searchParams.get('error') === 'admin_access_denied';

  const [issues, setIssues] = useState<EnvironmentalIssue[]>([]);
  const [ecoPoints, setEcoPoints] = useState<number>(1240);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = () => {
    setEcoPoints(getStudentPoints());
    fetch('/api/issues')
      .then((res) => {
        if (!res.ok) throw new Error('API offline');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          const custom = getClientReportedIssues();
          const merged = [...custom, ...data.filter(d => !custom.some(c => c.id === d.id))];
          setIssues(merged);
        }
      })
      .catch(() => {
        // Fallback for static GitHub Pages or offline
        setIssues(getClientIssues());
      })
      .finally(() => setLoading(false));

    fetch('/api/eco-bounty')
      .then((res) => res.json())
      .then((data) => {
        if (data?.stats?.myPoints) {
          const currentLocal = getStudentPoints();
          if (data.stats.myPoints > currentLocal) {
            setEcoPoints(data.stats.myPoints);
          }
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadDashboardData();

    const handlePointsUpdate = () => {
      setEcoPoints(getStudentPoints());
      loadDashboardData();
    };

    window.addEventListener('eco_points_updated', handlePointsUpdate);
    window.addEventListener('gm_issues_updated', handlePointsUpdate);
    window.addEventListener('storage', handlePointsUpdate);

    return () => {
      window.removeEventListener('eco_points_updated', handlePointsUpdate);
      window.removeEventListener('gm_issues_updated', handlePointsUpdate);
      window.removeEventListener('storage', handlePointsUpdate);
    };
  }, []);

  // Filter student's reports: reports by Elakkiyan or student auditor (or top issues for demo)
  const myReports = issues.filter(i => 
    !i.reported_by || 
    i.reported_by.toLowerCase().includes('elakkiyan') || 
    i.reported_by.toLowerCase().includes('student')
  );

  const openReportsCount = myReports.filter(i => i.status === 'open' || i.status === 'in_progress').length;
  const resolvedReportsCount = myReports.filter(i => i.status === 'resolved').length;
  const totalMyReports = myReports.length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Admin Access Denied Alert if redirected */}
      {accessError && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-amber-900">Admin Portal Access Restricted</h4>
            <p className="text-xs text-amber-800 mt-0.5">
              Your account has the <strong>Student / User</strong> role and cannot access administrative management pages. You have been redirected to your student dashboard.
            </p>
          </div>
        </div>
      )}

      {/* Top Welcome & Quick Actions Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white border border-[#E5EBE5] p-6 rounded-3xl text-gray-900 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#16A34A]" />
            Student Sustainability Auditor Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Welcome back, Elakkiyan! 👋
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Report environmental issues on campus, verify with Gemini AI, and earn Eco-Bounty rewards.
          </p>
        </div>

        {/* 4 Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/user/report"
            className="px-3.5 py-2.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Report Issue</span>
          </Link>

          <Link
            href="/user/eco-bounty"
            className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Eco-Bounty Hub</span>
          </Link>

          <Link
            href="/user/assistant"
            className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <Bot className="w-4 h-4 text-[#16A34A]" />
            <span>Green Assistant</span>
          </Link>

          <Link
            href="/user/issues"
            className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <FileText className="w-4 h-4 text-teal-600" />
            <span>My Reports</span>
          </Link>
        </div>
      </div>

      {/* 4 Student KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* My Reports */}
        <div className="bg-white border border-[#E5EBE5] shadow-xs p-4 sm:p-5 rounded-2xl">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">My Reports</span>
          <div className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">{totalMyReports}</div>
          <span className="text-[11px] text-gray-500 font-medium">Filed across campus</span>
        </div>

        {/* Open Reports */}
        <div className="bg-white border border-[#E5EBE5] shadow-xs p-4 sm:p-5 rounded-2xl">
          <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">Open Reports</span>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">{openReportsCount}</div>
          <span className="text-[11px] text-gray-500 font-medium">Under active review</span>
        </div>

        {/* Resolved Reports */}
        <div className="bg-white border border-[#E5EBE5] shadow-xs p-4 sm:p-5 rounded-2xl">
          <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider block">Resolved Reports</span>
          <div className="text-2xl sm:text-3xl font-black text-teal-700 mt-1">{resolvedReportsCount}</div>
          <span className="text-[11px] text-gray-500 font-medium">100% rewarded</span>
        </div>

        {/* Eco Points */}
        <div className="bg-white border border-emerald-200 shadow-xs p-4 sm:p-5 rounded-2xl">
          <span className="text-[11px] font-bold text-[#16A34A] uppercase tracking-wider block">Eco Points</span>
          <div className="text-2xl sm:text-3xl font-black text-[#16A34A] mt-1">{ecoPoints.toLocaleString()} pts</div>
          <span className="text-[11px] text-emerald-700 font-medium">+120 pts this week</span>
        </div>
      </div>

      {/* Quick Assistant Shortcut Banner */}
      <div className="bg-white border border-[#E5EBE5] shadow-xs rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-[#16A34A] flex items-center justify-center shrink-0 shadow-xs">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#16A34A]">
              <Sparkles className="w-3.5 h-3.5" />
              Green Assistant with Campus Sustainability Memory
            </div>
            <h3 className="text-base font-bold text-gray-900 mt-0.5">
              Have questions about campus environmental issues or recycling?
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Ask about recurring water leaks in Boys Hostel, IT Block energy waste, or sustainability tips.
            </p>
          </div>
        </div>

        <Link
          href="/user/assistant"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold shadow-xs transition-all shrink-0"
        >
          <span>Ask Green Assistant</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Recent Reports Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-gray-900">My Recent Reports</h2>
            <p className="text-xs text-gray-500">Track status and AI verification for your submissions</p>
          </div>
          <Link
            href="/user/issues"
            className="text-xs font-bold text-[#16A34A] hover:text-[#15803D] flex items-center gap-1"
          >
            <span>View All My Reports ({totalMyReports})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-500 text-sm">Loading your reports...</div>
        ) : myReports.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-gray-300 shadow-xs">
            <p className="text-sm text-gray-500 mb-3">You haven&apos;t reported any environmental issues yet.</p>
            <Link
              href="/user/report"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#16A34A] text-white text-xs font-bold"
            >
              <PlusCircle className="w-4 h-4" /> Report Your First Issue
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myReports.slice(0, 6).map((issue) => (
              <Link
                key={issue.id}
                href={`/user/issues/${issue.id}`}
                className="bg-white rounded-2xl p-5 border border-[#E5EBE5] hover:border-emerald-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <CategoryBadge category={issue.category} />
                    <StatusBadge status={issue.status} />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#16A34A] transition-colors line-clamp-1">
                      {issue.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {issue.description || issue.ai_summary}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-mono text-[11px]">{issue.location}</span>
                  <div className="flex items-center gap-1.5">
                    {issue.ai_verified && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <ShieldCheck className="w-3 h-3 text-[#16A34A]" />
                        AI Verified
                      </span>
                    )}
                    <span className="font-bold text-[#16A34A] flex items-center gap-0.5">
                      +{issue.eco_bounty_points || 50} pts
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function UserDashboardPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-sm text-gray-500">Loading student dashboard...</div>}>
      <UserDashboardContent />
    </Suspense>
  );
}
