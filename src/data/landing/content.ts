import { LEGAL_DISCLAIMER } from '@/config/site';

import type {
  BenefitItem,
  CountryProfile,
  DocumentCategory,
  FaqItem,
  LandingCategory,
  ProcessStep,
  ProfileDocumentGroup,
  SectionHeadings,
  WhyChooseItem,
} from './types';

/** Content-heavy fields resolved per (category, country). */
export interface LandingContent {
  visaType: string;
  presetVisaPurpose: string;
  searchIntent: string;
  heroDescription: string;
  trustPoints: string[];
  benefitItems: BenefitItem[];
  introduction: string[];
  serviceDescription: string;
  servicesIncluded: string[];
  processSteps: ProcessStep[];
  documentCategories: DocumentCategory[];
  profileDocuments?: ProfileDocumentGroup[];
  faqItems: FaqItem[];
  formTitle: string;
  formDescription: string;
  primaryCTA: string;
  secondaryCTA: string;
  breadcrumbLabel: string;
  sectionHeadings: SectionHeadings;
  disclaimerText: string;
}

/* ------------------------------------------------------------------ *
 * Shared building blocks (reused across types — NOT name-swapping,     *
 * differentiation happens on the visa-type dimension).                 *
 * ------------------------------------------------------------------ */

const baseWhyChoose: WhyChooseItem[] = [
  {
    icon: 'ShieldCheck',
    title: 'TÜRSAB Belgeli Yetkili Acenta',
    description:
      'VİS VİZE; vize başvurularına yönelik danışmanlık ve destek hizmeti veren, TÜRSAB belgeli yetkili bir acentadır. Resmi bir kurum değildir; nihai kararlar ilgili makamlara aittir.',
  },
  {
    icon: 'FileCheck2',
    title: 'Başvuru Türüne Özel Evrak Kontrolü',
    description:
      'Evraklarınızı profilinize ve başvuru amacınıza göre tek tek kontrol eder; eksik, tutarsız veya güncellenmesi gereken belgeleri önceden fark etmenize yardımcı oluruz.',
  },
  {
    icon: 'CalendarCheck',
    title: 'Randevu Sürecinin Takibi',
    description:
      'Başvuru merkezi randevu sürecini takip eder, uygun seçenekler oluştuğunda sizi bilgilendiririz. Randevu tarih ve uygunluğu resmi sistemlerce belirlenir.',
  },
  {
    icon: 'Headset',
    title: 'Türkiye Geneli Online Destek',
    description:
      'Hangi şehirde olursanız olun sürecinizi baştan sona online yürütür, sorularınızı anlaşılır biçimde yanıtlarız.',
  },
];

const identityDocs: DocumentCategory = {
  title: 'Kimlik ve Pasaport Belgeleri',
  items: [
    'Geçerlilik süresi yeterli pasaport',
    'Varsa eski pasaportlar',
    'Biyometrik fotoğraf',
    'Nüfus cüzdanı / kimlik fotokopisi',
  ],
};

const financialDocs: DocumentCategory = {
  title: 'Finansal Belgeler',
  items: [
    'Güncel banka hesap hareketleri',
    'Gelir durumunu gösteren belgeler',
    'Varsa tapu, araç veya diğer mal varlığı belgeleri',
  ],
};

const insuranceDocs: DocumentCategory = {
  title: 'Sigorta ve Seyahat',
  items: [
    'Seyahat sağlık sigortası (temininde size yardımcı oluruz)',
    'Seyahat planı ve tarih aralığı',
    'Konaklama bilgileri',
  ],
};

const professionProfiles: ProfileDocumentGroup[] = [
  {
    title: 'Sigortalı Çalışan',
    items: [
      'İşveren imzalı izin / görev yazısı',
      'Son dönem maaş bordroları',
      'SGK işe giriş ve hizmet dökümü',
      'Banka hesap hareketleri',
    ],
  },
  {
    title: 'İşveren / Şirket Sahibi',
    items: [
      'Ticaret sicil gazetesi',
      'Vergi levhası',
      'Faaliyet belgesi',
      'Şirket ve/veya şahsi banka hareketleri',
    ],
  },
  {
    title: 'Emekli',
    items: ['Emekli kimlik / maaş belgesi', 'Banka hesap hareketleri', 'Varsa ek gelir belgeleri'],
  },
  {
    title: 'Öğrenci',
    items: [
      'Öğrenci belgesi',
      '18 yaş altı için veli muvafakatnamesi',
      'Veli gelir ve sponsorluk belgeleri',
    ],
  },
  {
    title: 'Serbest Meslek',
    items: ['Vergi levhası', 'Meslek odası kaydı', 'Banka hesap hareketleri', 'Gelir beyanı'],
  },
];

function headings(overrides: Partial<SectionHeadings>): SectionHeadings {
  return {
    benefits: 'Size Sağladığımız Kolaylıklar',
    introduction: 'Süreç Hakkında Bilmeniz Gerekenler',
    services: 'Sunduğumuz Danışmanlık Hizmetleri',
    process: 'Başvuru Destek Sürecimiz',
    documents: 'Evrak Hazırlığı',
    profiles: 'Mesleki Duruma Göre Ek Belgeler',
    whyChoose: 'Neden VİS VİZE?',
    faq: 'Sıkça Sorulan Sorular',
    related: 'İlgili Vize Hizmetleri',
    ...overrides,
  };
}

const changeableInfoNote =
  'Gerekli belgeler; başvuru türüne, kişisel durumunuza ve ilgili resmi makamın güncel uygulamasına göre değişebilir.';

/* ------------------------------------------------------------------ *
 * Per-type builders                                                    *
 * ------------------------------------------------------------------ */

