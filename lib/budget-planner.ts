import { BudgetActionItem, SustainabilityBudgetPlan } from './types';

export const BASELINE_ACTIONS: BudgetActionItem[] = [
  {
    id: 'act-water-leak',
    problem: 'Water Leakage Repair',
    location: 'Boys Hostel Block B & Medical Centre',
    category: 'water',
    estimatedCost: 8000,
    expectedBenefit: 'High water savings (~16,000 L/month saved; eliminates damp wall seepage)',
    priority: 'Critical',
    estimatedRoi: '3.8x (Payback in ~3.2 months)',
    suggestedAction: 'Install high-grade pressure control valves, replace corroded PVC ball valves & leaking junction joints',
    annualSavings: 14400, // Direct water savings (16,000L * 12mo * ₹0.50/L = ₹9,600) + avoided structural water damage
    co2ReductionKg: 120,
    resourceSaved: '192,000 Litres / year',
    paybackMonths: 3.2,
    isBestInvestment: true,
    department: 'Plumbing',
    urgencyReason: 'Active underground joint crack causing daily water loss and foundation moisture seepage',
    relatedIssuesCount: 3,
  },
  {
    id: 'act-led-retrofit',
    problem: 'LED Replacement',
    location: 'IB Block (WW) Classrooms & Learning Center',
    category: 'energy',
    estimatedCost: 20000,
    expectedBenefit: 'Reduced electricity consumption (~480 kWh/month reduction across 12 lecture halls)',
    priority: 'High',
    estimatedRoi: '2.9x (Payback in ~4.6 months)',
    suggestedAction: 'Replace 65 legacy 36W fluorescent batten tubes with 18W smart flicker-free LED fixtures with motion shutoffs',
    annualSavings: 34560, // 480 kWh/mo * 12 mo * ₹6/kWh = ₹34,560
    co2ReductionKg: 4800,
    resourceSaved: '5,760 kWh / year (4.8 tons CO2e)',
    paybackMonths: 4.6,
    isBestInvestment: false,
    department: 'Electrical',
    urgencyReason: 'High wattage lights frequently left burning in empty evening study classrooms',
    relatedIssuesCount: 4,
  },
  {
    id: 'act-waste-infra',
    problem: 'Waste Infrastructure',
    location: 'Cafeteria, Mess & Main Pathway',
    category: 'waste',
    estimatedCost: 12000,
    expectedBenefit: 'Improved waste segregation (~120 kg/month clean plastic & pet bottles diverted for recycling)',
    priority: 'Medium',
    estimatedRoi: '2.1x (Recycling scrap revenue + sanitation labor efficiency)',
    suggestedAction: 'Deploy dual-stream color-coded segregation stations with clear bilingual signage & overflow sensors',
    annualSavings: 10800, // 120 kg/mo * 12 mo * ₹5/kg + avoided municipal disposal penalties
    co2ReductionKg: 860,
    resourceSaved: '1,440 kg segregated plastic / year',
    paybackMonths: 7.2,
    isBestInvestment: false,
    department: 'Waste Management',
    urgencyReason: 'Single-use plastic bottles mixing with wet dining waste, preventing recycling pickup',
    relatedIssuesCount: 5,
  },
  {
    id: 'act-hvac-control',
    problem: 'Smart HVAC & AC Setpoint Automation',
    location: 'AS Block (EW), Research Park & Seminar Hall',
    category: 'energy',
    estimatedCost: 10000,
    expectedBenefit: 'Prevents idle cooling waste (~320 kWh/month cut during low-occupancy conference hours)',
    priority: 'High',
    estimatedRoi: '3.2x (Payback in ~4.1 months)',
    suggestedAction: 'Install programmable AC thermostat lockouts (24°C standard) and PIR occupancy auto-cutoff switches',
    annualSavings: 23040, // 320 kWh/mo * 12 mo * ₹6/kWh
    co2ReductionKg: 3200,
    resourceSaved: '3,840 kWh / year (3.2 tons CO2e)',
    paybackMonths: 4.1,
    isBestInvestment: false,
    department: 'Electrical',
    urgencyReason: 'Split ACs running continuously overnight in unoccupied meeting rooms',
    relatedIssuesCount: 2,
  },
  {
    id: 'act-rainwater-filter',
    problem: 'Rainwater Harvesting Filter Reconditioning',
    location: 'Main Auditorium & Girls Hostel',
    category: 'water',
    estimatedCost: 9000,
    expectedBenefit: 'Restores filtration speed and recharges ~25,000 L groundwater per torrential rain event',
    priority: 'Medium',
    estimatedRoi: '2.4x (Payback in ~5.8 months)',
    suggestedAction: 'Desilt gravel and active sand filtration beds, replace mesh downspout leaf guards and clean settlement tank',
    annualSavings: 15000, // Equivalent value of municipal tanker purchases offset
    co2ReductionKg: 95,
    resourceSaved: '300,000 Litres groundwater recharge / year',
    paybackMonths: 5.8,
    isBestInvestment: false,
    department: 'Plumbing',
    urgencyReason: 'Organic leaf debris clogging tertiary filter mesh, causing rooftop overflow during downpours',
    relatedIssuesCount: 1,
  },
  {
    id: 'act-solar-bollard',
    problem: 'Solar Pathway Bollard Retrofit',
    location: 'A Gate, B Gate & Stone Bench Pathways',
    category: 'energy',
    estimatedCost: 15000,
    expectedBenefit: '100% off-grid dusk-to-dawn security illumination with zero campus grid draw (~210 kWh/month savings)',
    priority: 'Medium',
    estimatedRoi: '2.3x (Payback in ~6.2 months)',
    suggestedAction: 'Install 6 standalone 20W integrated solar PV bollards with LiFePO4 batteries and dusk-dawn sensors',
    annualSavings: 15120, // 210 kWh * 12 mo * ₹6/kWh
    co2ReductionKg: 2100,
    resourceSaved: '2,520 kWh / year (2.1 tons CO2e)',
    paybackMonths: 6.2,
    isBestInvestment: false,
    department: 'Electrical',
    urgencyReason: 'Underground conduit line faults causing repeated breaker trips along perimeter path',
    relatedIssuesCount: 2,
  },
];

