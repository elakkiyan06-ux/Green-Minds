'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Check, X, Volume2, Radio } from 'lucide-react';

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

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  return (
    <div className="space-y-2.5 p-4 rounded-2xl bg-[#F8FAF8] border border-[#E5EBE5] text-gray-900 shadow-2xs">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
          <Mic className="w-4 h-4 text-[#16A34A]" />
          <span>Voice Note (Optional)</span>
          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Eco-Bounty Fast Track
          </span>
        </label>
        
        {transcript && (
          <button
            type="button"
            onClick={() => onTranscriptChange('')}
            className="text-[11px] text-gray-500 hover:text-red-600 transition-colors"
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
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-xs ${
            isRecording
              ? 'bg-red-600 hover:bg-red-500 text-white animate-pulse'
              : 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-200'
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
            <div className="flex items-center gap-2 text-red-700 font-semibold bg-red-50 px-3 py-2 rounded-xl border border-red-200">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <span>Listening to your report... speak clearly</span>
            </div>
          ) : transcript ? (
            <div className="flex items-center gap-2 text-gray-900 bg-white px-3 py-2 rounded-xl border border-emerald-200 text-xs shadow-2xs">
              <Volume2 className="w-4 h-4 text-[#16A34A] shrink-0" />
              <span className="italic line-clamp-1 text-gray-800">&quot;{transcript}&quot;</span>
              <span className="ml-auto shrink-0 text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
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
    </div>
  );
}
