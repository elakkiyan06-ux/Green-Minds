'use client';

import React, { useEffect, useState } from 'react';
import { User, UserRole } from '@/lib/types';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  Building2, 
  Trophy, 
  Calendar,
  SlidersHorizontal,
  RefreshCw
} from 'lucide-react';

const MailIcon = ({ className }: { className?: string }) => (
  <svg className={className || "w-4 h-4"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'admin'>('all');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const match =
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.department && u.department.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === 'admin').length;
  const studentCount = users.filter((u) => u.role === 'user' || u.role === 'student').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#122419] border border-emerald-500/20 p-6 rounded-3xl text-white">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold mb-2">
            <Users className="w-3.5 h-3.5" />
            Campus User & Role Registry
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Campus Users & Permissions
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200/70 mt-1">
            Manage student auditors, staff accounts, and administrator permissions across university departments.
          </p>
        </div>

        <button
          onClick={fetchUsers}
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#122419] border border-emerald-500/20 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase">Total Accounts</span>
            <div className="text-2xl font-black text-white mt-0.5">{totalUsers}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#122419] border border-emerald-500/20 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase">Student Auditors</span>
            <div className="text-2xl font-black text-emerald-300 mt-0.5">{studentCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#122419] border border-emerald-500/20 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase">Administrators</span>
            <div className="text-2xl font-black text-white mt-0.5">{adminCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-[#122419] rounded-2xl p-4 border border-emerald-500/20 space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-emerald-500/60 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name, email, or department..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0A160F] border border-emerald-500/30 text-xs sm:text-sm text-white placeholder-emerald-800 focus:outline-none focus:border-emerald-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-emerald-900/40 text-xs">
          <span className="text-emerald-400/80 font-bold flex items-center gap-1 mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Filter Role:
          </span>

          <button
            onClick={() => setRoleFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              roleFilter === 'all'
                ? 'bg-emerald-500 text-gray-950'
                : 'bg-[#0A160F] text-emerald-200 hover:text-white border border-emerald-500/30'
            }`}
          >
            All Accounts
          </button>

          <button
            onClick={() => setRoleFilter('user')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              roleFilter === 'user'
                ? 'bg-emerald-500 text-gray-950'
                : 'bg-[#0A160F] text-emerald-200 hover:text-white border border-emerald-500/30'
            }`}
          >
            Students (user)
          </button>

          <button
            onClick={() => setRoleFilter('admin')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              roleFilter === 'admin'
                ? 'bg-emerald-500 text-gray-950'
                : 'bg-[#0A160F] text-emerald-200 hover:text-white border border-emerald-500/30'
            }`}
          >
            Administrators (admin)
          </button>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="animate-spin w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-xs text-emerald-300/70">Loading user registry...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-[#122419] rounded-3xl p-12 text-center border border-emerald-500/20 text-emerald-300/70">
          No users match the selected search criteria.
        </div>
      ) : (
        <div className="bg-[#122419] border border-emerald-500/20 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0A160F] text-emerald-400 uppercase text-[10px] tracking-wider border-b border-emerald-900/50">
                <tr>
                  <th className="p-4">User Details</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Eco Points</th>
                  <th className="p-4">Created Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-900/30">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-emerald-950/40 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 flex items-center justify-center font-bold text-xs">
                          {u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">{u.name}</div>
                          <div className="font-mono text-[10px] text-emerald-400/70">{u.id}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-emerald-200/90 font-mono text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <MailIcon className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{u.email}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                        u.role === 'admin'
                          ? 'bg-emerald-500 text-gray-950 shadow-xs'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>

                    <td className="p-4 text-emerald-200/90 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-emerald-400/70" />
                        <span>{u.department}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      {u.role === 'admin' ? (
                        <span className="text-emerald-500/50 text-[11px]">—</span>
                      ) : (
                        <span className="font-bold text-emerald-400 flex items-center gap-1">
                          <Trophy className="w-3 h-3 text-amber-400" />
                          {(u.eco_points || 0).toLocaleString()} pts
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-emerald-300/70 font-mono text-[11px]">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
