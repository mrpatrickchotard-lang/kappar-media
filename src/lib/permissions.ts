import { getServerSession } from 'next-auth';
import { authOptions } from './auth';

export type UserRole = 'admin' | 'writer' | 'partner';

export async function getSessionWithRole() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  return {
    ...session,
    user: {
      ...session.user,
      role: (session.user.role || 'admin') as UserRole,
    },
  };
}

export function canManageArticles(role: UserRole): boolean {
  return role === 'admin' || role === 'writer';
}

export function canManageAllArticles(role: UserRole): boolean {
  return role === 'admin';
}

export function canManagePartners(role: UserRole): boolean {
  return role === 'admin' || role === 'partner';
}

export function canManageAllPartners(role: UserRole): boolean {
  return role === 'admin';
}

export function canManageEvents(role: UserRole): boolean {
  return role === 'admin';
}

export function canManageUsers(role: UserRole): boolean {
  return role === 'admin';
}

export function canViewDatabase(role: UserRole): boolean {
  return role === 'admin';
}

export function getDashboardPath(role: UserRole): string {
  switch (role) {
    case 'admin': return '/admin';
    case 'writer': return '/dashboard/writer';
    case 'partner': return '/dashboard/partner';
    default: return '/admin/login';
  }
}
