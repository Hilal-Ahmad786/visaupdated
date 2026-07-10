'use server';

import { revalidatePath } from 'next/cache';

import { requireAdmin } from '@/lib/auth/guard';
import { can } from '@/lib/auth/permissions';
import {
  createAdminUser,
  deleteAdminUser,
  resetAdminUserPassword,
  setAdminUserStatus,
} from '@/lib/auth/users';
import type { UserStatus } from '@/types/admin';

/**
 * Server actions for real admin-user management (backed by the `admin_users`
 * table). Every action re-checks the caller's permission on the server — the
 * client UI gating is never trusted — and revalidates the affected pages.
 */

export interface ActionResult {
  ok: boolean;
  error?: string;
}

export async function createUserAction(input: {
  name: string;
  email: string;
  password: string;
  roleIds: string[];
}): Promise<ActionResult> {
  const user = requireAdmin('users');
  if (!can(user, 'users:edit')) return { ok: false, error: 'Bu işlem için yetkiniz yok.' };
  const res = await createAdminUser(input);
  if (res.ok) revalidatePath('/admin/kullanicilar');
  return { ok: res.ok, error: res.error };
}

export async function setUserStatusAction(id: string, status: UserStatus): Promise<ActionResult> {
  const user = requireAdmin('users');
  if (!can(user, 'users:edit')) return { ok: false, error: 'Bu işlem için yetkiniz yok.' };
  // Separation of duties: an admin can't suspend/deactivate their own account.
  if (id === user.id && status !== 'active') {
    return { ok: false, error: 'Kendi hesabınızı askıya alamaz veya kapatamazsınız.' };
  }
  const res = await setAdminUserStatus(id, status);
  if (res.ok) {
    revalidatePath('/admin/kullanicilar');
    revalidatePath(`/admin/kullanicilar/${id}`);
  }
  return { ok: res.ok, error: res.error };
}

export async function resetPasswordAction(id: string, password: string): Promise<ActionResult> {
  const user = requireAdmin('users');
  if (!can(user, 'users:edit')) return { ok: false, error: 'Bu işlem için yetkiniz yok.' };
  const res = await resetAdminUserPassword(id, password);
  if (res.ok) revalidatePath(`/admin/kullanicilar/${id}`);
  return { ok: res.ok, error: res.error };
}

export async function deleteUserAction(id: string): Promise<ActionResult> {
  const user = requireAdmin('users');
  if (!can(user, 'users:edit')) return { ok: false, error: 'Bu işlem için yetkiniz yok.' };
  if (id === user.id) return { ok: false, error: 'Kendi hesabınızı silemezsiniz.' };
  const res = await deleteAdminUser(id);
  if (res.ok) revalidatePath('/admin/kullanicilar');
  return { ok: res.ok, error: res.error };
}
