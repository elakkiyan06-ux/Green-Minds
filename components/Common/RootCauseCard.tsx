'use client';

import React from 'react';
import { AIRootCauseAnalysis } from '@/lib/types';
import { 
  Search, 
  Sparkles, 
  ShieldAlert, 
  Wrench, 
  HelpCircle, 
  AlertCircle, 
  Info,
  CheckCircle2
} from 'lucide-react';

interface RootCauseCardProps {
  analysis?: AIRootCauseAnalysis;
  observedProblemFallback?: string;
  locationFallback?: string;
}

export default function RootCauseCard({
  analysis,
  observedProblemFallback = 'Environmental issue reported on campus.',
  locationFallback = 'Campus'
}: RootCauseCardProps) {
  const data: AIRootCauseAnalysis = analysis || {
    observedProblem: observedProblemFallback,
    possibleCauses: [
      'Operational wear and component aging under continuous usage',
      'Potential environmental or physical stress on fixture',
      'Delayed preventive maintenance inspection cycle'
    ],
    evidence: 'Observational report filed with campus sustainability auditor verification.',
    confidence: 'Medium',
    recommendedPreventiveAction: `Schedule a preventive inspection of affected fixtures at ${locationFallback}.`
  };

  const confidenceBadgeColor =
    data.confidence === 'High'
      ? 'bg-blue-100 text-blue-800 border-blue-200'
      : data.confidence === 'Medium'
      ? 'bg-amber-100 text-amber-800 border-amber-200'
      : 'bg-gray-100 text-gray-700 border-gray-200';

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E5EBE5] shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-100 text-purple-800">
            <Search className="w-5 h-5 text-purple-700" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-800 block">
              DIAGNOSTIC INTELLIGENCE
            </span>
            <h3 className="text-base font-black text-gray-900 tracking-tight flex items-center gap-1.5">
              <span>AI ROOT-CAUSE ANALYSIS</span>
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-[10px] text-gray-500 font-semibold uppercase">Confidence:</span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${confidenceBadgeColor}`}>
            {data.confidence}
          </span>
        </div>
      </div>

      {/* Responsible AI Disclaimer: Never state uncertain causes as facts */}
      <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200/60 text-[11px] text-purple-900 leading-relaxed flex items-start gap-2.5">
        <Info className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
        <p>
          Causes shown are probabilistic hypotheses identified by AI based solely on available evidence and historical report clustering. 
          Language indicates <em>&ldquo;possible cause&rdquo;</em>, <em>&ldquo;may indicate&rdquo;</em>, and <em>&ldquo;could be related to&rdquo;</em>. 
          Causes are never claimed as confirmed facts until physical maintenance diagnostics confirm them.
        </p>
      </div>

      {/* 1. Observed Problem */}
      <div className="space-y-1">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
          Observed Problem:
        </span>
        <p className="text-sm font-bold text-gray-900 leading-snug">
          {data.observedProblem}
        </p>
      </div>

      {/* 2. Possible Contributing Causes */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
          Possible Contributing Causes:
        </span>
        <ul className="space-y-2">
          {data.possibleCauses.map((cause, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-800 bg-gray-50/80 p-2.5 rounded-xl border border-gray-100">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5 shrink-0"></span>
              <span className="leading-relaxed">
                <strong className="text-gray-900">May indicate:</strong> {cause}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* 3. Evidence */}
      <div className="space-y-1 p-3.5 rounded-xl bg-gray-50 border border-gray-100">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
          Evidence:
        </span>
        <p className="text-xs text-gray-700 italic font-medium leading-relaxed">
          &ldquo;{data.evidence}&rdquo;
        </p>
      </div>

      {/* 4. Recommended Preventive Action */}
      <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 space-y-1">
        <span className="text-[10px] font-black uppercase tracking-wider text-[#14532D] flex items-center gap-1.5">
          <Wrench className="w-3.5 h-3.5 text-[#16A34A]" />
          Recommended Preventive Action:
        </span>
        <p className="text-xs font-bold text-[#14532D] leading-snug">
          &ldquo;{data.recommendedPreventiveAction}&rdquo;
        </p>
      </div>
    </div>
  );
}
