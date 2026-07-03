import type { ApplicantStatus, Country, DocumentGroup, VisaType } from '@/types/content';

/* ---- Shared building blocks for Schengen-type countries (reused, not duplicated) ---- */

const schengenVisaTypes: VisaType[] = [
  { slug: 'turizm', name: 'Turizm / Ziyaret', summary: 'Tatil, gezi ve aile/arkadaş ziyareti amaçlı kısa süreli vize.' },
  { slug: 'ticari', name: 'Ticari / İş', summary: 'Toplantı, fuar ve iş görüşmeleri için ticari vize.' },
  { slug: 'egitim', name: 'Eğitim / Staj', summary: 'Kısa süreli kurs, eğitim veya staj programları.' },
  { slug: 'aile', name: 'Aile Ziyareti', summary: 'Schengen bölgesindeki yakınları ziyaret.' },
  { slug: 'transit', name: 'Transit', summary: 'Schengen üzerinden aktarmalı geçiş.' },
];

const schengenApplicantStatuses: ApplicantStatus[] = [
  {
    key: 'calisan',
    label: 'Sigortalı Çalışan',
    documents: [
      'İşveren imzalı izin/görev yazısı',
      'Son 3 ay maaş bordrosu',
      'SGK işe giriş ve hizmet dökümü',
      'Banka hesap hareketleri',
    ],
  },
  {
    key: 'isveren',
    label: 'İşveren / Şirket Sahibi',
    documents: [
      'Ticaret sicil gazetesi',
      'Vergi levhası',
      'Faaliyet belgesi',
      'Şirket banka hesap hareketleri',
    ],
  },
  {
    key: 'emekli',
    label: 'Emekli',
    documents: ['Emekli kimlik/maaş belgesi', 'Banka hesap hareketleri', 'Tapu/gelir belgeleri (varsa)'],
  },
  {
    key: 'ogrenci',
    label: 'Öğrenci',
    documents: ['Öğrenci belgesi', 'Veli muvafakatnamesi (18 yaş altı)', 'Veli gelir ve sponsorluk belgeleri'],
  },
  {
    key: 'serbest',
    label: 'Serbest Meslek',
    documents: ['Vergi levhası', 'Meslek odası kaydı', 'Banka hesap hareketleri', 'Gelir beyanı'],
  },
];

const schengenDocumentGroups: DocumentGroup[] = [
  {
    title: 'Kimlik ve Pasaport',
    items: ['En az 6 ay geçerli pasaport', 'Eski pasaportlar', '2 adet biyometrik fotoğraf', 'Nüfus cüzdanı fotokopisi'],
  },
  {
    title: 'Seyahat Belgeleri',
    items: ['Gidiş-dönüş uçuş rezervasyonu', 'Otel/konaklama rezervasyonu', 'Detaylı seyahat planı'],
  },
  {
    title: 'Finansal Belgeler',
    items: ['Son 3 ay banka hesap hareketleri', 'Gelir durumu belgeleri', 'Seyahat sağlık sigortası (min. 30.000 €)'],
  },
];

const schengenProcessSteps = [
  { title: 'Ön Değerlendirme', description: 'Profil ve seyahat amacınıza göre doğru vize türünü belirleriz.' },
  { title: 'Evrak Hazırlığı', description: 'Başvuran durumunuza özel evrak listesini hazırlar ve kontrol ederiz.' },
  { title: 'Form ve Başvuru', description: 'Başvuru formunu doldurur, başvuru merkezi adımlarını planlarız.' },
  { title: 'Randevu', description: 'Başvuru merkezi randevusunu takip eder, uygun seçenekleri iletiriz.' },
  { title: 'Biyometrik İşlem', description: 'Randevu gününde parmak izi ve fotoğraf işlemleri yapılır.' },
  { title: 'Değerlendirme', description: 'Başvuru konsolosluk tarafından değerlendirilir.' },
  { title: 'Sonuç', description: 'Pasaportunuz sonuç ile birlikte teslim edilir.' },
];

