import 'server-only';

import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { blogArticles } from '@/db/schema';
import { articles as seedArticles } from '@/content/seed/articles';
import type { Article } from '@/types/content';

/**
 * Blog persistence + overlay. Admin-edited posts live in the `blog_articles`
 * table (full Article in JSONB); the public site reads seed posts OVERLAID by
 * DB posts (DB wins per slug). So new/edited posts appear on the live site and
 * in the sitemap, while untouched seed posts keep working with no DB row.
 */

type Row = typeof blogArticles.$inferSelect;

function rowToArticle(row: Row): Article {
  const data = row.data as Article;
  // Hoisted columns stay authoritative over whatever is embedded in `data`.
  return { ...data, slug: row.slug, status: row.status as Article['status'] };
}

async function dbArticles(): Promise<Article[]> {
  if (!db) return [];
  const rows = await db.select().from(blogArticles);
  return rows.map(rowToArticle);
}

/** All articles (any status): seed overlaid by DB (DB wins per slug), newest first. */
export async function listAllArticles(): Promise<Article[]> {
  const fromDb = await dbArticles();
  const dbSlugs = new Set(fromDb.map((a) => a.slug));
  const merged = [...fromDb, ...seedArticles.filter((a) => !dbSlugs.has(a.slug))];
  return merged.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export async function listPublishedArticles(): Promise<Article[]> {
  return (await listAllArticles()).filter((a) => a.status === 'published');
}

export async function findArticle(
  slug: string,
  opts: { includeUnpublished?: boolean } = {},
): Promise<Article | null> {
  const all = await listAllArticles();
  const found = all.find((a) => a.slug === slug);
  if (!found) return null;
  if (!opts.includeUnpublished && found.status !== 'published') return null;
  return found;
}

export async function upsertArticle(article: Article): Promise<void> {
  if (!db) throw new Error('DATABASE_URL not configured');
  const now = new Date();
  const data: Article = { ...article, updatedAt: now.toISOString() };
  await db
    .insert(blogArticles)
    .values({ slug: article.slug, status: article.status, data, updatedAt: now })
    .onConflictDoUpdate({
      target: blogArticles.slug,
      set: { status: article.status, data, updatedAt: now },
    });
}

export async function setArticleStatus(slug: string, status: Article['status']): Promise<void> {
  const existing = (await dbArticles()).find((a) => a.slug === slug);
  const base = existing ?? seedArticles.find((a) => a.slug === slug);
  if (!base) throw new Error('Article not found');
  await upsertArticle({ ...base, status });
}

export async function deleteArticle(slug: string): Promise<void> {
  if (!db) throw new Error('DATABASE_URL not configured');
  const inSeed = seedArticles.find((a) => a.slug === slug);
  await db.delete(blogArticles).where(eq(blogArticles.slug, slug));
  // If a seed post shares the slug, hide it with an archived tombstone so the
  // delete actually sticks on the public site.
  if (inSeed) await upsertArticle({ ...inSeed, status: 'archived' });
}
