export type EnvironmentalCategory = 
  | 'waste'
  | 'water'
  | 'energy'
  | 'air_quality'
  | 'green_cover'
  | 'plastic'
  | 'other';

export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

export type IssueStatus = 'open' | 'in_progress' | 'resolved' | 'reported' | 'ai_verified' | 'assigned';

export type UserRole = 'user' | 'admin' | 'student' | 'faculty' | 'maintenance';

export type MaintenanceDepartment = 
  | 'Electrical'
  | 'Plumbing'
  | 'Housekeeping'
  | 'Civil'
  | 'Garden'
  | 'Waste Management'
  | 'Security'
  | 'General Maintenance';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  eco_points?: number;
  created_at: string;
}

export interface IssueAction {
  id: string;
  issue_id: string;
  action_text: string;
  action_type: 'immediate' | 'preventive';
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  created_at: string;
}

export interface EnvironmentalIssue {
  id: string;
  title: string;
  description: string;
  category: EnvironmentalCategory;
  location: string;
  severity: SeverityLevel;
  status: IssueStatus;
  image_url?: string;
  ai_summary: string;
  ai_observations: string[];
  ai_impact: string;
  ai_recommendations: string[];
  ai_preventive_actions: string[];
  ai_confidence: number;
  ai_uncertainty: string[];
  maintenance_required: boolean;
  reported_by?: string;
  resolution_notes?: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string | null;
  actions?: IssueAction[];

  // Eco-Bounty Extensions
  eco_bounty_eligible?: boolean;
  eco_bounty_points?: number;
  eco_bounty_rewarded?: boolean;
  ai_verified?: boolean;
  assigned_department?: string;
  voice_transcript?: string;

  // New Feature Extensions
  impact_estimate?: ResourceImpactEstimate;
  root_cause_analysis?: AIRootCauseAnalysis;
}

export interface AIRootCauseAnalysis {
  observedProblem: string;
  possibleCauses: string[];
  evidence: string;
  confidence: 'Low' | 'Medium' | 'High';
  recommendedPreventiveAction: string;
}

export interface ResourceImpactEstimate {
  category: 'Energy' | 'Water' | 'Waste' | 'Other';
  potentialResourceImpact: string; // e.g. "2.4 kWh"
  potentialCostImpact: number;     // in INR
  formattedCost: string;           // e.g. "₹19.20"
  assumedLoadOrRate: string;       // e.g. "1.2 kW"
  assumedLoadValue: number;
  assumedDurationHours: number;    // e.g. 2.0
  calculatedResourceQuantity: number;
  resourceUnit: string;            // "kWh", "Liters", "kg"
  appliedTariff: string;           // e.g. "₹8.00 / kWh"
  tariffRate: number;
  isEstimated: true;
  basis: string;                   // "Based on configurable assumptions"
  notes?: string;
}

export interface RecurringProblemPrediction {
  id: string;
  location: string;
  category: EnvironmentalCategory;
  categoryLabel: string;
  pastIncidentsCount: number;
  last30DaysCount: number;
  lastOccurrenceDate: string;
  lastOccurrenceFormatted: string;
  pattern: string;
  aiPrediction: string;
  recurrenceRisk: 'High' | 'Medium' | 'Low';
  riskScore: number;
  recommendedPreventiveAction: string;
  isAIPrediction: true;
  insufficientData?: boolean;
}

export interface AggregateImpactEstimate {
  potentialEnergyKWh: number;
  potentialWaterLiters: number;
  potentialWasteKg: number;
  estimatedTotalCost: number;
  tariffs: {
    electricityPerKWh: number;
    waterPer1000L: number;
    wastePerKg: number;
  };
  isEstimated: true;
  basis: string;
}

export interface CampusMetrics {
  id: string;
  date: string;
  green_score: number;
  waste_score: number;
  water_score: number;
  energy_score: number;
  green_cover_score: number;
  resolution_rate: number;
  total_issues: number;
  resolved_issues: number;
}

export interface AIAnalysisResult {
  category: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  summary: string;
  observations: string[];
  environmental_impact: string;
  immediate_actions: string[];
  preventive_actions: string[];
  maintenance_required: boolean;
  confidence: number;
  uncertainty: string[];

  // Eco-Bounty Extensions
  verified?: boolean;
  assignedDepartment?: string;
  ecoBountyEligible?: boolean;
  suggestedPoints?: number;
  title?: string;

  // New Feature Extensions
  impactEstimate?: ResourceImpactEstimate;
  rootCauseAnalysis?: AIRootCauseAnalysis;
}

export interface AssistantRecommendation {
  recommendation: string;
  reason: string;
  priority: 'High' | 'Medium' | 'Low';
  expected_benefit: string;
}

export interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  recommendations?: AssistantRecommendation[];
  isCampusDataBased?: boolean;
  timestamp: string;
}

export interface EcoReward {
  id: string;
  user_id: string;
  issue_id: string;
  points: number;
  reason: string;
  created_at: string;
}

export interface EcoAuditor {
  id: string;
  name: string;
  department: string;
  points: number;
  weekly_points: number;
  monthly_points: number;
  verified_reports: number;
  resolved_issues: number;
  issues_resolved?: number;
  rank: number;
  avatar: string;
}

export interface EcoBountyStats {
  myPoints: number;
  reportsSubmitted: number;
  verifiedReports: number;
  issuesResolved: number;
  campusImpact: number;
  weeklyEarned: number;
}

export interface AnalyticsSummary {
  totalIssues: number;
  openIssues: number;
  resolvedIssues: number;
  inProgressIssues: number;
  resolutionRate: number;
  greenScore: number;
  scoreBreakdown: {
    waste: number;
    water: number;
    energy: number;
    greenCover: number;
    resolutionRate: number;
  };
  categoryCounts: { category: string; count: number; label: string }[];
  severityCounts: { severity: string; count: number; color: string }[];
  weeklyTrends: { day: string; reported: number; resolved: number }[];
  locationCounts: { location: string; count: number }[];

  // Eco-Bounty Analytics Additions
  ecoBountyMetrics?: {
    totalStudentReports: number;
    aiVerifiedReports: number;
    ecoPointsAwarded: number;
    reportsResolved: number;
    resourceCategoryCounts: { category: string; count: number }[];
    topReportingLocations: { location: string; count: number }[];
    topContributors: { name: string; points: number }[];
  };

  // Prediction and Impact Extensions
  predictedRecurringProblems?: RecurringProblemPrediction[];
  aggregateImpact?: AggregateImpactEstimate;
}