/**
 * Greedily or selectively allocates budget across actions and calculates
 * comprehensive ROI, savings, and environmental benefits.
 */
export function calculateBudgetPlan(
  availableBudget: number,
  selectedActionIds?: string[]
): SustainabilityBudgetPlan {
  const budget = Math.max(0, availableBudget);
  
  let chosenActions: BudgetActionItem[] = [];

  if (selectedActionIds && selectedActionIds.length > 0) {
    // Admin explicitly chose specific actions
    chosenActions = BASELINE_ACTIONS.filter(act => selectedActionIds.includes(act.id));
  } else {
    // Default smart auto-allocation:
    // Sort by priority (Critical > High > Medium > Low) and then by ROI
    const priorityWeight: Record<string, number> = {
      Critical: 4,
      High: 3,
      Medium: 2,
      Low: 1,
    };

    const sorted = [...BASELINE_ACTIONS].sort((a, b) => {
      const pDiff = (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
      if (pDiff !== 0) return pDiff;
      return a.paybackMonths - b.paybackMonths;
    });

    let currentCost = 0;
    for (const act of sorted) {
      if (currentCost + act.estimatedCost <= budget) {
        chosenActions.push(act);
        currentCost += act.estimatedCost;
      }
    }

    // If budget is smaller than any single item, pick the single closest item
    if (chosenActions.length === 0 && sorted.length > 0) {
      chosenActions = [sorted[0]];
    }
  }

  const budgetRequired = chosenActions.reduce((sum, act) => sum + act.estimatedCost, 0);
  const remainingBudget = Math.max(0, budget - budgetRequired);
  const utilizationRate = budget > 0 ? Math.min(100, Math.round((budgetRequired / budget) * 100)) : 0;

  const totalAnnualSavings = chosenActions.reduce((sum, act) => sum + act.annualSavings, 0);
  const estimatedThreeYearSavings = totalAnnualSavings * 3;
  const netBenefitThreeYear = estimatedThreeYearSavings - budgetRequired;

  const totalCo2AvoidedKg = chosenActions.reduce((sum, act) => sum + act.co2ReductionKg, 0);
  
  // Resource metrics
  const waterSavedLitersYear = chosenActions
    .filter(a => a.category === 'water')
    .reduce((sum, a) => sum + (a.id === 'act-water-leak' ? 192000 : 300000), 0);

  const energySavedKwhYear = chosenActions
    .filter(a => a.category === 'energy')
    .reduce((sum, a) => sum + (a.id === 'act-led-retrofit' ? 5760 : a.id === 'act-hvac-control' ? 3840 : 2520), 0);

  const wasteSegregatedKgYear = chosenActions
    .filter(a => a.category === 'waste')
    .reduce((sum) => sum + 1440, 0);

  // Best investment is always the highest ROI / critical intervention
  const bestInvestment = BASELINE_ACTIONS.find(a => a.isBestInvestment) || BASELINE_ACTIONS[0];

  return {
    availableBudget: budget,
    recommendedActions: BASELINE_ACTIONS,
    bestInvestment,
    comparison: {
      budgetRequired,
      budgetAvailable: budget,
      remainingBudget,
      utilizationRate,
      totalAnnualSavings,
      estimatedThreeYearSavings,
      netBenefitThreeYear,
      totalCo2AvoidedKg,
      waterSavedLitersYear,
      energySavedKwhYear,
      wasteSegregatedKgYear,
    },
  };
}
