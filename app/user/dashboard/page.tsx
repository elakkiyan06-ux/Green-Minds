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

function UserDashboardContent() {
  const searchParams = useSearchParams();
  const accessError = searchParams.get('error') === 'admin_access_denied';

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
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 flex items-start gap-3 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold">Admin Portal Access Restricted</h4>
            <p className="text-xs text-amber-800 mt-0.5">
              Your account has the <strong>Student / User</strong> role and cannot access administrative management pages. You have been redirected to your student dashboard.
            </p>
          </div>
        </div>
      )}

      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#16A34A]" />
            Student Sustainability Auditor
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Welcome back, Elakkiyan! 👋
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Report environmental issues on campus, track repairs, and earn Eco-Bounty rewards.
          </p>
        </div>

        <div>
          <Link
            href="/user/report"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#16A34A] hover:bg-[#14532D] text-white text-sm font-bold shadow-md shadow-green-700/25 transition-all duration-150 hover:scale-[1.02]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Report Environmental Issue</span>
          </Link>
        </div>
      </div>

      {/* 4 Student KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* My Reports */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5EBE5] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">My Reports</span>
            <div className="text-2xl font-black text-gray-900 mt-1">{totalMyReports}</div>
            <span className="text-[11px] text-gray-500 font-medium">Filed across campus</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#16A34A] flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        {/* Open Reports */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5EBE5] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Open Reports</span>
            <div className="text-2xl font-black text-amber-600 mt-1">{openReportsCount}</div>
            <span className="text-[11px] text-gray-500 font-medium">Under active review</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Resolved Reports */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5EBE5] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Resolved Reports</span>
            <div className="text-2xl font-black text-emerald-700 mt-1">{resolvedReportsCount}</div>
            <span className="text-[11px] text-emerald-600 font-bold">100% rewarded</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-[#14532D] flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Eco Points */}
        <div className="bg-gradient-to-br from-[#16A34A] to-[#14532D] text-white p-5 rounded-2xl shadow-md shadow-green-900/15 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider">Eco Points</span>
            <div className="text-2xl font-black text-white mt-1">1,240</div>
            <span className="text-[11px] text-emerald-200 font-medium">+120 pts this week</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-white/20 text-white flex items-center justify-center">
            <Trophy className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Quick Assistant Shortcut Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-white border border-emerald-200 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#16A34A] text-white flex items-center justify-center shrink-0 shadow-sm shadow-green-700/25">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#14532D]">
              <Sparkles className="w-3.5 h-3.5 text-[#16A34A]" />
              Green Assistant with Campus Sustainability Memory
            </div>
            <h3 className="text-base font-bold text-gray-900 mt-0.5">
              Have questions about campus environmental issues or recycling?
            </h3>
            <p className="text-xs text-gray-600 mt-0.5">
              Ask about recurring water leaks in Boys Hostel, IT Block energy waste, or sustainability tips.
            </p>
          </div>
        </div>

        <Link
          href="/user/assistant"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-gray-50 border border-emerald-300 text-xs font-bold text-[#14532D] shadow-xs transition-colors shrink-0"
        >
          <span>Ask Green Assistant</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Recent Reports Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">My Recent Reports</h2>
            <p className="text-xs text-gray-500">Track status and AI verification for your submissions</p>
          </div>
          <Link
            href="/user/issues"
            className="text-xs font-bold text-[#16A34A] hover:text-[#14532D] flex items-center gap-1"
          >
            <span>View All My Reports ({totalMyReports})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-400 text-sm">Loading your reports...</div>
        ) : myReports.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-gray-300">
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
                  <span className="text-gray-400 font-mono text-[11px]">{issue.location}</span>
                  <div className="flex items-center gap-1.5">
                    {issue.ai_verified && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
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
