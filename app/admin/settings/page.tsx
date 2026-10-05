'use client';

import React, { useState } from 'react';
import { 
  Settings, 
  Zap, 
  Droplet, 
  Trash2, 
  ShieldCheck, 
  Save, 
  Check, 
  SlidersHorizontal, 
  Sparkles,
  Info,
  Building2,
  Users
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [electricityTariff, setElectricityTariff] = useState(8.00);
  const [waterTariff, setWaterTariff] = useState(35.00);
  const [wasteTariff, setWasteTariff] = useState(12.00);
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Top Header */}
      <div className="bg-[#122419] border border-emerald-500/20 p-6 rounded-3xl text-white">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold mb-2">
          <Settings className="w-3.5 h-3.5" />
          Campus Operations & System Configuration
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Admin System Settings
        </h1>
        <p className="text-xs sm:text-sm text-emerald-200/70 mt-1">
          Configure university resource tariffs, AI diagnostic sensitivity, department assignment rules, and security policies.
        </p>
      </div>

      {savedToast && (
        <div className="p-4 rounded-2xl bg-emerald-950 border border-emerald-500 text-emerald-200 flex items-center gap-3 animate-in fade-in duration-200">
          <Check className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">System settings and utility tariff assumptions saved successfully.</span>
        </div>
      )}

      {/* Resource Tariff Assumptions Form */}
      <form onSubmit={handleSave} className="bg-[#122419] rounded-3xl p-6 sm:p-8 border border-emerald-500/20 shadow-xl space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-emerald-900/50">
          <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Resource Impact Estimator Tariffs</h2>
            <p className="text-xs text-emerald-300/70">
              Assumed campus cost benchmarks used in resource loss calculations
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Electricity Tariff */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Electricity (₹ / kWh)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-xs text-emerald-400 font-bold">₹</span>
              <input
                type="number"
                step="0.1"
                min="1"
                value={electricityTariff}
                onChange={(e) => setElectricityTariff(parseFloat(e.target.value) || 0)}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-[#0A160F] border border-emerald-500/30 text-white font-mono text-sm focus:outline-none focus:border-emerald-400"
              />
            </div>
            <span className="text-[10px] text-emerald-200/50">Default commercial campus power rate</span>
          </div>

          {/* Water Tariff */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              <Droplet className="w-3.5 h-3.5 text-blue-400" />
              Water (₹ / 1,000 Liters)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-xs text-emerald-400 font-bold">₹</span>
              <input
                type="number"
                step="0.5"
                min="1"
                value={waterTariff}
                onChange={(e) => setWaterTariff(parseFloat(e.target.value) || 0)}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-[#0A160F] border border-emerald-500/30 text-white font-mono text-sm focus:outline-none focus:border-emerald-400"
              />
            </div>
            <span className="text-[10px] text-emerald-200/50">Municipal water supply & pumping cost</span>
          </div>

          {/* Waste Handling Tariff */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              <Trash2 className="w-3.5 h-3.5 text-emerald-400" />
              Waste Handling (₹ / kg)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-xs text-emerald-400 font-bold">₹</span>
              <input
                type="number"
                step="0.5"
                min="1"
                value={wasteTariff}
                onChange={(e) => setWasteTariff(parseFloat(e.target.value) || 0)}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-[#0A160F] border border-emerald-500/30 text-white font-mono text-sm focus:outline-none focus:border-emerald-400"
              />
            </div>
            <span className="text-[10px] text-emerald-200/50">Disposal, sorting, & landfill surcharge</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0A160F] border border-emerald-500/20 flex items-start gap-2.5 text-xs text-emerald-300/80">
          <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>
            These parameters dynamically feed the <strong>Resource Impact Estimator</strong> in both the issue detail diagnostics and aggregate campus analytics.
          </span>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 text-xs font-black shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Tariff Configuration</span>
          </button>
        </div>
      </form>

      {/* Role-Based Access Control & Demo Accounts Card */}
      <div className="bg-[#122419] rounded-3xl p-6 sm:p-8 border border-emerald-500/20 shadow-xl space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-emerald-900/50">
          <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Role-Based Access Control (RBAC) & Demo Accounts</h2>
            <p className="text-xs text-emerald-300/70">
              Registered authentication accounts and authorization scopes
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* User Account */}
          <div className="bg-[#0A160F] p-4 rounded-2xl border border-emerald-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase">User / Student Portal</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                role: user
              </span>
            </div>
            <div className="text-sm font-bold text-white">Elakkiyan R. (student@greenmind.demo)</div>
            <p className="text-[11px] text-emerald-200/70">
              Access limited to <code>/user/*</code>: Submit reports, Gemini vision analysis, view Eco-Bounty points, read-only issue status tracking, and Green Assistant.
            </p>
          </div>

          {/* Admin Account */}
          <div className="bg-[#0A160F] p-4 rounded-2xl border border-emerald-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase">Admin Portal</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500 text-gray-950">
                role: admin
              </span>
            </div>
            <div className="text-sm font-bold text-white">Dr. Aris Thorne (admin@greenmind.demo)</div>
            <p className="text-[11px] text-emerald-200/70">
              Access to <code>/admin/*</code>: Dispatch maintenance departments, update status, view recurring problem predictions, campus analytics, and user registry.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
