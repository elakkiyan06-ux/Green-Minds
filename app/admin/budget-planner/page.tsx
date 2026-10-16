'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Calculator, 
  Coins, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  Wrench, 
  Droplet, 
  Zap, 
  Trash2, 
  Clock, 
  FileText, 
  Download, 
  Check, 
  Sliders, 
  Building2, 
  Info,
  Calendar,
  Send,
  RefreshCw,
  X
} from 'lucide-react';
import { BudgetActionItem, SustainabilityBudgetPlan } from '@/lib/types';
import { calculateBudgetPlan, BASELINE_ACTIONS } from '@/lib/budget-planner';

const PRESET_BUDGETS = [
  { label: '₹25,000', value: 25000, desc: 'Quick Micro-Fixes' },
  { label: '₹50,000', value: 50000, desc: 'Recommended Standard' },
  { label: '₹75,000', value: 75000, desc: 'Multi-Block Program' },
  { label: '₹1,00,000', value: 100000, desc: 'Campus Overhaul' },
];

export default function SustainabilityBudgetPlannerPage() {
  const [budgetInput, setBudgetInput] = useState<string>('50000');
  const [budgetNumber, setBudgetNumber] = useState<number>(50000);
  const [selectedIds, setSelectedIds] = useState<string[]>([
    'act-water-leak',
    'act-led-retrofit',
    'act-waste-infra',
    'act-hvac-control'
  ]);
  const [filterCategory, setFilterCategory] = useState<'all' | 'water' | 'energy' | 'waste'>('all');
  const [dispatchedSuccess, setDispatchedSuccess] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);

  // Sync typed input with numeric budget
  const handleBudgetChange = (val: string) => {
    setBudgetInput(val);
    const parsed = parseInt(val.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(parsed)) {
      setBudgetNumber(parsed);
    } else {
      setBudgetNumber(0);
    }
  };

  const handleSelectPreset = (val: number) => {
    setBudgetInput(String(val));
    setBudgetNumber(val);
  };

  // Auto optimize allocation: greedy fit highest priority & ROI within budget
  const handleAutoOptimize = () => {
    const autoPlan = calculateBudgetPlan(budgetNumber);
    // Find the actions chosen by greedy calculation
    let runningCost = 0;
    const optimalIds: string[] = [];
    
    // Sort critical and high first
    const sorted = [...BASELINE_ACTIONS].sort((a, b) => {
      const pMap: Record<string, number> = { Critical: 4, High: 3, Medium: 2, Low: 1 };
      const pDiff = (pMap[b.priority] || 0) - (pMap[a.priority] || 0);
      if (pDiff !== 0) return pDiff;
      return a.paybackMonths - b.paybackMonths;
    });

    for (const act of sorted) {
      if (runningCost + act.estimatedCost <= budgetNumber) {
        optimalIds.push(act.id);
        runningCost += act.estimatedCost;
      }
    }

    if (optimalIds.length === 0 && sorted.length > 0) {
      optimalIds.push(sorted[0].id);
    }

    setSelectedIds(optimalIds);
  };

  const handleToggleAction = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedIds(BASELINE_ACTIONS.map(a => a.id));
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  // Recalculate plan based on active budget and current selections
  const plan: SustainabilityBudgetPlan = useMemo(() => {
    return calculateBudgetPlan(budgetNumber, selectedIds);
  }, [budgetNumber, selectedIds]);

  const { comparison, bestInvestment } = plan;
  const isOverBudget = comparison.budgetRequired > budgetNumber;
  const budgetVariance = budgetNumber - comparison.budgetRequired;

  // Filter actions for display
  const filteredActions = useMemo(() => {
    if (filterCategory === 'all') return plan.recommendedActions;
    return plan.recommendedActions.filter(a => a.category === filterCategory);
  }, [plan.recommendedActions, filterCategory]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16 text-gray-900">
      {/* 1. Header & Navigation Context */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white border border-[#E5EBE5] p-6 rounded-3xl shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase tracking-wide flex items-center gap-1.5 shadow-2xs">
              <Calculator className="w-3.5 h-3.5 text-[#16A34A]" />
              Capital Allocation & ROI Engine
            </span>
            <span className="text-xs text-gray-500">• Facilities Financial Planning</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Sustainability Budget Planner
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-2xl leading-relaxed">
            Enter your available campus sustainability budget. GreenMind evaluates active environmental telemetry, recurring failure patterns, and utility tariffs to recommend maximum-impact interventions.
          </p>
        </div>

        {/* Quick Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleAutoOptimize}
            className="px-3.5 py-2.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
            title="Automatically allocate budget for highest environmental ROI"
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>AI Auto-Optimize Allocation</span>
          </button>

          <button
            onClick={() => setShowExportModal(true)}
            className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <Download className="w-4 h-4 text-gray-500" />
            <span>Export Summary</span>
          </button>
        </div>
      </div>

      {/* 2. Mandatory Disclaimer Banner (Constraint: Do not present AI estimates as guaranteed financial returns) */}
      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-amber-900 flex items-start gap-3 shadow-2xs">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <span className="font-bold text-amber-950 uppercase tracking-wider block mb-0.5">
            Advisory on AI Environmental & Financial Projections
          </span>
          All ROI figures, payback durations, and projected utility savings are simulated analytical estimates based on campus tariffs 
          (<strong>₹6.00/kWh</strong> electricity, <strong>₹0.50/L</strong> water, <strong>₹5.00/kg</strong> scrap plastic) and standard engineering lifecycles. 
          They are provided solely for administrative prioritization and capital planning, <strong>not guaranteed financial returns</strong>.
        </div>
      </div>

      {/* 3. Budget Input & Allocation Controller Card */}
      <div className="bg-white border border-[#E5EBE5] rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-gray-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1">
              Available Sustainability Budget
            </span>
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl font-black text-[#14532D]">₹</span>
              <input
                type="text"
                value={budgetInput}
                onChange={(e) => handleBudgetChange(e.target.value)}
                placeholder="50,000"
                className="text-2xl sm:text-3xl font-black text-gray-900 border-b-2 border-emerald-500 focus:outline-none focus:border-[#16A34A] bg-transparent py-0.5 w-48 sm:w-64 font-mono tracking-tight"
              />
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-400 font-bold mr-1 hidden sm:inline">Presets:</span>
            {PRESET_BUDGETS.map((preset) => (
              <button
                key={preset.value}
                onClick={() => handleSelectPreset(preset.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  budgetNumber === preset.value
                    ? 'bg-[#16A34A] text-white shadow-xs'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
                }`}
              >
                <span>{preset.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Live Allocation KPI Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#F8FAF8] border border-gray-100">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Available Budget</span>
            <div className="text-2xl font-black text-gray-900 mt-1 font-mono">
              ₹{budgetNumber.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-gray-500 font-medium">Campus facilities pool</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8FAF8] border border-gray-100">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Allocated / Required</span>
            <div className={`text-2xl font-black mt-1 font-mono ${isOverBudget ? 'text-red-600' : 'text-[#16A34A]'}`}>
              ₹{comparison.budgetRequired.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-gray-500 font-medium">
              {selectedIds.length} recommended action{selectedIds.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8FAF8] border border-gray-100">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              {isOverBudget ? 'Budget Shortfall' : 'Unallocated Buffer'}
            </span>
            <div className={`text-2xl font-black mt-1 font-mono ${isOverBudget ? 'text-red-600' : 'text-emerald-700'}`}>
              ₹{Math.abs(budgetVariance).toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-gray-500 font-medium">
              {isOverBudget ? 'Exceeds target budget' : 'Available for contingency'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8FAF8] border border-gray-100">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Capital Utilization</span>
            <div className={`text-2xl font-black mt-1 font-mono ${isOverBudget ? 'text-red-600' : 'text-gray-900'}`}>
              {comparison.utilizationRate}%
            </div>
            {/* Progress bar */}
            <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${
                  isOverBudget ? 'bg-red-500' : 'bg-[#16A34A]'
                }`}
                style={{ width: `${Math.min(100, comparison.utilizationRate)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. AI Best Investment Spotlight Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-amber-50/40 border-2 border-emerald-300/80 p-6 sm:p-7 shadow-xs">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#16A34A]" />
              AI Best Investment Recommendation
            </div>

            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                <span>{bestInvestment.problem}</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-200 uppercase">
                  {bestInvestment.priority} Priority
                </span>
              </h3>
              <p className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-gray-400" />
                <span>{bestInvestment.location}</span>
                <span>•</span>
                <span className="font-semibold text-emerald-700">{bestInvestment.department} Dept</span>
              </p>
            </div>

            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              <strong>Why this is the highest return investment:</strong> Allocating <strong>₹{bestInvestment.estimatedCost.toLocaleString('en-IN')}</strong> to 
              repair active underground supply lines eliminates continuous wastage of <strong>16,000 L/month</strong> and halts compounding moisture damage to foundation pillars. 
              With a rapid payback of <strong>{bestInvestment.paybackMonths} months</strong> and <strong>{bestInvestment.estimatedRoi}</strong>, this delivers the fastest break-even of any campus project.
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-4 text-xs font-bold text-gray-700">
              <span className="flex items-center gap-1.5 text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded-lg border border-emerald-200">
                <Coins className="w-4 h-4 text-[#16A34A]" />
                Estimated Cost: ₹{bestInvestment.estimatedCost.toLocaleString('en-IN')}
              </span>
              <span className="flex items-center gap-1.5 text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                <Droplet className="w-4 h-4 text-blue-600" />
                {bestInvestment.expectedBenefit}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 w-full lg:w-auto">
            <button
              onClick={() => {
                if (!selectedIds.includes(bestInvestment.id)) {
                  setSelectedIds(prev => [...prev, bestInvestment.id]);
                }
              }}
              disabled={selectedIds.includes(bestInvestment.id)}
              className={`px-5 py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                selectedIds.includes(bestInvestment.id)
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                  : 'bg-[#16A34A] hover:bg-[#15803D] text-white shadow-xs'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>{selectedIds.includes(bestInvestment.id) ? 'Included in Plan' : 'Add to Budget Plan'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5. Comparison Dashboard: Budget Required vs Environmental Impact vs Cost Savings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">
              Investment Impact & Savings Comparison
            </h2>
            <p className="text-xs text-gray-500">
              Cross-metric evaluation of capital deployment across verified campus operational dimensions.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card A: Budget Required */}
          <div className="bg-white border border-[#E5EBE5] rounded-3xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-emerald-600" />
                  Budget Required
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                  {selectedIds.length} Projects
                </span>
              </div>

              <div className="mt-4">
                <div className="text-3xl sm:text-4xl font-black text-gray-900 font-mono tracking-tight">
                  ₹{comparison.budgetRequired.toLocaleString('en-IN')}
                </div>
                <span className="text-xs text-gray-500 mt-1 block">
                  Out of ₹{budgetNumber.toLocaleString('en-IN')} available
                </span>
              </div>

              <div className="mt-5 space-y-2 text-xs text-gray-600">
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span>Plumbing & Leakage:</span>
                  <span className="font-bold font-mono text-gray-900">
                    ₹{(selectedIds.includes('act-water-leak') ? 8000 : 0) + (selectedIds.includes('act-rainwater-filter') ? 9000 : 0)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span>Electrical & Lighting:</span>
                  <span className="font-bold font-mono text-gray-900">
                    ₹{(selectedIds.includes('act-led-retrofit') ? 20000 : 0) + (selectedIds.includes('act-hvac-control') ? 10000 : 0) + (selectedIds.includes('act-solar-bollard') ? 15000 : 0)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span>Waste Segregation Infra:</span>
                  <span className="font-bold font-mono text-gray-900">
                    ₹{selectedIds.includes('act-waste-infra') ? 12000 : 0}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-500">Allocation Health:</span>
              <span className={`font-bold ${isOverBudget ? 'text-red-600' : 'text-[#16A34A]'}`}>
                {isOverBudget ? 'Over Budget Shortfall' : 'Balanced & Sustainable'}
              </span>
            </div>
          </div>

          {/* Card B: Expected Environmental Impact */}
          <div className="bg-white border border-[#E5EBE5] rounded-3xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Droplet className="w-4 h-4 text-blue-600" />
                  Expected Environmental Benefit
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                  Verified Yield
                </span>
              </div>

              <div className="mt-4 space-y-3.5">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-600 flex items-center gap-1">
                      <Droplet className="w-3.5 h-3.5 text-blue-500" /> Water Saved:
                    </span>
                    <span className="font-bold text-gray-900 font-mono">
                      {comparison.waterSavedLitersYear.toLocaleString()} L / yr
                    </span>
                  </div>
                  <div className="w-full bg-blue-50 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-600 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-500" /> Energy Conserved:
                    </span>
                    <span className="font-bold text-gray-900 font-mono">
                      {comparison.energySavedKwhYear.toLocaleString()} kWh / yr
                    </span>
                  </div>
                  <div className="w-full bg-amber-50 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-600 flex items-center gap-1">
                      <Trash2 className="w-3.5 h-3.5 text-teal-600" /> Plastic Diverted:
                    </span>
                    <span className="font-bold text-gray-900 font-mono">
                      {comparison.wasteSegregatedKgYear.toLocaleString()} kg / yr
                    </span>
                  </div>
                  <div className="w-full bg-teal-50 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-teal-500 h-full rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-500">CO2 Equivalent Avoided:</span>
              <span className="font-black text-[#16A34A]">
                {comparison.totalCo2AvoidedKg.toLocaleString()} kg CO2e / yr
              </span>
            </div>
          </div>

          {/* Card C: Potential Cost Savings */}
          <div className="bg-white border border-[#E5EBE5] rounded-3xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-[#16A34A]" />
                  Potential Cost Savings
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Data-Driven Model
                </span>
              </div>

              <div className="mt-4">
                <div className="text-3xl sm:text-4xl font-black text-[#16A34A] font-mono tracking-tight">
                  ₹{comparison.totalAnnualSavings.toLocaleString('en-IN')}
                </div>
                <span className="text-xs text-gray-500 mt-1 block">
                  Projected Annual Utility Reduction
                </span>
              </div>

              <div className="mt-5 space-y-2 text-xs text-gray-600">
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span>3-Year Cumulative Savings:</span>
                  <span className="font-bold font-mono text-gray-900">
                    ₹{comparison.estimatedThreeYearSavings.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span>Net 3-Year Benefit:</span>
                  <span className="font-bold font-mono text-[#16A34A]">
                    +₹{Math.max(0, comparison.netBenefitThreeYear).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span>Average Payback Window:</span>
                  <span className="font-bold font-mono text-gray-900">
                    ~4.2 months
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-500">Financial Multiplier:</span>
              <span className="font-black text-amber-600">
                ~2.9x Return over 36 mo
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Recommended Actions Table / Card List */}
      <div className="bg-white border border-[#E5EBE5] rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">
              Actionable Campus Interventions
            </h2>
            <p className="text-xs text-gray-500">
              Check or uncheck actions to adjust your sustainability budget allocation in real time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Category Filter Pills */}
            <div className="inline-flex rounded-xl bg-gray-50 p-1 border border-gray-200 text-xs font-bold">
              {(['all', 'water', 'energy', 'waste'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1 rounded-lg capitalize transition-colors ${
                    filterCategory === cat
                      ? 'bg-white text-gray-900 shadow-2xs'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              onClick={handleSelectAll}
              className="px-2.5 py-1 text-xs font-semibold text-gray-600 hover:text-gray-900"
            >
              Select All
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={handleClearSelection}
              className="px-2.5 py-1 text-xs font-semibold text-gray-600 hover:text-gray-900"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredActions.map((action) => {
            const isSelected = selectedIds.includes(action.id);
            const priorityBadge = 
              action.priority === 'Critical' 
                ? 'bg-red-50 text-red-700 border-red-200' 
                : action.priority === 'High' 
                ? 'bg-amber-50 text-amber-700 border-amber-200' 
                : 'bg-emerald-50 text-emerald-800 border-emerald-200';

            const categoryIcon = 
              action.category === 'water' ? <Droplet className="w-4 h-4 text-blue-500" /> :
              action.category === 'energy' ? <Zap className="w-4 h-4 text-amber-500" /> :
              <Trash2 className="w-4 h-4 text-teal-600" />;

            return (
              <div
                key={action.id}
                onClick={() => handleToggleAction(action.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer select-none relative ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/20 shadow-xs'
                    : 'border-[#E5EBE5] bg-white hover:border-gray-300'
                }`}
              >
                {/* Header: Checkbox + Problem Title + Priority */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}} // Handled by card click
                      className="mt-1 w-4 h-4 rounded text-[#16A34A] focus:ring-emerald-500 focus:ring-offset-0 cursor-pointer"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        {categoryIcon}
                        <h4 className="text-base font-bold text-gray-900">
                          {action.problem}
                        </h4>
                        {action.isBestInvestment && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                            AI Pick
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3 text-gray-400" />
                        {action.location}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider shrink-0 ${priorityBadge}`}>
                    {action.priority}
                  </span>
                </div>

                {/* Key Metrics Grid */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs bg-[#F8FAF8] p-3 rounded-xl border border-gray-100">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Estimated Cost</span>
                    <span className="text-sm font-black text-gray-900 font-mono">
                      ₹{action.estimatedCost.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Estimated ROI</span>
                    <span className="text-xs font-bold text-[#16A34A]">
                      {action.estimatedRoi}
                    </span>
                  </div>
                </div>

                {/* Expected Environmental Benefit */}
                <div className="mt-3 text-xs">
                  <span className="font-bold text-gray-700 block">Expected Environmental Benefit:</span>
                  <p className="text-gray-600 mt-0.5 leading-relaxed">
                    {action.expectedBenefit}
                  </p>
                </div>

                {/* Suggested Action */}
                <div className="mt-3 pt-3 border-t border-gray-100 text-xs">
                  <span className="font-bold text-gray-700 block">Suggested Action:</span>
                  <p className="text-gray-600 mt-0.5 leading-relaxed">
                    {action.suggestedAction}
                  </p>
                </div>

                {/* Footer Badges */}
                <div className="mt-3 pt-2 flex items-center justify-between text-[11px] text-gray-500 font-medium">
                  <span>Assigned Dept: <strong className="text-gray-800">{action.department}</strong></span>
                  <span className="text-emerald-700 font-bold">₹{action.annualSavings.toLocaleString('en-IN')}/yr saved</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dispatch Action Bar */}
        <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs text-gray-600">
            Selected <strong>{selectedIds.length} actions</strong> requiring <strong>₹{comparison.budgetRequired.toLocaleString('en-IN')}</strong> of the ₹{budgetNumber.toLocaleString('en-IN')} budget.
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setDispatchedSuccess(true);
                setTimeout(() => setDispatchedSuccess(false), 5000);
              }}
              disabled={selectedIds.length === 0}
              className="px-5 py-2.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Dispatch Selected Work Orders ({selectedIds.length})</span>
            </button>
          </div>
        </div>

        {/* Dispatch Feedback Alert */}
        {dispatchedSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3 animate-in fade-in duration-200">
            <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0" />
            <div className="text-xs">
              <strong className="block font-bold">Sustainability Work Orders Successfully Dispatched!</strong>
              Work orders for {selectedIds.length} recommended actions totaling ₹{comparison.budgetRequired.toLocaleString('en-IN')} have been assigned to respective campus maintenance departments with budgeted allocations.
            </div>
          </div>
        )}
      </div>

      {/* 7. Export / Executive Summary Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-[#E5EBE5] text-gray-900 relative">
            <button
              onClick={() => setShowExportModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#16A34A] uppercase tracking-wider">
                <Calculator className="w-3.5 h-3.5" />
                Executive Capital Summary
              </div>
              <h3 className="text-xl font-black text-gray-900">
                GreenMind Sustainability Budget Plan
              </h3>
              <p className="text-xs text-gray-500">
                Generated for Campus Administration & Facilities Management Board
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FAF8] border border-gray-200 space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span>Available Budget:</span>
                <strong>₹{budgetNumber.toLocaleString('en-IN')}</strong>
              </div>
              <div className="flex justify-between">
                <span>Allocated Investment:</span>
                <strong className="text-[#16A34A]">₹{comparison.budgetRequired.toLocaleString('en-IN')}</strong>
              </div>
              <div className="flex justify-between">
                <span>Remaining Buffer:</span>
                <strong>₹{Math.max(0, budgetVariance).toLocaleString('en-IN')}</strong>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span>Est. Annual Savings:</span>
                <strong className="text-emerald-700">₹{comparison.totalAnnualSavings.toLocaleString('en-IN')} / yr</strong>
              </div>
              <div className="flex justify-between">
                <span>3-Year Net Benefit:</span>
                <strong className="text-emerald-700">+₹{comparison.netBenefitThreeYear.toLocaleString('en-IN')}</strong>
              </div>
              <div className="flex justify-between">
                <span>Total CO2 Avoided:</span>
                <strong>{comparison.totalCo2AvoidedKg.toLocaleString()} kg / yr</strong>
              </div>
            </div>

            <div className="text-[11px] text-gray-500 italic leading-relaxed">
              * Note: Estimates are based on current tariffs (₹6/kWh, ₹0.50/L, ₹5/kg) and do not represent guaranteed financial returns.
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  window.print();
                  setShowExportModal(false);
                }}
                className="flex-1 py-3 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Print / Save as PDF</span>
              </button>

              <button
                onClick={() => setShowExportModal(false)}
                className="py-3 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
