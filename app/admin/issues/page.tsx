'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { EnvironmentalIssue } from '@/lib/types';
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  AlertTriangle, 
  SlidersHorizontal,
  Wrench,
  CheckCircle2,
  Building2,
  Check
} from 'lucide-react';

export default function AdminIssuesPage() {
  const [issues, setIssues] = useState<EnvironmentalIssue[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const departments = [
    'All Departments',
    'Electrical',
    'Plumbing',
    'Housekeeping',
    'Civil',
    'Garden',
    'Waste Management',
    'Security',
    'General Maintenance',
  ];

  const statuses = [
    { value: 'all', label: 'All Statuses' },
    { value: 'reported', label: 'Reported / Open' },
    { value: 'ai_verified', label: 'AI Verified' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
  ];

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/issues');
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
  }, []);

  // Filter issues locally based on full admin criteria
  const filteredIssues = issues.filter(issue => {
    // Search
    if (search) {
      const q = search.toLowerCase();
      const match = 
        issue.title.toLowerCase().includes(q) ||
        issue.location.toLowerCase().includes(q) ||
        issue.description.toLowerCase().includes(q) ||
        (issue.assigned_department && issue.assigned_department.toLowerCase().includes(q));
      if (!match) return false;
    }

    // Status
    if (statusFilter !== 'all') {
      if (statusFilter === 'reported') {
        if (issue.status !== 'open' && (issue as any).status !== 'reported') return false;
      } else if (statusFilter === 'ai_verified') {
        if (!issue.ai_verified) return false;
      } else if (statusFilter === 'assigned') {
        if (!issue.assigned_department || issue.status === 'resolved') return false;
      } else {
        if (issue.status !== statusFilter) return false;
      }
    }

    // Severity
    if (severityFilter !== 'all' && issue.severity !== severityFilter) {
      return false;
    }

    // Department
    if (departmentFilter !== 'all' && departmentFilter !== 'All Departments') {
      if (!issue.assigned_department || !issue.assigned_department.toLowerCase().includes(departmentFilter.toLowerCase())) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Campus Issues Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Review AI diagnostics, assign maintenance departments, resolve duplicate reports, and update incident statuses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-[#16A34A] bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 shadow-2xs">
            {filteredIssues.length} of {issues.length} Issues
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E5EBE5] shadow-xs space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, location, ticket #, or department..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F8FAF8] border border-gray-200 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#16A34A]"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100 text-xs">
          <span className="text-gray-500 font-bold flex items-center gap-1 mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Filters:
          </span>

          {/* Status Tabs */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#F8FAF8] border border-gray-200 text-gray-700 font-medium focus:outline-none focus:border-[#16A34A]"
          >
            {statuses.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>

          {/* Severity */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#F8FAF8] border border-gray-200 text-gray-700 font-medium focus:outline-none focus:border-[#16A34A]"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Department */}
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#F8FAF8] border border-gray-200 text-gray-700 font-medium focus:outline-none focus:border-[#16A34A]"
          >
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* Issues Table */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="animate-spin w-8 h-8 border-4 border-[#16A34A] border-t-transparent rounded-full mx-auto"></div>
          <p className="text-xs text-gray-500">Loading campus issues...</p>
        </div>
      ) : filteredIssues.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#E5EBE5] text-gray-500 shadow-xs">
          No reports matching your criteria.
        </div>
      ) : (
        <div className="bg-white border border-[#E5EBE5] rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAF8] text-gray-500 uppercase text-[10px] tracking-wider border-b border-gray-100">
                <tr>
                  <th className="p-4">Ticket</th>
                  <th className="p-4">Issue Details</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Severity & AI Verification</th>
                  <th className="p-4">Assigned Department</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredIssues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-[#F8FAF8] transition-colors">
                    <td className="p-4 font-mono text-[11px] text-[#16A34A] font-bold">
                      {issue.id}
                    </td>

                    <td className="p-4 max-w-sm">
                      <div className="font-bold text-gray-900 text-sm truncate">{issue.title}</div>
                      <div className="text-xs text-gray-500 truncate mt-0.5">{issue.description}</div>
                    </td>

                    <td className="p-4 text-gray-700 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                        <span>{issue.location}</span>
                      </div>
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1 items-start">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          issue.severity === 'critical' ? 'bg-red-50 text-red-700 border border-red-200' :
                          issue.severity === 'high' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}>
                          {issue.severity.toUpperCase()}
                        </span>
                        {issue.ai_verified && (
                          <span className="text-[10px] font-semibold text-emerald-700 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-[#16A34A]" />
                            AI Verified
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-4 text-gray-700 font-medium whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span>{issue.assigned_department || 'Unassigned'}</span>
                      </div>
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        issue.status === 'resolved'
                          ? 'bg-teal-50 text-teal-800 border border-teal-200'
                          : issue.status === 'in_progress'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {issue.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>

                    <td className="p-4 text-right whitespace-nowrap">
                      <Link
                        href={`/admin/issues/${issue.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold shadow-2xs transition-colors"
                      >
                        <span>Manage & Dispatch</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
