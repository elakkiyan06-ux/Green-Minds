'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { EnvironmentalIssue } from '@/lib/types';
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
  HelpCircle,
  AlertTriangle,
  Save,
  Check,
  Bot,
  Trophy,
  Coins,
  ShieldCheck
} from 'lucide-react';

export default function IssueDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);

  const [issue, setIssue] = useState<EnvironmentalIssue | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [status, setStatus] = useState<string>('open');
  const [successToast, setSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>('Incident status and resolution notes updated successfully.');

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const res = await fetch(`/api/issues/${id}`);
        if (res.ok) {
          const data = await res.json();
          setIssue(data);
          setStatus(data.status);
          setResolutionNotes(data.resolution_notes || '');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchIssue();
  }, [id]);

  const handleUpdate = async (newStatus?: string) => {
    setUpdating(true);
    const targetStatus = newStatus || status;

    try {
      const res = await fetch(`/api/issues/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: targetStatus,
          resolution_notes: resolutionNotes,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setIssue(updated);
        setStatus(updated.status);
        if (targetStatus === 'resolved') {
          setToastMessage('🌱 Issue marked as Resolved! Eco-Bounty reward verified & awarded to student auditor.');
        } else {
          setToastMessage('Incident status and resolution notes updated successfully.');
        }
        setSuccessToast(true);
        setTimeout(() => setSuccessToast(false), 4000);
      }
    } catch (e) {
      console.error(e);
      alert('Failed to update issue.');
    } finally {
      setUpdating(false);
    }
  };

  const handleMarkResolved = () => {
    setStatus('resolved');
    handleUpdate('resolved');
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="animate-spin w-8 h-8 border-4 border-[#16A34A] border-t-transparent rounded-full mx-auto"></div>
        <p className="text-sm text-gray-500">Loading incident details...</p>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-base font-bold text-gray-800">Environmental issue not found.</p>
        <Link
          href="/issues"
          className="text-xs font-semibold text-[#16A34A] hover:underline"
        >
          Return to Issues List
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Toast Alert */}
      {successToast && (
        <div className="p-4 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-between shadow-lg animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-white" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <Link
            href="/issues"
            className="text-xs font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-1.5 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Issues</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-mono text-sm font-bold text-gray-400">
              {issue.id}
            </span>
            <CategoryBadge category={issue.category} />
            <SeverityBadge severity={issue.severity} />
            <StatusBadge status={issue.status} />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-2">
            {issue.title}
          </h1>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/assistant"
            className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#14532D] border border-emerald-200 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Bot className="w-4 h-4 text-[#16A34A]" />
            <span>Ask Assistant</span>
          </Link>

          {issue.status !== 'resolved' && (
            <button
              onClick={handleMarkResolved}
              disabled={updating}
              className="px-5 py-2.5 rounded-xl bg-[#16A34A] hover:bg-[#14532D] text-white text-xs font-bold shadow-md shadow-green-700/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>Mark as Resolved</span>
            </button>
          )}
        </div>
      </div>

      {/* Meta Information Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-white border border-[#E5EBE5] text-xs">
        <div>
          <span className="text-gray-400 block font-medium">Campus Location</span>
          <span className="font-bold text-gray-900 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
            {issue.location}
          </span>
        </div>
        <div>
          <span className="text-gray-400 block font-medium">Reported Time</span>
          <span className="font-bold text-gray-900 flex items-center gap-1 mt-0.5">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            {new Date(issue.created_at).toLocaleDateString()} {new Date(issue.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div>
          <span className="text-gray-400 block font-medium">Reported By</span>
          <span className="font-bold text-gray-900 flex items-center gap-1 mt-0.5">
            <User className="w-3.5 h-3.5 text-gray-400" />
            {issue.reported_by || 'Campus Community'}
          </span>
        </div>
        <div>
          <span className="text-gray-400 block font-medium">AI Confidence</span>
          <span className="font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
            <Sparkles className="w-3.5 h-3.5 text-[#16A34A]" />
            {Math.round((issue.ai_confidence || 0.9) * 100)}%
          </span>
        </div>
      </div>

      {/* ECO-BOUNTY REPORT SECTION */}
      {(issue.eco_bounty_eligible || issue.id.startsWith('EB-') || issue.eco_bounty_points) && (
        <div className="bg-gradient-to-r from-emerald-50 via-white to-emerald-50/50 rounded-2xl p-5 sm:p-6 border border-emerald-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-100 text-[#14532D]">
                <Trophy className="w-5 h-5 text-[#16A34A]" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block">
                  Campus Sustainability Audit
                </span>
                <h3 className="text-base font-black text-gray-900">
                  ECO-BOUNTY REPORT
                </h3>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-100 text-[#14532D] self-start sm:self-auto flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
              {issue.ai_verified !== false ? 'AI Verified' : 'Standard Submission'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-gray-400 block font-semibold uppercase text-[10px]">Reporter</span>
              <span className="font-bold text-gray-900 mt-0.5 block">
                {issue.reported_by || 'Student Auditor'}
              </span>
            </div>

            <div>
              <span className="text-gray-400 block font-semibold uppercase text-[10px]">AI Verification</span>
              <span className="font-bold text-emerald-700 mt-0.5 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                {issue.ai_verified !== false ? '✓ Verified' : 'Pending'}
              </span>
            </div>

            <div>
              <span className="text-gray-400 block font-semibold uppercase text-[10px]">Eco Points</span>
              <span className="font-black text-amber-600 font-mono text-sm mt-0.5 block">
                +{issue.eco_bounty_points || 50} pts
              </span>
            </div>

            <div>
              <span className="text-gray-400 block font-semibold uppercase text-[10px]">Reward Status</span>
              <span className={`font-bold mt-0.5 block ${
                issue.status === 'resolved' || issue.eco_bounty_rewarded
                  ? 'text-emerald-700'
                  : 'text-amber-700'
              }`}>
                {issue.status === 'resolved' || issue.eco_bounty_rewarded
                  ? '✓ Awarded'
                  : 'Pending Resolution'}
              </span>
            </div>
          </div>

          {issue.assigned_department && (
            <div className="pt-2 border-t border-emerald-100/60 flex items-center justify-between text-xs text-gray-600">
              <span>Assigned Maintenance: <strong className="text-gray-900">{issue.assigned_department}</strong></span>
              <span className="text-emerald-700 font-semibold">Priority Dispatch Active</span>
            </div>
          )}
        </div>
      )}

      {/* POTENTIAL RESOURCE IMPACT ESTIMATOR CARD */}
      <ResourceImpactCard 
        initialEstimate={issue.impact_estimate} 
        category={issue.category} 
        title={issue.title} 
        description={issue.description} 
      />

      {/* Uploaded Image If Present */}
      {issue.image_url && (
        <div className="bg-white rounded-2xl p-4 border border-[#E5EBE5] shadow-xs">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2 px-1">
            Visual Evidence
          </span>
          <div className="h-64 sm:h-80 w-full rounded-xl overflow-hidden bg-black/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={issue.image_url}
              alt={issue.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Original Report Description */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E5EBE5] shadow-xs space-y-2">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          ORIGINAL USER REPORT
        </h2>
        <p className="text-sm sm:text-base text-gray-800 leading-relaxed italic">
          &quot;{issue.description}&quot;
        </p>
      </div>

      {/* AI Summary */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E5EBE5] shadow-xs space-y-3">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#16A34A]" />
          <span>AI ENVIRONMENTAL SUMMARY</span>
        </h2>
        <p className="text-base sm:text-lg font-semibold text-gray-900 leading-relaxed">
          {issue.ai_summary}
        </p>
      </div>

      {/* Observations */}
      {issue.ai_observations && issue.ai_observations.length > 0 && (
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E5EBE5] shadow-xs space-y-3">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            AI OBSERVATIONS
          </h2>
          <ul className="space-y-2">
            {issue.ai_observations.map((obs, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-800">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] mt-2 shrink-0"></span>
                <span>{obs}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* AI ROOT-CAUSE ANALYSIS SECTION */}
      <RootCauseCard 
        analysis={issue.root_cause_analysis} 
        observedProblemFallback={issue.title} 
        locationFallback={issue.location} 
      />

      {/* Environmental Impact */}
      {issue.ai_impact && (
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E5EBE5] shadow-xs space-y-3">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 text-amber-700">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>ENVIRONMENTAL IMPACT</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-800 leading-relaxed">
            {issue.ai_impact}
          </p>
        </div>
      )}

      {/* Actions Breakdown: Immediate + Preventive */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Immediate Actions */}
        <div className="bg-white rounded-2xl p-6 border border-[#E5EBE5] shadow-xs space-y-3">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            IMMEDIATE ACTIONS
          </h2>
          <div className="space-y-2">
            {(issue.ai_recommendations || []).map((act, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs font-medium text-gray-800 p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-100">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                <span>{act}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Preventive Actions */}
        <div className="bg-white rounded-2xl p-6 border border-[#E5EBE5] shadow-xs space-y-3">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            PREVENTIVE ACTIONS
          </h2>
          <div className="space-y-2">
            {(issue.ai_preventive_actions || []).map((prev, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs font-medium text-gray-800 p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                <span className="w-4 h-4 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{prev}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Uncertainty Note if any */}
      {issue.ai_uncertainty && issue.ai_uncertainty.length > 0 && (
        <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200 text-amber-900 space-y-1">
          <span className="text-xs font-bold flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4" /> Uncertainty & Additional Info:
          </span>
          <p className="text-xs pl-5">{issue.ai_uncertainty.join(', ')}</p>
        </div>
      )}

      {/* Resolution Notes & Status Management Form */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E5EBE5] shadow-xs space-y-4">
        <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
          INCIDENT STATUS & RESOLUTION LOG
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Current Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#16A34A]"
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <div>
            <span className="block text-xs font-semibold text-gray-600 mb-1">
              Resolved Timestamp
            </span>
            <div className="px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-500 font-mono">
              {issue.resolved_at
                ? new Date(issue.resolved_at).toLocaleString()
                : 'Not resolved yet'}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Resolution Notes / Maintenance Action Report
          </label>
          <textarea
            rows={3}
            value={resolutionNotes}
            onChange={(e) => setResolutionNotes(e.target.value)}
            placeholder="Add details on maintenance technician dispatched, repair parts replaced, or completion notes..."
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-[#DCFCE7]"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={() => handleUpdate()}
            disabled={updating}
            className="px-6 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{updating ? 'Saving...' : 'Save Resolution Updates'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
