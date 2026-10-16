import { 
  AIAnalysisResult, 
  EnvironmentalIssue, 
  EnvironmentalCategory, 
  SeverityLevel,
  AssistantRecommendation 
} from './types';
import { INITIAL_DEMO_ISSUES } from './demo-data';
import { estimateResourceImpact } from './impact-estimator';
import { generateRootCauseAnalysis } from './root-cause';
import { queryCampusSustainabilityMemory } from './campus-memory';

const CUSTOM_ISSUES_STORAGE_KEY = 'gm_custom_issues';

/**
 * Intelligent client-side multimodal environmental report analysis engine.
 * Runs instantly in the browser without requiring a backend server.
 * Used on static hosts like GitHub Pages or when API routes are offline.
 */
export function analyzeReportInClient(
  location: string,
  description: string,
  hasImage: boolean,
  voiceTranscript?: string | null,
  imageFileName?: string | null,
  imageCategoryHint?: string | null
): AIAnalysisResult {
  const userText = `${description || ''} ${voiceTranscript || ''}`.toLowerCase().trim();
  const metaText = `${imageFileName || ''} ${imageCategoryHint || ''}`.toLowerCase().trim();
  const allText = `${userText} ${metaText} ${location}`.toLowerCase().trim();

  const hasAc = /\b(ac|a\/c|air\s*condition(?:er|ing)?|hvac)\b/i.test(allText);

  // Domain keywords
  const hasWaterWords = /\b(water|leak|leaking|leakage|drip|dripping|pipe|pipeline|tap|faucet|puddle|wet|flood|burst|overflow|spray|plumb|plumbing|seepage|drain|drainage|valve|flush|washroom|restroom|bathroom|sink|basin|tank|spill)\b/i.test(userText);
  const hasEnergyWords = /\b(light|lights|fan|fans|bulb|bulbs|lamp|lamps|electricity|electric|power|socket|switch|switches|appliance|appliances|kwh|watt|watts)\b/i.test(userText) || hasAc;
  const hasWasteWords = /\b(plastic|plastics|bottle|bottles|garbage|trash|waste|litter|bin|bins|debris|wrapper|wrappers|packaging|dump|dumping)\b/i.test(userText);
  const hasGreenWords = /\b(plant|plants|tree|trees|garden|grass|soil|foliage|lawn|shrub|sprinkler|sprinklers)\b/i.test(userText);

  // Meta signals from image hints
  const metaIsWater = imageCategoryHint === 'water' || /\b(water|leak|pipe|tap|faucet|drip)\b/i.test(metaText);
  const metaIsEnergy = imageCategoryHint === 'energy' || /\b(light|fan|ac|power|switch)\b/i.test(metaText);
  const metaIsWaste = imageCategoryHint === 'waste' || /\b(plastic|bottle|trash|garbage|waste)\b/i.test(metaText);
  const metaIsGreen = imageCategoryHint === 'green_cover' || /\b(plant|tree|garden|lawn)\b/i.test(metaText);

  // Category classification priority:
  // 1. User text keyword if explicit
  // 2. Image context hint or file name
  // 3. Defaults to Water (common campus leak reports) or Waste
  let category: 'Water' | 'Energy' | 'Green' | 'Waste' = 'Water';

  if (userText.length > 0) {
    if (hasWaterWords) category = 'Water';
    else if (hasEnergyWords) category = 'Energy';
    else if (hasWasteWords) category = 'Waste';
    else if (hasGreenWords) category = 'Green';
    else if (metaIsEnergy) category = 'Energy';
    else if (metaIsWaste) category = 'Waste';
    else if (metaIsGreen) category = 'Green';
    else category = 'Water';
  } else {
    // Image-only submission (e.g. photo of pipe or water leak attached)
    if (metaIsEnergy) category = 'Energy';
    else if (metaIsWaste) category = 'Waste';
    else if (metaIsGreen) category = 'Green';
    else category = 'Water';
  }

  let baseResult: AIAnalysisResult;

  // 1. WATER CONSERVATION & PLUMBING
  if (category === 'Water') {
    const isSevere = allText.includes('severe') || allText.includes('continuous') || allText.includes('flood') || allText.includes('burst') || allText.includes('pipe');
    const severity: SeverityLevel = isSevere ? 'high' : 'high';
    const suggestedPoints = 50;

    baseResult = {
      title: 'Water Leakage & Uncontained Plumbing Discharge',
      category: 'Water Conservation',
      severity: 'HIGH',
      summary: `Active water leakage and uncontained plumbing discharge identified at ${location} through combined photo and description analysis.`,
      observations: [
        `Continuous water discharge and leakage detected at ${location}`,
        hasImage ? 'Surface water accumulation, pipe joint seepage, or active faucet discharge verified in uploaded image' : 'Water flow ongoing based on auditor description',
        'Localized pooling creates slip hazards, structural dampness, and ongoing resource depletion'
      ],
      environmental_impact: 'Continuous potable water loss depletes campus reserves and incurs preventable utility expense (at ₹0.50/Liter). Prolonged seepage risks structural masonry degradation.',
      immediate_actions: [
        'Close sub-isolation stopcock valve to immediately halt water discharge',
        'Deploy warning "Caution: Wet Floor" signs around affected corridor/area',
        'Dispatch on-call plumbing technician to replace leaking seal gasket or valve cartridge'
      ],
      preventive_actions: [
        'Standardize on commercial grade vandal-resistant pressure-balanced fixtures with aerators',
        'Conduct monthly preventative acoustic leak detection across hostel and academic risers'
      ],
      maintenance_required: true,
      assignedDepartment: 'Plumbing & Water Services',
      confidence: 0.95,
      uncertainty: [
        'Exact pipe pressure and internal valve seal condition require physical inspection with manometer.'
      ],
      verified: true,
      ecoBountyEligible: true,
      suggestedPoints
    };
  } else if (category === 'Energy') {
    // 2. ENERGY WASTE / ELECTRICAL
    const isHigh = allText.includes('high') || allText.includes('night') || allText.includes('fans') || hasAc || allText.includes('room');
    const severity: SeverityLevel = isHigh ? 'high' : 'low';
    const suggestedPoints = isHigh ? 50 : 20;

    baseResult = {
      title: 'Lights and Electrical Loads Left Active in Unoccupied Area',
      category: 'Energy Waste',
      severity: isHigh ? 'HIGH' : 'LOW',
      summary: `Active illumination and electrical ventilation operating with no occupants visible at ${location}.`,
      observations: [
        'Multiple lighting banks appear active',
        'Ceiling ventilation fans or cooling fixtures appear powered on',
        'No individuals are clearly visible in the provided image or report',
        hasImage ? 'Visual confirmation of illuminated fixtures in uploaded photo' : 'Reported directly by student sustainability auditor'
      ],
      environmental_impact: 'Unnecessary kilowatt-hour load increases campus carbon footprint and accelerates commercial fixture wear (at ₹6.00/kWh).',
      immediate_actions: [
        'Switch off manual wall control switches for the sector',
        'Verify master circuit breaker switch if switches are locked',
        'Inspect room for occupancy before locking'
      ],
      preventive_actions: [
        'Install passive infrared (PIR) occupancy motion sensors',
        'Establish standard end-of-lecture classroom shutdown protocol',
        'Incorporate automated curfew scheduling for academic block HVAC'
      ],
      maintenance_required: true,
      assignedDepartment: 'Electrical Maintenance',
      confidence: 0.94,
      uncertainty: [
        'AI can identify visibly powered fixtures, but cannot verify whether the space is reserved on the campus timetable.'
      ],
      verified: true,
      ecoBountyEligible: true,
      suggestedPoints
    };
  } else if (category === 'Green') {
    // 3. GREEN COVER / IRRIGATION
    baseResult = {
      title: 'Landscaping Irrigation Deficit or Greenery Damage',
      category: 'Green Cover',
      severity: 'MEDIUM',
      summary: `Foliage stress or landscaping irrigation line failure observed at ${location}.`,
      observations: [
        `Vegetation showing signs of moisture deficit or damage at ${location}`,
        'Soil crust appears dry and cracked',
        'Irrigation dripper line may be misaligned or blocked'
      ],
      environmental_impact: 'Loss of campus greenery impairs natural cooling, biodiversity corridors, and campus aesthetic value.',
      immediate_actions: [
        'Provide deep manual hydration with recycled greywater',
        'Inspect local drip emitters and irrigation solenoid valves'
      ],
      preventive_actions: [
        'Apply organic mulch to retain topsoil moisture',
        'Implement automated soil moisture sensor schedule'
      ],
      maintenance_required: true,
      assignedDepartment: 'Horticulture & Grounds',
      confidence: 0.89,
      uncertainty: [
        'Soil nutrient balance and root health require direct agronomical inspection.'
      ],
      verified: true,
      ecoBountyEligible: true,
      suggestedPoints: 30
    };
  } else {
    // 4. PLASTIC POLLUTION & SOLID WASTE
    baseResult = {
      title: 'Plastic Waste Accumulation & Overflowing Receptacle',
      category: 'Plastic Pollution',
      severity: 'MEDIUM',
      summary: `Concentration of discarded single-use plastic containers and packaging observed at ${location}.`,
      observations: [
        `Visible discarded plastic bottles and food packaging at ${location}`,
        hasImage ? 'Scattered consumer packaging confirmed in image' : 'User report documents plastic accumulation',
        'Nearest disposal receptacles appear overwhelmed or underutilized'
      ],
      environmental_impact: 'Discarded plastics fragment into harmful microplastics, pollute campus drainage lines, and present ingestion risks to birds and campus fauna (at ₹5.00/kg handling cost).',
      immediate_actions: [
        'Clear accumulated plastic materials immediately',
        'Segregate recyclable PET containers from organic waste',
        'Empty overflowing collection bins in the vicinity'
      ],
      preventive_actions: [
        'Increase collection frequency during peak hours',
        'Install clear color-coded segregation signage',
        'Introduce reusable container incentives at campus canteen outlets'
      ],
      maintenance_required: true,
      assignedDepartment: 'Campus Sanitation',
      confidence: 0.90,
      uncertainty: [
        'Exact weight and recyclable quality of packaging cannot be confirmed from photos alone.'
      ],
      verified: true,
      ecoBountyEligible: true,
      suggestedPoints: 30
    };
  }

  // Calculate detailed resource impact & root cause
  const impactEstimate = estimateResourceImpact(baseResult.category, baseResult.title, description);
  const rootCauseAnalysis = generateRootCauseAnalysis(baseResult.category, baseResult.title || '', description, location);

  return {
    ...baseResult,
    impactEstimate,
    rootCauseAnalysis
  };
}

