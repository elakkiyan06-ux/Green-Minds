'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ImageUploader from '@/components/Report/ImageUploader';
import VoiceRecorder from '@/components/Report/VoiceRecorder';
import AnalysisLoadingModal from '@/components/Report/AnalysisLoadingModal';
import { CAMPUS_LOCATIONS } from '@/lib/types';
import { 
  Sparkles, 
  MapPin, 
  FileText, 
  ArrowRight, 
  AlertCircle,
  HelpCircle,
  Bot,
  Trophy,
  Coins
} from 'lucide-react';
import { addStudentPoints } from '@/lib/student-points';
import { analyzeReportInClient, saveClientReportedIssue } from '@/lib/client-environmental';

function ReportPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isBountyMode = searchParams.get('bounty') === 'true';

  const [location, setLocation] = useState<string>(CAMPUS_LOCATIONS[0]);
  const [description, setDescription] = useState('');
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string>('');
  const [imageCategoryHint, setImageCategoryHint] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const locations = CAMPUS_LOCATIONS;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const effectiveDesc = description.trim() || voiceTranscript.trim();

    if (!effectiveDesc && !image) {
      setError('Please provide a photo, description, or voice note of the problem.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      let analysisResult: any = null;

      // 1. Try server API /api/analyze first (active in dev/Vercel)
      try {
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location,
            description: effectiveDesc,
            image,
            voiceTranscript: voiceTranscript.trim() || undefined,
            imageFileName: image ? (imageFileName || undefined) : undefined,
            imageCategoryHint: image ? (imageCategoryHint || undefined) : undefined,
          }),
        });

        if (res.ok) {
          analysisResult = await res.json();
        }
      } catch (networkErr) {
        // Will fall back to client engine below
      }

      // 2. Client-side environmental analysis fallback (for GitHub Pages static export or offline)
      if (!analysisResult) {
        analysisResult = analyzeReportInClient(
          location,
          effectiveDesc,
          Boolean(image),
          voiceTranscript.trim() || undefined,
          imageFileName || undefined,
          imageCategoryHint || undefined
        );
      }

      const issueId = `EB-${Date.now().toString().slice(-4)}`;
      const points = analysisResult.suggestedPoints || (analysisResult.severity === 'HIGH' ? 50 : 30);

      const issueBody = {
        id: issueId,
        title: analysisResult.title || `${analysisResult.category} Incident at ${location}`,
        description: effectiveDesc,
        category: analysisResult.category?.toLowerCase()?.includes('energy') ? 'energy' : 
                  analysisResult.category?.toLowerCase()?.includes('water') ? 'water' : 
                  analysisResult.category?.toLowerCase()?.includes('green') ? 'green_cover' :
                  analysisResult.category?.toLowerCase()?.includes('plastic') || analysisResult.category?.toLowerCase()?.includes('waste') ? 'waste' : 'other',
        location,
        severity: (analysisResult.severity || 'medium').toLowerCase(),
        status: 'open',
        image_url: image || undefined,
        ai_summary: analysisResult.summary,
        ai_observations: analysisResult.observations,
        ai_impact: analysisResult.environmental_impact,
        ai_recommendations: analysisResult.immediate_actions,
        ai_preventive_actions: analysisResult.preventive_actions,
        ai_confidence: analysisResult.confidence,
        ai_uncertainty: analysisResult.uncertainty,
        maintenance_required: analysisResult.maintenance_required ?? true,
        reported_by: 'Elakkiyan (Student Auditor)',
        voice_transcript: voiceTranscript.trim() || undefined,
        eco_bounty_eligible: true,
        eco_bounty_points: points,
        eco_bounty_rewarded: true,
        ai_verified: analysisResult.verified !== false,
        assigned_department: analysisResult.assignedDepartment || 'Facilities General',
        impact_estimate: analysisResult.impactEstimate,
        root_cause_analysis: analysisResult.rootCauseAnalysis,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Auto-save the reported issue to /api/issues if available
      try {
        await fetch('/api/issues', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(issueBody),
        });
      } catch {
        // Fallback for offline mode
      }

      // Persist in client issues store for GitHub Pages
      saveClientReportedIssue(issueBody as any);

      // Credit eco points to student balance immediately
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(`awarded_${issueId}`, 'true');
      }
      addStudentPoints(points);

      // Save analysis payload in sessionStorage for /analysis/[issueId]
      const payload = {
        id: issueId,
        location,
        description: effectiveDesc,
        voiceTranscript: voiceTranscript.trim() || undefined,
        image,
        imageFileName: imageFileName || undefined,
        imageCategoryHint: imageCategoryHint || undefined,
        analysis: analysisResult,
        createdAt: new Date().toISOString(),
      };

      if (typeof window !== 'undefined') {
        sessionStorage.setItem(`pending_analysis_${issueId}`, JSON.stringify(payload));
        sessionStorage.setItem('pending_analysis_demo', JSON.stringify(payload));
        sessionStorage.setItem('latest_pending_id', issueId);
      }

      // Small delay to allow the loading animation steps to complete smoothly
      setTimeout(() => {
        const isGhPages = typeof window !== 'undefined' && 
          (window.location.hostname.includes('github.io') || window.location.pathname.startsWith('/Green-Minds'));
        
        // On static GitHub Pages, /analysis/demo exists statically and renders the freshly stored report
        const targetRoute = isGhPages ? `/analysis/demo?id=${issueId}` : `/analysis/${issueId}`;
        router.push(targetRoute);
      }, 1200);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "GreenMind couldn't complete the analysis. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="bg-white border border-[#E5EBE5] p-6 rounded-3xl text-gray-900 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase tracking-wide flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              Eco-Bounty Auditor Mode
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Report an Environmental Issue
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Photo + optional text/voice. Earn Eco Points for verified reports.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5EBE5] shadow-xs space-y-6 text-gray-900">
        {/* Location Dropdown */}
        <div className="space-y-2">
          <label htmlFor="location" className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#16A34A]" />
            <span>Campus Location</span>
          </label>
          <select
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#F8FAF8] text-gray-900 text-sm font-medium focus:outline-none focus:border-[#16A34A] focus:ring-1 focus:ring-[#DCFCE7] transition-all"
          >
            {locations.map((loc) => (
              <option key={loc} value={loc} className="bg-white text-gray-900">
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Image Upload Area */}
        <ImageUploader 
          image={image} 
          fileName={imageFileName}
          categoryHint={imageCategoryHint}
          onImageChange={(base64, fileNm, catHint) => {
            setImage(base64);
            if (fileNm !== undefined) setImageFileName(fileNm);
            if (catHint !== undefined) setImageCategoryHint(catHint);
          }}
          onCategoryHintChange={(cat) => setImageCategoryHint(cat)}
        />

        {/* Voice Note Feature (Eco-Bounty Enhancement) */}
        <VoiceRecorder
          transcript={voiceTranscript}
          onTranscriptChange={setVoiceTranscript}
          onAppendToDescription={(txt) => {
            if (!description.trim()) {
              setDescription(txt);
            }
          }}
        />

        {/* Description Textarea */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="description" className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#16A34A]" />
              <span>Description / Notes <span className="text-gray-500 font-normal lowercase">(optional if voice/photo provided)</span></span>
            </label>
            <span className="text-xs text-gray-500">Be as specific as possible</span>
          </div>
          <textarea
            id="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Water is leaking from the washroom pipe / tap dripping continuously in corridor..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#F8FAF8] text-gray-900 text-sm focus:outline-none focus:border-[#16A34A] focus:ring-1 focus:ring-[#DCFCE7] transition-all placeholder:text-gray-400"
          />
        </div>

        {/* AI Category Notice */}
        <div className="p-4 rounded-2xl bg-[#F8FAF8] border border-[#E5EBE5] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[#16A34A]">
              <Bot className="w-5 h-5 text-[#16A34A]" />
            </div>
            <div className="text-xs">
              <span className="font-bold text-gray-900 block">
                AI will automatically classify & verify Eco-Bounty eligibility.
              </span>
              <span className="text-gray-600">
                Gemini extracts category, severity, maintenance department, and awards up to +75 Eco Points.
              </span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 shrink-0">
            <Coins className="w-3.5 h-3.5 text-amber-600" />
            <span>+20 to +75 Pts</span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-base shadow-md shadow-green-900/10 transition-all duration-150 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            <Sparkles className="w-5 h-5" />
            <span>Analyze & Verify with GreenMind AI</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </form>

      {/* Multi-step Loading Modal */}
      {loading && <AnalysisLoadingModal hasImage={Boolean(image)} />}
    </div>
  );
}

export default function ReportPage() {
  return (
    <React.Suspense fallback={
      <div className="py-20 text-center space-y-4">
        <div className="animate-spin w-8 h-8 border-4 border-[#16A34A] border-t-transparent rounded-full mx-auto"></div>
        <p className="text-sm text-gray-500">Loading reporting interface...</p>
      </div>
    }>
      <ReportPageContent />
    </React.Suspense>
  );
}
