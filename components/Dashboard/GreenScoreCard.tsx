import React from 'react';
import { Award, TrendingUp, HelpCircle } from 'lucide-react';

interface GreenScoreCardProps {
  score: number;
  wasteScore?: number;
  waterScore?: number;
  energyScore?: number;
  greenCoverScore?: number;
  changeText?: string;
}

export default function GreenScoreCard({
  score = 78,
  wasteScore = 82,
  waterScore = 71,
  energyScore = 76,
  greenCoverScore = 85,
  changeText = '↑ 4 points this week',
}: GreenScoreCardProps) {
  const metrics = [
    { label: 'Waste Management', value: wasteScore, color: 'bg-emerald-600', weight: '25%' },
    { label: 'Water Conservation', value: waterScore, color: 'bg-blue-600', weight: '20%' },
    { label: 'Energy Efficiency', value: energyScore, color: 'bg-amber-500', weight: '20%' },
    { label: 'Green Cover', value: greenCoverScore, color: 'bg-teal-600', weight: '20%' },
  ];

  return (
    <div className="bg-white rounded-xl p-6 border border-[#E5EBE5] shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-[#DCFCE7] text-[#14532D]">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm tracking-wider text-gray-900 uppercase">
              CAMPUS GREEN SCORE
            </h3>
            <span className="text-xs text-gray-500">
              Weighted environmental benchmark
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>{changeText}</span>
        </div>
      </div>

      <div className="my-6 flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black text-[#14532D] tracking-tight">
              {score}
            </span>
            <span className="text-xl font-bold text-gray-400">/ 100</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Status: <span className="font-semibold text-emerald-600">Commendable (Target: 85+)</span>
          </p>
        </div>

        <div className="hidden sm:block text-right">
          <div className="inline-flex flex-col items-end">
            <span className="text-xs font-semibold text-gray-500">Calculation Formula</span>
            <span className="text-[11px] text-gray-400">Waste 25% + Water 20% + Energy 20% + Green 20% + Res. 15%</span>
          </div>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="space-y-4 pt-2">
        {metrics.map((m) => (
          <div key={m.label} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-gray-700 flex items-center gap-1.5">
                {m.label}
                <span className="text-[10px] text-gray-400">({m.weight})</span>
              </span>
              <span className="font-bold text-gray-900">{m.value}</span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${m.color} rounded-full transition-all duration-500`}
                style={{ width: `${Math.min(100, Math.max(0, m.value))}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