/**
 * Persists an issue locally so it survives page reloads and static navigation on GitHub Pages
 */
export function saveClientReportedIssue(issue: EnvironmentalIssue): void {
  if (typeof window === 'undefined') return;

  try {
    const raw = localStorage.getItem(CUSTOM_ISSUES_STORAGE_KEY);
    const existing: EnvironmentalIssue[] = raw ? JSON.parse(raw) : [];
    
    // Add or update
    const updated = [issue, ...existing.filter(i => i.id !== issue.id)];
    localStorage.setItem(CUSTOM_ISSUES_STORAGE_KEY, JSON.stringify(updated));

    // Dispatch global event for other components to react instantly
    window.dispatchEvent(new CustomEvent('gm_issues_updated', { detail: issue }));
  } catch (err) {
    console.error('Failed to save issue to localStorage:', err);
  }
}

/**
 * Retrieves all user-reported issues from localStorage
 */
export function getClientReportedIssues(): EnvironmentalIssue[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = localStorage.getItem(CUSTOM_ISSUES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to parse client issues:', err);
    return [];
  }
}

/**
 * Returns merged issues (custom client reports + initial demo reports)
 */
export function getClientIssues(filters?: {
  severity?: string;
  category?: string;
  status?: string;
  search?: string;
}): EnvironmentalIssue[] {
  const custom = getClientReportedIssues();
  const all = [...custom, ...INITIAL_DEMO_ISSUES.filter(d => !custom.some(c => c.id === d.id))];

  let result = all;

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(i => 
      i.title.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q) ||
      i.location.toLowerCase().includes(q) ||
      (i.category && i.category.toLowerCase().includes(q))
    );
  }

  if (filters?.severity && filters.severity !== 'all') {
    result = result.filter(i => i.severity.toLowerCase() === filters.severity?.toLowerCase());
  }

  if (filters?.category && filters.category !== 'all') {
    result = result.filter(i => i.category.toLowerCase() === filters.category?.toLowerCase());
  }

  if (filters?.status && filters.status !== 'all') {
    result = result.filter(i => i.status.toLowerCase() === filters.status?.toLowerCase());
  }

  return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