function genel(c: CountryProfile): LandingContent {
  return {
    visaType: `${c.name} Vizesi (Genel)`,
    presetVisaPurpose: '',
    searchIntent: `${c.name} vizesi almak isteyen, doğru vize türünü ve gerekli evrakları öğrenmek isteyen kullanıcı.`,
    heroDescription: `${c.name} vizesi başvurunuzda doğru vize türünün belirlenmesi, evrak kontrolü, form hazırlığı ve randevu süreci takibini tek noktadan yönetin. Turistik, ticari, eğitim, aile ve çalışma amaçlı başvurularınızda yanınızdayız.`,
    trustPoints: [
      'Başvuru türüne özel evrak kontrolü',
      'Doğru vize kategorisinin belirlenmesi',
      'Randevu süreci takibi',
      'KVKK uyumlu, Türkiye geneli online destek',
    ],
    benefitItems: [
      {
        icon: 'Compass',
        title: 'Doğru Vize Türü',
        description: `Seyahat amacınıza göre ${c.dative} hangi vize türüyle başvurmanız gerektiğini birlikte belirleriz.`,
      },
      {
        icon: 'ClipboardCheck',
        title: 'Kişiye Özel Evrak Listesi',
        description:
          'Profilinize uygun, güncel bir evrak listesi çıkarır ve tek tek kontrol ederiz.',
      },
      {
        icon: 'CalendarCheck',
        title: 'Randevu Takibi',
        description: 'Başvuru merkezi randevu sürecini takip eder, uygun seçenekleri iletiriz.',
      },
      {
        icon: 'Route',
        title: 'Süreç Yönetimi',
        description: 'Ön değerlendirmeden başvuru gününe kadar tüm adımlarda size yol gösteririz.',
      },
    ],
    introduction: [
      `${c.name} vizesi başvurusu; seyahatinizin amacına göre farklı vize türlerini ve farklı evrak setlerini kapsar. İlk adım, sizin için doğru başvuru kategorisini (turizm, ticari, eğitim, aile ziyareti veya çalışma) belirlemektir. VİS VİZE olarak profilinizi değerlendirir, size en uygun yol haritasını çıkarırız.`,
      `${c.genitive} başvuru süreci; eksiksiz ve kendi içinde tutarlı bir dosya hazırlamayı gerektirir. Banka hareketleri, seyahat planı, konaklama ve mesleki durumunuza ilişkin belgelerin birbirini desteklemesi önemlidir. Biz de tam olarak bu noktada evrak kontrolü ve form hazırlığı desteği sunarız.`,
      `${changeableInfoNote} Bu nedenle güncel gereklilikleri profilinize göre birlikte gözden geçirir; başvurunuzu sağlıklı biçimde planlamanıza yardımcı oluruz.`,
    ],
    serviceDescription: `${c.name} vize sürecinizin her aşamasında, başvuru türünüze uygun özel danışmanlık ve destek sağlıyoruz:`,
    servicesIncluded: [
      'Seyahat amacınıza göre doğru vize türünün belirlenmesi',
      'Profilinize özel, güncel evrak listesinin hazırlanması',
      'Evraklarınızın eksiksizlik ve tutarlılık açısından kontrolü',
      'Başvuru formunun doğru şekilde doldurulmasına destek',
      'Başvuru merkezi randevu sürecinin takibi',
      'Başvuru öncesi dosya düzeni ve son kontrol',
    ],
    processSteps: [
      {
        title: 'Ön Değerlendirme',
        description:
          'Seyahat amacınızı ve profilinizi değerlendirir, doğru vize türünü belirleriz.',
      },
      {
        title: 'Evrak Hazırlığı',
        description: 'Size özel evrak listesini paylaşır, belgelerinizi kontrol ederiz.',
      },
      {
        title: 'Form ve Başvuru',
        description: 'Başvuru formunu doldurur, başvuru merkezi adımlarını planlarız.',
      },
      {
        title: 'Randevu ve Takip',
        description: 'Randevu sürecini takip eder, başvuru gününe hazırlanmanıza yardımcı oluruz.',
      },
    ],
    documentCategories: [identityDocs, financialDocs, insuranceDocs],
    profileDocuments: professionProfiles,
    faqItems: [
      {
        question: `${c.name} vizesi için hangi belgeler gerekiyor?`,
        answer: `Gerekli belgeler başvuru türüne ve kişisel durumunuza göre değişir. Genel olarak pasaport, biyometrik fotoğraf, seyahat planı, konaklama, finansal belgeler ve seyahat sağlık sigortası talep edilir. Profilinize özel güncel listeyi ön değerlendirme sonrasında birlikte netleştiririz.`,
      },
      {
        question: `${c.name} vize başvurusunu kendim mi yapmalıyım, danışmanlık şart mı?`,
        answer:
          'Başvuruyu kendiniz de yapabilirsiniz. Danışmanlık; doğru vize türünü seçme, evrakları eksiksiz ve tutarlı hazırlama ve süreci planlama konularında zaman ve hata riskini azaltmayı amaçlar. Karar tamamen size aittir.',
      },
      {
        question: 'Vizemin onaylanacağını garanti ediyor musunuz?',
        answer:
          'Hayır. Hiçbir danışmanlık firması vize onayını, randevu tarihini veya işlem süresini garanti edemez. VİS VİZE yalnızca özel danışmanlık ve destek hizmeti sunar; nihai karar ilgili konsolosluk/büyükelçilik tarafından verilir.',
      },
      {
        question: 'Başvuru sürecini online olarak yürütebilir miyim?',
        answer:
          'Evet. Türkiye genelinde online destek sağlıyoruz; evrak kontrolü, form hazırlığı ve bilgilendirmeleri uzaktan yürütebiliriz. Başvuru merkezinde bizzat bulunulması gereken adımlar için de sizi önceden bilgilendiririz.',
      },
    ],
    formTitle: `${c.name} Vizesi İçin Ücretsiz Ön Değerlendirme`,
    formDescription:
      'Kısa formu doldurun; başvuru türünüzü değerlendirip size uygun yol haritasını iletelim.',
    primaryCTA: 'Ücretsiz Ön Değerlendirme Al',
    secondaryCTA: 'Hemen Ara',
    breadcrumbLabel: `${c.name} Vizesi`,
    sectionHeadings: headings({
      introduction: `${c.name} Vize Süreci Hakkında`,
      services: `${c.name} Vize Danışmanlığı Kapsamı`,
    }),
    disclaimerText: LEGAL_DISCLAIMER,
  };
}

function randevu(c: CountryProfile): LandingContent {
  return {
    visaType: `${c.name} Vize Randevu Desteği`,
    presetVisaPurpose: '',
    searchIntent: `${c.name} vize randevusu arayan; randevu takibi ve başvuru öncesi hazırlık desteği isteyen kullanıcı.`,
    heroDescription: `${c.name} vize randevu sürecinde randevu takibi, doğru başvuru rotasının belirlenmesi ve randevu öncesi dosya hazırlığı konularında yanınızdayız. Randevu tarih ve uygunluğu resmi sistemlerce belirlenir; biz süreci takip edip sizi hazırlarız.`,
    trustPoints: [
      'Randevu sürecinin takibi',
      'Randevu öncesi dosya hazırlığı',
      'Doğru başvuru rotasının belirlenmesi',
      'Türkiye geneli online destek',
    ],
    benefitItems: [
      {
        icon: 'CalendarCheck',
        title: 'Randevu Süreci Takibi',
        description:
          'Başvuru merkezi randevu sürecini takip eder, uygun seçenekler oluştuğunda bilgilendiririz.',
      },
      {
        icon: 'ClipboardCheck',
        title: 'Randevu Öncesi Hazırlık',
        description:
          'Randevu gününe kadar evraklarınızı eksiksiz ve tutarlı hale getirmenize yardımcı oluruz.',
      },
      {
        icon: 'Route',
        title: 'Doğru Başvuru Rotası',
        description: `Profilinize göre ${c.dative} hangi başvuru türü ve noktasının uygun olduğunu belirleriz.`,
      },
      {
        icon: 'ShieldCheck',
        title: 'Hata Riskini Azaltın',
        description:
          'Sık yapılan eksiklikleri önceden fark ederek başvuru gününde sürpriz yaşamamanıza destek oluruz.',
      },
    ],
    introduction: [
      `${c.name} vize randevusu, başvuru sürecinin en çok merak edilen adımlarından biridir. Randevu tarihleri ve uygunluğu ilgili resmi başvuru sistemleri tarafından belirlenir; hiçbir danışmanlık firması belirli bir tarihi veya anında randevuyu garanti edemez. VİS VİZE bu süreçte randevu takibi yapar ve sizi başvuruya hazırlar.`,
      `Önemli olan, randevu oluştuğunda dosyanızın hazır olmasıdır. Bu nedenle randevu beklerken evrak kontrolü, form hazırlığı ve doğru başvuru rotasının belirlenmesi gibi adımları önceden tamamlamanız sürecinizi rahatlatır.`,
      `Kendini yetkili başvuru merkezi gibi gösterip garantili randevu vaat eden veya olağan dışı ücret talep eden aracılara itibar etmemeniz önemlidir. Biz özel bir danışmanlık ve destek hizmeti sunarız; ${changeableInfoNote}`,
    ],
    serviceDescription: `${c.name} randevu sürecinizde size şu konularda destek oluyoruz:`,
    servicesIncluded: [
      'Randevu sürecinin düzenli takibi ve uygun seçeneklerin bildirilmesi',
      'Profilinize uygun başvuru türü ve noktasının belirlenmesi',
      'Randevu öncesi evrak listesinin hazırlanması ve kontrolü',
      'Başvuru formunun doğru doldurulmasına destek',
      'Randevu günü öncesi son dosya kontrolü',
      'Randevu sonrası izlenecek adımlar hakkında bilgilendirme',
    ],
    processSteps: [
      {
        title: 'Profil ve Rota',
        description: 'Doğru başvuru türünü belirler, randevu takibine başlarız.',
      },
      {
        title: 'Dosya Hazırlığı',
        description: 'Randevu beklerken evrak ve formlarınızı hazırlarız.',
      },
      {
        title: 'Randevu Takibi',
        description: 'Uygun randevu seçenekleri oluştuğunda sizi bilgilendiririz.',
      },
      {
        title: 'Randevu Günü',
        description: 'Son kontrolleri yapar, randevu sonrası adımları anlatırız.',
      },
    ],
    documentCategories: [identityDocs, financialDocs, insuranceDocs],
    profileDocuments: professionProfiles,
    faqItems: [
      {
        question: `${c.name} vize randevusu garanti veriyor musunuz?`,
        answer:
          'Hayır. Randevu tarihleri ve uygunluğu resmi başvuru sistemleri tarafından belirlenir. Garantili randevu, anında randevu veya özel randevu erişimi gibi vaatlerde bulunmuyoruz. Yaptığımız iş, randevu sürecini takip etmek ve sizi başvuruya hazırlamaktır.',
      },
      {
        question: 'VİS VİZE resmi randevu merkezi mi?',
        answer:
          'Hayır. VİS VİZE bir konsolosluk, büyükelçilik veya resmi başvuru/randevu merkezi değildir. TÜRSAB belgeli yetkili bir acenta olarak yalnızca danışmanlık ve destek hizmeti sunarız.',
      },
      {
        question: 'Randevu beklerken ne yapmalıyım?',
        answer:
          'Randevu oluştuğunda vakit kaybetmemek için evraklarınızı ve başvuru formunuzu önceden hazırlamanız önemlidir. Bu süreçte evrak kontrolü, tutarlılık gözden geçirmesi ve doğru başvuru rotasının belirlenmesi konularında size destek oluruz.',
      },
      {
        question: 'Randevu bulunduktan sonra süreç nasıl ilerliyor?',
        answer:
          'Randevu sonrasında başvuru merkezine sunulacak dosyanın son kontrolünü yapar, başvuru günü ve sonrasında izlemeniz gereken adımlar hakkında sizi bilgilendiririz. Nihai değerlendirme ilgili resmi makamlara aittir.',
      },
    ],
    formTitle: `${c.name} Vize Randevu Desteği Talep Edin`,
    formDescription:
      'Bilgilerinizi bırakın; randevu sürecini takip edip başvuruya hazırlanmanız için sizi arayalım.',
    primaryCTA: 'Randevu Desteği Talep Et',
    secondaryCTA: 'Hemen Ara',
    breadcrumbLabel: `${c.name} Vize Randevu`,
    sectionHeadings: headings({
      introduction: `${c.name} Vize Randevu Süreci`,
      services: 'Randevu Sürecinde Sunduğumuz Destek',
      documents: 'Randevu Öncesi Evrak Hazırlığı',
    }),
    disclaimerText: `${LEGAL_DISCLAIMER} Randevu tarihleri ve uygunluğu ilgili resmi başvuru sistemleri tarafından belirlenir; randevu garantisi verilmez.`,
  };
}

