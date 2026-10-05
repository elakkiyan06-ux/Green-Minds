'use client';

import React, { useState } from 'react';
import { ResourceImpactEstimate } from '@/lib/types';
import { DEFAULT_TARIFFS, estimateResourceImpact } from '@/lib/impact-estimator';
import { 
  Zap, 
  Droplet, 
  Trash2, 
  Coins, 
  SlidersHorizontal, 
  Info, 
  CheckCircle2,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

interface ResourceImpactCardProps {
  initialEstimate?: ResourceImpactEstimate;
  category?: string;
  title?: string;
  description?: string;
}

export default function ResourceImpactCard({
  initialEstimate,
  category = 'Energy',
  title = '',
  description = ''
}: ResourceImpactCardProps) {
  // Use passed estimate or compute initial
  const base = initialEstimate || estimateResourceImpact(category, title, description);

  const [durationHours, setDurationHours] = useState<number>(base.assumedDurationHours || 2.0);
  const [loadValue, setLoadValue] = useState<number>(base.assumedLoadValue || 1.2);
  const [showAdjust, setShowAdjust] = useState<boolean>(false);

  // Dynamic recalculation
  const recalculated = estimateResourceImpact(
    base.category,
    title,
    description,
    durationHours,
    loadValue
  );

  const isEnergy = base.category === 'Energy';
  const isWater = base.category === 'Water';

  return (
    <div className="bg-gradient-to-br from-amber-50/50 via-white to-orange-50/30 rounded-2xl p-6 border border-amber-200/90 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
            {isEnergy ? <Zap className="w-5 h-5 text-amber-600" /> :
             isWater ? <Droplet className="w-5 h-5 text-blue-600" /> :
             <Trash2 className="w-5 h-5 text-emerald-600" />}
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 block">
              Resource Impact Estimator
            </span>
            <h3 className="text-base font-black text-gray-900 tracking-tight flex items-center gap-1.5">
              <span>⚡ POTENTIAL IMPACT</span>
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAdjust(!showAdjust)}
          className="text-xs font-semibold text-amber-900 hover:text-amber-700 bg-amber-100/70 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 self-start sm:self-auto"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>{showAdjust ? 'Hide Adjustment' : 'Adjust Assumptions'}</span>
        </button>
      </div>

      {/* Main 2-Value Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Resource Value */}
        <div className="p-4 rounded-xl bg-white border border-amber-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
            {isEnergy ? 'Estimated Energy:' : isWater ? 'Estimated Water:' : 'Estimated Waste:'}
          </span>
          <span className="text-2xl font-black text-gray-900 font-mono mt-1 block">
            {recalculated.potentialResourceImpact}
          </span>
          <span className="text-[10px] text-gray-500 block mt-1">
            Based on {recalculated.assumedLoadOrRate} over {recalculated.assumedDurationHours}h
          </span>
        </div>

        {/* Cost Value */}
        <div className="p-4 rounded-xl bg-white border border-amber-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
            Estimated Cost:
          </span>
          <span className="text-2xl font-black text-amber-700 font-mono mt-1 block">
            {recalculated.formattedCost}
          </span>
          <span className="text-[10px] text-gray-500 block mt-1">
            Based on configured demo tariff ({recalculated.appliedTariff})
          </span>
        </div>
      </div>

      {/* Optional Interactive Adjustment Sliders */}
      {showAdjust && (
        <div className="p-4 rounded-xl bg-white/90 border border-gray-200 space-y-3 animate-in slide-in-from-top-1 duration-150">
          <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">
            Configure Incident Assumptions:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                <span>Assumed {isEnergy ? 'Load (kW)' : isWater ? 'Flow Rate (L/hr)' : 'Mass (kg)'}:</span>
                <span className="font-mono">{loadValue} {isEnergy ? 'kW' : isWater ? 'L/hr' : 'kg'}</span>
              </div>
              <input
                type="range"
                min={isEnergy ? 0.2 : isWater ? 10 : 2}
                max={isEnergy ? 6.0 : isWater ? 300 : 50}
                step={isEnergy ? 0.1 : isWater ? 5 : 1}
                value={loadValue}
                onChange={(e) => setLoadValue(parseFloat(e.target.value))}
                className="w-full accent-amber-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                <span>Estimated Duration:</span>
                <span className="font-mono">{durationHours} hours</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={24}
                step={0.5}
                value={durationHours}
                onChange={(e) => setDurationHours(parseFloat(e.target.value))}
                className="w-full accent-amber-600"
              />
            </div>
          </div>
        </div>
      )}

      {/* Transparent Calculation Breakdown Box */}
      <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-xs space-y-1.5 font-medium text-amber-950">
        <div className="font-bold flex items-center justify-between text-[11px] text-amber-900 uppercase">
          <span>Calculation Methodology</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 font-bold">Transparent</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
          <div>
            <span className="text-gray-500 block text-[9px] uppercase font-sans">Assumed Load:</span>
            <span>{recalculated.assumedLoadOrRate}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-[9px] uppercase font-sans">Estimated Duration:</span>
            <span>{recalculated.assumedDurationHours} hours</span>
          </div>
          <div>
            <span className="text-gray-500 block text-[9px] uppercase font-sans">
              {isEnergy ? 'Estimated Energy:' : isWater ? 'Estimated Water:' : 'Estimated Waste:'}
            </span>
            <span className="font-bold">{recalculated.potentialResourceImpact}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-[9px] uppercase font-sans">Estimated Cost:</span>
            <span className="font-bold text-amber-800">{recalculated.formattedCost}</span>
          </div>
        </div>
      </div>

      {/* Mandatory Regulatory / Responsible AI Footer Label */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[10px] text-gray-500 border-t border-amber-100 pt-2">
        <span className="font-semibold text-amber-800">
          • Label: Estimated • Based on configurable assumptions
        </span>
        <span className="italic">
          Do not present estimates as measured real-world savings.
        </span>
      </div>
    </div>
  );
}
