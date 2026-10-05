import { 
  EnvironmentalIssue, 
  IssueAction, 
  AnalyticsSummary, 
  EnvironmentalCategory, 
  SeverityLevel, 
  IssueStatus,
  EcoBountyStats,
  EcoAuditor
} from './types';
import { 
  INITIAL_DEMO_ISSUES, 
  INITIAL_ECO_STATS, 
  DEMO_LEADERBOARD 
} from './demo-data';
import { deriveScoresFromIssues } from './green-score';
import { getSupabase } from './supabase';
import { predictRecurringProblems } from './prediction';
import { calculateAggregateImpact, estimateResourceImpact } from './impact-estimator';
import { generateRootCauseAnalysis } from './root-cause';

// Persistent in-memory array for demo server-side execution
let memoryIssues: EnvironmentalIssue[] = [...INITIAL_DEMO_ISSUES];
let memoryEcoStats: EcoBountyStats = { ...INITIAL_ECO_STATS };
let memoryLeaderboard: EcoAuditor[] = [...DEMO_LEADERBOARD];

export async function getAllIssues(filters?: {
  severity?: string;
  category?: string;
  status?: string;
  location?: string;
  search?: string;
  bountyOnly?: boolean;
}): Promise<EnvironmentalIssue[]> {
  const supabase = getSupabase();

  if (supabase) {
    try {
      let query = supabase.from('environmental_issues').select('*, actions(*)').order('created_at', { ascending: false });
      
      if (filters?.severity && filters.severity !== 'all') {
        query = query.eq('severity', filters.severity.toLowerCase());
      }
      if (filters?.category && filters.category !== 'all') {
        query = query.eq('category', filters.category.toLowerCase());
      }
      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status.toLowerCase());
      }
      if (filters?.location && filters.location !== 'all') {
        query = query.eq('location', filters.location);
      }
      if (filters?.bountyOnly) {
        query = query.eq('eco_bounty_eligible', true);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data as EnvironmentalIssue[];
      }
    } catch {
      // Fallback to memory store if Supabase query fails
    }
  }

  // Use memory store
  let result = [...memoryIssues];

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      i =>
        i.title.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.location.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q) ||
        (i.assigned_department && i.assigned_department.toLowerCase().includes(q))
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

  if (filters?.location && filters.location !== 'all') {
    result = result.filter(i => i.location.toLowerCase() === filters.location?.toLowerCase());
  }

  if (filters?.bountyOnly) {
    result = result.filter(i => Boolean(i.eco_bounty_eligible));
  }

  return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function getIssueById(id: string): Promise<EnvironmentalIssue | null> {
  const supabase = getSupabase();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('environmental_issues')
        .select('*, actions(*)')
        .eq('id', id)
        .single();
      if (!error && data) {
        return data as EnvironmentalIssue;
      }
    } catch {
      // Fallback to memory
    }
  }

  const found = memoryIssues.find(i => i.id === id);
  return found || null;
}

