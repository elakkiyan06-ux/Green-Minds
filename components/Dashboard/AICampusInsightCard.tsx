import React from 'react';
import Link from 'next/link';
import { Bot, Sparkles, ArrowRight } from 'lucide-react';

interface AICampusInsightCardProps {
  insight?: string;
  onViewAnalysisHref?: string;
}

export default function AICampusInsightCard({
  insight = 'Most recent environmental reports are related to waste management around Block 3. Consider increasing collection frequency during high-traffic hours.',
  onViewAnalysisHref = '/analytics',
}: AICampusInsightCardProps) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#14532D] via-[#166534] to-[#14532D] p-6 text-white shadow-lg shadow-green-950/20">
      {/* Decorative background glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#16A34A] opacity-25 blur-2xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-200 border border-white/15 text-xs font-bold tracking-wider uppercase">
            <Bot className="w-4 h-4 text-emerald-300" />
            <span>AI CAMPUS INSIGHT</span>
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
          </div>

          <p className="text-sm sm:text-base font-medium text-emerald-50 leading-relaxed pt-1">
            &quot;{insight}&quot;
          </p>

          <div className="text-xs text-emerald-200/80">
            Synthesized from real-time incident reports across 11 campus zones.
          </div>
        </div>

        <div className="shrink-0 pt-2 sm:pt-0">
          <Link
            href={onViewAnalysisHref}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white text-[#14532D] hover:bg-[#DCFCE7] text-xs sm:text-sm font-bold shadow-md transition-all duration-150 hover:scale-[1.02]"
          >
            <span>View Analysis</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
