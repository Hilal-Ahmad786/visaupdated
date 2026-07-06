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
  'Bu sayfadaki ayrıntılı hükümler bilgilendirme amaçlıdır; nihai ve bağlayıcı yasal metin şirket ' +
  'tarafından onaylanarak yayımlanacaktır. Aşağıdaki kurumsal kimlik ve resmi makamlarla ilişki ' +
  'beyanları güncel ve doğrudur.';

/**
 * Verified, compliance-critical statements reused across legal pages. Extracted
 * from the company's official records (Vergi Levhası, İTO Faaliyet Belgesi,
 * Ticaret Sicili Gazetesi). Kept in sync with `legalEntity` in config/site.ts.
 */
const OPERATOR_IDENTITY =
  'Bu web sitesi ve üzerinden sunulan vize danışmanlık hizmetleri, VİS VİZE RANDEVU HİZMETLERİ LİMİTED ŞİRKETİ ' +
  '(MERSİS No: 0037095406700001 · Vergi Dairesi / No: Gaziosmanpaşa – 0370954067 · İstanbul Ticaret Sicil No: 381632-5 · ' +
  'Adres: Çırçır Mah. Saya Yolu Cad. No: 10-12A, Eyüpsultan / İstanbul) tarafından işletilmektedir.';

const NOT_GOVERNMENT =
  'VİS VİZE RANDEVU HİZMETLERİ LİMİTED ŞİRKETİ; resmi bir devlet kurumu, konsolosluk, büyükelçilik veya vize başvuru ' +
  'merkezi (VFS Global, iDATA, TLScontact vb.) DEĞİLDİR; bu kurumlarla resmi bir bağlantısı yoktur ve onlar adına ya da ' +
  'yetkili temsilcisi sıfatıyla işlem yapmaz. Vize başvurularının kabulü veya reddi tamamen ilgili konsolosluk ve yetkili ' +
  'makamların takdirindedir; şirketimiz vize verileceğine dair hiçbir garanti vermez.';

const FEE_SEPARATION =
  'Şirketimiz, verdiği bağımsız danışmanlık ve süreç takip hizmetleri karşılığında bir hizmet bedeli alır. Bu hizmet ' +
  'bedeli; konsolosluk vize harçları ile resmi başvuru merkezi (VFS Global, iDATA, TLScontact vb.) ücretlerinden ' +
  'TAMAMEN BAĞIMSIZ ve AYRIDIR. Resmi harç ve ücretler doğrudan ilgili resmi kurumlara ödenir; şirketimizin hizmet ' +
  'bedeli, sunulan danışmanlık hizmetinin karşılığıdır ve hizmet sözleşmesinde açıkça belirtilir.';

const TRAVEL_AGENCY_LICENSE =
  'Şirketimiz, T.C. Kültür ve Turizm Bakanlığı tarafından düzenlenen A Grubu Seyahat Acentası İşletme Belgesi (Belge No: 14559) ' +
  'sahibidir. Söz konusu belge, aynı tüzel kişiliğe (MERSİS No: 0037095406700001) ait olup 11.10.2022 tarihinde şirketin o ' +
  'dönemki ticaret unvanı ile düzenlenmiştir; unvan değişiklikleri sonrasında şirketin güncel ticaret unvanı VİS VİZE RANDEVU ' +
  'HİZMETLERİ LİMİTED ŞİRKETİ’dir.';

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
          '6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında veri sorumlusu sıfatıyla hareket eden şirket aşağıda belirtilmiştir:',
          OPERATOR_IDENTITY,
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
        heading: 'Hizmet Sağlayıcı ve Hizmetin Kapsamı',
        body: [
          OPERATOR_IDENTITY,
          'Şirketimiz; vize başvurularına yönelik randevu, evrak hazırlığı, bilgilendirme, danışmanlık ve süreç takibi konularında bağımsız, özel bir hizmet sunar. Bu şartlar, web sitesinin ve sunulan danışmanlık hizmetlerinin kullanımına ilişkin genel çerçeveyi tanımlar.',
        ],
      },
      {
        heading: 'Resmi Makamlarla İlişki',
        body: [NOT_GOVERNMENT],
      },
      {
        heading: 'Hizmet Bedeli ve Resmi Ücretlerden Ayrım',
        body: [FEE_SEPARATION],
      },
      {
        heading: 'Sorumluluğun Sınırı',
        body: [
          'Vize başvurularına ilişkin nihai kararlar ilgili resmi makamlar tarafından verilir; bu site bir sonucu garanti etmez.',
          'Başvuru merkezlerindeki randevu yoğunluğu ve slot sorunlarından kaynaklanabilecek aksaklıklardan şirketimiz sorumlu tutulamaz. Sorumluluğa ilişkin ayrıntılı ve bağlayıcı ifadeler, yayımlanacak son sürümde yer alacaktır.',
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
        body: [OPERATOR_IDENTITY],
      },
      {
        heading: 'Seyahat Acentası Belgesi',
        body: [TRAVEL_AGENCY_LICENSE],
      },
      {
        heading: 'Resmi Makamlarla İlişki',
        body: [NOT_GOVERNMENT],
      },
      {
        heading: 'Hizmet Bedeli ve Resmi Ücretlerden Ayrım',
        body: [FEE_SEPARATION],
      },
    ],
  },
];

export function getLegalPage(slug: string): LegalPage | null {
  return legalPages.find((p) => p.slug === slug) ?? null;
}
