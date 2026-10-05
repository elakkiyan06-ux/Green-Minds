'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { EnvironmentalIssue } from '@/lib/types';
import SeverityBadge from '@/components/Common/SeverityBadge';
import StatusBadge from '@/components/Common/StatusBadge';
import CategoryBadge from '@/components/Common/CategoryBadge';
import { 
  Search, 
  Filter, 
  Plus, 
  MapPin, 
  Clock, 
  ArrowRight,
  RefreshCw,
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

export default function IssuesPage() {
  const [issues, setIssues] = useState<EnvironmentalIssue[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

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

  const severities = [
    { value: 'all', label: 'All Severities' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' },
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

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Environmental Issues
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Monitor, prioritize and resolve campus environmental incidents.
          </p>
        </div>

        <Link
          href="/report"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#16A34A] hover:bg-[#14532D] text-white text-sm font-bold shadow-md shadow-green-700/20 transition-all duration-150 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Report New Issue</span>
        </Link>
      </div>

      {/* Top Filter & Search Controls */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E5EBE5] shadow-xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by issue title, location, description..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-[#DCFCE7]"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors"
          >
            Search
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Severity Filter */}
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">
              Filter by Severity
            </label>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#16A34A]"
            >
              {severities.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">
              Filter by Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#16A34A]"
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#16A34A]"
            >
              {statuses.map((st) => (
                <option key={st.value} value={st.value}>
                  {st.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Issues Table (Desktop) / Cards (Mobile) */}
      <div className="bg-white rounded-2xl border border-[#E5EBE5] shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Showing {issues.length} Environmental Incidents
          </span>
          <button
            onClick={fetchIssues}
            className="text-xs text-[#16A34A] hover:underline font-semibold flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" /> Refresh
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-gray-500">
            <div className="animate-spin w-6 h-6 border-2 border-[#16A34A] border-t-transparent rounded-full mx-auto mb-2"></div>
            Loading environmental incidents...
          </div>
        ) : issues.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-500 space-y-2">
            <p className="font-semibold text-gray-700">No issues found matching your filters.</p>
            <p className="text-xs text-gray-400">Try adjusting your category or severity filters.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#F7FAF7] text-[11px] font-semibold text-gray-500 uppercase border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3.5">ID</th>
                    <th className="px-4 py-3.5">Issue</th>
                    <th className="px-4 py-3.5">Category</th>
                    <th className="px-4 py-3.5">Location</th>
                    <th className="px-4 py-3.5">Severity</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5">Reported</th>
                    <th className="px-6 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {issues.map((issue) => (
                    <tr
                      key={issue.id}
                      className="hover:bg-emerald-50/40 transition-colors group cursor-pointer"
                    >
                      <td className="px-6 py-4 font-mono text-xs font-bold text-gray-400 whitespace-nowrap">
                        <Link href={`/issues/${issue.id}`} className="hover:text-emerald-700">
                          {issue.id}
                        </Link>
                      </td>
                      <td className="px-4 py-4 max-w-xs">
                        <Link href={`/issues/${issue.id}`} className="block">
                          <span className="font-bold text-gray-900 group-hover:text-[#16A34A] transition-colors line-clamp-1">
                            {issue.title}
                          </span>
                          <span className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                            {issue.description}
                          </span>
                        </Link>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <CategoryBadge category={issue.category} />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-600 font-medium">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          <span>{issue.location}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <SeverityBadge severity={issue.severity} />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <StatusBadge status={issue.status} />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-400">
                        {timeAgo(issue.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Link
                          href={`/issues/${issue.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 group-hover:bg-[#DCFCE7] text-gray-700 group-hover:text-[#14532D] text-xs font-semibold transition-colors"
                        >
                          <span>Inspect</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-gray-100">
              {issues.map((issue) => (
                <Link
                  key={issue.id}
                  href={`/issues/${issue.id}`}
                  className="p-4 block hover:bg-gray-50 transition-colors space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold text-gray-400">
                      {issue.id}
                    </span>
                    <StatusBadge status={issue.status} />
                  </div>

                  <h3 className="font-bold text-sm text-gray-900 leading-snug">
                    {issue.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <CategoryBadge category={issue.category} />
                    <SeverityBadge severity={issue.severity} />
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 pt-1 border-t border-gray-100">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span>{issue.location}</span>
                    </div>
                    <span>{timeAgo(issue.created_at)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
