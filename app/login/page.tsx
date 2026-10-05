'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Logo from '@/components/Common/Logo';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldAlert, 
  CheckCircle2, 
  Trophy, 
  Camera, 
  Bot,
  AlertCircle
} from 'lucide-react';

const MailIcon = ({ className }: { className?: string }) => (
  <svg className={className || "w-4 h-4"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LockIcon = ({ className }: { className?: string }) => (
  <svg className={className || "w-4 h-4"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

function UserLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/user/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e?: React.FormEvent, overrideEmail?: string, overridePass?: string) => {
    if (e) e.preventDefault();
    setError(null);
    setLoading(true);

    const loginEmail = overrideEmail || email;
    const loginPass = overridePass || password;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPass,
          expectedRole: 'user',
        }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push(redirectPath);
        router.refresh();
        return;
      }
    } catch (err: any) {
      // Fallback to client-side auth on static hosts like GitHub Pages
    }

    if (loginEmail === 'student@greenmind.demo' && loginPass === 'student123') {
      if (typeof window !== 'undefined') {
        localStorage.setItem('gm_client_role', 'user');
        localStorage.setItem('gm_client_user', JSON.stringify({
          id: 'user-001',
          name: 'Elakkiyan (Student Auditor)',
          email: 'student@greenmind.demo',
          role: 'user',
          department: 'Computer Science',
        }));
      }
      router.push(redirectPath);
      return;
    }

    setError('Failed to sign in. Please verify your credentials.');
    setLoading(false);
  };

  const handleDemoStudentLogin = () => {
    setEmail('student@greenmind.demo');
    setPassword('student123');
    handleLogin(undefined, 'student@greenmind.demo', 'student123');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7FAF7] via-white to-[#DCFCE7]/40 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center mb-4">
          <Logo showTagline={false} />
        </div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          GreenMind User Login
        </h1>
        <p className="mt-2 text-sm text-gray-600 max-w-sm mx-auto">
          Report environmental problems and contribute to a greener campus.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-green-950/5 rounded-3xl border border-[#E5EBE5] relative overflow-hidden">
          {/* Subtle top decoration */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-[#16A34A] to-teal-500" />

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Campus Email
              </label>
              <div className="relative">
                <MailIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@greenmind.demo"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-[#DCFCE7] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <LockIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-[#DCFCE7] transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-[#16A34A] hover:bg-[#14532D] text-white text-sm font-bold shadow-md shadow-green-700/20 transition-all duration-150 flex items-center justify-center gap-2 hover:scale-[1.01] disabled:opacity-50"
            >
              <span>{loading ? 'Signing in...' : 'Sign In to User Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Safe Demo Credentials Section */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Demo Student Account
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                1-Click Sign In
              </span>
            </div>
            
            <button
              type="button"
              onClick={handleDemoStudentLogin}
              disabled={loading}
              className="w-full text-left p-3 rounded-xl bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-200 transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#16A34A] text-white flex items-center justify-center text-xs font-bold">
                  🌱
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900">Elakkiyan R. (Student Auditor)</div>
                  <div className="text-[11px] text-gray-500 font-mono">student@greenmind.demo</div>
                </div>
              </div>
              <span className="text-xs font-semibold text-[#16A34A] group-hover:translate-x-0.5 transition-transform">
                Sign In →
              </span>
            </button>
          </div>

          {/* Student Feature Highlights */}
          <div className="mt-5 grid grid-cols-3 gap-2 text-center pt-3 border-t border-gray-100">
            <div className="p-2 rounded-lg bg-gray-50 text-[11px]">
              <Camera className="w-3.5 h-3.5 text-emerald-600 mx-auto mb-1" />
              <span className="text-gray-700 font-medium">Report Issues</span>
            </div>
            <div className="p-2 rounded-lg bg-gray-50 text-[11px]">
              <Trophy className="w-3.5 h-3.5 text-amber-600 mx-auto mb-1" />
              <span className="text-gray-700 font-medium">Eco-Bounty</span>
            </div>
            <div className="p-2 rounded-lg bg-gray-50 text-[11px]">
              <Bot className="w-3.5 h-3.5 text-blue-600 mx-auto mb-1" />
              <span className="text-gray-700 font-medium">AI Assistant</span>
            </div>
          </div>

          {/* Switch to Admin Login */}
          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">
              Campus administrator or facilities staff?
            </p>
            <Link
              href="/admin/login"
              className="mt-1 inline-flex items-center gap-1.5 text-xs font-bold text-gray-900 hover:text-[#16A34A] transition-colors"
            >
              <span>Go to Admin Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UserLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F7FAF7] flex items-center justify-center text-emerald-800 font-bold text-sm">Loading GreenMind Login...</div>}>
      <UserLoginContent />
    </Suspense>
  );
}
