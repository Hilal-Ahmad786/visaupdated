import type { Service, ServiceCategory } from '@/types/content';

export const serviceCategories: ServiceCategory[] = [
  { slug: 'danismanlik', title: 'Danışmanlık', description: 'Süreç planlama ve yol haritası' },
  { slug: 'evrak', title: 'Evrak & Form', description: 'Belge hazırlık ve kontrol' },
  { slug: 'randevu', title: 'Randevu', description: 'Randevu organizasyonu ve takip' },
  { slug: 'ek-hizmet', title: 'Ek Hizmetler', description: 'Sigorta ve rezervasyon desteği' },
];

const disclaimerNote =
  'Bu hizmet bir danışmanlık ve destek hizmetidir. Vize onayı, randevu tarihi veya işlem süresi garanti edilmez; nihai karar resmi makamlara aittir.';

export const services: Service[] = [
  {
    slug: 'vize-danismanligi',
    name: 'Vize Danışmanlığı',
    category: 'danismanlik',
    status: 'published',
    popular: true,
    icon: 'compass',
    shortDescription:
      'Gideceğiniz ülke ve seyahat amacınıza uygun başvuru sürecini baştan sona planlıyoruz.',
    heroTitle: 'Başvurunuza Uygun Süreci Birlikte Planlayalım',
    heroDescription:
      'Profilinize ve hedef ülkenize göre doğru vize türünü belirler, adım adım yol haritanızı çıkarırız.',
    scope: [
      'Profil ve seyahat amacı değerlendirmesi',
      'Doğru ülke ve vize türü belirleme',
      'Kişiye özel evrak listesi',
      'Başvuru zaman planı',
      'Süreç boyunca yönlendirme',
    ],
    exclusions: [
      'Resmi vize harçlarının ödenmesi',
      'Konsolosluk kararına müdahale',
      'Onay veya randevu garantisi',
    ],
    processSteps: [
      { title: 'Ön Değerlendirme', description: 'Kısa form veya telefon ile profilinizi alırız.' },
      { title: 'Yol Haritası', description: 'Size özel başvuru planını paylaşırız.' },
      { title: 'Hazırlık', description: 'Evrak ve randevu adımlarında destek veririz.' },
      { title: 'Takip', description: 'Başvuru sonuçlanana kadar süreci izleriz.' },
    ],
    requiredInfo: ['Hedef ülke', 'Seyahat amacı', 'Çalışma/gelir durumu', 'Planlanan seyahat tarihi'],
    pricingNote:
      'Ücret, talep edilen destek kapsamına göre belirlenir. Ön değerlendirme sonrası net fiyat paylaşılır.',
    supportedCountrySlugs: ['almanya', 'fransa', 'italya'],
    faqs: [
      {
        question: 'Danışmanlık ücreti vize harcına dahil mi?',
        answer: 'Hayır. Resmi vize harçları ve başvuru merkezi ücretleri danışmanlık ücretinden ayrıdır.',
      },
    ],
    relatedServiceSlugs: ['evrak-kontrolu', 'randevu-destegi'],
    seo: {
      title: 'Vize Danışmanlığı | VİS VİZE',
      description:
        'Hedef ülkenize ve seyahat amacınıza uygun vize sürecini planlayan profesyonel vize danışmanlığı hizmeti.',
    },
  },
  {
    slug: 'evrak-kontrolu',
    name: 'Evrak Kontrolü',
    category: 'evrak',
    status: 'published',
    popular: true,
    icon: 'file-check',
    shortDescription:
      'Başvuru evraklarınızı türünüze göre eksiksiz ve doğru hazırlamanıza yardımcı oluruz.',
    heroTitle: 'Evraklarınızı Başvuru Türünüze Göre Hazırlayın',
    heroDescription:
      'Eksik veya hatalı evrak en sık ret sebeplerindendir. Belgelerinizi tek tek kontrol ederiz.',
    scope: [
      'Başvuru türüne özel evrak listesi',
      'Belge formatı ve içerik kontrolü',
      'Eksik evrak tespiti',
      'Çeviri ve tasdik yönlendirmesi',
    ],
    exclusions: ['Sahte veya yanıltıcı belge üretimi', 'Belgelerin resmi tasdiki', 'Onay garantisi'],
    processSteps: [
      { title: 'Liste', description: 'Profilinize uygun evrak listesini paylaşırız.' },
      { title: 'Toplama', description: 'Belgelerinizi toplamanızda yönlendirme yaparız.' },
      { title: 'Kontrol', description: 'Her belgeyi tek tek inceleriz.' },
      { title: 'Düzenleme', description: 'Eksikleri tamamlamanız için geri bildirim veririz.' },
    ],
    requiredInfo: ['Hedef ülke', 'Vize türü', 'Çalışma durumu'],
    pricingNote: 'Evrak kontrol ücreti başvuru kapsamına göre belirlenir.',
    supportedCountrySlugs: ['almanya', 'fransa', 'italya'],
    faqs: [],
    relatedServiceSlugs: ['vize-danismanligi', 'randevu-destegi'],
    seo: {
      title: 'Evrak Kontrolü | VİS VİZE',
      description:
        'Vize başvuru evraklarınızı başvuru türünüze göre eksiksiz hazırlamanız için profesyonel evrak kontrol hizmeti.',
    },
  },
  {
    slug: 'randevu-destegi',
    name: 'Randevu Desteği',
    category: 'randevu',
    status: 'published',
    popular: true,
    icon: 'calendar-check',
    shortDescription: 'Başvuru merkezi randevu sürecini sizin adınıza organize eder ve takip ederiz.',
    heroTitle: 'Randevu Sürecinizi Sizin Adınıza Takip Edelim',
    heroDescription:
      'Randevu uygunluğu tamamen resmi başvuru merkezine bağlıdır. Süreci düzenli takip ederek size en uygun seçenekleri iletiriz.',
    scope: [
      'Randevu sistemi takibi',
      'Uygun tarih bildirimi',
      'Randevu öncesi hazırlık',
      'Hatırlatma ve yönlendirme',
    ],
    exclusions: ['Randevu tarihi garantisi', 'Resmi başvuru merkezi ücretleri', 'Onay garantisi'],
    processSteps: [
      { title: 'Talep', description: 'Tercih ettiğiniz tarih aralığını alırız.' },
      { title: 'Takip', description: 'Randevu uygunluğunu düzenli izleriz.' },
      { title: 'Bilgilendirme', description: 'Uygun seçenekleri size iletiriz.' },
      { title: 'Hazırlık', description: 'Randevu gününe hazırlanmanızı sağlarız.' },
    ],
    requiredInfo: ['Hedef ülke', 'Vize türü', 'Tercih edilen tarih aralığı', 'Başvuran sayısı'],
    pricingNote: 'Randevu desteği ücreti talep kapsamına göre belirlenir.',
    supportedCountrySlugs: ['almanya', 'fransa', 'italya'],
    faqs: [
      {
        question: 'Randevu tarihini garanti ediyor musunuz?',
        answer:
          'Hayır. Randevu uygunluğu resmi başvuru merkezine bağlıdır. Süreci takip eder, uygun seçenekleri iletiriz.',
      },
    ],
    relatedServiceSlugs: ['vize-danismanligi', 'evrak-kontrolu'],
    seo: {
      title: 'Randevu Desteği | VİS VİZE',
      description:
        'Vize başvuru merkezi randevu sürecini takip eden ve organize eden profesyonel randevu destek hizmeti.',
    },
  },
  {
    slug: 'seyahat-saglik-sigortasi',
    name: 'Seyahat Sağlık Sigortası Desteği',
    category: 'ek-hizmet',
    status: 'published',
    popular: false,
    icon: 'shield-check',
    shortDescription: 'Schengen ve diğer başvurular için uygun teminatlı sigorta seçiminde yönlendirme.',
    heroTitle: 'Başvurunuza Uygun Seyahat Sağlık Sigortası',
    heroDescription:
      'Schengen başvuruları için genellikle minimum 30.000 Euro teminatlı sigorta gerekir. Uygun poliçe seçiminde yönlendiririz.',
    scope: ['Teminat gereksinimi bilgilendirmesi', 'Uygun poliçe yönlendirmesi', 'Belge kontrolü'],
    exclusions: ['Sigorta poliçesinin doğrudan satışı (aracılık yetkisi gerektiğinde)', 'Onay garantisi'],
    processSteps: [
      { title: 'Gereksinim', description: 'Ülkeye göre teminat gereksinimini belirleriz.' },
      { title: 'Yönlendirme', description: 'Uygun poliçe seçeneklerini paylaşırız.' },
      { title: 'Kontrol', description: 'Poliçenin başvuruya uygunluğunu kontrol ederiz.' },
    ],
    requiredInfo: ['Hedef ülke', 'Seyahat tarihleri', 'Başvuran sayısı'],
    pricingNote: 'Poliçe ücreti sigorta sağlayıcısına aittir; yönlendirme hizmet kapsamındadır.',
    supportedCountrySlugs: ['almanya', 'fransa', 'italya'],
    faqs: [],
    relatedServiceSlugs: ['vize-danismanligi'],
    seo: {
      title: 'Seyahat Sağlık Sigortası Desteği | VİS VİZE',
      description:
        'Schengen ve diğer vize başvuruları için uygun teminatlı seyahat sağlık sigortası seçiminde yönlendirme.',
    },
  },
  {
    slug: 'ogrenci-vizesi-destegi',
    name: 'Öğrenci ve Eğitim Vizesi Desteği',
    category: 'danismanlik',
    status: 'published',
    popular: false,
    icon: 'graduation-cap',
    shortDescription: 'Eğitim amaçlı başvurularda kabul, finans ve evrak süreçlerinde danışmanlık.',
    heroTitle: 'Eğitim Vizesi Sürecinizde Yanınızdayız',
    heroDescription:
      'Kabul mektubu, finansal yeterlilik ve konaklama gibi öğrenci başvurularına özgü adımlarda yol gösteririz.',
    scope: ['Öğrenci profili değerlendirmesi', 'Evrak listesi', 'Finansal yeterlilik yönlendirmesi', 'Süreç takibi'],
    exclusions: ['Okul kabulü garantisi', 'Vize onay garantisi', 'Burs/finansman sağlama'],
    processSteps: [
      { title: 'Değerlendirme', description: 'Eğitim planınızı ve profilinizi inceleriz.' },
      { title: 'Hazırlık', description: 'Öğrenci başvurusuna özel evrakları hazırlatırız.' },
      { title: 'Takip', description: 'Randevu ve başvuru sürecini izleriz.' },
    ],
    requiredInfo: ['Hedef ülke', 'Eğitim programı', 'Kabul durumu', 'Finansal durum'],
    pricingNote: 'Ücret başvuru kapsamına göre belirlenir.',
    supportedCountrySlugs: ['almanya', 'fransa'],
    faqs: [],
    relatedServiceSlugs: ['vize-danismanligi', 'evrak-kontrolu'],
    seo: {
      title: 'Öğrenci ve Eğitim Vizesi Desteği | VİS VİZE',
      description: 'Eğitim amaçlı vize başvurularında kabul, finans ve evrak süreçlerinde profesyonel danışmanlık.',
    },
  },
  {
    slug: 'ticari-vize-destegi',
    name: 'Ticari ve Kurumsal Vize Desteği',
    category: 'danismanlik',
    status: 'published',
    popular: false,
    icon: 'briefcase',
    shortDescription: 'İş seyahatleri, fuar ziyaretleri ve kurumsal başvurular için süreç desteği.',
    heroTitle: 'İş ve Kurumsal Başvurularınız İçin Destek',
    heroDescription:
      'Davet mektubu, firma evrakları ve seyahat planı gibi ticari başvuru gereksinimlerinde yanınızdayız.',
    scope: ['Kurumsal evrak yönlendirmesi', 'Davet mektubu kontrolü', 'Çoklu başvuran organizasyonu', 'Süreç takibi'],
    exclusions: ['Davet mektubu temini', 'Vize onay garantisi', 'Resmi harçların ödenmesi'],
    processSteps: [
      { title: 'Brifing', description: 'Seyahat amacını ve katılımcıları belirleriz.' },
      { title: 'Hazırlık', description: 'Kurumsal evrakları hazırlatır ve kontrol ederiz.' },
      { title: 'Takip', description: 'Randevu ve başvuru sürecini yönetiriz.' },
    ],
    requiredInfo: ['Hedef ülke', 'Seyahat amacı', 'Firma bilgileri', 'Başvuran sayısı'],
    pricingNote: 'Kurumsal başvurularda ücret katılımcı sayısı ve kapsama göre belirlenir.',
    supportedCountrySlugs: ['almanya', 'fransa', 'italya'],
    faqs: [],
    relatedServiceSlugs: ['vize-danismanligi', 'randevu-destegi'],
    seo: {
      title: 'Ticari ve Kurumsal Vize Desteği | VİS VİZE',
      description: 'İş seyahatleri, fuar ziyaretleri ve kurumsal vize başvuruları için profesyonel süreç desteği.',
    },
  },
];

// Re-export for components that need the disclaimer note alongside a service.
export const SERVICE_DISCLAIMER = disclaimerNote;