const schengenCommonMistakes = [
  'Banka hareketlerinin yetersiz veya düzensiz olması',
  'Seyahat planı ile konaklama tarihlerinin uyuşmaması',
  'Eksik veya geçersiz seyahat sağlık sigortası',
  'Başvuran durumuna uygun olmayan gelir belgeleri',
];

const schengenRejectionGuidance = [
  'Ret gerekçesini dikkatle inceleyin; her gerekçe farklı çözüm gerektirir.',
  'Eksik veya zayıf değerlendirilen belgeleri güçlendirin.',
  'Gerekirse itiraz veya yeniden başvuru seçeneklerini değerlendirin.',
];

interface SchengenCountrySeed {
  slug: string;
  name: string;
  code: string;
  popular: boolean;
  heroDescription: string;
  related: string[];
}

function makeSchengenCountry(s: SchengenCountrySeed): Country {
  return {
    slug: s.slug,
    name: s.name,
    region: 'Schengen',
    code: s.code,
    status: 'published',
    popular: s.popular,
    heroEyebrow: `${s.name} Vizesi Başvuru Desteği`,
    heroTitle: `${s.name} Vizesi Sürecinizi Doğru Planlayın`,
    heroDescription: s.heroDescription,
    quickFacts: [
      { label: 'Bölge', value: 'Schengen' },
      { label: 'Vize Tipi', value: 'Kısa süreli (C tipi)' },
      { label: 'Sigorta', value: 'Min. 30.000 € teminat' },
      { label: 'Pasaport', value: 'En az 6 ay geçerli' },
    ],
    visaTypes: schengenVisaTypes,
    whoCanApply: [
      'Turizm veya ziyaret amacıyla seyahat edecekler',
      'İş, fuar veya toplantı için gidecekler',
      'Kısa süreli eğitim/staj programına katılacaklar',
      'Schengen bölgesindeki yakınlarını ziyaret edecekler',
    ],
    documentGroups: schengenDocumentGroups,
    applicantStatuses: schengenApplicantStatuses,
    processSteps: schengenProcessSteps,
    timelineNote:
      'İşlem süresi başvuru merkezi ve konsolosluk yoğunluğuna göre değişir. Süre garantisi verilemez; başvurunuzu erken planlamanızı öneririz.',
    commonMistakes: schengenCommonMistakes,
    rejectionGuidance: schengenRejectionGuidance,
    faqs: [
      {
        question: `${s.name} vizesi için randevu ne kadar sürede alınır?`,
        answer:
          'Randevu uygunluğu başvuru merkezine ve sezona göre değişir. Süreci sizin adınıza takip eder, uygun seçenekleri iletiriz.',
      },
      {
        question: `${s.name} vizesinde hangi sigorta gerekli?`,
        answer:
          'Tüm Schengen bölgesinde geçerli, minimum 30.000 Euro teminatlı seyahat sağlık sigortası genellikle zorunludur.',
      },
    ],
    relatedCountrySlugs: s.related,
    relatedServiceSlugs: ['vize-danismanligi', 'evrak-kontrolu', 'randevu-destegi'],
    seo: {
      title: `${s.name} Vizesi Başvuru ve Randevu Desteği | VİS VİZE`,
      description: `${s.name} vizesi için evrak hazırlığı, randevu organizasyonu ve süreç takibi. Başvuru türünüze uygun yol haritası ile profesyonel destek.`,
      canonical: `/vize-ulkeleri/${s.slug}`,
    },
  };
}

