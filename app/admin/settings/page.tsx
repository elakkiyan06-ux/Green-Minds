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
  const [electricityTariff, setElectricityTariff] = useState(6.00);
  const [waterTariff, setWaterTariff] = useState(0.50);
  const [wasteTariff, setWasteTariff] = useState(5.00);
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Top Header */}
      <div className="bg-white border border-[#E5EBE5] p-6 rounded-3xl text-gray-900 shadow-xs">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold mb-2">
          <Settings className="w-3.5 h-3.5 text-[#16A34A]" />
          Campus Operations & System Configuration
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Admin System Settings
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Configure university resource tariffs, AI diagnostic sensitivity, department assignment rules, and security policies.
        </p>
      </div>

      {savedToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3 animate-in fade-in duration-200 shadow-xs">
          <Check className="w-5 h-5 text-[#16A34A] shrink-0" />
          <span className="text-xs font-bold">System settings and utility tariff assumptions saved successfully.</span>
        </div>
      )}

      {/* Resource Tariff Assumptions Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5EBE5] shadow-xs space-y-6 text-gray-900">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-[#16A34A] border border-emerald-200 flex items-center justify-center">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">Resource Impact Estimator Tariffs</h2>
            <p className="text-xs text-gray-500">
              Assumed campus cost benchmarks used in resource loss calculations
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Electricity Tariff */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Electricity (₹ / kWh)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-xs text-gray-500 font-bold">₹</span>
              <input
                type="number"
                step="0.1"
                min="1"
                value={electricityTariff}
                onChange={(e) => setElectricityTariff(parseFloat(e.target.value) || 0)}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-[#F8FAF8] border border-gray-200 text-gray-900 font-mono text-sm focus:outline-none focus:border-[#16A34A]"
              />
            </div>
            <span className="text-[10px] text-gray-400">Campus electricity tariff (default: ₹6.00)</span>
          </div>

          {/* Water Tariff */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
              <Droplet className="w-3.5 h-3.5 text-blue-500" />
              Water (₹ / Liter)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-xs text-gray-500 font-bold">₹</span>
              <input
                type="number"
                step="0.05"
                min="0.01"
                value={waterTariff}
                onChange={(e) => setWaterTariff(parseFloat(e.target.value) || 0)}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-[#F8FAF8] border border-gray-200 text-gray-900 font-mono text-sm focus:outline-none focus:border-[#16A34A]"
              />
            </div>
            <span className="text-[10px] text-gray-400">Campus water supply rate: ₹0.50/L (₹500/1,000L)</span>
          </div>

          {/* Waste Handling Tariff */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
              <Trash2 className="w-3.5 h-3.5 text-[#16A34A]" />
              Plastic & Waste (₹ / kg)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-xs text-gray-500 font-bold">₹</span>
              <input
                type="number"
                step="0.5"
                min="1"
                value={wasteTariff}
                onChange={(e) => setWasteTariff(parseFloat(e.target.value) || 0)}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-[#F8FAF8] border border-gray-200 text-gray-900 font-mono text-sm focus:outline-none focus:border-[#16A34A]"
              />
            </div>
            <span className="text-[10px] text-gray-400">Plastic & solid waste handling (default: ₹5.00)</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-2.5 text-xs text-emerald-950">
          <Info className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
          <span>
            These parameters dynamically feed the <strong>Resource Impact Estimator</strong> in both the issue detail diagnostics and aggregate campus analytics.
          </span>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold shadow-2xs transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Tariff Configuration</span>
          </button>
        </div>
      </form>

      {/* Role-Based Access Control & Demo Accounts Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5EBE5] shadow-xs space-y-5 text-gray-900">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-[#16A34A] border border-emerald-200 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">Role-Based Access Control (RBAC) & Demo Accounts</h2>
            <p className="text-xs text-gray-500">
              Registered authentication accounts and authorization scopes
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* User Account */}
          <div className="bg-[#F8FAF8] p-4 rounded-2xl border border-gray-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 uppercase">User / Student Portal</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                role: user
              </span>
            </div>
            <div className="text-sm font-bold text-gray-900">Elakkiyan R. (student@greenmind.demo)</div>
            <p className="text-[11px] text-gray-500">
              Access limited to <code>/user/*</code>: Submit reports, Gemini vision analysis, view Eco-Bounty points, read-only issue status tracking, and Green Assistant.
            </p>
          </div>

          {/* Admin Account */}
          <div className="bg-[#F8FAF8] p-4 rounded-2xl border border-gray-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-900 uppercase">Admin Portal</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#16A34A] text-white">
                role: admin
              </span>
            </div>
            <div className="text-sm font-bold text-gray-900">Dr. Aris Thorne (admin@greenmind.demo)</div>
            <p className="text-[11px] text-gray-500">
              Access to <code>/admin/*</code>: Dispatch maintenance departments, update status, view recurring problem predictions, campus analytics, and user registry.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
