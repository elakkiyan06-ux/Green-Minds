'use client';

import React, { useEffect, useState } from 'react';
import { Trophy, Coins, CheckCircle2, ArrowRight, Sparkles, X } from 'lucide-react';

interface RewardModalProps {
  pointsEarned: number;
  previousPoints: number;
  newPoints: number;
  issueTitle: string;
  onClose: () => void;
  onViewDashboard: () => void;
  onViewEcoBounty: () => void;
}

export default function RewardModal({
  pointsEarned = 50,
  previousPoints = 1190,
  newPoints = 1240,
  issueTitle,
  onClose,
  onViewDashboard,
  onViewEcoBounty,
}: RewardModalProps) {
  const [animatedPoints, setAnimatedPoints] = useState(previousPoints);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPoints(newPoints);
    }, 400);
    return () => clearTimeout(timer);
  }, [newPoints]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-emerald-100 relative overflow-hidden text-center">
        {/* Subtle Decorative Elements */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#14532D] via-[#16A34A] to-amber-400"></div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Badge */}
        <div className="relative mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-[#DCFCE7] via-emerald-100 to-amber-100 flex items-center justify-center text-[#14532D] shadow-inner mb-4">
          <Trophy className="w-10 h-10 text-[#16A34A] animate-bounce" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500"></span>
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-xs font-black uppercase tracking-widest text-[#16A34A] flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            🌱 ECO-BOUNTY EARNED!
          </span>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">
            +{pointsEarned} Eco Points
          </h2>
          <p className="text-xs text-gray-600 pt-1 leading-relaxed max-w-sm mx-auto">
            Great catch! Your report was verified by Gemini AI and dispatched as an active maintenance ticket.
          </p>
        </div>

        {/* Points Counter Box */}
        <div className="my-6 p-4 rounded-2xl bg-gradient-to-r from-gray-50 via-emerald-50/40 to-gray-50 border border-emerald-100/80 flex items-center justify-around">
          <div className="text-left">
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Previous Balance</span>
            <span className="text-sm font-bold text-gray-600 font-mono">{previousPoints.toLocaleString()}</span>
          </div>

          <div className="h-8 w-px bg-gray-200"></div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-emerald-800 block">New Balance</span>
            <span className="text-xl font-black text-[#14532D] font-mono transition-all duration-500">
              {animatedPoints.toLocaleString()} pts
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={onViewDashboard}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#16A34A] to-[#14532D] hover:from-[#15803D] hover:to-[#0F391E] text-white text-xs sm:text-sm font-extrabold shadow-md shadow-green-700/20 transition-all flex items-center justify-center gap-2"
          >
            <span>Return to Campus Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onViewEcoBounty}
            className="w-full py-3 px-4 rounded-xl bg-white hover:bg-emerald-50 text-[#14532D] border border-emerald-300 text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2"
          >
            <Trophy className="w-4 h-4 text-[#16A34A]" />
            <span>View Eco-Bounty Hub & Leaderboard</span>
          </button>
        </div>
      </div>
    </div>
  );
}
