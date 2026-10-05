'use client';

import React, { useEffect, useState } from 'react';
import ResourceImpactSummary from '@/components/Analytics/ResourceImpactSummary';
import { AggregateImpactEstimate } from '@/lib/types';
import { Zap, Droplet, Trash2, SlidersHorizontal, Info } from 'lucide-react';

export default function AdminResourceImpactPage() {
  const [impactData, setImpactData] = useState<AggregateImpactEstimate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics')
      .then(res => res.json())
      .then(data => {
        if (data?.aggregateImpact) {
          setImpactData(data.aggregateImpact);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="bg-[#122419] border border-emerald-500/20 p-6 rounded-3xl text-white">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold mb-2">
          <Zap className="w-3.5 h-3.5" />
          Financial & Ecological Assessment
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Campus Resource Impact Estimator
        </h1>
        <p className="text-xs sm:text-sm text-emerald-200/70 mt-1 max-w-2xl">
          Estimate potential resource loss (Energy in kWh, Water in Liters, Waste in kg) and financial impact based on transparent, configurable university utility tariffs.
        </p>
      </div>

      {/* Mandatory Transparent Disclaimer Notice */}
      <div className="p-4 rounded-2xl bg-[#122419] border border-emerald-500/30 flex items-start gap-3 text-xs text-emerald-200">
        <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white block">Configurable Model Disclaimer:</span>
          <span>
            All figures are <strong>Estimated</strong> and calculated <strong>based on configurable assumptions</strong> (equipment load wattage, leak flow rate, and demo utility tariffs). These values represent potential avoidance benchmarks and are not presented as measured real-world sensor data.
          </span>
        </div>
      </div>

      {/* Main Resource Impact Summary */}
      <div className="bg-[#122419] border border-emerald-500/20 rounded-3xl p-6 shadow-xl">
        <ResourceImpactSummary initialAggregate={impactData || undefined} />
      </div>
    </div>
  );
}
