'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Logo from '@/components/Common/Logo';
import { 
  ShieldCheck, 
  ArrowRight, 
  Building2, 
  SlidersHorizontal, 
  BarChart3, 
  Wrench,
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

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/admin/dashboard';

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
          expectedRole: 'admin',
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

    if (loginEmail === 'admin@greenmind.demo' && loginPass === 'admin123') {
      if (typeof window !== 'undefined') {
        localStorage.setItem('gm_client_role', 'admin');
        localStorage.setItem('gm_client_user', JSON.stringify({
          id: 'admin-001',
          name: 'Campus Facility Operations',
          email: 'admin@greenmind.demo',
          role: 'admin',
          department: 'Facilities General',
        }));
      }
      router.push(redirectPath);
      return;
    }

    setError('Failed to sign in. Please verify your administrative credentials.');
    setLoading(false);
  };

  const handleDemoAdminLogin = () => {
    setEmail('admin@greenmind.demo');
    setPassword('admin123');
    handleLogin(undefined, 'admin@greenmind.demo', 'admin123');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1E15] via-[#14281D] to-[#0A160F] text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 backdrop-blur-md">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <span className="text-sm font-black tracking-wider uppercase text-emerald-300">
              Campus Security & Administration
            </span>
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          GreenMind Admin Portal
        </h1>
        <p className="mt-2 text-sm text-emerald-200/80 max-w-sm mx-auto">
          Manage environmental issues, maintenance and campus sustainability.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-[#172E21]/95 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl shadow-black/40 rounded-3xl border border-emerald-500/30 relative overflow-hidden">
          {/* Subtle top indicator */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-green-500" />

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/80 border border-red-500/50 flex items-start gap-2.5 text-xs text-red-200 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-emerald-200 uppercase tracking-wider mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <MailIcon className="w-4 h-4 text-emerald-400/60 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@greenmind.demo"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0F2015] border border-emerald-500/30 text-sm text-white placeholder-emerald-700 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-emerald-200 uppercase tracking-wider mb-1.5">
                Security Password
              </label>
              <div className="relative">
                <LockIcon className="w-4 h-4 text-emerald-400/60 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0F2015] border border-emerald-500/30 text-sm text-white placeholder-emerald-700 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 text-sm font-black shadow-lg shadow-emerald-500/20 transition-all duration-150 flex items-center justify-center gap-2 hover:scale-[1.01] disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Access Admin Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Safe Demo Admin Credentials */}
          <div className="mt-6 pt-5 border-t border-emerald-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                Demo Administrator
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-900 text-emerald-200 border border-emerald-700">
                1-Click Sign In
              </span>
            </div>

            <button
              type="button"
              onClick={handleDemoAdminLogin}
              disabled={loading}
              className="w-full text-left p-3 rounded-xl bg-[#0F2015] hover:bg-[#12271A] border border-emerald-500/30 transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 flex items-center justify-center text-xs font-bold">
                  🛡️
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Dr. Aris Thorne (Campus Admin)</div>
                  <div className="text-[11px] text-emerald-400/70 font-mono">admin@greenmind.demo</div>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-400 group-hover:translate-x-0.5 transition-transform">
                Enter →
              </span>
            </button>
          </div>

          {/* Admin Capabilities Summary */}
          <div className="mt-5 grid grid-cols-3 gap-2 text-center pt-3 border-t border-emerald-500/20">
            <div className="p-2 rounded-lg bg-[#0F2015] text-[11px] border border-emerald-500/10">
              <Wrench className="w-3.5 h-3.5 text-emerald-400 mx-auto mb-1" />
              <span className="text-emerald-200 font-medium">Maintenance</span>
            </div>
            <div className="p-2 rounded-lg bg-[#0F2015] text-[11px] border border-emerald-500/10">
              <BarChart3 className="w-3.5 h-3.5 text-teal-400 mx-auto mb-1" />
              <span className="text-emerald-200 font-medium">Analytics</span>
            </div>
            <div className="p-2 rounded-lg bg-[#0F2015] text-[11px] border border-emerald-500/10">
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400 mx-auto mb-1" />
              <span className="text-emerald-200 font-medium">Impact & Recurrence</span>
            </div>
          </div>

          {/* Switch to User Login */}
          <div className="mt-6 pt-4 border-t border-emerald-500/20 text-center">
            <p className="text-xs text-emerald-300/70">
              Looking for student or regular user login?
            </p>
            <Link
              href="/login"
              className="mt-1 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <span>Go to GreenMind User Login</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0F1E15] flex items-center justify-center text-emerald-400 font-bold text-sm">Loading Admin Portal...</div>}>
      <AdminLoginContent />
    </Suspense>
  );
}
