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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#E5EBE5] relative overflow-hidden text-center text-gray-900">
        {/* Subtle Decorative Elements */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-[#16A34A] to-amber-400"></div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Badge */}
        <div className="relative mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-50 to-amber-50 border border-emerald-200 flex items-center justify-center text-[#16A34A] shadow-inner mb-4">
          <Trophy className="w-10 h-10 text-[#16A34A] animate-bounce" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500"></span>
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-[#16A34A] flex items-center justify-center gap-1.5">
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
        <div className="my-6 p-4 rounded-2xl bg-[#F8FAF8] border border-gray-200 flex items-center justify-around shadow-2xs">
          <div className="text-left">
            <span className="text-[10px] uppercase font-bold text-gray-500 block">Previous Balance</span>
            <span className="text-sm font-bold text-gray-700 font-mono">{previousPoints.toLocaleString()}</span>
          </div>

          <div className="h-8 w-px bg-gray-200"></div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-gray-500 block">New Balance</span>
            <span className="text-xl font-black text-amber-600 font-mono transition-all duration-500">
              {animatedPoints.toLocaleString()} pts
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={onViewDashboard}
            className="w-full py-3.5 px-4 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs sm:text-sm font-bold shadow-md shadow-green-900/10 transition-all flex items-center justify-center gap-2"
          >
            <span>Return to Campus Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onViewEcoBounty}
            className="w-full py-3 px-4 rounded-xl bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-2xs"
          >
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>View Eco-Bounty Hub & Leaderboard</span>
          </button>
        </div>
      </div>
    </div>
  );
}
