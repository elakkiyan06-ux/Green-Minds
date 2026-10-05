import React from 'react';
import Link from 'next/link';
import { EnvironmentalIssue } from '@/lib/types';
import SeverityBadge from '@/components/Common/SeverityBadge';
import StatusBadge from '@/components/Common/StatusBadge';
import CategoryBadge from '@/components/Common/CategoryBadge';
import { ArrowRight, MapPin, Clock } from 'lucide-react';

interface RecentIssuesTableProps {
  issues: EnvironmentalIssue[];
}

function timeAgo(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function RecentIssuesTable({ issues }: RecentIssuesTableProps) {
  const displayIssues = issues.slice(0, 5);

  return (
    <div className="bg-white rounded-xl border border-[#E5EBE5] shadow-xs overflow-hidden">
      <div className="p-5 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-sm tracking-wider text-gray-900 uppercase">
            Recent Environmental Issues
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Active reports requiring facilities and community action
          </p>
        </div>

        <Link
          href="/issues"
          className="text-xs font-semibold text-[#16A34A] hover:text-[#14532D] inline-flex items-center gap-1 transition-colors"
        >
          View All Issues <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {displayIssues.length === 0 ? (
        <div className="p-8 text-center text-sm text-gray-500">
          No environmental issues reported yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F7FAF7] text-[11px] font-semibold text-gray-500 uppercase border-b border-gray-100">
              <tr>
                <th className="px-5 py-3">Issue</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayIssues.map((issue) => (
                <tr
                  key={issue.id}
                  className="hover:bg-emerald-50/40 transition-colors group cursor-pointer"
                >
                  <td className="px-5 py-3.5">
                    <Link href={`/issues/${issue.id}`} className="block focus:outline-none">
                      <span className="font-semibold text-gray-900 group-hover:text-[#16A34A] transition-colors line-clamp-1">
                        {issue.title}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] font-mono text-gray-400">
                          {issue.id}
                        </span>
                        <CategoryBadge category={issue.category} />
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-gray-600 text-xs">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span>{issue.location}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <SeverityBadge severity={issue.severity} />
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <StatusBadge status={issue.status} />
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-right text-xs text-gray-400">
                    <div className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span>{timeAgo(issue.created_at)}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