export const countries: Country[] = [
  makeSchengenCountry({
    slug: 'almanya',
    name: 'Almanya',
    code: 'DE',
    popular: true,
    heroDescription:
      'Almanya turizm, ticari, eğitim ve aile ziyareti başvurularında doğru evrak ve randevu planlamasıyla yanınızdayız. Kısa formu doldurun, uzman ekibimiz başvuru türünüzü değerlendirsin.',
    related: ['fransa', 'italya', 'hollanda'],
  }),
  makeSchengenCountry({
    slug: 'fransa',
    name: 'Fransa',
    code: 'FR',
    popular: true,
    heroDescription:
      'Fransa vize başvurunuzu seyahat amacınıza göre planlıyoruz. Evrak hazırlığı ve randevu takibinde profesyonel destek alın.',
    related: ['almanya', 'italya', 'ispanya'],
  }),
  makeSchengenCountry({
    slug: 'italya',
    name: 'İtalya',
    code: 'IT',
    popular: true,
    heroDescription:
      'İtalya vizesi için başvuru türünüze uygun evrak listesi ve randevu organizasyonu ile sürecinizi kolaylaştırıyoruz.',
    related: ['almanya', 'fransa', 'ispanya'],
  }),
  makeSchengenCountry({
    slug: 'ispanya',
    name: 'İspanya',
    code: 'ES',
    popular: true,
    heroDescription:
      'İspanya vize sürecinizde doğru planlama ile zaman kazanın. Evrak kontrolü ve randevu takibi tek noktadan.',
    related: ['italya', 'fransa', 'almanya'],
  }),
  makeSchengenCountry({
    slug: 'hollanda',
    name: 'Hollanda',
    code: 'NL',
    popular: false,
    heroDescription:
      'Hollanda vize başvurunuz için başvuran durumunuza özel evrak hazırlığı ve süreç takibi sağlıyoruz.',
    related: ['almanya', 'fransa', 'italya'],
  }),
  makeSchengenCountry({
    slug: 'yunanistan',
    name: 'Yunanistan',
    code: 'GR',
    popular: false,
    heroDescription:
      'Yunanistan vizesi için seyahat amacınıza uygun başvuru planı ve randevu desteği ile yanınızdayız.',
    related: ['italya', 'ispanya', 'almanya'],
  }),
  makeSchengenCountry({
    slug: 'macaristan',
    name: 'Macaristan',
    code: 'HU',
    popular: false,
    heroDescription:
      'Macaristan vize başvurunuzu seyahat amacınıza göre planlıyoruz. Evrak hazırlığı ve randevu takibinde profesyonel destek alın.',
    related: ['avusturya', 'almanya', 'polonya'],
  }),
  makeSchengenCountry({
    slug: 'danimarka',
    name: 'Danimarka',
    code: 'DK',
    popular: false,
    heroDescription:
      'Danimarka vizesi için başvuran durumunuza özel evrak listesi ve randevu organizasyonu ile sürecinizi kolaylaştırıyoruz.',
    related: ['hollanda', 'almanya', 'avusturya'],
  }),
  makeSchengenCountry({
    slug: 'avusturya',
    name: 'Avusturya',
    code: 'AT',
    popular: false,
    heroDescription:
      'Avusturya vize sürecinizde doğru planlama ile zaman kazanın. Evrak kontrolü ve randevu takibi tek noktadan.',
    related: ['almanya', 'macaristan', 'italya'],
  }),
  makeSchengenCountry({
    slug: 'polonya',
    name: 'Polonya',
    code: 'PL',
    popular: false,
    heroDescription:
      'Polonya vizesi için seyahat amacınıza uygun başvuru planı ve randevu desteği ile yanınızdayız.',
    related: ['macaristan', 'almanya', 'avusturya'],
  }),
  makeSchengenCountry({
    slug: 'belcika',
    name: 'Belçika',
    code: 'BE',
    popular: false,
    heroDescription:
      'Belçika vize başvurunuzu seyahat amacınıza göre planlıyoruz. Evrak hazırlığı ve randevu takibinde profesyonel destek alın.',
    related: ['hollanda', 'fransa', 'almanya'],
  }),
  makeSchengenCountry({
    slug: 'cekya',
    name: 'Çekya',
    code: 'CZ',
    popular: false,
    heroDescription:
      'Çekya vizesi için başvuran durumunuza özel evrak listesi ve randevu organizasyonu ile sürecinizi kolaylaştırıyoruz.',
    related: ['almanya', 'avusturya', 'polonya'],
  }),
  makeSchengenCountry({
    slug: 'portekiz',
    name: 'Portekiz',
    code: 'PT',
    popular: false,
    heroDescription:
      'Portekiz vize sürecinizde doğru planlama ile zaman kazanın. Evrak kontrolü ve randevu takibi tek noktadan.',
    related: ['ispanya', 'fransa', 'italya'],
  }),
  makeSchengenCountry({
    slug: 'isvicre',
    name: 'İsviçre',
    code: 'CH',
    popular: false,
    heroDescription:
      'İsviçre vizesi için seyahat amacınıza uygun başvuru planı ve randevu desteği ile yanınızdayız.',
    related: ['almanya', 'fransa', 'italya'],
  }),
  makeSchengenCountry({
    slug: 'isvec',
    name: 'İsveç',
    code: 'SE',
    popular: false,
    heroDescription:
      'İsveç vize başvurunuzu seyahat amacınıza göre planlıyoruz. Evrak hazırlığı ve randevu takibinde profesyonel destek alın.',
    related: ['norvec', 'finlandiya', 'danimarka'],
  }),
  makeSchengenCountry({
    slug: 'norvec',
    name: 'Norveç',
    code: 'NO',
    popular: false,
    heroDescription:
      'Norveç vizesi için başvuran durumunuza özel evrak listesi ve randevu organizasyonu ile sürecinizi kolaylaştırıyoruz.',
    related: ['isvec', 'danimarka', 'finlandiya'],
  }),
  makeSchengenCountry({
    slug: 'finlandiya',
    name: 'Finlandiya',
    code: 'FI',
    popular: false,
    heroDescription:
      'Finlandiya vize sürecinizde doğru planlama ile zaman kazanın. Evrak kontrolü ve randevu takibi tek noktadan.',
    related: ['isvec', 'estonya', 'norvec'],
  }),
  makeSchengenCountry({
    slug: 'izlanda',
    name: 'İzlanda',
    code: 'IS',
    popular: false,
    heroDescription:
      'İzlanda vizesi için seyahat amacınıza uygun başvuru planı ve randevu desteği ile yanınızdayız.',
    related: ['norvec', 'danimarka', 'isvec'],
  }),
  makeSchengenCountry({
    slug: 'malta',
    name: 'Malta',
    code: 'MT',
    popular: false,
    heroDescription:
      'Malta vize başvurunuzu seyahat amacınıza göre planlıyoruz. Evrak hazırlığı ve randevu takibinde profesyonel destek alın.',
    related: ['italya', 'ispanya', 'yunanistan'],
  }),
  makeSchengenCountry({
    slug: 'luksemburg',
    name: 'Lüksemburg',
    code: 'LU',
    popular: false,
    heroDescription:
      'Lüksemburg vizesi için başvuran durumunuza özel evrak listesi ve randevu organizasyonu ile sürecinizi kolaylaştırıyoruz.',
    related: ['belcika', 'fransa', 'almanya'],
  }),
  makeSchengenCountry({
    slug: 'lihtenstayn',
    name: 'Lihtenştayn',
    code: 'LI',
    popular: false,
    heroDescription:
      'Lihtenştayn vize sürecinizde doğru planlama ile zaman kazanın. Evrak kontrolü ve randevu takibi tek noktadan.',
    related: ['isvicre', 'avusturya', 'almanya'],
  }),
  makeSchengenCountry({
    slug: 'slovenya',
    name: 'Slovenya',
    code: 'SI',
    popular: false,
    heroDescription:
      'Slovenya vizesi için seyahat amacınıza uygun başvuru planı ve randevu desteği ile yanınızdayız.',
    related: ['hirvatistan', 'avusturya', 'italya'],
  }),
  makeSchengenCountry({
    slug: 'slovakya',
    name: 'Slovakya',
    code: 'SK',
    popular: false,
    heroDescription:
      'Slovakya vize başvurunuzu seyahat amacınıza göre planlıyoruz. Evrak hazırlığı ve randevu takibinde profesyonel destek alın.',
    related: ['cekya', 'avusturya', 'macaristan'],
  }),
  makeSchengenCountry({
    slug: 'hirvatistan',
    name: 'Hırvatistan',
    code: 'HR',
    popular: false,
    heroDescription:
      'Hırvatistan vizesi için başvuran durumunuza özel evrak listesi ve randevu organizasyonu ile sürecinizi kolaylaştırıyoruz.',
    related: ['slovenya', 'italya', 'macaristan'],
  }),
  makeSchengenCountry({
    slug: 'estonya',
    name: 'Estonya',
    code: 'EE',
    popular: false,
    heroDescription:
      'Estonya vize sürecinizde doğru planlama ile zaman kazanın. Evrak kontrolü ve randevu takibi tek noktadan.',
    related: ['letonya', 'litvanya', 'finlandiya'],
  }),
  makeSchengenCountry({
    slug: 'letonya',
    name: 'Letonya',
    code: 'LV',
    popular: false,
    heroDescription:
      'Letonya vizesi için seyahat amacınıza uygun başvuru planı ve randevu desteği ile yanınızdayız.',
    related: ['litvanya', 'estonya', 'polonya'],
  }),
  makeSchengenCountry({
    slug: 'litvanya',
    name: 'Litvanya',
    code: 'LT',
    popular: false,
    heroDescription:
      'Litvanya vize başvurunuzu seyahat amacınıza göre planlıyoruz. Evrak hazırlığı ve randevu takibinde profesyonel destek alın.',
    related: ['letonya', 'estonya', 'polonya'],
  }),
  makeSchengenCountry({
    slug: 'bulgaristan',
    name: 'Bulgaristan',
    code: 'BG',
    popular: false,
    heroDescription:
      'Bulgaristan vizesi için başvuran durumunuza özel evrak listesi ve randevu organizasyonu ile sürecinizi kolaylaştırıyoruz.',
    related: ['romanya', 'yunanistan', 'macaristan'],
  }),
  makeSchengenCountry({
    slug: 'romanya',
    name: 'Romanya',
    code: 'RO',
    popular: false,
    heroDescription:
      'Romanya vize sürecinizde doğru planlama ile zaman kazanın. Evrak kontrolü ve randevu takibi tek noktadan.',
    related: ['bulgaristan', 'macaristan', 'yunanistan'],
  }),
];

