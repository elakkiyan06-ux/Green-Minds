'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { EnvironmentalIssue } from '@/lib/types';
import { INITIAL_DEMO_ISSUES } from '@/lib/demo-data';
import SeverityBadge from '@/components/Common/SeverityBadge';
import StatusBadge from '@/components/Common/StatusBadge';
import CategoryBadge from '@/components/Common/CategoryBadge';
import ResourceImpactCard from '@/components/Common/ResourceImpactCard';
import RootCauseCard from '@/components/Common/RootCauseCard';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  User, 
  CheckCircle2, 
  Sparkles, 
  Wrench, 
  Clock, 
  AlertTriangle,
  Trophy,
  ShieldCheck,
  Building2
} from 'lucide-react';

export default function UserIssueDetailClient({ id }: { id: string }) {
  const [issue, setIssue] = useState<EnvironmentalIssue | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIssue = async () => {
      let found: EnvironmentalIssue | null = null;
      try {
        const res = await fetch(`/api/issues/${id}`);
        if (res.ok) {
          found = await res.json();
        }
      } catch (err) {
        // Fallback for static demo mode
      }

      if (!found) {
        found = INITIAL_DEMO_ISSUES.find((i) => i.id === id) || null;
      }

      setIssue(found);
      setLoading(false);
    };

    fetchIssue();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="animate-spin w-8 h-8 border-4 border-[#16A34A] border-t-transparent rounded-full mx-auto"></div>
        <p className="text-sm text-gray-500">Loading report details...</p>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-base font-bold text-gray-800">Environmental issue not found.</p>
        <Link
          href="/user/issues"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#16A34A] text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Reports
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Top Navigation */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <Link
          href="/user/issues"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Reports</span>
        </Link>

        <span className="text-xs font-mono text-gray-400">
          Ticket #{issue.id}
        </span>
      </div>

      {/* Hero Issue Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5EBE5] shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <CategoryBadge category={issue.category} />
            <SeverityBadge severity={issue.severity} />
            {issue.ai_verified && (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
                AI Verified Report
              </span>
            )}
          </div>
          <StatusBadge status={issue.status} />
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            {issue.title}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2 leading-relaxed">
            {issue.description}
          </p>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-gray-100 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span className="block text-[10px] text-gray-400 font-bold uppercase">Location</span>
              <span className="font-semibold text-gray-800">{issue.location}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span className="block text-[10px] text-gray-400 font-bold uppercase">Reported</span>
              <span className="font-semibold text-gray-800">
                {new Date(issue.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span className="block text-[10px] text-gray-400 font-bold uppercase">Assigned To</span>
              <span className="font-semibold text-gray-800">{issue.assigned_department || 'Facilities General'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
            <div>
              <span className="block text-[10px] text-gray-400 font-bold uppercase">Eco Points</span>
              <span className="font-bold text-[#16A34A]">+{issue.eco_bounty_points || 50} pts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Issue Photo if available */}
      {issue.image_url && (
        <div className="bg-white rounded-3xl p-4 border border-[#E5EBE5] overflow-hidden shadow-xs">
          <img
            src={issue.image_url}
            alt={issue.title}
            className="w-full max-h-96 object-cover rounded-2xl"
          />
        </div>
      )}

      {/* Maintenance Progress Tracking Timeline */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E5EBE5] shadow-xs space-y-4">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-emerald-600" />
          <span>MAINTENANCE STATUS & TIMELINE</span>
        </h2>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
          <div>
            <span className="text-xs font-bold text-gray-500 block">Current Status</span>
            <div className="text-base font-black text-gray-900 mt-0.5 capitalize">
              {issue.status.replace('_', ' ')}
            </div>
          </div>

          <div>
            <span className="text-xs font-bold text-gray-500 block">Assigned Department</span>
            <div className="text-sm font-bold text-emerald-700 mt-0.5">
              {issue.assigned_department || 'Pending Department Dispatch'}
            </div>
          </div>

          <div>
            <span className="text-xs font-bold text-gray-500 block">Resolved At</span>
            <div className="text-xs font-mono text-gray-700 mt-0.5">
              {issue.resolved_at ? new Date(issue.resolved_at).toLocaleDateString() : 'In progress'}
            </div>
          </div>
        </div>

        {issue.resolution_notes && (
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
            <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider block mb-1">
              Maintenance Technician Note
            </span>
            <p className="text-xs text-emerald-950 leading-relaxed">
              {issue.resolution_notes}
            </p>
          </div>
        )}
      </div>

      {/* RESOURCE IMPACT ESTIMATOR CARD */}
      <ResourceImpactCard
        category={issue.category}
        initialEstimate={issue.impact_estimate}
        title={issue.title}
      />

      {/* AI ROOT-CAUSE ANALYSIS */}
      <RootCauseCard 
        analysis={issue.root_cause_analysis} 
        observedProblemFallback={issue.title} 
        locationFallback={issue.location} 
      />

      {/* AI Observations & Immediate Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-[#E5EBE5] shadow-xs space-y-3">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            AI OBSERVATIONS
          </h2>
          <div className="space-y-2">
            {(issue.ai_observations || []).map((obs, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-gray-800 p-2.5 rounded-xl bg-gray-50">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] shrink-0 mt-1.5" />
                <span>{obs}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#E5EBE5] shadow-xs space-y-3">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            RECOMMENDED ACTIONS
          </h2>
          <div className="space-y-2">
            {(issue.ai_recommendations || []).map((rec, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs font-medium text-gray-800 p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
