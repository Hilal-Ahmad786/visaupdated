import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { LegalDisclaimer } from '@/components/legal/LegalDisclaimer';
import { Section } from '@/components/ui/Section';
import { StatusAlert } from '@/components/ui/states';
import { legalNav } from '@/config/site';
import { getLegalPage, legalPages } from '@/content/seed/legal';
import { buildMetadata } from '@/lib/seo';

export function generateStaticParams() {
  return legalPages.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const page = getLegalPage(params.slug);
  if (!page) {
    return buildMetadata({
      title: 'Yasal Belge',
      description: 'Yasal bilgilendirme.',
      path: `/yasal/${params.slug}`,
      noindex: true,
    });
  }
  return buildMetadata({
    title: page.title,
    description: `${page.title} — VİS VİZE yasal bilgilendirme metni.`,
    path: `/yasal/${page.slug}`,
  });
}

export default function LegalPageRoute({ params }: { params: { slug: string } }) {
  const page = getLegalPage(params.slug);
  if (!page) notFound();

  return (
    <>
      <Breadcrumbs items={[{ name: page.title, href: `/yasal/${page.slug}` }]} />

      <Section bg="page">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-12">
          {/* Main content */}
          <article className="max-w-3xl">
            <h1 className="text-h1">{page.title}</h1>
            <p className="mt-2 text-sm text-ink-muted">Son güncelleme: {page.updatedLabel}</p>

            <div className="mt-6">
              <StatusAlert tone="warning" title="Taslak metin">
                {page.intro}
              </StatusAlert>
            </div>

            <div className="mt-8 space-y-8">
              {page.sections.map((section) => (
                <section key={section.heading}>
                  <h2 className="text-h3">{section.heading}</h2>
                  <div className="mt-3 space-y-3 text-ink-soft">
                    {section.body.map((paragraph, i) => (
                      <p key={i} className="leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-10">
              <LegalDisclaimer />
            </div>
          </article>

          {/* Other legal pages */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <nav aria-label="Diğer yasal belgeler" className="card p-5">
              <h2 className="mb-3 font-heading text-label uppercase tracking-[0.14em] text-ink-muted">
                Yasal Belgeler
              </h2>
              <ul className="space-y-1">
                {legalNav.map((item) => {
                  const active = item.href === `/yasal/${page.slug}`;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? 'page' : undefined}
                        className={
                          active
                            ? 'block rounded-input bg-navy px-3 py-2 text-sm font-medium text-white'
                            : 'block rounded-input px-3 py-2 text-sm text-ink-soft hover:bg-surface'
                        }
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>
        </div>
      </Section>
    </>
  );
}
