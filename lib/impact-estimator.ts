import { 
  EnvironmentalCategory, 
  EnvironmentalIssue, 
  ResourceImpactEstimate, 
  AggregateImpactEstimate 
} from './types';

export interface TariffSettings {
  electricityPerKWh: number; // in INR ₹
  waterPer1000L: number;     // in INR ₹
  wastePerKg: number;        // in INR ₹
}

export const DEFAULT_TARIFFS: TariffSettings = {
  electricityPerKWh: 8.0,  // Standard commercial / institutional tariff in India (~₹8/kWh)
  waterPer1000L: 35.0,     // Institutional municipal supply tariff (~₹35 per 1,000 Liters)
  wastePerKg: 12.0,        // Solid waste handling & sorting cost (~₹12/kg)
};

/**
 * Calculates a transparent, configurable Resource and Cost Impact estimate for an environmental incident.
 * Does NOT invent exact savings from images; computes explicitly based on configurable inputs.
 */
export function estimateResourceImpact(
  category: EnvironmentalCategory | string,
  title: string = '',
  description: string = '',
  customDurationHours?: number,
  customLoadOrRate?: number,
  tariffs: TariffSettings = DEFAULT_TARIFFS
): ResourceImpactEstimate {
  const text = `${title} ${description}`.toLowerCase();
  const cat = (category || '').toLowerCase();

  // 1. ENERGY IMPACT ESTIMATION
  if (cat === 'energy' || text.includes('light') || text.includes('fan') || text.includes('ac') || text.includes('power') || text.includes('spotlight') || text.includes('electricity')) {
    let assumedKW = 1.2; // default: standard classroom with lights and fans
    let durationHours = customDurationHours ?? 2.0;

    if (text.includes('ac') || text.includes('air condition')) {
      assumedKW = 2.4; // 1.5 - 2.0 ton split AC load
      durationHours = customDurationHours ?? 3.0;
    } else if (text.includes('spotlight') || text.includes('halogen')) {
      assumedKW = 1.6; // Four 400W halogen fixtures
      durationHours = customDurationHours ?? 4.0;
    } else if (text.includes('lab') || text.includes('computer')) {
      assumedKW = 3.2; // Multi-computer + ambient lighting
      durationHours = customDurationHours ?? 4.0;
    }

    if (customLoadOrRate !== undefined && customLoadOrRate > 0) {
      assumedKW = customLoadOrRate;
    }

    const calculatedKWh = Number((assumedKW * durationHours).toFixed(2));
    const cost = Number((calculatedKWh * tariffs.electricityPerKWh).toFixed(2));

    return {
      category: 'Energy',
      potentialResourceImpact: `${calculatedKWh} kWh`,
      potentialCostImpact: cost,
      formattedCost: `₹${cost.toFixed(2)}`,
      assumedLoadOrRate: `${assumedKW} kW`,
      assumedLoadValue: assumedKW,
      assumedDurationHours: durationHours,
      calculatedResourceQuantity: calculatedKWh,
      resourceUnit: 'kWh',
      appliedTariff: `₹${tariffs.electricityPerKWh.toFixed(2)} / kWh`,
      tariffRate: tariffs.electricityPerKWh,
      isEstimated: true,
      basis: 'Based on configurable assumptions',
      notes: `Assumed load: ${assumedKW} kW for estimated duration of ${durationHours} hrs at institutional tariff of ₹${tariffs.electricityPerKWh}/kWh.`
    };
  }

  // 2. WATER IMPACT ESTIMATION
  if (cat === 'water' || text.includes('water') || text.includes('leak') || text.includes('pipe') || text.includes('tap') || text.includes('hose') || text.includes('faucet')) {
    let assumedLitersPerHour = 30; // standard leaking tap / joint
    let durationHours = customDurationHours ?? 4.0;

    if (text.includes('burst') || text.includes('severe') || text.includes('pipeline')) {
      assumedLitersPerHour = 75; // pressurized corridor pipe
      durationHours = customDurationHours ?? 3.0;
    } else if (text.includes('hose') || text.includes('canteen')) {
      assumedLitersPerHour = 300; // unvalved washdown hose
      durationHours = customDurationHours ?? 2.0;
    } else if (text.includes('continuous running tap') || text.includes('faucet')) {
      assumedLitersPerHour = 60; // stuck cartridge
      durationHours = customDurationHours ?? 5.0;
    }

    if (customLoadOrRate !== undefined && customLoadOrRate > 0) {
      assumedLitersPerHour = customLoadOrRate;
    }

    const calculatedLiters = Math.round(assumedLitersPerHour * durationHours);
    const cost = Number(((calculatedLiters / 1000) * tariffs.waterPer1000L).toFixed(2));

    return {
      category: 'Water',
      potentialResourceImpact: `${calculatedLiters.toLocaleString()} Liters`,
      potentialCostImpact: cost,
      formattedCost: `₹${cost.toFixed(2)}`,
      assumedLoadOrRate: `${assumedLitersPerHour} L/hr`,
      assumedLoadValue: assumedLitersPerHour,
      assumedDurationHours: durationHours,
      calculatedResourceQuantity: calculatedLiters,
      resourceUnit: 'Liters',
      appliedTariff: `₹${tariffs.waterPer1000L.toFixed(2)} / 1,000 L`,
      tariffRate: tariffs.waterPer1000L,
      isEstimated: true,
      basis: 'Based on configurable assumptions',
      notes: `Assumed flow rate: ${assumedLitersPerHour} L/hr over ${durationHours} hrs at municipal rate of ₹${tariffs.waterPer1000L}/1,000 L.`
    };
  }

  // 3. WASTE & PLASTIC IMPACT ESTIMATION
  let assumedKg = 12; // default waste bin overflow
  let durationHours = customDurationHours ?? 1.0;

  if (text.includes('single-use') || text.includes('plastic') || text.includes('food container')) {
    assumedKg = 8;
  } else if (text.includes('overflowing') || text.includes('debris') || text.includes('drain')) {
    assumedKg = 25;
  } else if (text.includes('unsegregated') || text.includes('mixed')) {
    assumedKg = 18;
  }

  if (customLoadOrRate !== undefined && customLoadOrRate > 0) {
    assumedKg = customLoadOrRate;
  }

  const cost = Number((assumedKg * tariffs.wastePerKg).toFixed(2));

  return {
    category: 'Waste',
    potentialResourceImpact: `${assumedKg} kg`,
    potentialCostImpact: cost,
    formattedCost: `₹${cost.toFixed(2)}`,
    assumedLoadOrRate: `${assumedKg} kg`,
    assumedLoadValue: assumedKg,
    assumedDurationHours: durationHours,
    calculatedResourceQuantity: assumedKg,
    resourceUnit: 'kg',
    appliedTariff: `₹${tariffs.wastePerKg.toFixed(2)} / kg`,
    tariffRate: tariffs.wastePerKg,
    isEstimated: true,
    basis: 'Based on configurable assumptions',
    notes: `Assumed unsegregated/diverted mass of ${assumedKg} kg at institutional sorting and disposal rate of ₹${tariffs.wastePerKg}/kg.`
  };
}