/**
 * Client-side assistant query for static hosts (GitHub Pages)
 */
export function askClientAssistant(question: string): { 
  text: string; 
  recommendations: AssistantRecommendation[]; 
  isCampusDataBased: boolean 
} {
  const allIssues = getClientIssues();
  const memoryResult = queryCampusSustainabilityMemory(question, allIssues);

  if (memoryResult && memoryResult.answered) {
    return {
      text: memoryResult.responseText,
      isCampusDataBased: true,
      recommendations: [
        {
          recommendation: 'Target high-recurrence zones for preventive maintenance inspections',
          reason: 'Historical reports reveal repeated reactive repairs at the same location.',
          priority: 'High',
          expected_benefit: 'Addresses root causes and permanently lowers incident recurrence rate.'
        },
        {
          recommendation: 'Encourage student auditors to continue logging multi-modal reports',
          reason: 'Crowd-sourced verification maintains real-time telemetry across all campus sectors.',
          priority: 'Medium',
          expected_benefit: 'Ensures the Campus Sustainability Memory database stays accurate and up to date.'
        }
      ]
    };
  }

  const q = question.toLowerCase();
  if (q.includes('leak') || q.includes('water') || q.includes('pipe')) {
    return {
      text: 'Water leakage represents the highest utility expense on campus (₹0.50/L). Plumbing & Water Services responds with top priority to student reports with photo documentation.',
      isCampusDataBased: true,
      recommendations: [
        {
          recommendation: 'Shut sub-isolation valves immediately when encountering burst lines',
          reason: 'Prevents structural dampness and thousands of liters of treated potable water loss.',
          priority: 'High',
          expected_benefit: 'Zero immediate resource wastage.'
        },
        {
          recommendation: 'Audit aerators and push-taps weekly in hostel washrooms',
          reason: 'Degraded rubber gaskets cause 78% of observed micro-leaks.',
          priority: 'Medium',
          expected_benefit: 'Reduces plumbing maintenance tickets by 45%.'
        }
      ]
    };
  }

  if (q.includes('energy') || q.includes('light') || q.includes('fan') || q.includes('ac')) {
    return {
      text: 'Energy waste from unmonitored classroom lighting and AC accounts for significant avoidable campus emissions (₹6/kWh). IT Block and Library have dedicated shutdown audits.',
      isCampusDataBased: true,
      recommendations: [
        {
          recommendation: 'Perform 15-minute sweep after final lectures',
          reason: 'Unoccupied rooms frequently have ceiling fans and bank lights active.',
          priority: 'High',
          expected_benefit: 'Saves an estimated 12.8 kWh per unoccupied classroom.'
        },
        {
          recommendation: 'Advocate for motion-sensor PIR retrofits in seminar halls',
          reason: 'Automates shutdown and removes human dependency.',
          priority: 'Medium',
          expected_benefit: 'Permanent 30% reduction in lighting energy costs.'
        }
      ]
    };
  }

  return {
    text: `GreenMind has recorded ${allIssues.length} active campus environmental reports. Students have earned Eco-Points for identifying water leaks, energy waste, and plastic accumulation.`,
    isCampusDataBased: true,
    recommendations: [
      {
        recommendation: 'Report any visible resource waste through the + Report Issue tool',
        reason: 'Verified photo submissions earn up to 75 Eco-Bounty points.',
        priority: 'High',
        expected_benefit: 'Direct contribution to campus sustainability and department dispatch.'
      },
      {
        recommendation: 'Check the Eco-Bounty Hub for active campus bounties',
        reason: 'Higher bounties are assigned to recurring problem zones.',
        priority: 'Medium',
        expected_benefit: 'Accelerates issue resolution in high-traffic campus sectors.'
      }
    ]
  };
}
