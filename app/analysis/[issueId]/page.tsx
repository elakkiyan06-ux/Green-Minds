'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AIAnalysisResult } from '@/lib/types';
import SeverityBadge from '@/components/Common/SeverityBadge';
import CategoryBadge from '@/components/Common/CategoryBadge';
import RewardModal from '@/components/EcoBounty/RewardModal';
import ResourceImpactCard from '@/components/Common/ResourceImpactCard';
import RootCauseCard from '@/components/Common/RootCauseCard';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Wrench, 
  HelpCircle, 
  ArrowLeft, 
  Save, 
  Bot, 
  ShieldAlert,
  Calendar,
  MapPin,
  Check,
  CheckSquare,
  Square,
  Trophy,
  Coins,
  ShieldCheck,
  Building2,
  Info
} from 'lucide-react';

interface PendingAnalysisPayload {
  id: string;
  location: string;
  description: string;
  voiceTranscript?: string;
  image?: string | null;
  analysis: AIAnalysisResult;
  createdAt: string;
}

export default function AnalysisResultPage({
  params,
}: {
  params: Promise<{ issueId: string }>;
}) {
  const router = useRouter();
  const { issueId } = use(params);

  const [payload, setPayload] = useState<PendingAnalysisPayload | null>(null);
  const [checkedActions, setCheckedActions] = useState<Record<number, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [createdIssueId, setCreatedIssueId] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem(`pending_analysis_${issueId}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setPayload(parsed);
          return;
        } catch (e) {
          console.error(e);
        }
      }

      // Fallback demo data (Room 302 Energy Waste scenario by default)
      setPayload({
        id: issueId.startsWith('EB-') ? issueId : 'EB-1042',
        location: 'IT Block – Room 302',
        description: 'Lights and fans are left running in Room 302 with no students inside during evening hours.',
        voiceTranscript: 'Lights and fans are left on in IT Block Room 302.',
        image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
        analysis: {
          category: 'Energy Waste',
          severity: 'HIGH',
          summary: 'Multiple overhead fluorescent fixtures and ceiling fans operating in an unmonitored classroom.',
          observations: [
            'Multiple ceiling fluorescent lights are visibly powered ON',
            'Ceiling fans appear to be actively spinning',
            'No people are clearly visible in the provided camera frame',
            'Window blinds are open during evening daylight-saving window'
          ],
          environmental_impact: 'Continuous idle electrical consumption adds avoidable kilowatt-hours to IT Block load and contributes to carbon footprint from non-renewable grid reliance.',
          immediate_actions: [
            'Switch off manual wall light switches at front entrance',
            'Turn off ceiling fan regulators',
            'Verify room schedule on digital display outside Room 302'
          ],
          preventive_actions: [
            'Install passive infrared (PIR) occupancy sensor switches',
            'Implement 15-minute building shutdown sweep protocol by floor security',
            'Display energy conservation reminders near exit doors'
          ],
          maintenance_required: true,
          confidence: 0.94,
          uncertainty: [
            'AI cannot confirm official room reservation status without timetable API integration'
          ],
          verified: true,
          ecoBountyEligible: true,
          suggestedPoints: 50,
          assignedDepartment: 'Electrical Maintenance',
          title: 'Lights and fans left running'
        },
        createdAt: new Date().toISOString(),
      });
    }
  }, [issueId]);

  if (!payload) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="animate-spin w-8 h-8 border-4 border-[#16A34A] border-t-transparent rounded-full mx-auto"></div>
        <p className="text-sm text-gray-500">Loading AI environmental analysis...</p>
      </div>
    );
  }

  const { analysis } = payload;
  const isEligible = analysis.ecoBountyEligible !== false;
  const pointsAward = analysis.suggestedPoints || (analysis.severity === 'HIGH' ? 50 : 30);
  const assignedDept = analysis.assignedDepartment || 'Electrical Maintenance';

  const handleToggleAction = (index: number) => {
    setCheckedActions(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleCreateMaintenanceTicket = async () => {
    setSaving(true);
    try {
      const ticketId = payload.id.startsWith('EB-') ? payload.id : `EB-${Date.now().toString().slice(-4)}`;
      
      const issueBody = {
        id: ticketId,
        title: analysis.title || `${analysis.category} Incident at ${payload.location}`,
        description: payload.description,
        category: analysis.category.toLowerCase().includes('energy') ? 'energy' : 
                  analysis.category.toLowerCase().includes('water') ? 'water' : 
                  analysis.category.toLowerCase().includes('waste') ? 'waste' : 'other',
        location: payload.location,
        severity: analysis.severity.toLowerCase(),
        status: 'open',
        image_url: payload.image || undefined,
        ai_summary: analysis.summary,
        ai_observations: analysis.observations,
        ai_impact: analysis.environmental_impact,
        ai_recommendations: analysis.immediate_actions,
        ai_preventive_actions: analysis.preventive_actions,
        ai_confidence: analysis.confidence,
        ai_uncertainty: analysis.uncertainty,
        maintenance_required: analysis.maintenance_required ?? true,
        reported_by: 'Elakkiyan (Student Auditor)',
        voice_transcript: payload.voiceTranscript,
        eco_bounty_eligible: isEligible,
        eco_bounty_points: pointsAward,
        eco_bounty_rewarded: true,
        ai_verified: analysis.verified !== false,
        assigned_department: assignedDept,
        impact_estimate: analysis.impactEstimate,
        root_cause_analysis: analysis.rootCauseAnalysis,
      };

      const res = await fetch('/api/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(issueBody),
      });

      if (!res.ok) {
        throw new Error('Failed to create maintenance ticket.');
      }

      const created = await res.json();
      setCreatedIssueId(created.id || ticketId);
      setSavedSuccess(true);

      // Trigger Eco-Bounty Reward Modal Celebration!
      setShowRewardModal(true);
    } catch (err) {
      console.error(err);
      alert('Could not save incident. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Eco-Bounty Reward Celebration Modal */}
      {showRewardModal && (
        <RewardModal
          pointsEarned={pointsAward}
          previousPoints={1190}
          newPoints={1240}
          issueTitle={payload.location}
          onClose={() => setShowRewardModal(false)}
          onViewDashboard={() => router.push('/dashboard')}
          onViewEcoBounty={() => router.push('/eco-bounty')}
        />
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase tracking-wide flex items-center gap-1">
              <Trophy className="w-3 h-3 text-[#16A34A]" />
              Eco-Bounty Verified
            </span>
            <span className="text-xs text-gray-500 font-mono">
              Ticket: {payload.id}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-[#16A34A]" />
            AI Environmental Verification
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/report?bounty=true"
            className="px-3.5 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 text-xs font-semibold text-gray-700 transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>New Report</span>
          </Link>

          <Link
            href="/eco-bounty"
            className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Trophy className="w-4 h-4 text-amber-600" />
            <span>Eco-Bounty Hub</span>
          </Link>
        </div>
      </div>

      {/* ECO-BOUNTY AUDIT VERIFICATION CARD (Hero Box) */}
      <div className="bg-gradient-to-br from-[#14532D] via-[#166534] to-[#14532D] text-white rounded-3xl p-6 sm:p-7 shadow-xl shadow-green-950/15 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-200 text-xs font-bold tracking-wide uppercase flex items-center gap-1.5 border border-emerald-300/30">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                AI Verified: YES
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 text-xs font-bold tracking-wide uppercase flex items-center gap-1.5 border border-amber-300/30">
                <Coins className="w-3.5 h-3.5 text-amber-300" />
                Eco-Bounty Eligible: YES (+{pointsAward} pts)
              </span>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                Ticket: {payload.id} • {analysis.category}
              </h2>
              <p className="text-emerald-100/90 text-sm mt-1 max-w-xl">
                Location: <span className="font-semibold text-white">{payload.location}</span> • Assigned Department: <span className="font-bold text-amber-300">{assignedDept}</span>
              </p>
            </div>

            {payload.voiceTranscript && (
              <div className="p-3 rounded-xl bg-black/25 border border-white/10 text-xs text-emerald-100 flex items-center gap-2">
                <span className="font-bold text-emerald-300 uppercase shrink-0">Voice Input:</span>
                <span className="italic">&ldquo;{payload.voiceTranscript}&rdquo;</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col items-end gap-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-center min-w-[160px] w-full">
              <span className="text-[11px] font-bold text-emerald-200 uppercase tracking-widest block">
                Auditor Reward
              </span>
              <span className="text-3xl font-black text-amber-300 font-mono">
                +{pointsAward} pts
              </span>
              <span className="text-[10px] text-emerald-100/80 block mt-0.5">
                Ready to Claim
              </span>
            </div>

            <button
              onClick={handleCreateMaintenanceTicket}
              disabled={saving || savedSuccess}
              className="w-full py-3.5 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 text-gray-950 font-black text-sm shadow-lg shadow-amber-400/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Wrench className="w-4 h-4 text-gray-900" />
              <span>{saving ? 'Creating Ticket...' : savedSuccess ? 'Ticket Created ✓' : 'Create Maintenance Ticket'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* RESPONSIBLE AI DISCLOSURE / LIMITATIONS */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/90 border border-amber-200/90 text-amber-900 text-xs space-y-2">
        <div className="flex items-center gap-2 font-bold text-sm text-amber-950">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Responsible AI Transparency & Model Limitations</span>
        </div>
        <p className="leading-relaxed text-amber-900">
          <strong className="font-semibold text-amber-950">Campus Verification Protocol:</strong> GreenMind AI identifies visual indicators (such as illuminated fixtures or running taps), but it does not claim certainty regarding unmetered electricity/water consumption without sensor readings. In classroom scenes, AI notes: <em>&quot;No people are clearly visible in the provided image&quot;</em> rather than making assumptions about official room schedule occupancy.
        </p>
        {analysis.uncertainty && analysis.uncertainty.length > 0 && (
          <div className="pt-1 text-amber-800">
            <span className="font-semibold">Noted AI Uncertainty:</span> {analysis.uncertainty.join('; ')}
          </div>
        )}
      </div>

      {/* POTENTIAL RESOURCE IMPACT ESTIMATOR CARD */}
      <ResourceImpactCard
        initialEstimate={analysis.impactEstimate}
        category={analysis.category}
        title={analysis.title}
        description={payload.description}
      />

      {/* 3 Highlights Badges: Category, Severity, Confidence */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Category */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5EBE5] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-[#14532D] flex items-center justify-center font-black text-xl shrink-0">
            ⚡
          </div>
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Issue Category
            </span>
            <span className="text-base font-black text-gray-900">
              {analysis.category}
            </span>
          </div>
        </div>

        {/* Severity */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5EBE5] shadow-xs flex items-center gap-4">
          <div className="shrink-0">
            <SeverityBadge severity={analysis.severity} size="lg" />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Priority Level
            </span>
            <span className="text-sm font-semibold text-gray-600">
              Assigned: {assignedDept}
            </span>
          </div>
        </div>

        {/* Confidence */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5EBE5] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-black text-lg shrink-0">
            {Math.round(analysis.confidence * 100)}%
          </div>
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              AI Confidence
            </span>
            <span className="text-sm font-semibold text-gray-600">
              Multimodal Verification
            </span>
          </div>
        </div>
      </div>

      {/* Image Preview If Available */}
      {payload.image && (
        <div className="bg-white rounded-2xl p-4 border border-[#E5EBE5] shadow-xs">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Auditor Incident Photo
            </span>
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Visually Supported by Gemini Vision
            </span>
          </div>
          <div className="h-64 sm:h-72 w-full rounded-xl overflow-hidden bg-black/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={payload.image}
              alt="Analyzed incident"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* WHAT WE FOUND */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E5EBE5] shadow-xs space-y-3">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
          <span>WHAT WE FOUND</span>
        </h2>
        <p className="text-base sm:text-lg font-semibold text-gray-900 leading-relaxed">
          &quot;{analysis.summary}&quot;
        </p>
        <div className="flex items-center gap-4 text-xs text-gray-500 pt-1">
          <span className="flex items-center gap-1 font-medium text-gray-700">
            <MapPin className="w-3.5 h-3.5 text-[#16A34A]" />
            {payload.location}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            {new Date(payload.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {/* OBSERVATIONS */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E5EBE5] shadow-xs space-y-4">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          AI OBSERVATIONS (EMPIRICAL)
        </h2>
        <ul className="space-y-2.5">
          {analysis.observations.map((obs, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-800 leading-normal">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] mt-2 shrink-0"></span>
              <span>{obs}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* AI ROOT-CAUSE ANALYSIS SECTION */}
      <RootCauseCard
        analysis={analysis.rootCauseAnalysis}
        observedProblemFallback={analysis.title || payload.location}
        locationFallback={payload.location}
      />

      {/* ENVIRONMENTAL IMPACT */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E5EBE5] shadow-xs space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-amber-700">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span>ENVIRONMENTAL IMPACT</span>
        </h2>
        <p className="text-sm sm:text-base text-gray-800 leading-relaxed">
          {analysis.environmental_impact}
        </p>
      </div>

      {/* IMMEDIATE ACTIONS CHECKLIST */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E5EBE5] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            IMMEDIATE ACTIONS (CHECKLIST)
          </h2>
          <span className="text-xs text-gray-500">
            Interactive task checklist
          </span>
        </div>

        <div className="space-y-2.5">
          {analysis.immediate_actions.map((act, idx) => {
            const isChecked = checkedActions[idx] || false;

            return (
              <div
                key={idx}
                onClick={() => handleToggleAction(idx)}
                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all duration-150 ${
                  isChecked
                    ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                    : 'bg-gray-50/80 hover:bg-gray-100/80 border-gray-200 text-gray-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  {isChecked ? (
                    <CheckSquare className="w-5 h-5 text-[#16A34A] shrink-0" />
                  ) : (
                    <Square className="w-5 h-5 text-gray-400 shrink-0" />
                  )}
                  <span className={`text-sm font-medium ${isChecked ? 'line-through opacity-75' : ''}`}>
                    {act}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-red-100 text-red-700">
                    High Priority
                  </span>
                  <span className="text-xs font-semibold text-gray-400">
                    {isChecked ? 'Completed' : 'Pending'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PREVENTIVE ACTIONS */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E5EBE5] shadow-xs space-y-4">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          PREVENTIVE ACTIONS (LONG-TERM)
        </h2>
        <div className="space-y-3">
          {analysis.preventive_actions.map((prev, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-[#F7FAF7] border border-gray-100">
              <span className="w-6 h-6 rounded-lg bg-[#DCFCE7] text-[#14532D] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="text-sm text-gray-800 leading-snug">
                {prev}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* MAINTENANCE STATUS */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E5EBE5] shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${analysis.maintenance_required ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Maintenance Requirement
            </span>
            <span className="text-base font-bold text-gray-900">
              {analysis.maintenance_required
                ? `Dispatched to ${assignedDept}`
                : 'No immediate maintenance intervention required.'}
            </span>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-emerald-100 text-[#14532D] shrink-0">
          Status: AI Verified
        </span>
      </div>

      {/* Action Footer */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link
          href="/report?bounty=true"
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-gray-300 hover:bg-gray-100 text-sm font-bold text-gray-700 transition-colors text-center"
        >
          Back to Report
        </Link>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            href="/assistant"
            className="flex-1 sm:flex-none px-6 py-3.5 rounded-xl bg-white hover:bg-emerald-50 border border-emerald-300 text-[#14532D] text-sm font-bold shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <Bot className="w-4 h-4 text-[#16A34A]" />
            <span>Ask GreenMind</span>
          </Link>

          <button
            onClick={handleCreateMaintenanceTicket}
            disabled={saving || savedSuccess}
            className="flex-1 sm:flex-none px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#16A34A] to-[#14532D] hover:from-[#15803D] hover:to-[#0F391E] text-white text-sm font-extrabold shadow-lg shadow-green-700/25 transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Wrench className="w-4 h-4" />
            <span>{saving ? 'Creating Ticket...' : savedSuccess ? 'Ticket Created ✓' : 'Create Maintenance Ticket'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
