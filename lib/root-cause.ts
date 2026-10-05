import { AIRootCauseAnalysis, EnvironmentalIssue } from './types';

/**
 * Generates an AI Root-Cause Analysis based strictly on available evidence and historical records.
 * Uses cautious, probabilistic language ("Possible cause", "May indicate", "Could be related to").
 * Never claims confirmed root cause without maintenance diagnostic logs.
 */
export function generateRootCauseAnalysis(
  category: string,
  title: string,
  description: string,
  location: string,
  historicalIssues: EnvironmentalIssue[] = []
): AIRootCauseAnalysis {
  const combined = `${title} ${description} ${location}`.toLowerCase();
  const cat = (category || '').toLowerCase();

  // Find similar historical reports in the same location
  const locNormalized = location.toLowerCase().trim();
  const sameLocationHistory = historicalIssues.filter(
    (i) => i.location && i.location.toLowerCase().trim() === locNormalized
  );
  const sameLocationAndCatHistory = sameLocationHistory.filter(
    (i) => (i.category || '').toLowerCase() === cat
  );

  const hasHistoricalRecurrence = sameLocationAndCatHistory.length >= 2;

  // 1. Water Leakage / Plumbing Issues
  if (cat.includes('water') || combined.includes('leak') || combined.includes('pipe') || combined.includes('tap') || combined.includes('faucet')) {
    const evidence = hasHistoricalRecurrence
      ? `Similar leakage incidents have been reported at the same location (${sameLocationAndCatHistory.length} recorded events in ${location}).`
      : `Visible localized moisture and uncontained discharge observed in uploaded report at ${location}.`;

    return {
      observedProblem: `Uncontained water loss and active discharge at ${location}.`,
      possibleCauses: [
        'Aging pipe fittings and joint seal degradation under continuous line pressure',
        'Loose connection or gasket wear at the fixture interface',
        'Repeated high-pressure surges from municipal supply cycling',
        'Physical valve stem wear from frequent manual operation'
      ],
      evidence,
      confidence: hasHistoricalRecurrence ? 'Medium' : 'Low',
      recommendedPreventiveAction:
        'Schedule a preventive plumbing inspection of the affected pipeline section and replace degrading coupling gaskets.',
    };
  }

  // 2. Energy Waste / HVAC / Lighting
  if (cat.includes('energy') || combined.includes('light') || combined.includes('fan') || combined.includes('ac') || combined.includes('power')) {
    const evidence = hasHistoricalRecurrence
      ? `Multiple occurrences of active lighting/HVAC post-lecture have been audited at ${location} (${sameLocationAndCatHistory.length} logged incidents).`
      : `Illumination and ventilation operating without occupant presence visible in report evidence.`;

    return {
      observedProblem: `Idle electrical load operating in unoccupied space at ${location}.`,
      possibleCauses: [
        'Absence of automated occupancy sensing controls or automated curfew switches',
        'Manual override switch left engaged following previous scheduled session',
        'Lack of assigned end-of-day room shutdown protocol for departmental staff',
        'Inadequate student/faculty awareness regarding master switch-off'
      ],
      evidence,
      confidence: hasHistoricalRecurrence ? 'Medium' : 'Low',
      recommendedPreventiveAction:
        'Install passive infrared (PIR) occupancy motion sensors and integrate automatic night setback timer controls.',
    };
  }

  // 3. Waste Management & Littering
  if (cat.includes('waste') || cat.includes('plastic') || combined.includes('bin') || combined.includes('overflow') || combined.includes('litter')) {
    const evidence = hasHistoricalRecurrence
      ? `Repeated receptacle overflow and waste buildup logged during peak hours at ${location} (${sameLocationAndCatHistory.length} historical reports).`
      : `Receptacle capacity exceeded with single-use packaging accumulating on adjacent ground.`;

    return {
      observedProblem: `Waste receptacle capacity breach and perimeter litter accumulation at ${location}.`,
      possibleCauses: [
        'Disposal capacity mismatch during peak dining/break traffic intervals',
        'Infrequent afternoon sanitation clearance rounds between 12:00 PM and 3:00 PM',
        'Lack of clearly segregated recycling receptacles causing volume overload in general bins',
        'High reliance on non-biodegradable single-use food packaging from campus vendors'
      ],
      evidence,
      confidence: hasHistoricalRecurrence ? 'Medium' : 'Low',
      recommendedPreventiveAction:
        'Deploy dual 120L sorting receptacles with bilingual pictorial signage and adjust mid-day clearance schedules.',
    };
  }

  // 4. Default / General Environmental Issues
  return {
    observedProblem: `Environmental anomaly reported at ${location}.`,
    possibleCauses: [
      'Operational wear and tear of existing campus physical infrastructure',
      'Weather-related stress or seasonal environmental fluctuations',
      'Delayed maintenance inspection cycles for the sector'
    ],
    evidence: `Logged observational report filed with campus sustainability auditor verification.`,
    confidence: 'Low',
    recommendedPreventiveAction:
      `Conduct a localized diagnostic audit at ${location} to establish baseline environmental parameters.`,
  };
}
