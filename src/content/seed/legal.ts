/**
 * Legal page content (seed).
 *
 * IMPORTANT: The text below is a PLACEHOLDER scaffold only. It intentionally
 * avoids binding legal claims or guarantees. The final, legally-binding text for
 * each document must be drafted and approved by the company (and, where needed,
 * a qualified legal advisor) before publication. Part 2 may serve the same shape
 * from the admin/CMS — the `LegalPage` contract stays identical.
 */

export interface LegalPage {
  slug: string;
  title: string;
  updatedLabel: string;
  intro: string;
  sections: { heading: string; body: string[] }[];
  /** Optional metadata (safe defaults applied in the UI when absent). */
  category?: string;
  summary?: string;
  effectiveLabel?: string;
  version?: string;
}

/** Shown prominently on every legal page until final text is approved. */
const PLACEHOLDER_NOTICE =
  'Bu sayfadaki metin geçici bir taslaktır ve bilgilendirme amaçlıdır. Nihai ve bağlayıcı yasal metin ' +
  'şirket tarafından onaylanarak yayımlanacaktır. Lütfen kesin bilgi için yayımlanan son sürümü esas alın.';

export const legalPages: LegalPage[] = [
  {
    slug: 'kvkk',
    title: 'KVKK Aydınlatma Metni',
    updatedLabel: 'Taslak — onay bekliyor',
    intro: PLACEHOLDER_NOTICE,
    sections: [
      {
        heading: 'Veri Sorumlusu',
        body: [
          'Bu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında veri sorumlusunun kimliği ve iletişim bilgilerini açıklamak üzere hazırlanacaktır.',
          'Veri sorumlusuna ilişkin nihai unvan, adres ve iletişim bilgileri şirket tarafından onaylandıktan sonra bu bölümde yer alacaktır.',
        ],
      },
      {
        heading: 'İşlenen Kişisel Veriler ve Amaçları',
        body: [
          'Vize danışmanlığı ve destek hizmetlerinin sunulabilmesi amacıyla iletişim ve başvuru sürecine ilişkin bilgiler işlenebilir.',
          'İşlenen veri kategorileri, işleme amaçları ve hukuki sebepleri, nihai metinde ayrıntılı olarak belirtilecektir. Bu taslakta bağlayıcı bir beyan yer almamaktadır.',
        ],
      },
      {
        heading: 'Haklarınız',
        body: [
          'KVKK kapsamında ilgili kişiler; verilerine erişim, düzeltme, silme ve işlemeye itiraz gibi haklara sahiptir.',
          'Bu hakların nasıl kullanılacağına ilişkin başvuru yöntemleri ve süreler, onaylanan nihai metinde açıkça düzenlenecektir.',
        ],
      },
    ],
  },
  {
    slug: 'acik-riza',
    title: 'Açık Rıza Metni',
    updatedLabel: 'Taslak — onay bekliyor',
    intro: PLACEHOLDER_NOTICE,
    sections: [
      {
        heading: 'Açık Rızanın Kapsamı',
        body: [
          'Bu metin, belirli kişisel veri işleme faaliyetleri için açık rıza alınmasının kapsamını açıklamak üzere hazırlanacaktır.',
          'Rızanın hangi işleme faaliyetlerini kapsadığı, nihai ve onaylı metinde net biçimde tanımlanacaktır.',
        ],
      },
      {
        heading: 'Rızanın Geri Alınması',
        body: [
          'Açık rıza, ilgili kişi tarafından her zaman geri alınabilir.',
          'Geri alma talebinin nasıl iletileceği ve sonuçları, yayımlanacak son sürümde ayrıntılandırılacaktır.',
        ],
      },
    ],
  },
  {
    slug: 'gizlilik',
    title: 'Gizlilik Politikası',
    updatedLabel: 'Taslak — onay bekliyor',
    intro: PLACEHOLDER_NOTICE,
    sections: [
      {
        heading: 'Toplanan Bilgiler',
        body: [
          'Bu politika, web sitesi üzerinden hangi bilgilerin toplandığını ve nasıl kullanıldığını genel hatlarıyla açıklamayı amaçlar.',
          'Toplanan bilgi kategorileri ve kullanım amaçları, onaylanan nihai metinde ayrıntılı olarak yer alacaktır.',
        ],
      },
      {
        heading: 'Bilgilerin Paylaşımı',
        body: [
          'Bilgiler yalnızca hizmetin sunulması için gerekli olan durumlarda ve yürürlükteki mevzuata uygun olarak işlenir.',
          'Üçüncü taraflarla paylaşımın koşulları, kesinleşmiş metinde açıkça düzenlenecektir.',
        ],
      },
      {
        heading: 'Veri Güvenliği',
        body: [
          'Bilgilerin korunması için makul teknik ve idari tedbirlerin alınması hedeflenir.',
          'Güvenlik önlemlerine ilişkin nihai beyanlar, yayımlanacak son sürümde belirtilecektir.',
        ],
      },
    ],
  },
  {
    slug: 'cerez',
    title: 'Çerez Politikası',
    updatedLabel: 'Taslak — onay bekliyor',
    intro: PLACEHOLDER_NOTICE,
    sections: [
      {
        heading: 'Çerez Nedir?',
        body: [
          'Çerezler, web sitelerinin ziyaretçi cihazlarında sakladığı küçük metin dosyalarıdır ve sitenin çalışması ile deneyimin iyileştirilmesi için kullanılabilir.',
          'Bu bölüm, kullanılan çerezlerin genel işleyişini tanıtmak amacıyla hazırlanmıştır.',
        ],
      },
      {
        heading: 'Çerez Türleri',
        body: [
          'Zorunlu çerezler sitenin temel işlevleri için, analitik ve tercih çerezleri ise deneyimi geliştirmek için kullanılabilir.',
          'Sitede kullanılan çerezlerin tam listesi ve amaçları, onaylanan nihai metinde belirtilecektir.',
        ],
      },
      {
        heading: 'Çerez Tercihlerinin Yönetimi',
        body: [
          'Ziyaretçiler tarayıcı ayarları üzerinden çerez tercihlerini yönetebilir.',
          'Tercih yönetimine ilişkin ayrıntılı yönergeler, yayımlanacak son sürümde yer alacaktır.',
        ],
      },
    ],
  },
  {
    slug: 'kullanim-sartlari',
    title: 'Kullanım Şartları',
    updatedLabel: 'Taslak — onay bekliyor',
    intro: PLACEHOLDER_NOTICE,
    sections: [
      {
        heading: 'Hizmetin Kapsamı',
        body: [
          'Bu şartlar, web sitesinin ve sunulan danışmanlık hizmetlerinin kullanımına ilişkin genel çerçeveyi tanımlamayı amaçlar.',
          'Hizmet kapsamına ve kullanım koşullarına dair bağlayıcı hükümler, onaylanan nihai metinde düzenlenecektir.',
        ],
      },
      {
        heading: 'Sorumluluğun Sınırı',
        body: [
          'Vize başvurularına ilişkin nihai kararlar ilgili resmi makamlar tarafından verilir; bu site bir sonucu garanti etmez.',
          'Sorumluluğa ilişkin ayrıntılı ve bağlayıcı ifadeler, yayımlanacak son sürümde yer alacaktır.',
        ],
      },
    ],
  },
  {
    slug: 'bilgilendirme',
    title: 'Yasal Bilgilendirme',
    updatedLabel: 'Taslak — onay bekliyor',
    intro: PLACEHOLDER_NOTICE,
    sections: [
      {
        heading: 'Hizmet Sağlayıcı Hakkında',
        body: [
          'Bu bölüm, hizmet sağlayıcının niteliğine ve sunulan hizmetin bağımsız danışmanlık kapsamına ilişkin genel bilgilendirmeyi içerir.',
          'Resmi unvan ve tescil bilgileri, onaylanan nihai metinde yer alacaktır.',
        ],
      },
      {
        heading: 'Resmi Makamlarla İlişki',
        body: [
          'Hizmet sağlayıcı; konsolosluk, büyükelçilik, vize başvuru merkezi veya devlet kurumu değildir ve bu kurumlar adına işlem yapmaz.',
          'Resmi süreçler ve kararlar yalnızca ilgili resmi makamların yetkisindedir.',
        ],
      },
    ],
  },
];

export function getLegalPage(slug: string): LegalPage | null {
  return legalPages.find((p) => p.slug === slug) ?? null;
}
