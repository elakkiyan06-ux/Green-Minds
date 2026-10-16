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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#E5EBE5] p-6 rounded-3xl text-gray-900 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold mb-2">
            <Users className="w-3.5 h-3.5 text-[#16A34A]" />
            Campus User & Role Registry
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Campus Users & Permissions
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage student auditors, staff accounts, and administrator permissions across university departments.
          </p>
        </div>

        <button
          onClick={fetchUsers}
          className="px-4 py-2 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto shadow-2xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E5EBE5] p-4 rounded-2xl flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase">Total Accounts</span>
            <div className="text-2xl font-black text-gray-900 mt-0.5">{totalUsers}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-[#16A34A] flex items-center justify-center shadow-2xs">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-[#E5EBE5] p-4 rounded-2xl flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase">Student Auditors</span>
            <div className="text-2xl font-black text-[#16A34A] mt-0.5">{studentCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-[#16A34A] flex items-center justify-center shadow-2xs">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-[#E5EBE5] p-4 rounded-2xl flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs font-bold text-gray-700 uppercase">Administrators</span>
            <div className="text-2xl font-black text-gray-900 mt-0.5">{adminCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 text-gray-700 flex items-center justify-center shadow-2xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl p-4 border border-[#E5EBE5] shadow-xs space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name, email, or department..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F8FAF8] border border-gray-200 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#16A34A]"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-gray-100 text-xs">
          <span className="text-gray-500 font-bold flex items-center gap-1 mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Filter Role:
          </span>

          <button
            onClick={() => setRoleFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              roleFilter === 'all'
                ? 'bg-[#16A34A] text-white shadow-2xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Accounts
          </button>

          <button
            onClick={() => setRoleFilter('user')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              roleFilter === 'user'
                ? 'bg-[#16A34A] text-white shadow-2xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Students (user)
          </button>

          <button
            onClick={() => setRoleFilter('admin')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              roleFilter === 'admin'
                ? 'bg-[#16A34A] text-white shadow-2xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Administrators (admin)
          </button>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="animate-spin w-8 h-8 border-4 border-[#16A34A] border-t-transparent rounded-full mx-auto"></div>
          <p className="text-xs text-gray-500">Loading user registry...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#E5EBE5] text-gray-500 shadow-xs">
          No users match the selected search criteria.
        </div>
      ) : (
        <div className="bg-white border border-[#E5EBE5] rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAF8] text-gray-500 uppercase text-[10px] tracking-wider border-b border-gray-100">
                <tr>
                  <th className="p-4">User Details</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Eco Points</th>
                  <th className="p-4">Created Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-[#F8FAF8] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#14532D] flex items-center justify-center font-bold text-xs shadow-2xs">
                          {u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-sm">{u.name}</div>
                          <div className="font-mono text-[10px] text-gray-400">{u.id}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-gray-600 font-mono text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <MailIcon className="w-3.5 h-3.5 text-gray-400" />
                        <span>{u.email}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                        u.role === 'admin'
                          ? 'bg-[#16A34A] text-white shadow-xs'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}>
                        {u.role}
                      </span>
                    </td>

                    <td className="p-4 text-gray-700 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-gray-400" />
                        <span>{u.department}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      {u.role === 'admin' ? (
                        <span className="text-gray-400 text-[11px]">—</span>
                      ) : (
                        <span className="font-bold text-emerald-800 flex items-center gap-1">
                          <Trophy className="w-3 h-3 text-amber-500" />
                          {(u.eco_points || 0).toLocaleString()} pts
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-gray-500 font-mono text-[11px]">
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
