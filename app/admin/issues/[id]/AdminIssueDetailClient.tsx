'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { EnvironmentalIssue, MaintenanceDepartment, IssueStatus } from '@/lib/types';
import { INITIAL_DEMO_ISSUES } from '@/lib/demo-data';
import ResourceImpactCard from '@/components/Common/ResourceImpactCard';
import RootCauseCard from '@/components/Common/RootCauseCard';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  User, 
  CheckCircle2, 
  Sparkles, 
  Wrench, 
  Clock, 
  AlertTriangle,
  Save,
  ShieldCheck,
  Building2,
  Check,
  Zap,
} from 'lucide-react';

const DEPARTMENTS: MaintenanceDepartment[] = [
  'Electrical',
  'Plumbing',
  'Housekeeping',
  'Civil',
  'Garden',
  'Waste Management',
  'Security',
  'General Maintenance',
];

export default function AdminIssueDetailClient({ id }: { id: string }) {
  const router = useRouter();

  const [issue, setIssue] = useState<EnvironmentalIssue | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState<IssueStatus>('open');
  const [assignedDepartment, setAssignedDepartment] = useState<string>('Electrical');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchIssue = async () => {
      let found: EnvironmentalIssue | null = null;
      try {
        const res = await fetch(`/api/issues/${id}`);
        if (res.ok) {
          found = await res.json();
        }
      } catch (err) {
        // Fallback for static hosting
      }

      if (!found) {
        found = INITIAL_DEMO_ISSUES.find((i) => i.id === id) || null;
      }

      if (found) {
        setIssue(found);
        setStatus(found.status);
        setAssignedDepartment(found.assigned_department || 'Electrical');
        setResolutionNotes(found.resolution_notes || '');
      }
      setLoading(false);
    };

    fetchIssue();
  }, [id]);

  const handleSaveManagementUpdates = async (overrideStatus?: IssueStatus) => {
    setUpdating(true);
    setToastMessage(null);
    setErrorMessage(null);

    const targetStatus = overrideStatus || status;

    try {
      const res = await fetch(`/api/issues/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: targetStatus,
          assigned_department: assignedDepartment,
          resolution_notes: resolutionNotes,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setIssue(updated);
        setStatus(updated.status);
        setAssignedDepartment(updated.assigned_department || assignedDepartment);
      } else {
        // Fallback for static demo mode
        if (issue) {
          const updated: EnvironmentalIssue = {
            ...issue,
            status: targetStatus,
            assigned_department: assignedDepartment as MaintenanceDepartment,
            resolution_notes: resolutionNotes,
            updated_at: new Date().toISOString(),
          };
          setIssue(updated);
          setStatus(updated.status);
        }
      }

      setToastMessage('Maintenance department, status, and resolution report updated successfully.');
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err: any) {
      if (issue) {
        const updated: EnvironmentalIssue = {
          ...issue,
          status: targetStatus,
          assigned_department: assignedDepartment as MaintenanceDepartment,
          resolution_notes: resolutionNotes,
          updated_at: new Date().toISOString(),
        };
        setIssue(updated);
        setStatus(updated.status);
        setToastMessage('Maintenance changes saved locally.');
        setTimeout(() => setToastMessage(null), 4000);
      } else {
        setErrorMessage(err.message || 'Error updating issue.');
      }
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full mx-auto"></div>
        <p className="text-xs text-emerald-200/70">Loading issue management details...</p>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-base font-bold text-white">Environmental report not found.</p>
        <Link
          href="/admin/issues"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-gray-950 text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Issues
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between pb-2 border-b border-emerald-900/50">
        <Link
          href="/admin/issues"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Issues</span>
        </Link>

        <span className="text-xs font-mono text-emerald-400">
          Admin Ticket #{issue.id}
        </span>
      </div>

      {/* Success / Error Alerts */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-950 border border-emerald-500 text-emerald-200 flex items-center gap-3 animate-in fade-in duration-200">
          <Check className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-950 border border-red-500 text-red-200 flex items-center gap-3 animate-in fade-in duration-200">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <span className="text-xs font-semibold">{errorMessage}</span>
        </div>
      )}

      {/* Admin Operations Control Box */}
      <div className="bg-[#122419] rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-emerald-900/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">Maintenance Dispatch & Status Control</h2>
              <p className="text-xs text-emerald-300/70">Assign campus maintenance departments and log resolution reports</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
              issue.status === 'resolved' ? 'bg-teal-950 text-teal-300 border border-teal-800' :
              issue.status === 'in_progress' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
              'bg-amber-950 text-amber-300 border border-amber-800'
            }`}>
              Current: {issue.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Department Selector */}
          <div>
            <label className="block text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1.5">
              Assign Maintenance Department
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3" />
              <select
                value={assignedDepartment}
                onChange={(e) => setAssignedDepartment(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0A160F] border border-emerald-500/40 text-sm font-semibold text-white focus:outline-none focus:border-emerald-400 transition-colors"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept} className="bg-[#0A160F] text-white">
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status Selector */}
          <div>
            <label className="block text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1.5">
              Incident Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as IssueStatus)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#0A160F] border border-emerald-500/40 text-sm font-semibold text-white focus:outline-none focus:border-emerald-400 transition-colors"
            >
              <option value="open">Reported / Open</option>
              <option value="ai_verified">AI Verified</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Resolution Notes */}
        <div>
          <label className="block text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1.5">
            Maintenance Technician Notes & Resolution Log
          </label>
          <textarea
            rows={3}
            value={resolutionNotes}
            onChange={(e) => setResolutionNotes(e.target.value)}
            placeholder="Add details on maintenance technician dispatched, repair parts replaced, or preventive plumbing/electrical actions completed..."
            className="w-full px-4 py-2.5 rounded-xl bg-[#0A160F] border border-emerald-500/40 text-sm text-white placeholder-emerald-800 focus:outline-none focus:border-emerald-400"
          />
        </div>

        {/* Save & Quick Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            {status !== 'resolved' && (
              <button
                type="button"
                onClick={() => {
                  setStatus('resolved');
                  handleSaveManagementUpdates('resolved');
                }}
                disabled={updating}
                className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-gray-950 text-xs font-black transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark as Resolved</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => handleSaveManagementUpdates()}
            disabled={updating}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 text-xs font-black shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{updating ? 'Saving Changes...' : 'Save Management Updates'}</span>
          </button>
        </div>
      </div>

      {/* Issue Overview Card */}
      <div className="bg-[#122419] rounded-3xl p-6 sm:p-8 border border-emerald-500/20 shadow-xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-bold uppercase">
              {issue.category}
            </span>
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
              issue.severity === 'critical' ? 'bg-red-950 text-red-300 border border-red-800' :
              issue.severity === 'high' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
              'bg-emerald-950 text-emerald-300 border border-emerald-800'
            }`}>
              Severity: {issue.severity.toUpperCase()}
            </span>
            {issue.ai_verified && (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Gemini Vision Verified
              </span>
            )}
          </div>

          <span className="text-xs text-emerald-300/80 font-mono">
            Reported by: {issue.reported_by || 'Student Auditor'}
          </span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {issue.title}
          </h1>
          <p className="text-sm text-emerald-100/80 mt-2 leading-relaxed">
            {issue.description}
          </p>
        </div>

        {/* Location & Metadata */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-emerald-900/40 text-xs text-emerald-200/80">
          <div>
            <span className="block text-[10px] text-emerald-400 uppercase font-bold">Location</span>
            <span className="font-semibold text-white">{issue.location}</span>
          </div>
          <div>
            <span className="block text-[10px] text-emerald-400 uppercase font-bold">Logged At</span>
            <span className="font-semibold text-white">{new Date(issue.created_at).toLocaleString()}</span>
          </div>
          <div>
            <span className="block text-[10px] text-emerald-400 uppercase font-bold">Department</span>
            <span className="font-semibold text-emerald-300">{issue.assigned_department || 'Unassigned'}</span>
          </div>
          <div>
            <span className="block text-[10px] text-emerald-400 uppercase font-bold">Eco-Bounty</span>
            <span className="font-semibold text-emerald-300">+{issue.eco_bounty_points || 50} pts awarded</span>
          </div>
        </div>
      </div>

      {/* Issue Photo if provided */}
      {issue.image_url && (
        <div className="bg-[#122419] rounded-3xl p-4 border border-emerald-500/20 overflow-hidden shadow-xl">
          <img
            src={issue.image_url}
            alt={issue.title}
            className="w-full max-h-96 object-cover rounded-2xl"
          />
        </div>
      )}

      {/* RESOURCE IMPACT ESTIMATOR CARD */}
      <ResourceImpactCard
        category={issue.category}
        initialEstimate={issue.impact_estimate}
        title={issue.title}
      />

      {/* AI ROOT-CAUSE ANALYSIS */}
      <RootCauseCard 
        analysis={issue.root_cause_analysis} 
        observedProblemFallback={issue.title} 
        locationFallback={issue.location} 
      />

      {/* AI Observations and Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#122419] rounded-3xl p-6 border border-emerald-500/20 shadow-xl space-y-3">
          <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            AI OBSERVATIONS & EVIDENCE
          </h3>
          <div className="space-y-2">
            {(issue.ai_observations || []).map((obs, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-emerald-100 p-2.5 rounded-xl bg-[#0A160F] border border-emerald-900/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                <span>{obs}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#122419] rounded-3xl p-6 border border-emerald-500/20 shadow-xl space-y-3">
          <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            PREVENTIVE ACTIONS FOR MAINTENANCE
          </h3>
          <div className="space-y-2">
            {(issue.ai_preventive_actions || []).map((act, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-emerald-100 p-2.5 rounded-xl bg-[#0A160F] border border-emerald-900/30">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{act}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
