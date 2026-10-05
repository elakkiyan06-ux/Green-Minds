import UserIssueDetailClient from './UserIssueDetailClient';
import { INITIAL_DEMO_ISSUES } from '@/lib/demo-data';

export async function generateStaticParams() {
  return INITIAL_DEMO_ISSUES.map((issue) => ({
    id: issue.id,
  }));
}

export default async function UserIssueDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <UserIssueDetailClient id={id} />;
}
