import 'server-only';

import { redirect } from 'next/navigation';

import { canAccessModule } from '@/lib/auth/permissions';
import { getCurrentUser } from '@/lib/auth/session';
import type { AdminModule, AdminUser } from '@/types/admin';

/**
 * Server-side route guard. Call at the top of every admin page/layout.
 * Redirects unauthenticated users to login and module-denied users to /admin.
 * This is the security boundary — UI hiding alone is never relied upon.
 */
export function requireAdmin(module?: AdminModule): AdminUser {
  const user = getCurrentUser();
  if (!user) {
    redirect('/admin/giris');
  }
  if (module && !canAccessModule(user, module)) {
    redirect('/admin');
  }
  return user;
}
