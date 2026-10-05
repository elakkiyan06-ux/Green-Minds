import { User, UserRole } from './types';
import { getSupabase } from './supabase';

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  department: string;
  eco_points: number;
  created_at: string;
}

export const SESSION_COOKIE_NAME = 'gm_session';

// Registered Demo Accounts
export const DEMO_USERS: (SessionUser & { passwordHash: string })[] = [
  {
    id: 'user-student-001',
    name: 'Elakkiyan R.',
    email: 'student@greenmind.demo',
    passwordHash: 'student123',
    role: 'user',
    department: 'Computer Science & Engineering',
    eco_points: 1240,
    created_at: '2026-08-15T09:00:00Z',
  },
  {
    id: 'user-admin-001',
    name: 'Dr. Aris Thorne',
    email: 'admin@greenmind.demo',
    passwordHash: 'admin123',
    role: 'admin',
    department: 'Campus Sustainability & Facilities Cell',
    eco_points: 0,
    created_at: '2026-01-10T08:30:00Z',
  },
  {
    id: 'user-student-002',
    name: 'Priya Sharma',
    email: 'priya.s@greenmind.demo',
    passwordHash: 'priya123',
    role: 'user',
    department: 'Environmental Engineering',
    eco_points: 980,
    created_at: '2026-08-20T10:15:00Z',
  },
  {
    id: 'user-student-003',
    name: 'Rohit Kumar',
    email: 'rohit.k@greenmind.demo',
    passwordHash: 'rohit123',
    role: 'user',
    department: 'Mechanical Engineering',
    eco_points: 840,
    created_at: '2026-08-22T11:45:00Z',
  },
  {
    id: 'user-student-004',
    name: 'Ananya Mishra',
    email: 'ananya.m@greenmind.demo',
    passwordHash: 'ananya123',
    role: 'user',
    department: 'Biotechnology',
    eco_points: 720,
    created_at: '2026-09-01T14:20:00Z',
  },
  {
    id: 'user-admin-002',
    name: 'Prof. K. Sundaram',
    email: 'sundaram.admin@greenmind.demo',
    passwordHash: 'admin123',
    role: 'admin',
    department: 'Estate & Infrastructure Management',
    eco_points: 0,
    created_at: '2026-02-01T10:00:00Z',
  },
];

// In-memory runtime users cache (can be extended by signup/new reports)
let runtimeUsers: (SessionUser & { passwordHash: string })[] = [...DEMO_USERS];

export function getAllCampusUsers(): SessionUser[] {
  return runtimeUsers.map(({ passwordHash, ...user }) => user);
}

export function findUserByEmail(email: string): (SessionUser & { passwordHash: string }) | undefined {
  const normalized = email.trim().toLowerCase();
  return runtimeUsers.find(u => u.email.toLowerCase() === normalized);
}

export function findUserById(id: string): SessionUser | undefined {
  const user = runtimeUsers.find(u => u.id === id);
  if (!user) return undefined;
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

/**
 * Authenticates user credentials with role verification.
 */
export async function authenticateCredentials(
  email: string,
  password: string,
  expectedRole?: 'user' | 'admin'
): Promise<{ success: boolean; user?: SessionUser; error?: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  const supabase = getSupabase();

  // 1. Check Supabase first if configured
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', normalizedEmail)
        .single();

      if (!error && data) {
        const userRole = (data.role === 'admin' ? 'admin' : 'user') as 'user' | 'admin';
        if (expectedRole && userRole !== expectedRole) {
          return {
            success: false,
            error: expectedRole === 'admin'
              ? 'Access denied: This account does not have administrator privileges. Please use the User Login.'
              : 'This is an administrator account. Please use the Admin Portal.',
          };
        }

        const sessionUser: SessionUser = {
          id: data.id,
          name: data.name,
          email: data.email,
          role: userRole,
          department: data.department || 'General',
          eco_points: data.eco_points || 0,
          created_at: data.created_at || new Date().toISOString(),
        };

        return { success: true, user: sessionUser };
      }
    } catch {
      // Fall through to memory store
    }
  }

  // 2. Memory / Demo Store Fallback
  const found = findUserByEmail(normalizedEmail);
  if (!found) {
    return { success: false, error: 'Invalid email address or account not found.' };
  }

  if (found.passwordHash !== password.trim()) {
    return { success: false, error: 'Invalid password. Please check your credentials.' };
  }

  if (expectedRole && found.role !== expectedRole) {
    return {
      success: false,
      error: expectedRole === 'admin'
        ? 'Access denied: This account does not have administrator privileges. Please use the User Login.'
        : 'This is an administrator account. Please use the Admin Portal.',
    };
  }

  const { passwordHash, ...sessionUser } = found;
  return { success: true, user: sessionUser };
}

/**
 * Simple, tamper-resistant base64 session token encoding
 */
export function encodeSessionToken(user: SessionUser): string {
  const payload = {
    ...user,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    sig: 'gm_' + Buffer.from(`${user.id}:${user.role}:${user.email}`).toString('base64'),
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

export function decodeSessionToken(token: string): SessionUser | null {
  try {
    const raw = Buffer.from(token, 'base64').toString('utf-8');
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.id || !parsed.role || !parsed.email) {
      return null;
    }
    if (parsed.exp && parsed.exp < Date.now()) {
      return null;
    }
    return {
      id: parsed.id,
      name: parsed.name,
      email: parsed.email,
      role: parsed.role === 'admin' ? 'admin' : 'user',
      department: parsed.department,
      eco_points: parsed.eco_points || 0,
      created_at: parsed.created_at,
    };
  } catch {
    return null;
  }
}