function schengen(c: CountryProfile): LandingContent {
  return {
    visaType: `${c.name} Schengen Vizesi`,
    presetVisaPurpose: 'turizm',
    searchIntent: `${c.name} üzerinden Schengen vizesi (kısa süreli) almak isteyen; evrak ve başvuru desteği arayan kullanıcı.`,
    heroDescription: `${c.name} Schengen vizesi başvurunuzda seyahat planı, konaklama, finansal belgeler ve seyahat sağlık sigortası dahil kısa süreli başvuru dosyanızı birlikte hazırlıyoruz. Doğru başvuru ülkesinin seçilmesi ve tutarlı bir seyahat planı süreç açısından önemlidir.`,
    trustPoints: [
      'Kısa süreli seyahat planı kurgusu',
      'Doğru başvuru ülkesinin belirlenmesi',
      'Seyahat sağlık sigortası desteği',
      'Evrak tutarlılığı kontrolü',
    ],
    benefitItems: [
      {
        icon: 'Plane',
        title: 'Seyahat Planı Kurgusu',
        description:
          'Gidiş-dönüş, konaklama ve şehir planınızı belgelerle tutarlı biçimde kurgulamanıza yardımcı oluruz.',
      },
      {
        icon: 'MapPin',
        title: 'Doğru Başvuru Ülkesi',
        description: `Ağırlıklı kalınacak ülkeye göre başvurunun ${c.dative} yapılmasının uygun olup olmadığını değerlendiririz.`,
      },
      {
        icon: 'ShieldCheck',
        title: 'Sigorta ve Finans',
        description:
          'Seyahat sağlık sigortası ve finansal belgeleriniz konusunda yönlendirme sağlarız.',
      },
      {
        icon: 'ClipboardCheck',
        title: 'Evrak Tutarlılığı',
        description: 'Belgelerinizin birbiriyle çelişmemesi için tek tek kontrol ederiz.',
      },
    ],
    introduction: [
      `${c.name} Schengen vizesi, kısa süreli (genellikle 90 güne kadar) turistik, ticari veya ziyaret amaçlı seyahatler için değerlendirilen bir vize türüdür. Schengen başvurularında temel ilke, seyahatinizin ağırlıklı olarak hangi ülkede geçeceğine göre doğru başvuru ülkesini seçmektir.`,
      `Başarılı bir başvuru dosyası; seyahat planı, uçuş ve konaklama bilgileri, finansal belgeler, mesleki durum belgeleri ve seyahat sağlık sigortasının birbiriyle uyumlu olmasını gerektirir. VİS VİZE olarak ${c.genitive} Schengen başvurusunda bu belgeleri tutarlı bir bütün haline getirmenize yardımcı oluruz.`,
      `${changeableInfoNote} Bu nedenle vize ücretleri, sigorta limitleri veya kalış süreleri gibi değişebilen bilgileri güncel resmi kaynaklardan teyit etmenizi öneririz.`,
    ],
    serviceDescription: `${c.name} Schengen başvurunuzda sunduğumuz destek başlıkları:`,
    servicesIncluded: [
      'Seyahat amacınıza uygun kısa süreli vize kurgusunun oluşturulması',
      'Doğru başvuru ülkesinin belirlenmesine yönelik değerlendirme',
      'Uçuş, konaklama ve seyahat planı belgelerinin tutarlılık kontrolü',
      'Finansal belgelerin ve mesleki durum evraklarının gözden geçirilmesi',
      'Seyahat sağlık sigortası temininde yönlendirme',
      'Başvuru formu ve randevu sürecinde destek',
    ],
    processSteps: [
      {
        title: 'Seyahat Planı',
        description: 'Amacınızı, tarihlerinizi ve rota planınızı netleştiririz.',
      },
      {
        title: 'Evrak Hazırlığı',
        description: 'Konaklama, finans ve sigorta belgelerini birlikte hazırlarız.',
      },
      {
        title: 'Tutarlılık Kontrolü',
        description: 'Belgeler arası çelişkileri gidererek dosyanızı güçlendiririz.',
      },
      {
        title: 'Form ve Randevu',
        description: 'Başvuru formunu doldurur, randevu sürecini takip ederiz.',
      },
    ],
    documentCategories: [
      identityDocs,
      {
        title: 'Seyahat ve Konaklama',
        items: [
          'Gidiş-dönüş uçuş rezervasyonu',
          'Otel / konaklama rezervasyonu veya davetiye',
          'Detaylı seyahat planı (itinerary)',
        ],
      },
      {
        title: 'Finans ve Sigorta',
        items: [
          'Son dönem banka hesap hareketleri',
          'Gelir durumu belgeleri',
          'Seyahat sağlık sigortası (temininde destek oluruz)',
        ],
      },
    ],
    profileDocuments: professionProfiles,
    faqItems: [
      {
        question: `${c.name} Schengen vizesiyle diğer Schengen ülkelerine gidebilir miyim?`,
        answer:
          'Schengen vizesi kural olarak tüm Schengen bölgesinde geçerlidir; ancak başvuruyu ağırlıklı olarak kalacağınız veya ilk giriş yapacağınız ülkeye yapmanız beklenir. Seyahat planınıza göre doğru başvuru ülkesini birlikte değerlendiririz.',
      },
      {
        question: 'Schengen başvurusunda seyahat sağlık sigortası zorunlu mu?',
        answer:
          'Kısa süreli Schengen başvurularında geçerli bir seyahat sağlık sigortası genellikle talep edilir. Sigortanın kapsam ve limit koşulları değişebildiğinden, size uygun poliçenin temininde yönlendirme sağlarız.',
      },
      {
        question: 'Vize ücretini ve kalış süresini söyleyebilir misiniz?',
        answer: `Ücretler, kalış süreleri ve güncel koşullar zamanla değişebilir ve ilgili resmi makamlarca belirlenir. Bu bilgileri güncel resmi kaynaklardan teyit etmenizi öneririz. ${changeableInfoNote}`,
      },
      {
        question: 'Banka hareketlerim başvuru için yeterli mi?',
        answer:
          'Finansal belgeler, seyahat sürenizi ve planınızı destekleyecek bir bütünlük içinde değerlendirilir. Hesap hareketlerinizi ve gelir belgelerinizi profilinize göre gözden geçirir, tutarlı bir dosya oluşturmanıza yardımcı oluruz. Nihai değerlendirme ilgili makamlara aittir.',
      },
    ],
    formTitle: `${c.name} Schengen Vizesi Ön Değerlendirme`,
    formDescription:
      'Seyahat planınızı paylaşın; kısa süreli başvuru dosyanız için size uygun yol haritasını çıkaralım.',
    primaryCTA: 'Ücretsiz Ön Değerlendirme Al',
    secondaryCTA: 'Hemen Ara',
    breadcrumbLabel: `${c.name} Schengen Vizesi`,
    sectionHeadings: headings({
      introduction: `${c.name} Schengen Vizesi Hakkında`,
      services: 'Schengen Başvurusunda Sunduğumuz Destek',
    }),
    disclaimerText: LEGAL_DISCLAIMER,
  };
}

