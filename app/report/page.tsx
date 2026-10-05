'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ImageUploader from '@/components/Report/ImageUploader';
import VoiceRecorder from '@/components/Report/VoiceRecorder';
import AnalysisLoadingModal from '@/components/Report/AnalysisLoadingModal';
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

function ReportPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isBountyMode = searchParams.get('bounty') === 'true';

  const [location, setLocation] = useState('Block 3');
  const [description, setDescription] = useState('');
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const locations = [
    'Block 1',
    'Block 2',
    'Block 3',
    'Boys Hostel',
    'Girls Hostel',
    'Canteen',
    'Parking',
    'Laboratory',
    'Garden',
    'Seminar Hall',
    'Other'
  ];

  useEffect(() => {
    if (isBountyMode) {
      setLocation('Block 3');
      setDescription('Lights and fans are left running in empty IT Block Room 302 after class dismissed.');
      setVoiceTranscript('Lights and fans are left on in IT Block Room 302.');
      setImage('https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=800&q=80');
    }
  }, [isBountyMode]);

  const handlePreFillWasteDemo = () => {
    setLocation('Block 3');
    setDescription('There is a lot of plastic waste near Block 3 and the dustbin is overflowing onto the walkway.');
    setVoiceTranscript('');
    setImage('https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80');
    setError(null);
  };

  const handlePreFillEnergyBountyDemo = () => {
    setLocation('Block 3');
    setDescription('Lights and ceiling fans left running in unoccupied IT Block Room 302.');
    setVoiceTranscript('Lights and fans are left on in IT Block Room 302.');
    setImage('https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=800&q=80');
    setError(null);
  };

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
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location,
          description: effectiveDesc,
          image,
          voiceTranscript: voiceTranscript.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to analyze environmental report.');
      }

      const analysisResult = await res.json();
      const issueId = `EB-${Date.now().toString().slice(-4)}`;

      // Save analysis payload in sessionStorage for /analysis/[issueId]
      const payload = {
        id: issueId,
        location,
        description: effectiveDesc,
        voiceTranscript: voiceTranscript.trim() || undefined,
        image,
        analysis: analysisResult,
        createdAt: new Date().toISOString(),
      };

      if (typeof window !== 'undefined') {
        sessionStorage.setItem(`pending_analysis_${issueId}`, JSON.stringify(payload));
        sessionStorage.setItem('latest_pending_id', issueId);
      }

      // Small delay to allow the loading animation steps to complete smoothly
      setTimeout(() => {
        router.push(`/analysis/${issueId}`);
      }, 1200);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "GreenMind couldn't complete the analysis. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase tracking-wide flex items-center gap-1">
                <Trophy className="w-3 h-3 text-[#16A34A]" />
                Eco-Bounty Auditor Mode
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Report an Environmental Issue
            </h1>
            <p className="text-sm text-gray-600 mt-0.5">
              Photo + optional text/voice. Earn Eco Points for verified reports.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handlePreFillEnergyBountyDemo}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-colors flex items-center gap-1"
              title="Auto-fill with Room 302 Energy Waste Scenario"
            >
              <Coins className="w-3.5 h-3.5 text-amber-600" />
              <span>Room 302 Bounty</span>
            </button>

            <button
              type="button"
              onClick={handlePreFillWasteDemo}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#14532D] border border-emerald-200 transition-colors flex items-center gap-1"
              title="Auto-fill with Block 3 Waste Overflow Scenario"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>Block 3 Waste</span>
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E5EBE5] shadow-xs space-y-6">
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
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm font-medium focus:outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-[#DCFCE7] transition-all"
          >
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Image Upload Area */}
        <ImageUploader image={image} onImageChange={setImage} />

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
              <span>Description / Notes <span className="text-gray-400 font-normal lowercase">(optional if voice/photo provided)</span></span>
            </label>
            <span className="text-xs text-gray-400">Be as specific as possible</span>
          </div>
          <textarea
            id="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Lights and fans are left running in IT Block Room 302..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-[#DCFCE7] transition-all placeholder:text-gray-400"
          />
        </div>

        {/* AI Category Notice */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-[#DCFCE7]/60 to-emerald-50 border border-emerald-200/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#14532D] text-white">
              <Bot className="w-4 h-4 text-emerald-300" />
            </div>
            <div className="text-xs">
              <span className="font-bold text-[#14532D] block">
                AI will automatically classify & verify Eco-Bounty eligibility.
              </span>
              <span className="text-gray-600">
                Gemini extracts category, severity, maintenance department, and awards up to +75 Eco Points.
              </span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            <Coins className="w-3.5 h-3.5 text-amber-600" />
            <span>+20 to +75 Pts</span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#16A34A] to-[#14532D] hover:from-[#15803D] hover:to-[#0F391E] text-white font-extrabold text-base shadow-lg shadow-green-700/25 transition-all duration-150 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            <Sparkles className="w-5 h-5 text-yellow-300" />
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