/**
 * Aggregates potential energy, water, waste, and financial impacts across all campus issues.
 */
export function calculateAggregateImpact(
  issues: EnvironmentalIssue[],
  tariffs: TariffSettings = DEFAULT_TARIFFS
): AggregateImpactEstimate {
  let totalEnergyKWh = 0;
  let totalWaterLiters = 0;
  let totalWasteKg = 0;
  let totalCost = 0;

  issues.forEach(issue => {
    const est = issue.impact_estimate || estimateResourceImpact(issue.category, issue.title, issue.description, undefined, undefined, tariffs);
    
    if (est.category === 'Energy') {
      totalEnergyKWh += est.calculatedResourceQuantity;
    } else if (est.category === 'Water') {
      totalWaterLiters += est.calculatedResourceQuantity;
    } else {
      totalWasteKg += est.calculatedResourceQuantity;
    }

    totalCost += est.potentialCostImpact;
  });

  return {
    potentialEnergyKWh: Number(totalEnergyKWh.toFixed(1)),
    potentialWaterLiters: Math.round(totalWaterLiters),
    potentialWasteKg: Number(totalWasteKg.toFixed(1)),
    estimatedTotalCost: Number(totalCost.toFixed(2)),
    tariffs,
    isEstimated: true,
    basis: 'Based on configurable assumptions'
  };
}
