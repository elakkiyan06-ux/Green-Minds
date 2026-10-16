'use client';

import React from 'react';
import ChatInterface from '@/components/Assistant/ChatInterface';
import { Bot, Sparkles, HelpCircle } from 'lucide-react';

export default function AssistantPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="bg-white border border-[#E5EBE5] p-6 rounded-3xl text-gray-900 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase tracking-wide flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#16A34A]" />
            Campus Context Aware
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
          <Bot className="w-7 h-7 text-[#16A34A]" />
          <span>GreenMind Sustainability Advisor</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          Ask questions about campus environmental issues, recurring problem history, and conservation guidelines.
        </p>
      </div>

      {/* Main Chat Interface */}
      <ChatInterface />
    </div>
  );
}
