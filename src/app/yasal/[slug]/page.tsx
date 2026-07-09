import { CalendarDays, Mail, Phone } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PageHero } from '@/components/layout/PageHero';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { LegalDisclaimer } from '@/components/legal/LegalDisclaimer';
import { LegalToc } from '@/components/legal/LegalToc';
import { Section } from '@/components/ui/Section';
import { StatusAlert } from '@/components/ui/states';
import { contactSettings, legalNav } from '@/config/site';
import { getLegalPage, legalPages } from '@/content/seed/legal';
import { buildMetadata } from '@/lib/seo';

export function generateStaticParams() {
  return legalPages.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const page = getLegalPage(params.slug);
  if (!page) {
    return buildMetadata({ title: 'Yasal Belge', description: 'Yasal bilgilendirme.', path: `/yasal/${params.slug}`, noindex: true });
  }
  return buildMetadata({
    title: page.title,
    description: page.summary ?? `${page.title} — VİS VİZE yasal bilgilendirme metni.`,
    path: `/yasal/${page.slug}`,
  });
}

export default function LegalPageRoute({ params }: { params: { slug: string } }) {
  const page = getLegalPage(params.slug);
  if (!page) notFound();

  const toc = page.sections.map((s, i) => ({ id: `bolum-${i}`, heading: s.heading }));

  return (
    <>
      <Breadcrumbs items={[{ name: 'Yasal Belgeler', href: `/yasal/${page.slug}` }, { name: page.title, href: `/yasal/${page.slug}` }]} />

      <PageHero
        eyebrow={page.category ?? 'Yasal Bilgilendirme'}
        title={page.title}
        description={page.summary}
      />

      <Section bg="page">
        <div className="grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12">
          {/* TOC (sticky desktop / mobile drawer) */}
          <LegalToc items={toc} />

          {/* Main content */}
          <div className="min-w-0">
            <article className="max-w-3xl">
              {/* Version + dates */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-ink-muted">
                <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4" aria-hidden="true" /> Yürürlük: {page.effectiveLabel ?? page.updatedLabel}</span>
                <span>Son güncelleme: {page.updatedLabel}</span>
                <span>Sürüm: {page.version ?? 'v1.0'}</span>
              </div>

              <div className="mt-6">
                <StatusAlert tone="warning" title="Taslak metin">{page.intro}</StatusAlert>
              </div>

              <div className="mt-8 space-y-8">
                {page.sections.map((section, i) => (
                  <section key={section.heading} id={`bolum-${i}`} className="scroll-mt-24">
                    <h2 className="text-h3">{section.heading}</h2>
                    <div className="mt-3 space-y-3 text-ink-soft">
                      {section.body.map((paragraph, j) => (
                        <p key={j} className="leading-relaxed">{paragraph}</p>
                      ))}
                    </div>
                  </section>
                ))}
              </div>

              {/* Contact block */}
              <div className="mt-10 rounded-card border border-line-light bg-white p-5 no-print">
                <h2 className="font-heading text-h4">Haklarınız ve İletişim</h2>
                <p className="mt-1.5 text-sm text-ink-soft">
                  Bu belge veya kişisel verilerinizle ilgili talepleriniz için bizimle iletişime geçebilirsiniz.
                </p>
                <div className="mt-3 flex flex-wrap gap-4 text-sm">
                  <a href={contactSettings.phoneHref} className="inline-flex items-center gap-1.5 font-medium text-navy hover:text-gold">
                    <Phone className="h-4 w-4 text-gold" aria-hidden="true" /> {contactSettings.phoneDisplay}
                  </a>
                  <a href={`mailto:${contactSettings.email}`} className="inline-flex items-center gap-1.5 font-medium text-navy hover:text-gold">
                    <Mail className="h-4 w-4 text-gold" aria-hidden="true" /> {contactSettings.email}
                  </a>
                </div>
              </div>

              <div className="mt-8">
                <LegalDisclaimer />
              </div>

              {/* Related legal pages */}
              <nav aria-label="Diğer yasal belgeler" className="mt-8 no-print">
                <h2 className="mb-3 font-heading text-label uppercase tracking-[0.14em] text-ink-muted">Diğer Yasal Belgeler</h2>
                <ul className="flex flex-wrap gap-2">
                  {legalNav.filter((l) => l.href !== `/yasal/${page.slug}`).map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="pill text-sm">{item.label}</Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </article>
          </div>
        </div>
      </Section>
    </>
  );
}
