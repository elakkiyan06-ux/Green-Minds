'use client';

import React, { useEffect, useState } from 'react';
import PredictedRecurringProblems from '@/components/Analytics/PredictedRecurringProblems';
import { RecurringProblemPrediction } from '@/lib/types';
import { AlertTriangle, Wrench, ShieldCheck, RefreshCw } from 'lucide-react';

export default function AdminRecurringProblemsPage() {
  const [predictions, setPredictions] = useState<RecurringProblemPrediction[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    fetch('/api/analytics')
      .then(res => res.json())
      .then(data => {
        if (data?.predictedRecurringProblems) {
          setPredictions(data.predictedRecurringProblems);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#122419] border border-emerald-500/20 p-6 rounded-3xl text-white">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold mb-2">
            <AlertTriangle className="w-3.5 h-3.5" />
            AI Predictive Maintenance Intelligence
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Campus Recurring Environmental Problems
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200/70 mt-1">
            Historical incident clustering to identify persistent water leaks, energy waste, and sanitation failures before they escalate.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Analysis</span>
        </button>
      </div>

      {/* Main Recurring Problems Component */}
      <div className="bg-[#122419] border border-emerald-500/20 rounded-3xl p-6 shadow-xl">
        <PredictedRecurringProblems predictions={predictions} />
      </div>
    </div>
  );
}
