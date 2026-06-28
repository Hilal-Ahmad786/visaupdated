/**
 * Permission API. Pure functions used by route guards (server) and UI guards
 * (client). Role permissions + direct grants − direct denies. A role with
 * `['*']` is a super admin. Replace `getCurrentUser()` (in session.ts) with a
 * real auth provider later — these functions stay the same.
 */
import type { AdminModule, AdminUser, Permission, PermissionAction, Role } from '@/types/admin';
import { roles as allRoles } from '@/lib/data/mock-users';

function effectivePermissions(user: AdminUser): Set<string> {
  const set = new Set<string>();
  const collect = (roleId: string, seen = new Set<string>()) => {
    if (seen.has(roleId)) return;
    seen.add(roleId);
    const role = allRoles.find((r) => r.id === roleId);
    if (!role) return;
    if ((role.permissions as string[]).includes('*')) {
      set.add('*');
      return;
    }
    for (const p of role.permissions as string[]) set.add(p);
    for (const inherited of role.inheritsRoleIds ?? []) collect(inherited, seen);
  };
  for (const roleId of user.roleIds) collect(roleId);
  for (const g of user.directGrants ?? []) set.add(g);
  for (const d of user.directDenies ?? []) set.delete(d);
  return set;
}

export function can(user: AdminUser | null, permission: Permission): boolean {
  if (!user || user.status !== 'active') return false;
  const perms = effectivePermissions(user);
  if (perms.has('*')) return true;
  // A direct deny always wins.
  if ((user.directDenies ?? []).includes(permission)) return false;
  return perms.has(permission);
}

export function canAccessModule(user: AdminUser | null, module: AdminModule): boolean {
  if (!user || user.status !== 'active') return false;
  const perms = effectivePermissions(user);
  if (perms.has('*')) return true;
  // Module access = has any permission on that module.
  for (const p of perms) {
    if (p.startsWith(`${module}:`)) return true;
  }
  return false;
}

export function canViewSensitiveData(user: AdminUser | null, module: AdminModule = 'leads'): boolean {
  return can(user, `${module}:view_sensitive` as Permission);
}

export function canPublish(user: AdminUser | null, module: AdminModule): boolean {
  return can(user, `${module}:publish` as Permission);
}

export function permissionsForModule(user: AdminUser | null, module: AdminModule): PermissionAction[] {
  if (!user) return [];
  const perms = effectivePermissions(user);
  if (perms.has('*')) {
    return ['view', 'create', 'edit', 'review', 'approve', 'publish', 'unpublish', 'archive', 'delete', 'export', 'manage_settings', 'view_sensitive', 'assign'];
  }
  const actions: PermissionAction[] = [];
  for (const p of perms) {
    const [m, a] = p.split(':');
    if (m === module && a) actions.push(a as PermissionAction);
  }
  return actions;
}

export function roleById(id: string): Role | undefined {
  return allRoles.find((r) => r.id === id);
}
