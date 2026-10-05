'use client';

import React, { useState } from 'react';
import { AggregateImpactEstimate } from '@/lib/types';
import { DEFAULT_TARIFFS, TariffSettings } from '@/lib/impact-estimator';
import { 
  Zap, 
  Droplet, 
  Trash2, 
  Coins, 
  SlidersHorizontal, 
  Info, 
  RefreshCw,
  Check
} from 'lucide-react';

interface ResourceImpactSummaryProps {
  initialAggregate?: AggregateImpactEstimate;
}

export default function ResourceImpactSummary({ initialAggregate }: ResourceImpactSummaryProps) {
  const [tariffs, setTariffs] = useState<TariffSettings>(
    initialAggregate?.tariffs || DEFAULT_TARIFFS
  );
  const [showConfig, setShowConfig] = useState(false);

  // Default baseline quantities from campus incident log
  const baseEnergyKWh = initialAggregate?.potentialEnergyKWh || 124.8;
  const baseWaterLiters = initialAggregate?.potentialWaterLiters || 3850;
  const baseWasteKg = initialAggregate?.potentialWasteKg || 165;

  // Dynamic recalculation on the fly based on configurable tariff inputs
  const calculatedEnergyCost = Number((baseEnergyKWh * tariffs.electricityPerKWh).toFixed(2));
  const calculatedWaterCost = Number(((baseWaterLiters / 1000) * tariffs.waterPer1000L).toFixed(2));
  const calculatedWasteCost = Number((baseWasteKg * tariffs.wastePerKg).toFixed(2));
  const totalEstimatedCost = Number((calculatedEnergyCost + calculatedWaterCost + calculatedWasteCost).toFixed(2));

  const handleResetDefaults = () => {
    setTariffs(DEFAULT_TARIFFS);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E5EBE5] shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1 border border-emerald-200">
              <Zap className="w-3 h-3 text-[#16A34A]" />
              OPERATIONAL & FINANCIAL ROI
            </span>
            <span className="text-xs text-gray-500">• Resource Impact Estimator</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            Campus Resource & Financial Impact Estimator
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Connects observed environmental problems with estimated utility consumption and operational expenditure.
          </p>
        </div>

        <button
          onClick={() => setShowConfig(!showConfig)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-colors self-start sm:self-auto"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-gray-600" />
          <span>{showConfig ? 'Hide Tariff Settings' : 'Configure Tariff Assumptions'}</span>
        </button>
      </div>

      {/* Mandatory Transparent Disclaimer Banner */}
      <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-start gap-3 text-xs text-blue-900">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold block">Calculation Transparency & Methodology:</span>
          <p className="text-blue-800/90 leading-relaxed text-[11px]">
            All values are explicitly <strong>Estimated based on configurable assumptions</strong>. 
            GreenMind does not claim measured metered savings from photos. Estimates apply institutional tariffs to assumed load/flow durations.
          </p>
        </div>
      </div>

      {/* Configurable Tariffs Drawer */}
      {showConfig && (
        <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200/90 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#16A34A]" />
              Adjustable Tariff & Cost Assumptions
            </span>
            <button
              onClick={handleResetDefaults}
              className="text-xs font-semibold text-[#16A34A] hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Reset to Defaults
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                Electricity Tariff (₹ / kWh)
              </label>
              <input
                type="number"
                step="0.5"
                min="1"
                max="30"
                value={tariffs.electricityPerKWh}
                onChange={(e) =>
                  setTariffs({ ...tariffs, electricityPerKWh: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-xs font-bold text-gray-900 focus:outline-none focus:border-[#16A34A]"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">Institutional HT supply default: ₹8.00</span>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                Water Cost (₹ / 1,000 Liters)
              </label>
              <input
                type="number"
                step="5"
                min="5"
                max="150"
                value={tariffs.waterPer1000L}
                onChange={(e) =>
                  setTariffs({ ...tariffs, waterPer1000L: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-xs font-bold text-gray-900 focus:outline-none focus:border-[#16A34A]"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">Municipal commercial rate: ₹35.00</span>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                Waste Handling (₹ / kg)
              </label>
              <input
                type="number"
                step="1"
                min="1"
                max="50"
                value={tariffs.wastePerKg}
                onChange={(e) =>
                  setTariffs({ ...tariffs, wastePerKg: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-xs font-bold text-gray-900 focus:outline-none focus:border-[#16A34A]"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">Segregation & tipping fee: ₹12.00</span>
            </div>
          </div>
        </div>
      )}

      {/* Main 4 Aggregate Impact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Energy Impact */}
        <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                Potential Energy Impact
              </span>
              <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
                <Zap className="w-4 h-4" />
              </div>
            </div>
            <span className="text-2xl sm:text-3xl font-black text-gray-900 font-mono mt-2 block">
              {baseEnergyKWh} <span className="text-sm font-semibold text-gray-500">kWh</span>
            </span>
          </div>

          <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between text-xs">
            <span className="text-gray-500">Estimated Cost:</span>
            <span className="font-bold text-amber-900 font-mono">₹{calculatedEnergyCost.toLocaleString()}</span>
          </div>
          <span className="text-[10px] text-gray-400 block italic">
            Estimated • Based on configurable assumptions
          </span>
        </div>

        {/* Card 2: Water Impact */}
        <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200/80 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">
                Potential Water Impact
              </span>
              <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                <Droplet className="w-4 h-4" />
              </div>
            </div>
            <span className="text-2xl sm:text-3xl font-black text-gray-900 font-mono mt-2 block">
              {baseWaterLiters.toLocaleString()} <span className="text-sm font-semibold text-gray-500">Liters</span>
            </span>
          </div>

          <div className="pt-2 border-t border-blue-200/60 flex items-center justify-between text-xs">
            <span className="text-gray-500">Estimated Cost:</span>
            <span className="font-bold text-blue-900 font-mono">₹{calculatedWaterCost.toLocaleString()}</span>
          </div>
          <span className="text-[10px] text-gray-400 block italic">
            Estimated • Based on configurable assumptions
          </span>
        </div>

        {/* Card 3: Waste Impact */}
        <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                Potential Waste Impact
              </span>
              <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                <Trash2 className="w-4 h-4" />
              </div>
            </div>
            <span className="text-2xl sm:text-3xl font-black text-gray-900 font-mono mt-2 block">
              {baseWasteKg} <span className="text-sm font-semibold text-gray-500">kg</span>
            </span>
          </div>

          <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between text-xs">
            <span className="text-gray-500">Disposal Cost:</span>
            <span className="font-bold text-emerald-900 font-mono">₹{calculatedWasteCost.toLocaleString()}</span>
          </div>
          <span className="text-[10px] text-gray-400 block italic">
            Estimated • Based on configurable assumptions
          </span>
        </div>

        {/* Card 4: Total Cost Impact */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#14532D] to-[#166534] text-white flex flex-col justify-between space-y-3 shadow-md">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider block">
                Estimated Cost Impact
              </span>
              <div className="p-1.5 rounded-lg bg-white/20 text-white">
                <Coins className="w-4 h-4" />
              </div>
            </div>
            <span className="text-2xl sm:text-3xl font-black font-mono mt-2 block">
              ₹{totalEstimatedCost.toLocaleString()}
            </span>
          </div>

          <div className="pt-2 border-t border-white/20 flex items-center justify-between text-xs text-emerald-100">
            <span>Avoidable Campus Spend</span>
            <span className="font-bold text-emerald-300">Preventable</span>
          </div>
          <span className="text-[10px] text-emerald-200/80 block italic">
            Estimated • Based on configurable assumptions
          </span>
        </div>
      </div>
    </div>
  );
}