export async function createIssue(newIssueData: Partial<EnvironmentalIssue>): Promise<EnvironmentalIssue> {
  const nextNumber = memoryIssues.length + 1;
  const id = newIssueData.id || `EB-${1040 + nextNumber}`;

  const severity = (newIssueData.severity || 'medium') as SeverityLevel;
  const defaultPoints = severity === 'critical' ? 75 : severity === 'high' ? 50 : severity === 'medium' ? 30 : 20;
  const ecoPoints = newIssueData.eco_bounty_points ?? defaultPoints;

  const issue: EnvironmentalIssue = {
    id,
    title: newIssueData.title || `Issue at ${newIssueData.location || 'Campus'}`,
    description: newIssueData.description || '',
    category: (newIssueData.category || 'waste') as EnvironmentalCategory,
    location: newIssueData.location || 'Block 3',
    severity,
    status: (newIssueData.status || 'open') as IssueStatus,
    image_url: newIssueData.image_url || undefined,
    ai_summary: newIssueData.ai_summary || 'Incident reported and processed by GreenMind.',
    ai_observations: newIssueData.ai_observations || ['Report filed by student auditor'],
    ai_impact: newIssueData.ai_impact || 'Environmental impact being evaluated.',
    ai_recommendations: newIssueData.ai_recommendations || ['Review incident location'],
    ai_preventive_actions: newIssueData.ai_preventive_actions || ['Monitor area for repeat occurrences'],
    ai_confidence: newIssueData.ai_confidence || 0.92,
    ai_uncertainty: newIssueData.ai_uncertainty || [],
    maintenance_required: newIssueData.maintenance_required ?? true,
    reported_by: newIssueData.reported_by || 'Elakkiyan (Student Auditor)',
    resolution_notes: newIssueData.resolution_notes || '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    resolved_at: null,
    
    // Eco-Bounty integration
    eco_bounty_eligible: newIssueData.eco_bounty_eligible ?? true,
    eco_bounty_points: ecoPoints,
    eco_bounty_rewarded: true, // Auto-awarded on verified submission
    ai_verified: newIssueData.ai_verified ?? true,
    assigned_department: newIssueData.assigned_department || 'Facilities General',
    voice_transcript: newIssueData.voice_transcript,

    impact_estimate: newIssueData.impact_estimate || estimateResourceImpact(
      newIssueData.category || 'waste',
      newIssueData.title,
      newIssueData.description
    ),
    root_cause_analysis: newIssueData.root_cause_analysis || generateRootCauseAnalysis(
      newIssueData.category || 'waste',
      newIssueData.title || '',
      newIssueData.description || '',
      newIssueData.location || 'Campus',
      memoryIssues
    ),

    actions: newIssueData.actions || (newIssueData.ai_recommendations || []).map((rec, idx) => ({
      id: `act-${id}-${idx + 1}`,
      issue_id: id,
      action_text: rec,
      action_type: 'immediate',
      priority: 'high',
      completed: false,
      created_at: new Date().toISOString(),
    }))
  };

  // Prepend to memory store so it appears immediately at the top
  memoryIssues = [issue, ...memoryIssues];

  // Update Eco Stats
  memoryEcoStats.myPoints += ecoPoints;
  memoryEcoStats.weeklyEarned += ecoPoints;
  memoryEcoStats.reportsSubmitted += 1;
  memoryEcoStats.verifiedReports += 1;
  memoryEcoStats.campusImpact += 2;

  // Update current user rank entry in leaderboard
  const currentUserIdx = memoryLeaderboard.findIndex(u => u.name.includes('Elakkiyan'));
  if (currentUserIdx !== -1) {
    memoryLeaderboard[currentUserIdx].points += ecoPoints;
    memoryLeaderboard[currentUserIdx].weekly_points += ecoPoints;
    memoryLeaderboard[currentUserIdx].verified_reports += 1;
  }

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { actions, ...issueRow } = issue;
      await supabase.from('environmental_issues').insert([issueRow]);
      if (actions && actions.length > 0) {
        await supabase.from('actions').insert(actions);
      }
    } catch {
      // Ignored for demo resilience
    }
  }

  return issue;
}

export async function updateIssue(
  id: string,
  updates: Partial<EnvironmentalIssue>
): Promise<EnvironmentalIssue | null> {
  const index = memoryIssues.findIndex(i => i.id === id);
  if (index === -1) return null;

  const current = memoryIssues[index];
  const updated: EnvironmentalIssue = {
    ...current,
    ...updates,
    updated_at: new Date().toISOString(),
  };

  if (updates.status === 'resolved' && !updated.resolved_at) {
    updated.resolved_at = new Date().toISOString();
    // If was not rewarded previously, award points now
    if (updated.eco_bounty_eligible && !current.eco_bounty_rewarded) {
      updated.eco_bounty_rewarded = true;
      memoryEcoStats.issuesResolved += 1;
    }
  } else if (updates.status && updates.status !== 'resolved') {
    updated.resolved_at = null;
  }

  memoryIssues[index] = updated;

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { actions, ...updateData } = updates;
      await supabase
        .from('environmental_issues')
        .update(updateData)
        .eq('id', id);
    } catch {
      // Handled silently
    }
  }

  return updated;
}

export async function toggleIssueAction(
  issueId: string,
  actionId: string,
  completed: boolean
): Promise<IssueAction | null> {
  const issue = memoryIssues.find(i => i.id === issueId);
  if (!issue || !issue.actions) return null;

  const action = issue.actions.find(a => a.id === actionId);
  if (!action) return null;

  action.completed = completed;
  issue.updated_at = new Date().toISOString();

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('actions').update({ completed }).eq('id', actionId);
    } catch {
      // Ignore
    }
  }

  return action;
}

export function getEcoBountyStats(): EcoBountyStats {
  return { ...memoryEcoStats };
}

export function getEcoLeaderboard(period: 'week' | 'month' | 'all' = 'all'): EcoAuditor[] {
  const list = [...memoryLeaderboard];
  if (period === 'week') {
    list.sort((a, b) => b.weekly_points - a.weekly_points);
  } else if (period === 'month') {
    list.sort((a, b) => b.monthly_points - a.monthly_points);
  } else {
    list.sort((a, b) => b.points - a.points);
  }
  return list.map((user, idx) => ({ ...user, rank: idx + 1 }));
}

