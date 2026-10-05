'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { EnvironmentalIssue } from '@/lib/types';
import SeverityBadge from '@/components/Common/SeverityBadge';
import StatusBadge from '@/components/Common/StatusBadge';
import CategoryBadge from '@/components/Common/CategoryBadge';
import { 
  Search, 
  Plus, 
  MapPin, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  Trophy, 
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';

function timeAgo(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function UserIssuesPage() {
  const [issues, setIssues] = useState<EnvironmentalIssue[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewScope, setViewScope] = useState<'my' | 'campus'>('my');

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'waste', label: 'Waste Management' },
    { value: 'water', label: 'Water Conservation' },
    { value: 'energy', label: 'Energy Efficiency' },
    { value: 'air_quality', label: 'Air Quality' },
    { value: 'green_cover', label: 'Green Cover' },
    { value: 'plastic', label: 'Plastic Pollution' },
    { value: 'other', label: 'Other' },
  ];

  const statuses = [
    { value: 'all', label: 'All Statuses' },
    { value: 'open', label: 'Open' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
  ];

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (severityFilter !== 'all') params.append('severity', severityFilter);
      if (categoryFilter !== 'all') params.append('category', categoryFilter);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (search) params.append('search', search);

      const res = await fetch(`/api/issues?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setIssues(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [severityFilter, categoryFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchIssues();
  };

  // Filter based on viewScope: 'my' = student auditor reports
  const displayedIssues = viewScope === 'my'
    ? issues.filter(i => 
        !i.reported_by || 
        i.reported_by.toLowerCase().includes('elakkiyan') || 
        i.reported_by.toLowerCase().includes('student')
      )
    : issues;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            My Environmental Reports
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Track repairs, verification status, and eco-bounty points for reported issues.
          </p>
        </div>

        <Link
          href="/user/report"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#16A34A] hover:bg-[#14532D] text-white text-xs sm:text-sm font-bold shadow-sm shadow-green-700/20 transition-all duration-150 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Report New Issue</span>
        </Link>
      </div>

      {/* View Scope Toggle */}
      <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl max-w-xs">
        <button
          onClick={() => setViewScope('my')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
            viewScope === 'my'
              ? 'bg-white text-gray-900 shadow-xs'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          My Reports
        </button>
        <button
          onClick={() => setViewScope('campus')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
            viewScope === 'campus'
              ? 'bg-white text-gray-900 shadow-xs'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Campus Feed
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E5EBE5] shadow-xs space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reports by title, location, or department..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-[#16A34A] transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition-colors"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100 text-xs">
          <span className="text-gray-400 font-semibold flex items-center gap-1 mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Filters:
          </span>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 bg-white font-medium focus:outline-none focus:border-[#16A34A]"
          >
            {statuses.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 bg-white font-medium focus:outline-none focus:border-[#16A34A]"
          >
            {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
      </div>

      {/* Issue Cards */}
      {loading ? (
        <div className="py-16 text-center space-y-3">
          <div className="animate-spin w-8 h-8 border-4 border-[#16A34A] border-t-transparent rounded-full mx-auto"></div>
          <p className="text-xs text-gray-500">Loading reports...</p>
        </div>
      ) : displayedIssues.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-300 space-y-3">
          <p className="text-sm font-semibold text-gray-700">No reports found matching your criteria.</p>
          <Link
            href="/user/report"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#16A34A] text-white text-xs font-bold"
          >
            <Plus className="w-4 h-4" /> Report an Environmental Issue
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedIssues.map((issue) => (
            <Link
              key={issue.id}
              href={`/user/issues/${issue.id}`}
              className="bg-white rounded-2xl p-5 border border-[#E5EBE5] hover:border-emerald-300 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <CategoryBadge category={issue.category} />
                    <SeverityBadge severity={issue.severity} />
                  </div>
                  <StatusBadge status={issue.status} />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#16A34A] transition-colors line-clamp-1">
                    {issue.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {issue.description || issue.ai_summary}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-gray-400">
                  <span className="flex items-center gap-1 font-mono text-[11px]">
                    <MapPin className="w-3.5 h-3.5" />
                    {issue.location}
                  </span>
                  <span className="flex items-center gap-1 text-[11px]">
                    <Clock className="w-3.5 h-3.5" />
                    {timeAgo(issue.created_at)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {issue.eco_bounty_eligible && (
                    <span className="text-[11px] font-bold text-[#16A34A] flex items-center gap-1">
                      <Trophy className="w-3 h-3" />
                      +{issue.eco_bounty_points || 50} pts
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#16A34A] transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