function turistik(c: CountryProfile): LandingContent {
  return {
    visaType: `${c.name} Turistik Vize`,
    presetVisaPurpose: 'turizm',
    searchIntent: `${c.name} turistik / turist vizesi almak isteyen; tatil ve gezi amaçlı başvuru desteği arayan kullanıcı.`,
    heroDescription: `${c.name} turistik vizesi başvurunuzda tatil planınızı; konaklama ve ulaşım rezervasyonları, finansal belgeler ve seyahat sağlık sigortası ile tutarlı bir dosya haline getiriyoruz. Gezi amaçlı seyahatinizi baştan sona planlamanıza destek oluyoruz.`,
    trustPoints: [
      'Tatil / gezi planının kurgulanması',
      'Konaklama ve ulaşım belgeleri',
      'Finansal belge yönlendirmesi',
      'Seyahat sağlık sigortası desteği',
    ],
    benefitItems: [
      {
        icon: 'Plane',
        title: 'Gezi Planı',
        description:
          'Ziyaret edilecek şehirler, tarihler ve konaklama planınızı belgelerle uyumlu biçimde kurgularız.',
      },
      {
        icon: 'Building2',
        title: 'Konaklama ve Ulaşım',
        description:
          'Otel ve ulaşım rezervasyonlarınızın başvuruya uygun biçimde hazırlanmasına yardımcı oluruz.',
      },
      {
        icon: 'ClipboardCheck',
        title: 'Profil Belgeleri',
        description:
          'Çalışan, işveren, emekli veya öğrenci profilinize göre ek belgeleri hazırlarız.',
      },
      {
        icon: 'ShieldCheck',
        title: 'Sigorta ve Finans',
        description:
          'Seyahat sağlık sigortası ve finansal belgeler konusunda yönlendirme sağlarız.',
      },
    ],
    introduction: [
      `${c.name} turistik vizesi; tatil, gezi ve ziyaret amaçlı kısa süreli seyahatler için değerlendirilen bir vize türüdür. Turistik başvurularda amacın net biçimde ortaya konması ve seyahat planının belgelerle desteklenmesi önemlidir.`,
      `${c.name} turist vizesi dosyanızda konaklama ve ulaşım rezervasyonları, finansal belgeleriniz, mesleki durumunuz ve seyahat sağlık sigortanız birbirini desteklemelidir. VİS VİZE olarak bu belgeleri tutarlı bir bütün haline getirmenize ve gezinizi planlamanıza yardımcı oluruz.`,
      `${changeableInfoNote} Bu yüzden güncel gereklilikleri profilinize göre birlikte gözden geçiririz.`,
    ],
    serviceDescription: `${c.name} turistik vize başvurunuzda sunduğumuz destek:`,
    servicesIncluded: [
      'Tatil / gezi amacına uygun başvuru kurgusunun oluşturulması',
      'Konaklama ve ulaşım rezervasyonlarının planlanması',
      'Finansal belgelerin ve profil evraklarının kontrolü',
      'Seyahat sağlık sigortası temininde yönlendirme',
      'Başvuru formu ve randevu sürecinde destek',
      'Başvuru öncesi dosya düzeni ve son kontrol',
    ],
    processSteps: [
      {
        title: 'Gezi Planı',
        description: 'Tatil planınızı, tarihlerinizi ve rotanızı belirleriz.',
      },
      {
        title: 'Rezervasyonlar',
        description: 'Konaklama ve ulaşım belgelerini planlamanıza yardımcı oluruz.',
      },
      {
        title: 'Evrak Kontrolü',
        description: 'Finansal ve profil belgelerinizi gözden geçiririz.',
      },
      {
        title: 'Form ve Randevu',
        description: 'Başvuru formunu doldurur, randevu sürecini takip ederiz.',
      },
    ],
    documentCategories: [
      identityDocs,
      {
        title: 'Tatil ve Konaklama',
        items: [
          'Gidiş-dönüş ulaşım rezervasyonu',
          'Otel / konaklama rezervasyonu',
          'Şehir ve tarih bazlı gezi planı',
        ],
      },
      {
        title: 'Finans ve Sigorta',
        items: [
          'Banka hesap hareketleri ve gelir belgeleri',
          'Mesleki durum belgeleri',
          'Seyahat sağlık sigortası (temininde destek oluruz)',
        ],
      },
    ],
    profileDocuments: professionProfiles,
    faqItems: [
      {
        question: `${c.name} turistik vizesi için otel ve uçak rezervasyonu şart mı?`,
        answer:
          'Turistik başvurularda seyahat planını gösteren konaklama ve ulaşım rezervasyonları genellikle beklenir. Kesin bilet almadan da başvuruya uygun rezervasyon belgeleri hazırlanabilir; bu konuda size yol gösteririz.',
      },
      {
        question: 'Çalışmıyorum, turistik vize başvurusu yapabilir miyim?',
        answer:
          'Evet. Öğrenci, emekli veya ev hanımı gibi farklı profillerde de başvuru yapılabilir. Bu durumda gelir ve sponsorluk belgeleri ile seyahatinizi destekleyen bir dosya hazırlanması önemlidir. Profilinize uygun belge setini birlikte belirleriz.',
      },
      {
        question: 'Turistik vizeyle ne kadar kalabilirim?',
        answer: `Kalış süreleri ve koşullar ilgili resmi makamlarca belirlenir ve değişebilir. Bu bilgileri güncel resmi kaynaklardan teyit etmenizi öneririz. ${changeableInfoNote}`,
      },
      {
        question: 'Seyahat sağlık sigortasını siz mi hazırlıyorsunuz?',
        answer:
          'Başvurunuz için gerekli seyahat sağlık sigortasının temininde size yardımcı oluruz. Poliçe kapsam ve koşulları değişebildiğinden, size uygun seçeneği birlikte değerlendiririz.',
      },
    ],
    formTitle: `${c.name} Turistik Vize Ön Değerlendirme`,
    formDescription:
      'Tatil planınızı paylaşın; turistik başvuru dosyanız için size uygun yol haritasını çıkaralım.',
    primaryCTA: 'Ücretsiz Ön Değerlendirme Al',
    secondaryCTA: 'Hemen Ara',
    breadcrumbLabel: `${c.name} Turistik Vize`,
    sectionHeadings: headings({
      introduction: `${c.name} Turistik Vize Hakkında`,
      services: 'Turistik Başvuruda Sunduğumuz Destek',
    }),
    disclaimerText: LEGAL_DISCLAIMER,
  };
}