/**
 * Schengen landing content. Served at the fixed route /schengen-vizesi using the
 * same country-detail rendering. Kept OUT of the `countries` array so it does not
 * appear in the countries listing or the [countrySlug] dynamic route.
 */
export const schengenLanding: Country = {
  ...makeSchengenCountry({
    slug: 'schengen',
    name: 'Schengen',
    code: 'EU',
    popular: true,
    heroDescription:
      'Schengen vizesi 27 Avrupa ülkesine kısa süreli seyahat imkânı sağlar. Doğru ülkeye, doğru evraklarla başvurmanız için yanınızdayız.',
    related: ['almanya', 'fransa', 'italya'],
  }),
  heroEyebrow: 'Schengen Vizesi Başvuru ve Randevu Desteği',
  heroTitle: 'Schengen Vizesi Sürecinizi Doğru Planlayın',
  quickFacts: [
    { label: 'Kapsam', value: '27 Schengen ülkesi' },
    { label: 'Süre', value: '180 günde 90 güne kadar' },
    { label: 'Vize Tipi', value: 'Kısa süreli (C tipi)' },
    { label: 'Sigorta', value: 'Min. 30.000 € teminat' },
  ],
  seo: {
    title: 'Schengen Vizesi Başvuru ve Randevu Desteği | VİS VİZE',
    description:
      'Schengen vizesi için doğru ülke seçimi, evrak hazırlığı ve randevu organizasyonu. Başvuru türünüze uygun profesyonel destek alın.',
    canonical: '/schengen-vizesi',
  },
};
