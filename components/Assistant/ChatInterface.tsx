'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AssistantMessage, AssistantRecommendation } from '@/lib/types';
import { 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  CheckCircle2, 
  HelpCircle, 
  TrendingUp, 
  ShieldAlert, 
  Loader2,
  Database
} from 'lucide-react';

interface ChatInterfaceProps {
  initialQuestion?: string;
}

export default function ChatInterface({ initialQuestion }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: 'Hello! I am GreenMind, your campus sustainability advisor. I analyze live environmental logs across our campus to help you reduce waste, save water, boost energy efficiency, and improve our Green Score. How can I assist you today?',
      isCampusDataBased: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [input, setInput] = useState(initialQuestion || '');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    'What environmental problems repeatedly happen in Boys Hostel?',
    'What is the most common issue in IT Block?',
    'Which problems have remained unresolved the longest?',
    'What environmental issues are in the Sports Complex?',
    'How can our campus save water?',
    'Why is our Green Score at 78/100 and how to reach 85?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (questionToSend?: string) => {
    const q = (questionToSend || input).trim();
    if (!q || loading) return;

    const userMessage: AssistantMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
      });

      if (!res.ok) {
        throw new Error('Failed to get assistant response');
      }

      const data = await res.json();

      const aiMessage: AssistantMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.text || 'Here are our recommendations based on campus environmental data.',
        recommendations: data.recommendations || [],
        isCampusDataBased: data.isCampusDataBased,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: "GreenMind couldn't complete the analysis right now. Please try asking again.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] min-h-[500px] bg-white rounded-2xl border border-[#E5EBE5] shadow-xs overflow-hidden">
      {/* Top Assistant Status Banner */}
      <div className="px-6 py-3.5 bg-gradient-to-r from-[#F7FAF7] to-[#DCFCE7]/30 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#14532D] text-white flex items-center justify-center">
            <Bot className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <span className="font-extrabold text-sm text-gray-900 block leading-tight">
              GreenMind Sustainability Advisor
            </span>
            <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Campus Context Synchronized
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-700 bg-white px-3 py-1 rounded-full border border-emerald-200 shadow-2xs">
          <Database className="w-3.5 h-3.5 text-[#16A34A]" />
          <span className="font-semibold text-emerald-900">Campus Sustainability Memory Active</span>
        </div>
      </div>

      {/* Suggested Questions Pills */}
      <div className="px-6 py-2.5 bg-gray-50/70 border-b border-gray-100 overflow-x-auto">
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span className="text-xs font-semibold text-gray-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#16A34A]" />
            Suggestions:
          </span>
          {suggestedQuestions.map((sq) => (
            <button
              key={sq}
              onClick={() => handleSend(sq)}
              className="text-xs font-medium px-3 py-1 rounded-full bg-white hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 text-gray-700 transition-colors shadow-2xs"
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F7FAF7]/40">
        {messages.map((m) => {
          const isUser = m.role === 'user';

          return (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center shadow-xs ${
                  isUser
                    ? 'bg-[#16A34A] text-white'
                    : 'bg-[#14532D] text-white'
                }`}
              >
                {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5 text-emerald-300" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-2xl rounded-2xl p-4.5 space-y-3.5 ${
                  isUser
                    ? 'bg-[#16A34A] text-white rounded-tr-none shadow-sm'
                    : 'bg-white text-gray-900 border border-[#E5EBE5] rounded-tl-none shadow-xs'
                }`}
              >
                {/* AI Campus Context Badge */}
                {!isUser && m.isCampusDataBased && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-800">
                    <Database className="w-3 h-3 text-emerald-600" />
                    <span>Derived from active campus incident reports</span>
                  </div>
                )}

                {/* Main Content Text */}
                <div className={`text-sm leading-relaxed ${isUser ? 'text-white' : 'text-gray-800'}`}>
                  {m.content}
                </div>

                {/* Structured Recommendations Card List */}
                {m.recommendations && m.recommendations.length > 0 && (
                  <div className="space-y-2.5 pt-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Recommended Strategic Actions:
                    </div>
                    {m.recommendations.map((rec, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-emerald-200 transition-colors text-xs space-y-1.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-[#DCFCE7] text-[#14532D] flex items-center justify-center font-bold text-[10px]">
                              {idx + 1}
                            </span>
                            {rec.recommendation}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase ${
                              rec.priority === 'High'
                                ? 'bg-red-100 text-red-700'
                                : rec.priority === 'Medium'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            {rec.priority}
                          </span>
                        </div>

                        <p className="text-gray-600 text-[11px] pl-6.5">
                          <strong className="text-gray-700">Reason:</strong> {rec.reason}
                        </p>

                        <div className="pl-6.5 flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span><strong>Expected Benefit:</strong> {rec.expected_benefit}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className={`text-[10px] text-right ${isUser ? 'text-emerald-100' : 'text-gray-400'}`}>
                  {m.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#14532D] text-white flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5 text-emerald-300 animate-pulse" />
            </div>
            <div className="bg-white border border-[#E5EBE5] rounded-2xl rounded-tl-none p-4 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                <Loader2 className="w-4 h-4 animate-spin text-[#16A34A]" />
                <span>GreenMind is analyzing campus context and formulating recommendations...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-4 bg-white border-t border-gray-100 flex items-center gap-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about campus sustainability, e.g. 'How can we reduce repeated waste in Block 3?'"
          className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-[#DCFCE7] text-sm text-gray-900 transition-all placeholder:text-gray-400"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="px-5 py-3 rounded-xl bg-[#16A34A] hover:bg-[#14532D] disabled:opacity-40 text-white font-semibold text-sm shadow-md shadow-green-700/20 transition-all duration-150 flex items-center gap-2 shrink-0"
        >
          <span>Ask</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
