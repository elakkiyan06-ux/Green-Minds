import { NextRequest, NextResponse } from 'next/server';
import { calculateBudgetPlan, BASELINE_ACTIONS } from '@/lib/budget-planner';
import { getAllIssues } from '@/lib/store';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const budgetParam = searchParams.get('budget');
    const budget = budgetParam ? Math.max(0, parseInt(budgetParam, 10) || 50000) : 50000;
    const selected = searchParams.get('selected')?.split(',').filter(Boolean);

    // Read real campus issues to enrich related counts
    const issues = await getAllIssues();
    const waterIssues = issues.filter(i => i.category === 'water' && i.status !== 'resolved').length;
    const energyIssues = issues.filter(i => i.category === 'energy' && i.status !== 'resolved').length;
    const wasteIssues = issues.filter(i => (i.category === 'waste' || i.category === 'plastic') && i.status !== 'resolved').length;

    const plan = calculateBudgetPlan(budget, selected);

    // Enrich related issue counts dynamically from campus telemetry
    plan.recommendedActions = plan.recommendedActions.map(act => {
      let liveCount = act.relatedIssuesCount || 1;
      if (act.category === 'water') liveCount = Math.max(liveCount, waterIssues);
      if (act.category === 'energy') liveCount = Math.max(liveCount, energyIssues);
      if (act.category === 'waste') liveCount = Math.max(liveCount, wasteIssues);
      return { ...act, relatedIssuesCount: liveCount };
    });

    return NextResponse.json(plan);
  } catch (error: any) {
    console.error('Error generating budget plan:', error);
    return NextResponse.json(
      { error: 'Failed to calculate sustainability budget plan', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const budget = typeof body.budget === 'number' ? Math.max(0, body.budget) : 50000;
    const selectedActionIds = Array.isArray(body.selectedActionIds) ? body.selectedActionIds : undefined;

    const plan = calculateBudgetPlan(budget, selectedActionIds);
    return NextResponse.json(plan);
  } catch (error: any) {
    console.error('Error in budget plan calculation:', error);
    return NextResponse.json(
      { error: 'Invalid budget calculation request', details: error.message },
      { status: 400 }
    );
  }
}
