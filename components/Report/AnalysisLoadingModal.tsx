'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';

interface AnalysisLoadingModalProps {
  hasImage: boolean;
}

export default function AnalysisLoadingModal({ hasImage }: AnalysisLoadingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: 'Analyzing report', desc: 'Reading incident text and location taxonomy...' },
    { title: 'Examining image', desc: hasImage ? 'Running multimodal visual analysis on uploaded image...' : 'Validating report visual descriptors...' },
    { title: 'Classifying issue', desc: 'Determining environmental category & taxonomy...' },
    { title: 'Assessing severity', desc: 'Calculating campus risk matrix & urgency level...' },
    { title: 'Generating recommendations', desc: 'Formulating immediate actions & preventive policy...' },
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(1), 600);
    const timer2 = setTimeout(() => setCurrentStep(2), 1400);
    const timer3 = setTimeout(() => setCurrentStep(3), 2200);
    const timer4 = setTimeout(() => setCurrentStep(4), 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-emerald-100 relative overflow-hidden">
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#14532D] via-[#16A34A] to-[#DCFCE7]"></div>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] flex items-center justify-center text-[#16A34A] animate-pulse">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-gray-900">
              GreenMind Intelligence
            </h3>
            <p className="text-xs text-gray-500">
              GreenMind is analyzing the environmental issue...
            </p>
          </div>
        </div>

        {/* Steps Progression */}
        <div className="space-y-3.5 my-6">
          {steps.map((step, idx) => {
            const isDone = currentStep > idx;
            const isCurrent = currentStep === idx;

            return (
              <div
                key={step.title}
                className={`flex items-start gap-3 p-2.5 rounded-xl transition-all duration-300 ${
                  isCurrent
                    ? 'bg-emerald-50/80 border border-emerald-200'
                    : isDone
                    ? 'bg-gray-50/50'
                    : 'opacity-40'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-[#16A34A] animate-spin" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-gray-300"></div>
                  )}
                </div>

                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <span>{step.title}</span>
                    {isCurrent && (
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 rounded">
                        In Progress
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 leading-tight">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-2 border-t border-gray-100">
          <span className="text-[11px] text-gray-400 font-medium">
            Powered by Google Gemini 2.0 Flash Multimodal
          </span>
        </div>
      </div>
    </div>
  );
}
