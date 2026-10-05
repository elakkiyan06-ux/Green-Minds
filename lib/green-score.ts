export interface GreenScoreInput {
  wasteScore: number;
  waterScore: number;
  energyScore: number;
  greenCoverScore: number;
  resolutionRate: number;
}

/**
 * Calculates the Campus Green Score based on the specified weights:
 * Waste Management: 25%
 * Water Conservation: 20%
 * Energy Efficiency: 20%
 * Green Cover: 20%
 * Resolution Rate: 15%
 */
export function calculateGreenScore(input: GreenScoreInput): number {
  const { wasteScore, waterScore, energyScore, greenCoverScore, resolutionRate } = input;
  
  const weighted = 
    (wasteScore * 0.25) +
    (waterScore * 0.20) +
    (energyScore * 0.20) +
    (greenCoverScore * 0.20) +
    (resolutionRate * 0.15);

  return Math.round(weighted);
}

/**
 * Calculates dynamic component scores based on the current active environmental issues
 */
export function deriveScoresFromIssues(issues: Array<{ category: string; status: string; severity: string }>) {
  const total = issues.length;
  if (total === 0) {
    return {
      wasteScore: 82,
      waterScore: 71,
      energyScore: 76,
      greenCoverScore: 85,
      resolutionRate: 86,
      greenScore: 79,
    };
  }

  const resolved = issues.filter(i => i.status === 'resolved').length;
  const resolutionRate = Math.round((resolved / total) * 100);

  // Compute penalty per category based on open/in-progress issues and severity
  const penalty = (cat: string) => {
    const catIssues = issues.filter(i => i.category === cat && i.status !== 'resolved');
    let pts = 0;
    for (const issue of catIssues) {
      if (issue.severity === 'critical') pts += 10;
      else if (issue.severity === 'high') pts += 6;
      else if (issue.severity === 'medium') pts += 3;
      else pts += 1;
    }
    return pts;
  };

  const wasteScore = Math.max(40, Math.min(100, 95 - penalty('waste') - penalty('plastic')));
  const waterScore = Math.max(40, Math.min(100, 92 - penalty('water')));
  const energyScore = Math.max(40, Math.min(100, 94 - penalty('energy')));
  const greenCoverScore = Math.max(40, Math.min(100, 96 - penalty('green_cover')));

  const greenScore = calculateGreenScore({
    wasteScore,
    waterScore,
    energyScore,
    greenCoverScore,
    resolutionRate,
  });

  return {
    wasteScore,
    waterScore,
    energyScore,
    greenCoverScore,
    resolutionRate,
    greenScore,
  };
}