function ogrenci(c: CountryProfile): LandingContent {
  return {
    visaType: `${c.name} Öğrenci / Eğitim Vizesi`,
    presetVisaPurpose: 'egitim',
    searchIntent: `${c.name} öğrenci / eğitim vizesi almak isteyen; kabul, finansal destek ve evrak konusunda danışmanlık arayan öğrenci.`,
    heroDescription: `${c.name} öğrenci vizesi başvurunuzda kabul/okul belgeleri, finansal destek, konaklama ve öğrenci profilinize uygun evrak hazırlığında yanınızdayız. Eğitim amaçlı başvurunuzu doğru yönde planlamanıza destek oluruz.`,
    trustPoints: [
      'Kabul ve eğitim belgeleri kontrolü',
      'Finansal destek ve sponsor belgeleri',
      'Öğrenci profiline uygun dosya',
      'Uzun / kısa süreli yön değerlendirmesi',
    ],
    benefitItems: [
      {
        icon: 'GraduationCap',
        title: 'Eğitim Odaklı Dosya',
        description:
          'Okul/üniversite kabulü ve eğitim amacınızı destekleyen belgeleri düzenlemenize yardımcı oluruz.',
      },
      {
        icon: 'ClipboardCheck',
        title: 'Finansal Destek',
        description:
          'Öğrenim ve yaşam giderlerini karşılayacak finansal belge ve sponsorluk yapısını kurgularız.',
      },
      {
        icon: 'Building2',
        title: 'Konaklama Planı',
        description:
          'Öğrenci yurdu veya konaklama belgelerinizin başvuruya uygun hazırlanmasında yönlendiririz.',
      },
      {
        icon: 'Route',
        title: 'Doğru Başvuru Yönü',
        description:
          'Programın süresine göre kısa veya uzun süreli başvuru yönünü birlikte belirleriz.',
      },
    ],
    introduction: [
      `${c.name} öğrenci vizesi; ${c.locative} bir eğitim kurumunda öğrenim görmek isteyen öğrenciler için değerlendirilen bir vize türüdür. Sürecin temeli, bir eğitim kurumundan alınan kabul veya kayıt belgesi ile eğitim amacının net biçimde ortaya konmasıdır.`,
      `${c.name} eğitim vizesi dosyanızda kabul belgesi, finansal destek (öğrenim ve yaşam giderleri), konaklama, sağlık sigortası ve öğrenci profilinize ilişkin belgeler bir bütün oluşturmalıdır. Programın süresine göre kısa süreli veya uzun süreli (ulusal) başvuru yönü farklılaşabilir; doğru yönü birlikte değerlendiririz.`,
      `Ülkeye özgü öğrenim koşulları değişebileceğinden, güncel gereklilikleri resmi kaynaklardan teyit etmenizi öneririz. ${changeableInfoNote}`,
    ],
    serviceDescription: `${c.name} öğrenci vizesi sürecinde sunduğumuz destek:`,
    servicesIncluded: [
      'Kabul / kayıt belgesi ve eğitim amacının başvuruya uygun düzenlenmesi',
      'Finansal destek ve sponsorluk yapısının kurgulanması',
      'Konaklama belgelerinin planlanması',
      'Öğrenci profiline özel evrak listesinin hazırlanması',
      'Kısa / uzun süreli başvuru yönünün değerlendirilmesi',
      'Başvuru formu ve randevu sürecinde destek',
    ],
    processSteps: [
      {
        title: 'Profil ve Yön',
        description: 'Eğitim planınızı değerlendirir, doğru başvuru yönünü belirleriz.',
      },
      {
        title: 'Belge Hazırlığı',
        description: 'Kabul, finans ve konaklama belgelerinizi düzenleriz.',
      },
      {
        title: 'Dosya Kontrolü',
        description: 'Öğrenci profilinize göre dosyanızı bütünlük açısından gözden geçiririz.',
      },
      {
        title: 'Form ve Randevu',
        description: 'Başvuru formunu doldurur, randevu sürecini takip ederiz.',
      },
    ],
    documentCategories: [
      identityDocs,
      {
        title: 'Eğitim Belgeleri',
        items: [
          'Okul / üniversite kabul veya kayıt belgesi',
          'Önceki diploma / transkript',
          'Varsa dil yeterlilik belgesi',
        ],
      },
      {
        title: 'Finansal ve Konaklama',
        items: [
          'Öğrenim ve yaşam giderlerini gösteren finansal belgeler',
          'Sponsor / veli gelir ve taahhüt belgeleri',
          'Konaklama bilgileri ve sağlık sigortası',
        ],
      },
    ],
    profileDocuments: [
      {
        title: 'Kendi İmkânıyla Başvuran Öğrenci',
        items: [
          'Kendi adına finansal belgeler',
          'Banka hesap hareketleri',
          'Eğitim ve konaklama planı',
        ],
      },
      {
        title: 'Veli / Sponsor Destekli Öğrenci',
        description: 'Öğrenim giderleri bir veli veya sponsor tarafından karşılanıyorsa:',
        items: [
          'Sponsorun gelir ve banka belgeleri',
          'Sponsorluk / taahhüt yazısı',
          'Öğrenci ile sponsor arasındaki bağı gösteren belgeler',
        ],
      },
    ],
    faqItems: [
      {
        question: `${c.name} öğrenci vizesi için kabul belgesi şart mı?`,
        answer:
          'Öğrenci/eğitim vizesi başvuruları genellikle bir eğitim kurumundan alınan kabul veya kayıt belgesine dayanır. Kabul sürecinizin durumuna göre başvuru planınızı birlikte kurgular, hangi belgelerin gerektiğini netleştiririz.',
      },
      {
        question: 'Öğrenci vizesinde finansal belgeler nasıl olmalı?',
        answer:
          'Öğrenim ve yaşam giderlerinizi karşılayabileceğinizi gösteren finansal belgeler önemlidir. Bu, kendi hesabınız üzerinden veya bir sponsor/veli aracılığıyla sağlanabilir. Profilinize uygun finansal yapıyı ve gerekli belgeleri birlikte belirleriz.',
      },
      {
        question: 'Kısa süreli mi yoksa uzun süreli vizeyle mi başvurmalıyım?',
        answer:
          'Bu, eğitim programınızın süresine ve türüne göre değişir. Kısa programlar farklı, uzun süreli öğrenim ise ayrı bir başvuru yönü gerektirebilir. Doğru yönü profilinize göre değerlendirir; nihai kararın ilgili resmi makamlara ait olduğunu hatırlatırız.',
      },
      {
        question: 'Öğrenci vizesiyle çalışabilir miyim?',
        answer:
          'Öğrencilerin çalışma koşulları ülkeye ve vize türüne göre değişir ve resmi düzenlemelere tabidir. Bu konudaki güncel kuralları resmi kaynaklardan teyit etmenizi öneririz; başvuru dosyanızı eğitim amacı üzerine kurgularız.',
      },
    ],
    formTitle: `${c.name} Öğrenci Vizesi Başvuru Değerlendirmesi`,
    formDescription:
      'Eğitim planınızı paylaşın; öğrenci başvurunuz için uygun yol haritasını birlikte çıkaralım.',
    primaryCTA: 'Başvurumu Değerlendirin',
    secondaryCTA: 'Hemen Ara',
    breadcrumbLabel: `${c.name} Öğrenci Vizesi`,
    sectionHeadings: headings({
      introduction: `${c.name} Öğrenci Vizesi Hakkında`,
      services: 'Öğrenci Vizesinde Sunduğumuz Destek',
      profiles: 'Öğrenci Profiline Göre Belgeler',
    }),
    disclaimerText: LEGAL_DISCLAIMER,
  };
}

function erasmus(c: CountryProfile): LandingContent {
  return {
    visaType: `${c.name} Erasmus Vizesi`,
    presetVisaPurpose: 'egitim',
    searchIntent: `${c.name} Erasmus / değişim programı vizesi alacak; kabul ve program belgeleri için destek arayan öğrenci.`,
    heroDescription: `${c.name} Erasmus vizesi başvurunuzda üniversite yazışmaları, Erasmus/değişim programı belgeleri, hibe/burs bilgileri, konaklama ve sigorta evrakları konusunda yanınızdayız. Değişim öğrencisi dosyanızı doğru biçimde hazırlamanıza destek oluruz.`,
    trustPoints: [
      'Erasmus / değişim programı belgeleri',
      'Üniversite yazışmalarının düzenlenmesi',
      'Hibe / burs bilgilerinin dosyaya işlenmesi',
      'Konaklama ve sigorta desteği',
    ],
    benefitItems: [
      {
        icon: 'GraduationCap',
        title: 'Program Belgeleri',
        description:
          'Kabul / hareketlilik (mobility) belgeleri ve öğrenim anlaşmanızın dosyaya uygun düzenlenmesine yardımcı oluruz.',
      },
      {
        icon: 'ClipboardCheck',
        title: 'Hibe ve Finans',
        description:
          'Erasmus hibesi / burs bilgilerinizi ve varsa ek finansal belgeleri düzenlemenize destek oluruz.',
      },
      {
        icon: 'Building2',
        title: 'Konaklama ve Sigorta',
        description:
          'Konaklama ve sağlık sigortası belgelerinizin başvuruya uygun hazırlanmasında yönlendiririz.',
      },
      {
        icon: 'CalendarCheck',
        title: 'Program Tarihleri',
        description:
          'Program başlangıç-bitiş tarihlerine göre başvuru planınızı zamanında kurgularız.',
      },
    ],
    introduction: [
      `${c.name} Erasmus vizesi; ${c.locative} bir üniversitede değişim (Erasmus) programı kapsamında öğrenim görecek öğrenciler için değerlendirilen bir vize türüdür. Sürecin temelinde kabul/hareketlilik belgeleri ve üniversite yazışmaları yer alır.`,
      `${c.name} Erasmus başvurusunda; hareketlilik belgeleri, öğrenim anlaşması, hibe/burs bilgileri, konaklama ve sağlık sigortası ile program tarihlerinin birbiriyle tutarlı olması önemlidir. VİS VİZE olarak değişim öğrencisi dosyanızı bütünlük içinde hazırlamanıza yardımcı oluruz.`,
      `Program koşulları üniversiteye ve döneme göre değişebileceğinden, güncel gereklilikleri kurumunuz ve ilgili resmi kaynaklardan teyit etmenizi öneririz. ${changeableInfoNote}`,
    ],
    serviceDescription: `${c.name} Erasmus vizesi sürecinde sunduğumuz destek:`,
    servicesIncluded: [
      'Kabul / hareketlilik belgeleri ve üniversite yazışmalarının düzenlenmesi',
      'Erasmus hibe / burs bilgilerinin dosyaya işlenmesi',
      'Konaklama ve sağlık sigortası belgelerinin planlanması',
      'Program tarihlerine göre başvuru zamanlamasının kurgulanması',
      'Öğrenci profiline özel evrak listesinin hazırlanması',
      'Başvuru formu ve randevu sürecinde destek',
    ],
    processSteps: [
      {
        title: 'Program Bilgisi',
        description: 'Erasmus programınızı ve tarihlerinizi değerlendiririz.',
      },
      {
        title: 'Belge Hazırlığı',
        description: 'Hareketlilik, hibe, konaklama ve sigorta belgelerini düzenleriz.',
      },
      {
        title: 'Dosya Kontrolü',
        description: 'Belgelerinizi bütünlük ve tutarlılık açısından gözden geçiririz.',
      },
      {
        title: 'Form ve Randevu',
        description: 'Başvuru formunu doldurur, randevu sürecini takip ederiz.',
      },
    ],
    documentCategories: [
      identityDocs,
      {
        title: 'Erasmus / Program Belgeleri',
        items: [
          'Kabul / hareketlilik (mobility) belgesi',
          'Öğrenim anlaşması (learning agreement)',
          'Üniversite / bölüm yazışmaları',
          'Öğrenci belgesi',
        ],
      },
      {
        title: 'Finans, Konaklama ve Sigorta',
        items: [
          'Erasmus hibe / burs bilgileri',
          'Varsa ek finansal belgeler',
          'Konaklama bilgileri ve sağlık sigortası',
        ],
      },
    ],
    faqItems: [
      {
        question: `${c.name} Erasmus vizesi normal öğrenci vizesinden farklı mı?`,
        answer:
          'Erasmus başvuruları, değişim programına özgü hareketlilik belgeleri ve üniversite yazışmalarıyla desteklenmesiyle öne çıkar. Temelde bir eğitim/öğrenci vizesi süreci olsa da program belgeleri dosyanın merkezinde yer alır. Sizin durumunuza uygun başvuru yönünü birlikte belirleriz.',
      },
      {
        question: 'Erasmus hibesi finansal belge yerine geçer mi?',
        answer:
          'Erasmus hibesi dosyanızı destekleyen önemli bir belgedir; ancak yaşam giderlerinizi karşılayabileceğinizi gösteren ek finansal belgeler de istenebilir. Profilinize uygun finansal yapıyı birlikte oluştururuz.',
      },
      {
        question: 'Program tarihlerim netleşmeden başvurabilir miyim?',
        answer:
          'Başvuru planlaması genellikle program tarihleri ve kabul belgeleri üzerinden yapılır. Belgeleriniz tamamlanırken evrak hazırlığına başlayabilir, tarihler netleştiğinde başvuruyu zamanında yapacak şekilde ilerleyebiliriz.',
      },
      {
        question: 'Konaklama belgemi henüz alamadım, sorun olur mu?',
        answer:
          'Konaklama bilgisi başvuru dosyasının bir parçasıdır; kesinleşmemişse geçici konaklama belgeleriyle ilerlenebilir. Doğru belge türünü ve zamanlamayı program koşullarınıza göre değerlendiririz.',
      },
    ],
    formTitle: `${c.name} Erasmus Vizesi Başvuru Değerlendirmesi`,
    formDescription:
      'Program bilgilerinizi paylaşın; Erasmus başvurunuz için uygun yol haritasını çıkaralım.',
    primaryCTA: 'Başvurumu Değerlendirin',
    secondaryCTA: 'Hemen Ara',
    breadcrumbLabel: `${c.name} Erasmus Vizesi`,
    sectionHeadings: headings({
      introduction: `${c.name} Erasmus Vizesi Hakkında`,
      services: 'Erasmus Sürecinde Sunduğumuz Destek',
    }),
    disclaimerText: LEGAL_DISCLAIMER,
  };
}

