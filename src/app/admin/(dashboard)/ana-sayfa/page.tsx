import { HomepageEditor } from '@/components/admin/builder/HomepageEditor';
import { PageHeader } from '@/components/admin/ui/primitives';
import { getContentRepository } from '@/content/repository';
import { requireAdmin } from '@/lib/auth/guard';
import { canPublish } from '@/lib/auth/permissions';

export default async function HomepageEditorPage() {
  const user = requireAdmin('homepage');

  const repo = getContentRepository();
  const [countries, services, articles, faqs] = await Promise.all([
    repo.getCountries(),
    repo.getServices(),
    repo.getArticles(),
    repo.getFaqs(),
  ]);

  const options = {
    countries: countries.map((c) => ({ slug: c.slug, name: c.name, popular: c.popular })),
    services: services.map((s) => ({ slug: s.slug, name: s.name, popular: s.popular })),
    articles: articles.map((a) => ({ slug: a.slug, title: a.title, featured: a.featured })),
    faqs: faqs.map((f) => ({ slug: f.slug, question: f.question })),
  };

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <PageHeader
        title="Ana Sayfa Düzenleyici"
        description="Onaylı bölümlerin görünürlüğünü, sırasını ve içerik kaynağını yönetin."
      />

      <HomepageEditor canPublish={canPublish(user, 'homepage')} options={options} />
    </div>
  );
}
