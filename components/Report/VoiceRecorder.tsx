'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Check, X, Sparkles, Volume2, Radio } from 'lucide-react';

interface VoiceRecorderProps {
  transcript: string;
  onTranscriptChange: (text: string) => void;
  onAppendToDescription?: (text: string) => void;
}

export default function VoiceRecorder({
  transcript,
  onTranscriptChange,
  onAppendToDescription,
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);

  const sampleTranscripts = [
    'Lights and fans are left on in IT Block Room 302.',
    'Continuous water leakage from washroom pipe in Boys Hostel Wing B.',
    'Dustbin is overflowing with plastic takeaway cups near Block 3.'
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = 'en-US';

          recognition.onresult = (event: any) => {
            let current = '';
            for (let i = 0; i < event.results.length; i++) {
              current += event.results[i][0].transcript;
            }
            if (current) {
              onTranscriptChange(current);
              if (onAppendToDescription) {
                onAppendToDescription(current);
              }
            }
          };

          recognition.onerror = (event: any) => {
            console.warn('Speech recognition error:', event.error);
            stopRecording();
          };

          recognitionRef.current = recognition;
        } catch (e) {
          console.error('Speech recognition initialization error:', e);
        }
      }
    }
  }, []);

  const startRecording = () => {
    setIsRecording(true);
    setRecordingSeconds(0);

    timerRef.current = setInterval(() => {
      setRecordingSeconds(prev => prev + 1);
    }, 1000);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        // Already started or unsupported
      }
    } else {
      // Simulate live speech detection for demo
      setTimeout(() => {
        if (!transcript) {
          const sample = 'Lights and fans are left on in IT Block Room 302.';
          onTranscriptChange(sample);
          if (onAppendToDescription) onAppendToDescription(sample);
        }
      }, 2500);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignored
      }
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleApplyPreset = (preset: string) => {
    onTranscriptChange(preset);
    if (onAppendToDescription) onAppendToDescription(preset);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  return (
    <div className="space-y-2.5 p-4 rounded-xl bg-gradient-to-br from-emerald-50/50 via-[#F7FAF7] to-white border border-emerald-200/80">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
          <Mic className="w-4 h-4 text-[#16A34A]" />
          <span>Voice Note (Optional)</span>
          <span className="text-[10px] font-semibold text-emerald-800 bg-[#DCFCE7] px-1.5 py-0.2 rounded border border-emerald-200">
            Eco-Bounty Fast Track
          </span>
        </label>
        
        {transcript && (
          <button
            type="button"
            onClick={() => onTranscriptChange('')}
            className="text-[11px] text-gray-400 hover:text-red-600 transition-colors"
          >
            Clear Voice Note
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Record Button */}
        <button
          type="button"
          onClick={toggleRecording}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm ${
            isRecording
              ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
              : 'bg-white hover:bg-emerald-50 text-[#14532D] border border-emerald-300'
          }`}
        >
          {isRecording ? (
            <>
              <Radio className="w-4 h-4 text-white animate-spin" />
              <span>Recording ({formatTime(recordingSeconds)}) • Tap to Stop</span>
            </>
          ) : (
            <>
              <Mic className="w-4 h-4 text-[#16A34A]" />
              <span>Record Voice Note</span>
            </>
          )}
        </button>

        {/* Live Status or Audio Wave Indicator */}
        <div className="flex-1 w-full text-xs">
          {isRecording ? (
            <div className="flex items-center gap-2 text-red-600 font-semibold bg-red-50 px-3 py-2 rounded-lg border border-red-200">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
              <span>Listening to your report... speak clearly</span>
            </div>
          ) : transcript ? (
            <div className="flex items-center gap-2 text-gray-800 bg-white px-3 py-2 rounded-lg border border-emerald-200 text-xs">
              <Volume2 className="w-4 h-4 text-[#16A34A] shrink-0" />
              <span className="italic line-clamp-1">&quot;{transcript}&quot;</span>
              <span className="ml-auto shrink-0 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                Transcribed
              </span>
            </div>
          ) : (
            <span className="text-[11px] text-gray-500">
              Quickly dictate the location and problem instead of typing.
            </span>
          )}
        </div>
      </div>

      {/* Preset Voice Transcripts for Instant Hackathon Demonstration */}
      <div className="pt-1 flex flex-wrap items-center gap-1.5 text-[11px]">
        <span className="text-gray-400 font-medium">Dictation Presets:</span>
        {sampleTranscripts.map((sample, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleApplyPreset(sample)}
            className="px-2 py-0.5 rounded-md bg-white hover:bg-emerald-50 border border-gray-200 text-gray-600 hover:text-emerald-800 transition-colors line-clamp-1"
          >
            {sample}
          </button>
        ))}
      </div>
    </div>
  );
}
