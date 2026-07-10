'use server';

import { revalidatePath } from 'next/cache';

import { requireAdmin } from '@/lib/auth/guard';
import { can, canPublish } from '@/lib/auth/permissions';
import {
  deleteArticle,
  findArticle,
  setArticleStatus,
  upsertArticle,
} from '@/lib/admin/blog-store';
import type { Article } from '@/types/content';

export interface BlogActionResult {
  ok: boolean;
  error?: string;
  slug?: string;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function revalidateBlog(slug?: string) {
  revalidatePath('/blog');
  revalidatePath('/sitemap.xml');
  revalidatePath('/admin/blog');
  revalidatePath('/'); // homepage featured list
  if (slug) {
    revalidatePath(`/blog/${slug}`);
    revalidatePath(`/admin/blog/${slug}`);
  }
}

/** Create a new draft article and return its slug for the editor redirect. */
export async function createArticleAction(input: {
  title: string;
  slug?: string;
  category?: string;
}): Promise<BlogActionResult> {
  const user = requireAdmin('blog');
  if (!can(user, 'blog:create') && !can(user, 'blog:edit')) {
    return { ok: false, error: 'Bu işlem için yetkiniz yok.' };
  }
  const title = (input.title ?? '').trim();
  if (title.length < 3) return { ok: false, error: 'Lütfen bir başlık girin.' };
  const slug = slugify(input.slug?.trim() || title);
  if (!slug) return { ok: false, error: 'Geçerli bir slug oluşturulamadı.' };
  if (await findArticle(slug, { includeUnpublished: true })) {
    return { ok: false, error: 'Bu slug ile bir yazı zaten var.' };
  }
  const now = new Date().toISOString();
  const article: Article = {
    slug,
    title,
    excerpt: '',
    category: input.category?.trim() || 'rehber',
    status: 'draft',
    featured: false,
    author: { name: user.name, role: 'Editör' },
    publishedAt: now,
    updatedAt: now,
    readingMinutes: 1,
    tags: [],
    intro: '',
    sections: [],
    seo: { title, description: '' },
  };
  await upsertArticle(article);
  revalidateBlog(slug);
  return { ok: true, slug };
}

/** Save (upsert) a full article edited in the admin. */
export async function saveArticleAction(article: Article): Promise<BlogActionResult> {
  const user = requireAdmin('blog');
  if (!can(user, 'blog:edit')) return { ok: false, error: 'Bu işlem için yetkiniz yok.' };
  if (!article?.slug?.trim() || !article?.title?.trim()) {
    return { ok: false, error: 'Başlık ve slug zorunludur.' };
  }
  await upsertArticle({ ...article, updatedAt: new Date().toISOString() });
  revalidateBlog(article.slug);
  return { ok: true, slug: article.slug };
}

export async function publishArticleAction(
  slug: string,
  publish: boolean,
): Promise<BlogActionResult> {
  const user = requireAdmin('blog');
  if (!canPublish(user, 'blog')) return { ok: false, error: 'Yayınlama yetkiniz yok.' };
  await setArticleStatus(slug, publish ? 'published' : 'draft');
  revalidateBlog(slug);
  return { ok: true, slug };
}

export async function deleteArticleAction(slug: string): Promise<BlogActionResult> {
  const user = requireAdmin('blog');
  if (!can(user, 'blog:delete') && !can(user, 'blog:edit')) {
    return { ok: false, error: 'Bu işlem için yetkiniz yok.' };
  }
  await deleteArticle(slug);
  revalidateBlog(slug);
  return { ok: true };
}
