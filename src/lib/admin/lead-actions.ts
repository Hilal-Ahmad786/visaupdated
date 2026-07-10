'use server';

import crypto from 'node:crypto';

import { revalidatePath } from 'next/cache';

import { requireAdmin } from '@/lib/auth/guard';
import { can } from '@/lib/auth/permissions';
import { addLeadNote, assignLead, setLeadArchived, updateLeadStatus } from '@/lib/leads';

/**
 * Server actions for the real lead workflow (status/stage, assignment, notes,
 * archive). Persist to the leads table. Permission is re-checked server-side.
 */

export interface ActionResult {
  ok: boolean;
  error?: string;
}

function revalidateLead(id: string) {
  revalidatePath('/admin/leads');
  revalidatePath(`/admin/leads/${id}`);
  revalidatePath('/admin');
}

export async function changeLeadStatusAction(id: string, status: string): Promise<ActionResult> {
  const user = requireAdmin('leads');
  if (!can(user, 'leads:edit')) return { ok: false, error: 'Bu işlem için yetkiniz yok.' };
  const res = await updateLeadStatus(id, status);
  if (res.ok) revalidateLead(id);
  return res;
}

export async function assignLeadAction(id: string, userId: string | null): Promise<ActionResult> {
  const user = requireAdmin('leads');
  if (!can(user, 'leads:assign') && !can(user, 'leads:edit')) {
    return { ok: false, error: 'Bu işlem için yetkiniz yok.' };
  }
  const res = await assignLead(id, userId || null);
  if (res.ok) revalidateLead(id);
  return res;
}

export async function addLeadNoteAction(id: string, body: string): Promise<ActionResult> {
  const user = requireAdmin('leads');
  if (!can(user, 'leads:edit')) return { ok: false, error: 'Bu işlem için yetkiniz yok.' };
  const text = (body ?? '').trim();
  if (!text) return { ok: false, error: 'Not boş olamaz.' };
  const res = await addLeadNote(id, {
    id: crypto.randomUUID(),
    authorId: user.id,
    authorName: user.name,
    body: text.slice(0, 2000),
    createdAt: new Date().toISOString(),
  });
  if (res.ok) revalidateLead(id);
  return res;
}

export async function archiveLeadAction(id: string, archived = true): Promise<ActionResult> {
  const user = requireAdmin('leads');
  if (!can(user, 'leads:edit') && !can(user, 'leads:archive')) {
    return { ok: false, error: 'Bu işlem için yetkiniz yok.' };
  }
  const res = await setLeadArchived(id, archived);
  if (res.ok) revalidateLead(id);
  return res;
}

export async function bulkArchiveLeadsAction(ids: string[]): Promise<ActionResult> {
  const user = requireAdmin('leads');
  if (!can(user, 'leads:edit') && !can(user, 'leads:archive')) {
    return { ok: false, error: 'Bu işlem için yetkiniz yok.' };
  }
  for (const id of ids) await setLeadArchived(id, true);
  revalidatePath('/admin/leads');
  revalidatePath('/admin');
  return { ok: true };
}

export async function bulkAssignLeadsAction(
  ids: string[],
  userId: string | null,
): Promise<ActionResult> {
  const user = requireAdmin('leads');
  if (!can(user, 'leads:assign') && !can(user, 'leads:edit')) {
    return { ok: false, error: 'Bu işlem için yetkiniz yok.' };
  }
  for (const id of ids) await assignLead(id, userId || null);
  revalidatePath('/admin/leads');
  return { ok: true };
}
