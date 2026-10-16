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
    <div className="min-h-screen bg-gradient-to-br from-[#F7FAF7] via-white to-[#DCFCE7]/40 text-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex flex-col items-center gap-3 mb-4">
          <Logo showTagline={false} />
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-2xs">
            <ShieldCheck className="w-5 h-5 text-[#16A34A]" />
            <span className="text-xs font-bold tracking-wider uppercase text-emerald-800">
              Campus Security & Administration
            </span>
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
          GreenMind Admin Portal
        </h1>
        <p className="mt-2 text-sm text-gray-600 max-w-sm mx-auto">
          Manage environmental issues, maintenance dispatches, and campus sustainability.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-green-950/5 rounded-3xl border border-[#E5EBE5] relative overflow-hidden">
          {/* Subtle top indicator */}
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
                Admin Email
              </label>
              <div className="relative">
                <MailIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@greenmind.demo"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8FAF8] border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-[#DCFCE7] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Security Password
              </label>
              <div className="relative">
                <LockIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8FAF8] border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-[#DCFCE7] transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-sm font-bold shadow-md shadow-green-900/10 transition-all duration-150 flex items-center justify-center gap-2 hover:scale-[1.01] disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Access Admin Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Safe Demo Admin Credentials */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#14532D] uppercase tracking-wider">
                Demo Administrator
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                1-Click Sign In
              </span>
            </div>

            <button
              type="button"
              onClick={handleDemoAdminLogin}
              disabled={loading}
              className="w-full text-left p-3 rounded-xl bg-[#F8FAF8] hover:bg-[#EFF6EF] border border-[#E5EBE5] transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-200 text-emerald-800 flex items-center justify-center text-xs font-bold">
                  🛡️
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900">Dr. Aris Thorne (Campus Admin)</div>
                  <div className="text-[11px] text-[#16A34A] font-mono">admin@greenmind.demo</div>
                </div>
              </div>
              <span className="text-xs font-bold text-[#16A34A] group-hover:translate-x-0.5 transition-transform">
                Enter →
              </span>
            </button>
          </div>

          {/* Admin Capabilities Summary */}
          <div className="mt-5 grid grid-cols-3 gap-2 text-center pt-3 border-t border-gray-100">
            <div className="p-2 rounded-xl bg-[#F8FAF8] text-[11px] border border-gray-100">
              <Wrench className="w-3.5 h-3.5 text-[#16A34A] mx-auto mb-1" />
              <span className="text-gray-700 font-medium">Maintenance</span>
            </div>
            <div className="p-2 rounded-xl bg-[#F8FAF8] text-[11px] border border-gray-100">
              <BarChart3 className="w-3.5 h-3.5 text-teal-600 mx-auto mb-1" />
              <span className="text-gray-700 font-medium">Analytics</span>
            </div>
            <div className="p-2 rounded-xl bg-[#F8FAF8] text-[11px] border border-gray-100">
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600 mx-auto mb-1" />
              <span className="text-gray-700 font-medium">Impact & Recurrence</span>
            </div>
          </div>

          {/* Switch to User Login */}
          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">
              Looking for student or regular user login?
            </p>
            <Link
              href="/login"
              className="mt-1 inline-flex items-center gap-1.5 text-xs font-bold text-[#16A34A] hover:text-[#14532D] transition-colors"
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
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAF8] flex items-center justify-center text-[#16A34A] font-bold text-sm">Loading Admin Portal...</div>}>
      <AdminLoginContent />
    </Suspense>
  );
}
