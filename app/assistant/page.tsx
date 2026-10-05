'use client';

import React from 'react';
import ChatInterface from '@/components/Assistant/ChatInterface';
import { Bot, Sparkles, HelpCircle } from 'lucide-react';

export default function AssistantPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase tracking-wide">
            Campus Context Aware
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
          <Bot className="w-7 h-7 text-[#16A34A]" />
          <span>GreenMind Assistant</span>
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Ask anything about improving campus sustainability.
        </p>
      </div>

      {/* Main Chat Interface */}
      <ChatInterface />
    </div>
  );
}