function isci(c: CountryProfile): LandingContent {
  return {
    visaType: `${c.name} İşçi / Çalışma Vizesi`,
    presetVisaPurpose: 'calisma',
    searchIntent: `${c.name} işçi / çalışma / iş vizesi almak isteyen; iş teklifi ve evrak sürecinde danışmanlık arayan kullanıcı.`,
    heroDescription: `${c.name} işçi vizesi (çalışma vizesi) başvurunuzda iş ilişkisi/teklifi, işveren belgeleri, mesleki nitelik ve başvuran evraklarının hazırlığında yanınızdayız. Çalışma vizesi ile resmi çalışma izni sürecinin farkını da net biçimde açıklarız.`,
    trustPoints: [
      'İş teklifi / iş ilişkisi değerlendirmesi',
      'İşveren ve başvuran belgeleri',
      'Mesleki nitelik dosyası',
      'Danışmanlık ile resmi izin farkının açıklanması',
    ],
    benefitItems: [
      {
        icon: 'Briefcase',
        title: 'İş İlişkisi Değerlendirmesi',
        description:
          'İş teklifi veya çalışma ilişkinizi başvuru açısından değerlendirir, gerekli belgeleri belirleriz.',
      },
      {
        icon: 'Building2',
        title: 'İşveren Belgeleri',
        description:
          'İşveren tarafından sağlanması gereken belgeleri ve başvurudaki rolünü açıklarız.',
      },
      {
        icon: 'BadgeCheck',
        title: 'Mesleki Nitelik',
        description:
          'Diploma, sertifika ve iş deneyimi belgelerinizi mesleki profilinize göre düzenlemenize yardımcı oluruz.',
      },
      {
        icon: 'Info',
        title: 'Süreç Netliği',
        description:
          'Vize danışmanlığı ile resmi çalışma izni kararının farklı süreçler olduğunu şeffaf biçimde anlatırız.',
      },
    ],
    introduction: [
      `${c.name} işçi vizesi; ${c.locative} bir işveren nezdinde çalışmak üzere yapılan başvuruları kapsar. Halk arasında çalışma vizesi veya iş vizesi olarak da anılan bu süreçte, genellikle bir iş teklifi veya çalışma ilişkisi ile işveren tarafından sağlanan belgeler esas alınır.`,
      `${c.name} çalışma vizesi başvurusunda; işveren belgeleri, iş sözleşmesi/teklifi, mesleki nitelik belgeleri (diploma, sertifika, deneyim) ve başvuran evraklarının uyumlu bir bütün oluşturması önemlidir. VİS VİZE olarak bu dosyanın hazırlığında ve düzenlenmesinde size destek oluruz.`,
      `Önemli bir ayrım: Çalışma izni kararı ve iş piyasasına erişim, ilgili ülkenin resmi makamlarının yetkisindedir. VİS VİZE bir işveren veya resmi izin makamı değildir; yalnızca başvuru sürecine yönelik özel danışmanlık ve destek sağlar. ${changeableInfoNote}`,
    ],
    serviceDescription: `${c.name} çalışma vizesi sürecinde sunduğumuz destek:`,
    servicesIncluded: [
      'İş teklifi / çalışma ilişkisinin başvuru açısından değerlendirilmesi',
      'İşveren tarafından sağlanacak belgeler konusunda yönlendirme',
      'Mesleki nitelik ve deneyim belgelerinin düzenlenmesi',
      'Başvuran evraklarının kontrolü ve tutarlılık gözden geçirmesi',
      'Başvuru formu ve randevu sürecinde destek',
      'Süreç boyunca danışmanlık ile resmi izin farkının açıklanması',
    ],
    processSteps: [
      {
        title: 'Ön Değerlendirme',
        description: 'İş ilişkinizi ve profilinizi değerlendirir, gerekli belgeleri belirleriz.',
      },
      {
        title: 'Belge Hazırlığı',
        description: 'İşveren ve başvuran belgelerini birlikte düzenleriz.',
      },
      {
        title: 'Dosya Kontrolü',
        description: 'Mesleki nitelik ve evrak bütünlüğünü gözden geçiririz.',
      },
      {
        title: 'Form ve Randevu',
        description: 'Başvuru formunu doldurur, randevu sürecini takip ederiz.',
      },
    ],
    documentCategories: [
      identityDocs,
      {
        title: 'İş ve İşveren Belgeleri',
        items: [
          'İş teklifi / iş sözleşmesi',
          'İşveren tarafından sağlanan belgeler',
          'Görev ve pozisyon bilgileri',
        ],
      },
      {
        title: 'Mesleki Nitelik Belgeleri',
        items: [
          'Diploma ve sertifikalar',
          'İş deneyimi / referans belgeleri',
          'Varsa mesleki yeterlilik / denklik belgeleri',
        ],
      },
    ],
    profileDocuments: [
      {
        title: 'Nitelikli / Vasıflı Çalışan',
        items: [
          'Diploma ve mesleki sertifikalar',
          'İş deneyimi belgeleri',
          'Pozisyona ilişkin iş teklifi',
        ],
      },
      {
        title: 'İşveren Tarafı',
        description: 'Başvuruda işveren tarafından sağlanması beklenen belgeler:',
        items: [
          'Şirket / işveren belgeleri',
          'İş sözleşmesi veya teklif yazısı',
          'Pozisyon ve istihdam bilgileri',
        ],
      },
    ],
    faqItems: [
      {
        question: `${c.name} çalışma vizesi ile çalışma izni aynı şey mi?`,
        answer:
          'Hayır. Çalışma vizesi başvurusu ile resmi çalışma izni kararı farklı süreçlerdir. İzin ve iş piyasasına erişim ilgili ülkenin resmi makamlarının yetkisindedir. VİS VİZE bu konuda yalnızca başvuru sürecine yönelik danışmanlık ve destek sağlar; izni veren taraf değildir.',
      },
      {
        question: 'İş teklifim yok, yine de başvurabilir miyim?',
        answer:
          'Çalışma amaçlı başvurular genellikle bir iş teklifi veya çalışma ilişkisi üzerine kuruludur. Durumunuzu ön değerlendirmede birlikte inceler; hangi seçeneklerin uygun olabileceğini ve hangi belgelerin gerektiğini açıklarız.',
      },
      {
        question: 'İşveren hangi belgeleri sağlamalı?',
        answer:
          'İşveren tarafından sağlanan belgeler başvurunun önemli bir parçasıdır ve pozisyona göre değişebilir. Genel olarak iş sözleşmesi/teklifi ve işverene ilişkin belgeler beklenir. Somut listeyi profilinize ve pozisyona göre netleştiririz.',
      },
      {
        question: 'İşçi vizesi başvurumun kabul edileceğini garanti ediyor musunuz?',
        answer:
          'Hayır. Hiçbir danışmanlık firması çalışma vizesi veya iznin onaylanacağını garanti edemez. Biz dosyanızın doğru ve eksiksiz hazırlanmasına destek oluruz; nihai karar ilgili resmi makamlara aittir.',
      },
    ],
    formTitle: `${c.name} Çalışma Vizesi Danışmanlığı`,
    formDescription:
      'İş durumunuzu paylaşın; çalışma vizesi süreciniz için sizi bir danışmanımız arasın.',
    primaryCTA: 'Danışman Beni Arasın',
    secondaryCTA: 'Hemen Ara',
    breadcrumbLabel: `${c.name} İşçi Vizesi`,
    sectionHeadings: headings({
      introduction: `${c.name} İşçi / Çalışma Vizesi Hakkında`,
      services: 'Çalışma Vizesinde Sunduğumuz Destek',
      profiles: 'Profile Göre Belgeler',
    }),
    disclaimerText: LEGAL_DISCLAIMER,
  };
}

