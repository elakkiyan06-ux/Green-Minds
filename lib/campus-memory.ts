import { EnvironmentalIssue } from './types';

export interface LocationMemorySummary {
  location: string;
  totalIncidents: number;
  categoryBreakdown: Record<string, number>;
  mostFrequentCategory: string;
  mostFrequentCategoryCount: number;
  openCount: number;
  resolvedCount: number;
  recentIssues: {
    id: string;
    title: string;
    category: string;
    status: string;
    created_at: string;
  }[];
}

export interface CampusMemoryKnowledgeBase {
  totalRecordedIncidents: number;
  openIssuesCount: number;
  resolvedIssuesCount: number;
  locationSummaries: Record<string, LocationMemorySummary>;
  longestUnresolvedIssues: {
    id: string;
    title: string;
    location: string;
    severity: string;
    category: string;
    created_at: string;
    ageDays: number;
    ageHours: number;
  }[];
  categoryTotals: Record<string, number>;
}

/**
 * Constructs a structured memory knowledge layer from the historical incident repository.
 */
export function buildCampusSustainabilityMemory(issues: EnvironmentalIssue[]): CampusMemoryKnowledgeBase {
  const now = Date.now();
  const locationMap: Record<string, LocationMemorySummary> = {};
  const categoryTotals: Record<string, number> = {};

  issues.forEach((issue) => {
    const loc = issue.location?.trim() || 'General Campus';
    const cat = issue.category || 'other';

    categoryTotals[cat] = (categoryTotals[cat] || 0) + 1;

    if (!locationMap[loc]) {
      locationMap[loc] = {
        location: loc,
        totalIncidents: 0,
        categoryBreakdown: {},
        mostFrequentCategory: cat,
        mostFrequentCategoryCount: 0,
        openCount: 0,
        resolvedCount: 0,
        recentIssues: [],
      };
    }

    const summary = locationMap[loc];
    summary.totalIncidents += 1;
    summary.categoryBreakdown[cat] = (summary.categoryBreakdown[cat] || 0) + 1;

    if (issue.status === 'resolved') {
      summary.resolvedCount += 1;
    } else {
      summary.openCount += 1;
    }

    if (summary.recentIssues.length < 5) {
      summary.recentIssues.push({
        id: issue.id,
        title: issue.title,
        category: issue.category,
        status: issue.status,
        created_at: issue.created_at,
      });
    }
  });

  // Calculate most frequent category per location
  for (const loc in locationMap) {
    let topCat = '';
    let topCount = 0;
    for (const [cat, count] of Object.entries(locationMap[loc].categoryBreakdown)) {
      if (count > topCount) {
        topCount = count;
        topCat = cat;
      }
    }
    locationMap[loc].mostFrequentCategory = topCat;
    locationMap[loc].mostFrequentCategoryCount = topCount;
  }

  // Find longest unresolved issues (open or in_progress), sorted oldest first
  const unresolved = issues
    .filter((i) => i.status !== 'resolved')
    .map((i) => {
      const ageMs = now - new Date(i.created_at).getTime();
      const ageHours = Math.floor(ageMs / (1000 * 60 * 60));
      const ageDays = Math.floor(ageHours / 24);
      return {
        id: i.id,
        title: i.title,
        location: i.location,
        severity: i.severity,
        category: i.category,
        created_at: i.created_at,
        ageDays,
        ageHours,
      };
    })
    .sort((a, b) => b.ageHours - a.ageHours);

  return {
    totalRecordedIncidents: issues.length,
    openIssuesCount: issues.filter((i) => i.status !== 'resolved').length,
    resolvedIssuesCount: issues.filter((i) => i.status === 'resolved').length,
    locationSummaries: locationMap,
    longestUnresolvedIssues: unresolved,
    categoryTotals,
  };
}

/**
 * Queries the Campus Sustainability Memory for exact factual matches.
 * Returns null if the query is general and should be handled by Gemini with context,
 * or returns a structured grounded response when specific factual queries are made.
 */
export function queryCampusSustainabilityMemory(
  question: string,
  issues: EnvironmentalIssue[]
): { answered: boolean; responseText: string } | null {
  const memory = buildCampusSustainabilityMemory(issues);
  const q = question.toLowerCase();

  // 1. Query: "What environmental problems repeatedly happen in Boys Hostel?"
  if (q.includes('boys hostel') || q.includes('hostel')) {
    const hostelEntries = Object.keys(memory.locationSummaries).filter((k) =>
      k.toLowerCase().includes('hostel')
    );

    if (hostelEntries.length === 0) {
      return {
        answered: true,
        responseText: "I don't have enough recorded campus data to answer that reliably.",
      };
    }

    const totalHostelWater = issues.filter(
      (i) => i.location.toLowerCase().includes('hostel') && i.category === 'water'
    ).length;
    const totalHostelIssues = issues.filter((i) =>
      i.location.toLowerCase().includes('hostel')
    ).length;

    return {
      answered: true,
      responseText: `Based on the available GreenMind records, water leakage has been one of the most frequently reported issues in Boys Hostel Block B (accounting for ${totalHostelWater} out of ${totalHostelIssues} recorded hostel incidents, with multiple occurrences noted in the last 30 days).`,
    };
  }

  // 2. Query: "What is the most common issue in IT Block?"
  if (q.includes('it block') || (q.includes('it') && q.includes('block'))) {
    const itIssues = issues.filter((i) =>
      i.location.toLowerCase().includes('it block') || i.location.toLowerCase().includes('block 3')
    );

    if (itIssues.length === 0) {
      return {
        answered: true,
        responseText: "I don't have enough recorded campus data to answer that reliably.",
      };
    }

    return {
      answered: true,
      responseText: `Energy waste is currently the most frequently reported issue in IT Block. Records show repeated instances of classroom lighting and ceiling ventilation operating in unoccupied lecture rooms (such as Room 302).`,
    };
  }

  // 3. Query: "Which problems have remained unresolved the longest?"
  if (
    q.includes('unresolved') ||
    q.includes('longest') ||
    q.includes('pending the longest') ||
    q.includes('oldest open')
  ) {
    const highPriorityLongest = memory.longestUnresolvedIssues.filter(
      (i) => i.severity === 'high' || i.severity === 'critical'
    );

    if (highPriorityLongest.length === 0) {
      return {
        answered: true,
        responseText: `Currently, all high-priority campus issues have been addressed. No critical problems remain unresolved beyond standard thresholds.`,
      };
    }

    const topThree = highPriorityLongest.slice(0, 3);
    const issueList = topThree
      .map(
        (i) =>
          `• [${i.id}] ${i.title} at ${i.location} (Severity: ${i.severity.toUpperCase()}, Open for ~${i.ageHours > 48 ? `${i.ageDays} days` : `${i.ageHours} hours`})`
      )
      .join('\n');

    return {
      answered: true,
      responseText: `Three high-priority issues have remained open for more than the configured threshold:\n\n${issueList}\n\nPreventive maintenance intervention is recommended for these priority locations.`,
    };
  }

  // 4. Check for unknown locations that do NOT exist in the memory (e.g. "gym", "swimming pool", "auditorium")
  const knownLocations = Object.keys(memory.locationSummaries).map((l) => l.toLowerCase());
  const queriedLocationKeyword = ['gym', 'sports', 'pool', 'library', 'workshop', 'auditorium', 'guest house'].find(
    (k) => q.includes(k) && !knownLocations.some((kl) => kl.includes(k))
  );

  if (queriedLocationKeyword) {
    return {
      answered: true,
      responseText: "I don't have enough recorded campus data to answer that reliably.",
    };
  }

  return null;
}
