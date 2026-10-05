import AnalysisResultClient from './AnalysisResultClient';
import { INITIAL_DEMO_ISSUES } from '@/lib/demo-data';

export async function generateStaticParams() {
  const ids = [
    { issueId: 'demo' },
    ...INITIAL_DEMO_ISSUES.map((issue) => ({
      issueId: issue.id,
    })),
  ];
  return ids;
}

export default async function AnalysisResultPage({
  params,
}: {
  params: Promise<{ issueId: string }>;
}) {
  const { issueId } = await params;
  return <AnalysisResultClient issueId={issueId} />;
}