function aile(c: CountryProfile): LandingContent {
  return {
    visaType: `${c.name} Aile Birleşimi Vizesi`,
    presetVisaPurpose: 'aile',
    searchIntent: `${c.name} aile birleşimi / eş vizesi başvurusu yapacak; akrabalık ve evlilik belgeleri için danışmanlık arayan kullanıcı.`,
    heroDescription: `${c.name} aile birleşimi vizesi başvurunuzda akrabalık/evlilik belgeleri, nüfus kayıtları, başvuran ve sponsor evrakları, tercüme ve belge düzeni konularında yanınızdayız. Bu hassas süreci sabırla ve özenle planlamanıza destek oluruz.`,
    trustPoints: [
      'Akrabalık / evlilik belgeleri düzeni',
      'Nüfus ve resmi kayıt belgeleri',
      'Başvuran ve sponsor evrakları',
      'Tercüme ve belge hazırlığı yönlendirmesi',
    ],
    benefitItems: [
      {
        icon: 'HeartHandshake',
        title: 'Aile Bağı Belgeleri',
        description:
          'Evlilik, akrabalık ve nüfus kayıtlarının başvuruya uygun düzenlenmesine yardımcı oluruz.',
      },
      {
        icon: 'Users',
        title: 'Başvuran ve Sponsor',
        description: `${c.locative} bulunan aile ferdi (sponsor) ile başvuran belgelerini uyumlu biçimde hazırlarız.`,
      },
      {
        icon: 'FileCheck2',
        title: 'Tercüme ve Belge Düzeni',
        description:
          'Belgelerin tercümesi ve düzeni konusunda yönlendirme sağlar, dosyanızı derli toplu hale getiririz.',
      },
      {
        icon: 'ClipboardCheck',
        title: 'İkamet ve Gelir',
        description:
          'Gerekli durumlarda sponsorun ikamet ve gelir belgelerinin hazırlanmasına destek oluruz.',
      },
    ],
    introduction: [
      `${c.name} aile birleşimi vizesi; ${c.locative} yasal olarak bulunan bir aile ferdinin (örneğin eş) yanına yerleşmek amacıyla yapılan başvuruları kapsar. Eş vizesi olarak da anılan bu süreçte, aile bağını kanıtlayan resmi belgeler dosyanın merkezinde yer alır.`,
      `${c.name} aile birleşimi başvurusunda; evlilik/akrabalık belgeleri, nüfus kayıtları, başvuran ve sponsor evrakları, gerekli durumlarda ikamet ve gelir bilgileri ile tercümesi gereken belgeler bir bütün oluşturmalıdır. VİS VİZE olarak bu belgeleri özenle düzenlemenize ve süreci planlamanıza yardımcı oluruz.`,
      `Aile birleşimi başvuruları kişisel ve hassas bir konudur; her ailenin durumu farklıdır. Sonuç garantisi vermeksizin, dosyanızı doğru ve eksiksiz hazırlamanız için yanınızda oluruz. ${changeableInfoNote}`,
    ],
    serviceDescription: `${c.name} aile birleşimi sürecinde sunduğumuz destek:`,
    servicesIncluded: [
      'Evlilik / akrabalık ve nüfus kayıt belgelerinin düzenlenmesi',
      'Başvuran ve sponsor evraklarının uyumlu biçimde hazırlanması',
      'Gerekli durumlarda ikamet ve gelir belgelerinin planlanması',
      'Belge tercümesi ve düzeni konusunda yönlendirme',
      'Başvuru formu ve randevu sürecinde destek',
      'Sürecin adım adım planlanması',
    ],
    processSteps: [
      {
        title: 'Durum Değerlendirmesi',
        description: 'Aile durumunuzu değerlendirir, gerekli belgeleri belirleriz.',
      },
      {
        title: 'Belge Hazırlığı',
        description: 'Akrabalık, nüfus ve sponsor belgelerini düzenleriz.',
      },
      {
        title: 'Tercüme ve Düzen',
        description: 'Tercüme ve belge düzeni konusunda yönlendirir, dosyayı toparlarız.',
      },
      {
        title: 'Form ve Randevu',
        description: 'Başvuru formunu doldurur, randevu sürecini takip ederiz.',
      },
    ],
    documentCategories: [
      identityDocs,
      {
        title: 'Aile ve Nüfus Belgeleri',
        items: [
          'Evlilik / akrabalık belgesi',
          'Nüfus kayıt örneği',
          'Gerekli belgelerin tercümeleri',
        ],
      },
      {
        title: 'Sponsor (Aile Ferdi) Belgeleri',
        items: [
          `${c.locative} ikamet / statü belgeleri`,
          'Gelir ve geçim belgeleri (gerekli durumlarda)',
          'Konaklama / ikamet bilgileri',
        ],
      },
    ],
    profileDocuments: [
      {
        title: 'Başvuran (Türkiye Tarafı)',
        items: [
          'Kimlik ve nüfus belgeleri',
          'Evlilik / akrabalık belgeleri',
          'Pasaport ve fotoğraf',
        ],
      },
      {
        title: 'Sponsor (Yurt Dışı Tarafı)',
        description: `${c.locative} bulunan aile ferdinden beklenebilecek belgeler:`,
        items: [
          'İkamet / statü belgesi',
          'Gelir ve geçim belgeleri',
          'Davet / taahhüt yazısı (gerekli durumlarda)',
        ],
      },
    ],
    faqItems: [
      {
        question: `${c.name} aile birleşimi vizesi için hangi belgeler gerekiyor?`,
        answer: `Aile bağını kanıtlayan belgeler (evlilik/akrabalık, nüfus kayıtları), başvuran ve sponsor evrakları ile gerekli durumlarda ikamet ve gelir belgeleri esastır. Her ailenin durumu farklı olduğundan, size özel belge listesini ön değerlendirmede netleştiririz. ${changeableInfoNote}`,
      },
      {
        question: 'Belgelerin tercümesi gerekiyor mu?',
        answer:
          'Aile birleşimi başvurularında belgelerin tercümesi ve uygun biçimde düzenlenmesi sıklıkla gerekir. Hangi belgelerin tercümeye ihtiyaç duyduğunu ve nasıl hazırlanması gerektiğini birlikte belirler, size yol gösteririz.',
      },
      {
        question: 'Aile birleşimi başvurusunun kabulünü garanti ediyor musunuz?',
        answer:
          'Hayır. Aile birleşimi başvurularının sonucu ilgili resmi makamların değerlendirmesine bağlıdır ve garanti edilemez. Biz yalnızca dosyanızın doğru, eksiksiz ve özenli hazırlanmasına destek oluruz.',
      },
      {
        question: 'Süreç ne kadar sürer?',
        answer: `İşlem süreleri resmi makamlarca belirlenir ve başvuruya göre değişir; bu nedenle kesin bir süre taahhüdünde bulunmuyoruz. Güncel bilgileri resmi kaynaklardan teyit etmenizi öneririz.`,
      },
    ],
    formTitle: `${c.name} Aile Birleşimi Vizesi Danışmanlığı`,
    formDescription:
      'Durumunuzu paylaşın; aile birleşimi süreciniz için sizi bir danışmanımız arasın.',
    primaryCTA: 'Danışman Beni Arasın',
    secondaryCTA: 'Hemen Ara',
    breadcrumbLabel: `${c.name} Aile Birleşimi Vizesi`,
    sectionHeadings: headings({
      introduction: `${c.name} Aile Birleşimi Vizesi Hakkında`,
      services: 'Aile Birleşiminde Sunduğumuz Destek',
      profiles: 'Taraflara Göre Belgeler',
    }),
    disclaimerText: LEGAL_DISCLAIMER,
  };
}

