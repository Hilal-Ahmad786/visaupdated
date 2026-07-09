import { ArrowUpRight } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { Section, SectionHeading } from '@/components/ui/Section';
import { legalNav } from '@/config/site';
import { getContentRepository } from '@/content/repository';
import { getAllLandingPages } from '@/data/googleAdsLandingPages';
import { RANDEVU_BASE_PATH, getRandevuPagesByProvider } from '@/data/randevuLandingPages';
import { buildMetadata } from '@/lib/seo';

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: 'Site Haritası',
  description:
    'VİS VİZE web sitesindeki tüm sayfalar: kurumsal sayfalar, vize ülkeleri, hizmetler, vize danışmanlık sayfaları, randevu süreci danışmanlığı, blog ve S.S.S.',
  path: '/site-haritasi',
});

interface LinkItem {
  label: string;
  href: string;
}

/** A titled group of internal links. `sub` renders a smaller nested heading. */
function LinkGroup({
  title,
  items,
  sub = false,
}: {
  title: string;
  items: LinkItem[];
  sub?: boolean;
}) {
  if (items.length === 0) return null;
  const Heading = sub ? 'h3' : 'h2';
  return (
    <div>
      <Heading className={sub ? 'font-heading text-h4 text-navy' : 'font-heading text-h3 text-navy'}>
        {title}
      </Heading>
      <ul className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="group inline-flex items-start gap-1 text-ink-soft hover:text-navy"
            >
              <span>{item.label}</span>
              <ArrowUpRight
                className="mt-1 h-3.5 w-3.5 shrink-0 text-gold opacity-0 transition-opacity group-hover:opacity-100"
                aria-hidden="true"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const CORPORATE_LINKS: LinkItem[] = [
  { label: 'Ana Sayfa', href: '/' },
  { label: 'Hakkımızda', href: '/hakkimizda' },
  { label: 'Hizmetler', href: '/hizmetler' },
  { label: 'Vize Süreci', href: '/vize-sureci' },
  { label: 'Vize Ülkeleri', href: '/vize-ulkeleri' },
  { label: 'Schengen Vizesi', href: '/schengen-vizesi' },
  { label: 'Online Ön Başvuru', href: '/online-on-basvuru' },
  { label: 'Randevu Talebi', href: '/randevu-talebi' },
  { label: 'Vize Randevu Süreci Danışmanlığı', href: RANDEVU_BASE_PATH },
  { label: 'Blog', href: '/blog' },
  { label: 'S.S.S.', href: '/sss' },
  { label: 'İletişim', href: '/iletisim' },
];

export default async function SiteHaritasiPage() {
  const repo = getContentRepository();
  const [countries, services, faqs, articles] = await Promise.all([
    repo.getCountries(),
    repo.getServices(),
    repo.getFaqs(),
    repo.getArticles(),
  ]);

  const countryLinks: LinkItem[] = countries.map((c) => ({
    label: c.name,
    href: `/vize-ulkeleri/${c.slug}`,
  }));

  const serviceLinks: LinkItem[] = services.map((s) => ({
    label: s.name,
    href: `/hizmetler/${s.slug}`,
  }));

  // Google Ads visa-consultancy landing pages, grouped by campaign.
  const landingByCampaign = new Map<string, LinkItem[]>();
  for (const p of getAllLandingPages()) {
    const list = landingByCampaign.get(p.campaignName) ?? [];
    list.push({ label: p.breadcrumbLabel, href: `/${p.slug}` });
    landingByCampaign.set(p.campaignName, list);
  }

  const randevuGroups = getRandevuPagesByProvider();

  const articleLinks: LinkItem[] = articles.map((a) => ({
    label: a.title,
    href: `/blog/${a.slug}`,
  }));

  const faqLinks: LinkItem[] = faqs.map((f) => ({ label: f.question, href: `/sss/${f.slug}` }));

  const legalLinks: LinkItem[] = legalNav.map((l) => ({ label: l.label, href: l.href }));

  return (
    <>
      <Breadcrumbs items={[{ name: 'Site Haritası', href: '/site-haritasi' }]} />

      <Section bg="white" ariaLabel="Site Haritası">
        <SectionHeading
          eyebrow="Site Haritası"
          title="Tüm Sayfalar"
          description="VİS VİZE web sitesindeki sayfalara buradan ulaşabilirsiniz."
        />

        <div className="mt-10 space-y-12">
          <LinkGroup title="Kurumsal" items={CORPORATE_LINKS} />
          <LinkGroup title="Vize Ülkeleri" items={countryLinks} />
          <LinkGroup title="Hizmetler" items={serviceLinks} />

          {[...landingByCampaign.entries()].map(([campaign, items]) => (
            <LinkGroup key={campaign} title={campaign} items={items} />
          ))}

          {/* Randevu süreci danışmanlığı — grouped by provider */}
          <div>
            <h2 className="font-heading text-h3 text-navy">Randevu Süreci Danışmanlığı</h2>
            <div className="mt-4 space-y-6">
              {randevuGroups.map((group) => (
                <LinkGroup
                  key={group.provider}
                  sub
                  title={`${group.provider} Randevu Süreci`}
                  items={group.pages.map((p) => ({
                    label: p.city || p.country || 'Genel Randevu Desteği',
                    href: `${RANDEVU_BASE_PATH}/${p.slug}`,
                  }))}
                />
              ))}
            </div>
          </div>

          <LinkGroup title="Blog" items={articleLinks} />
          <LinkGroup title="Sıkça Sorulan Sorular" items={faqLinks} />
          <LinkGroup title="Yasal" items={legalLinks} />
        </div>
      </Section>
    </>
  );
}
