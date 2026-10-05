'use client';

import React, { useState } from 'react';
import Logo from '@/components/Common/Logo';
import { 
  Settings as SettingsIcon, 
  Sun, 
  Moon, 
  Bell, 
  Bot, 
  Info, 
  RotateCcw, 
  Check, 
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

export default function SettingsPage() {
  const [appearance, setAppearance] = useState<'light' | 'dark'>('light');
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleResetDemoData = async () => {
    try {
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
          <SettingsIcon className="w-7 h-7 text-[#16A34A]" />
          <span>Settings</span>
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Configure application preferences and AI operational parameters.
        </p>
      </div>

      <div className="space-y-6">
        {/* Appearance */}
        <div className="bg-white rounded-2xl p-6 border border-[#E5EBE5] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <Sun className="w-4 h-4 text-[#16A34A]" />
                <span>Appearance</span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Customize the visual theme of the GreenMind interface.
              </p>
            </div>

            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-gray-100 border border-gray-200">
              <button
                type="button"
                onClick={() => setAppearance('light')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  appearance === 'light'
                    ? 'bg-white text-[#14532D] shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>Light</span>
              </button>
              <button
                type="button"
                onClick={() => setAppearance('dark')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  appearance === 'dark'
                    ? 'bg-white text-[#14532D] shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Dark</span>
              </button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl p-6 border border-[#E5EBE5] shadow-xs">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#16A34A]" />
                <span>Environmental Alerts</span>
              </h2>
              <p className="text-xs text-gray-500">
                Receive notifications when high or critical environmental incidents are reported.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={alertsEnabled}
                onChange={(e) => setAlertsEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#16A34A]"></div>
            </label>
          </div>
        </div>

        {/* AI Processing Settings */}
        <div className="bg-white rounded-2xl p-6 border border-[#E5EBE5] shadow-xs">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <Bot className="w-4 h-4 text-[#16A34A]" />
                <span>AI Environmental Analysis</span>
              </h2>
              <p className="text-xs text-gray-500">
                Enable automated severity grading and action plan extraction via Google Gemini 2.0 Flash.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={aiEnabled}
                onChange={(e) => setAiEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#16A34A]"></div>
            </label>
          </div>
        </div>

        {/* Prototype Demo Controls */}
        <div className="bg-white rounded-2xl p-6 border border-[#E5EBE5] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Demo Environment</span>
              </h2>
              <p className="text-xs text-gray-500">
                Hackathon prototype mode active with 10 pre-seeded realistic campus incidents.
              </p>
            </div>

            <button
              onClick={handleResetDemoData}
              className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo State</span>
            </button>
          </div>

          {resetSuccess && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Demo data state refreshed.</span>
            </div>
          )}
        </div>

        {/* About Card */}
        <div className="bg-gradient-to-br from-[#14532D] to-[#0F391E] text-white rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex items-center gap-3">
            <Logo showTagline={false} />
          </div>

          <div className="space-y-1 text-xs text-emerald-100/90 leading-relaxed">
            <p className="font-bold text-white text-sm">
              Green Campus Assistant
            </p>
            <p>
              &quot;From Campus Problems to Sustainable Actions.&quot;
            </p>
            <p className="text-[11px] text-emerald-200/80 pt-1">
              GreenMind empowers college students, staff, and sustainability administrators to collaboratively monitor, diagnose, and resolve campus environmental incidents with Google Gemini Multimodal GenAI.
            </p>
          </div>

          <div className="pt-2 border-t border-emerald-800 flex items-center justify-between text-[11px] text-emerald-300">
            <span>Hackathon Prototype v1.0.0</span>
            <span>Next.js 16 • Tailwind CSS • Gemini 2.0 Flash</span>
          </div>
        </div>
      </div>
    </div>
  );
}