export async function getAnalyticsData(): Promise<AnalyticsSummary> {
  const issues = await getAllIssues();
  const totalIssues = issues.length;
  const resolvedIssues = issues.filter(i => i.status === 'resolved').length;
  const openIssues = issues.filter(i => i.status === 'open').length;
  const inProgressIssues = issues.filter(i => i.status === 'in_progress').length;
  const resolutionRate = totalIssues > 0 ? Math.round((resolvedIssues / totalIssues) * 100) : 0;

  const scores = deriveScoresFromIssues(issues);

  // Category counts
  const catMap: Record<string, { count: number; label: string }> = {
    waste: { count: 0, label: 'Waste Management' },
    water: { count: 0, label: 'Water Conservation' },
    energy: { count: 0, label: 'Energy Waste' },
    plastic: { count: 0, label: 'Plastic Pollution' },
    green_cover: { count: 0, label: 'Green Cover' },
    air_quality: { count: 0, label: 'Air Quality' },
    other: { count: 0, label: 'Other' },
  };

  issues.forEach(i => {
    const c = (i.category || 'other').toLowerCase();
    if (catMap[c]) {
      catMap[c].count++;
    } else {
      catMap.other.count++;
    }
  });

  const categoryCounts = Object.entries(catMap).map(([category, val]) => ({
    category,
    count: val.count,
    label: val.label,
  }));

  // Severity counts
  const sevMap: Record<string, { count: number; color: string }> = {
    low: { count: 0, color: '#10B981' },
    medium: { count: 0, color: '#F59E0B' },
    high: { count: 0, color: '#EF4444' },
    critical: { count: 0, color: '#991B1B' },
  };

  issues.forEach(i => {
    const s = (i.severity || 'medium').toLowerCase();
    if (sevMap[s]) {
      sevMap[s].count++;
    }
  });

  const severityCounts = [
    { severity: 'Low', count: sevMap.low.count, color: sevMap.low.color },
    { severity: 'Medium', count: sevMap.medium.count, color: sevMap.medium.color },
    { severity: 'High', count: sevMap.high.count, color: sevMap.high.color },
    { severity: 'Critical', count: sevMap.critical.count, color: sevMap.critical.color },
  ];

  // Weekly trends (last 7 days)
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeklyTrends = days.map((day, idx) => ({
    day,
    reported: [3, 2, 4, 3, 5, 2, issues.length > 10 ? issues.length - 8 : 3][idx],
    resolved: [2, 3, 2, 4, 3, 2, resolvedIssues > 4 ? resolvedIssues - 3 : 2][idx],
  }));

  // Location counts
  const locMap: Record<string, number> = {};
  issues.forEach(i => {
    locMap[i.location] = (locMap[i.location] || 0) + 1;
  });
  const locationCounts = Object.entries(locMap)
    .map(([location, count]) => ({ location, count }))
    .sort((a, b) => b.count - a.count);

  // Eco-Bounty Metrics
  const studentReports = issues.filter(i => Boolean(i.eco_bounty_eligible));
  const aiVerifiedReports = issues.filter(i => Boolean(i.ai_verified)).length;
  const ecoPointsAwarded = studentReports.reduce((sum, item) => sum + (item.eco_bounty_points || 0), 0);
  const reportsResolved = studentReports.filter(i => i.status === 'resolved').length;

  const resourceCategoryCounts = [
    { category: 'Energy', count: issues.filter(i => i.category === 'energy').length },
    { category: 'Water', count: issues.filter(i => i.category === 'water').length },
    { category: 'Waste', count: issues.filter(i => i.category === 'waste' || i.category === 'plastic').length },
    { category: 'Safety', count: issues.filter(i => i.severity === 'critical' || i.severity === 'high').length },
    { category: 'Other', count: issues.filter(i => i.category === 'green_cover' || i.category === 'air_quality' || i.category === 'other').length },
  ];

  const topContributors = memoryLeaderboard.slice(0, 4).map(u => ({
    name: u.name,
    points: u.points,
  }));

  return {
    totalIssues,
    openIssues,
    resolvedIssues,
    inProgressIssues,
    resolutionRate,
    greenScore: scores.greenScore,
    scoreBreakdown: {
      waste: scores.wasteScore,
      water: scores.waterScore,
      energy: scores.energyScore,
      greenCover: scores.greenCoverScore,
      resolutionRate: scores.resolutionRate,
    },
    categoryCounts,
    severityCounts,
    weeklyTrends,
    locationCounts,
    ecoBountyMetrics: {
      totalStudentReports: studentReports.length,
      aiVerifiedReports,
      ecoPointsAwarded: ecoPointsAwarded + 1240, // Base demo community pool + current
      reportsResolved,
      resourceCategoryCounts,
      topReportingLocations: locationCounts.slice(0, 5),
      topContributors,
    },
    predictedRecurringProblems: predictRecurringProblems(issues),
    aggregateImpact: calculateAggregateImpact(issues)
  };
}

export function resetDemoData() {
  memoryIssues = [...INITIAL_DEMO_ISSUES];
  memoryEcoStats = { ...INITIAL_ECO_STATS };
  memoryLeaderboard = [...DEMO_LEADERBOARD];
}
