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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#E5EBE5] p-6 rounded-3xl text-gray-900 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold mb-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            AI Predictive Maintenance Intelligence
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Campus Recurring Environmental Problems
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Historical incident clustering to identify persistent water leaks, energy waste, and sanitation failures before they escalate.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto shadow-2xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Analysis</span>
        </button>
      </div>

      {/* Main Recurring Problems Component */}
      <div className="bg-white border border-[#E5EBE5] rounded-3xl p-6 shadow-xs">
        <PredictedRecurringProblems predictions={predictions} />
      </div>
    </div>
  );
}