function ticari(c: CountryProfile): LandingContent {
  return {
    visaType: `${c.name} Ticari Vize`,
    presetVisaPurpose: 'ticari',
    searchIntent: `${c.name} ticari / iş seyahati / fuar vizesi alacak; davet ve şirket belgeleri için danışmanlık arayan kullanıcı.`,
    heroDescription: `${c.name} ticari vizesi başvurunuzda iş daveti, şirket belgeleri, işveren yazıları, fuar/toplantı amacı, seyahat planı ve finansal belgeler konusunda yanınızdayız. İş seyahati dosyanızı tutarlı biçimde hazırlamanıza destek oluruz.`,
    trustPoints: [
      'İş daveti ve şirket belgeleri',
      'Fuar / toplantı amacının belgelenmesi',
      'Seyahat planı kurgusu',
      'Finansal belge yönlendirmesi',
    ],
    benefitItems: [
      {
        icon: 'Briefcase',
        title: 'İş Amacı Belgeleri',
        description:
          'Toplantı, fuar veya iş görüşmesi amacınızı belgelerle net biçimde ortaya koymanıza yardımcı oluruz.',
      },
      {
        icon: 'Building2',
        title: 'Şirket ve Davet',
        description:
          'İş daveti, şirket belgeleri ve işveren yazılarının başvuruya uygun hazırlanmasında yönlendiririz.',
      },
      {
        icon: 'Plane',
        title: 'Seyahat Planı',
        description: 'Ulaşım, konaklama ve toplantı programınızı tutarlı bir plana dönüştürürüz.',
      },
      {
        icon: 'ClipboardCheck',
        title: 'Finansal Belgeler',
        description:
          'Şirket ve/veya şahsi finansal belgelerinizi başvuru açısından gözden geçiririz.',
      },
    ],
    introduction: [
      `${c.name} ticari vizesi; ${c.locative} iş toplantısı, fuar, iş görüşmesi veya benzeri ticari amaçlarla yapılacak kısa süreli seyahatler için değerlendirilen bir vize türüdür. İş seyahati vizesi olarak da anılan bu süreçte, seyahatin ticari amacı belgelerle desteklenmelidir.`,
      `${c.name} ticari vize dosyanızda; iş daveti veya toplantı/fuar belgeleri, şirket ve işveren belgeleri, seyahat planı ile finansal belgelerin birbirini desteklemesi önemlidir. VİS VİZE olarak bu belgeleri tutarlı bir bütün haline getirmenize yardımcı oluruz.`,
      `${changeableInfoNote} Bu nedenle güncel gereklilikleri seyahatinizin niteliğine göre birlikte gözden geçiririz.`,
    ],
    serviceDescription: `${c.name} ticari vize başvurunuzda sunduğumuz destek:`,
    servicesIncluded: [
      'İş / fuar / toplantı amacının belgelerle ortaya konması',
      'İş daveti ve şirket belgelerinin düzenlenmesinde yönlendirme',
      'İşveren yazıları ve görevlendirme belgelerinin hazırlığı',
      'Seyahat planı ve konaklama belgelerinin kurgulanması',
      'Şirket / şahsi finansal belgelerin gözden geçirilmesi',
      'Başvuru formu ve randevu sürecinde destek',
    ],
    processSteps: [
      {
        title: 'Amaç ve Plan',
        description: 'Ticari amacınızı ve seyahat planınızı netleştiririz.',
      },
      { title: 'Belge Hazırlığı', description: 'Davet, şirket ve işveren belgelerini düzenleriz.' },
      {
        title: 'Dosya Kontrolü',
        description: 'Finansal ve seyahat belgelerini tutarlılık açısından gözden geçiririz.',
      },
      {
        title: 'Form ve Randevu',
        description: 'Başvuru formunu doldurur, randevu sürecini takip ederiz.',
      },
    ],
    documentCategories: [
      identityDocs,
      {
        title: 'Ticari Amaç Belgeleri',
        items: [
          'İş daveti / toplantı veya fuar belgesi',
          'İşveren görevlendirme yazısı',
          'Karşı firma yazışmaları (varsa)',
        ],
      },
      {
        title: 'Şirket ve Finans',
        items: [
          'Şirket belgeleri (sicil, vergi levhası vb.)',
          'Şirket ve/veya şahsi banka hareketleri',
          'Seyahat planı, konaklama ve sağlık sigortası',
        ],
      },
    ],
    profileDocuments: [
      {
        title: 'Şirket Çalışanı / Görevlendirilen',
        items: [
          'İşveren görevlendirme yazısı',
          'İş daveti / toplantı belgesi',
          'Maaş ve SGK belgeleri',
        ],
      },
      {
        title: 'Şirket Sahibi / Yönetici',
        items: [
          'Şirket sicil ve vergi belgeleri',
          'Şirket banka hareketleri',
          'Karşı firma davet / yazışmaları',
        ],
      },
    ],
    faqItems: [
      {
        question: `${c.name} ticari vizesi için davetiye şart mı?`,
        answer:
          'Ticari başvurularda iş amacını gösteren bir davet veya toplantı/fuar belgesi çoğu zaman beklenir. Davet yoksa da seyahatin ticari amacını destekleyen alternatif belgelerle dosya kurgulanabilir. Durumunuza uygun yolu birlikte belirleriz.',
      },
      {
        question: 'Ticari vize ile turistik vize arasındaki fark nedir?',
        answer:
          'Temel fark seyahatin amacındadır: ticari vize iş toplantısı, fuar veya iş görüşmesi gibi amaçlara; turistik vize ise tatil ve gezi amacına dayanır. Belgeler de amaca göre farklılaşır. Doğru başvuru türünü profilinize göre değerlendiririz.',
      },
      {
        question: 'Fuar için başvuruyu ne zaman yapmalıyım?',
        answer:
          'Fuar ve toplantı tarihleri belli olduğunda, randevu ve evrak hazırlığı için başvuruyu erken planlamak faydalıdır. Tarihlerinize göre süreci birlikte kurgular, zamanında hazır olmanıza yardımcı oluruz.',
      },
      {
        question: 'Ticari vizenin onaylanacağını garanti ediyor musunuz?',
        answer:
          'Hayır. Vize onayı, randevu ve işlem süresi garanti edilemez. VİS VİZE yalnızca başvuru dosyanızın doğru ve tutarlı hazırlanmasına destek olur; nihai karar ilgili resmi makamlara aittir.',
      },
    ],
    formTitle: `${c.name} Ticari Vize Danışmanlığı`,
    formDescription:
      'Seyahat amacınızı paylaşın; ticari başvurunuz için size uygun yol haritasını çıkaralım.',
    primaryCTA: 'Danışman Beni Arasın',
    secondaryCTA: 'Hemen Ara',
    breadcrumbLabel: `${c.name} Ticari Vize`,
    sectionHeadings: headings({
      introduction: `${c.name} Ticari Vize Hakkında`,
      services: 'Ticari Vizede Sunduğumuz Destek',
      profiles: 'Profile Göre Belgeler',
    }),
    disclaimerText: LEGAL_DISCLAIMER,
  };
}

const BUILDERS: Record<LandingCategory, (c: CountryProfile) => LandingContent> = {
  genel,
  randevu,
  schengen,
  turistik,
  ogrenci,
  erasmus,
  isci,
  aile,
  ticari,
};

export function buildLandingContent(
  category: LandingCategory,
  country: CountryProfile,
): LandingContent {
  return BUILDERS[category](country);
}

/** Brand-level "Neden VİS VİZE?" items (company, not country — shared by design). */
export function whyChooseItems(): WhyChooseItem[] {
  return baseWhyChoose;
}
