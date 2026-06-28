import type { Article, BlogCategory } from '@/types/content';

export const blogCategories: BlogCategory[] = [
  { slug: 'rehberler', title: 'Vize Rehberleri' },
  { slug: 'schengen', title: 'Schengen' },
  { slug: 'belgeler', title: 'Belgeler' },
  { slug: 'guncellemeler', title: 'Güncellemeler' },
];

const editorial = { name: 'VİS VİZE Editör Ekibi', role: 'İçerik Ekibi' };

export const articles: Article[] = [
  {
    slug: 'almanya-vizesi-belgeleri',
    title: 'Almanya Vizesi İçin Gerekli Belgeler (Başvuran Durumuna Göre)',
    excerpt:
      'Almanya Schengen vizesi başvurusunda istenen belgeleri çalışan, işveren, emekli, öğrenci ve serbest meslek profillerine göre derledik.',
    category: 'belgeler',
    status: 'published',
    featured: true,
    author: editorial,
    publishedAt: '2026-01-15',
    updatedAt: '2026-06-10',
    readingMinutes: 8,
    tags: ['Almanya', 'Schengen', 'Belgeler'],
    relatedCountrySlugs: ['almanya', 'fransa'],
    relatedServiceSlugs: ['evrak-kontrolu', 'vize-danismanligi'],
    intro:
      'Almanya vize başvurusunda en sık karşılaşılan sorun eksik veya yanlış hazırlanmış evraklardır. Bu rehberde temel belgeleri ve başvuran durumuna göre değişen ek belgeleri özetledik. Belgeler konsolosluk ve başvuru merkezi güncellemelerine göre değişebilir; başvuru öncesi güncel listeyi doğrulayın.',
    sections: [
      {
        heading: 'Tüm Başvurularda İstenen Temel Belgeler',
        paragraphs: [
          'Başvuran durumundan bağımsız olarak hemen her Almanya Schengen başvurusunda aşağıdaki belgeler istenir.',
        ],
        bullets: [
          'En az 6 ay geçerli pasaport ve eski pasaportlar',
          'İki adet biyometrik fotoğraf',
          'Doldurulmuş ve imzalı başvuru formu',
          'Gidiş-dönüş uçuş ve konaklama rezervasyonu',
          'Minimum 30.000 € teminatlı seyahat sağlık sigortası',
          'Son 3 ay banka hesap hareketleri',
        ],
      },
      {
        heading: 'Başvuran Durumuna Göre Ek Belgeler',
        paragraphs: [
          'Konsolosluk, başvuranın gelir ve bağ durumunu değerlendirmek için profile özel belgeler ister.',
        ],
        bullets: [
          'Sigortalı çalışan: izin yazısı, bordro, SGK dökümü',
          'İşveren: ticaret sicil gazetesi, vergi levhası, faaliyet belgesi',
          'Emekli: emekli maaş belgesi, banka hareketleri',
          'Öğrenci: öğrenci belgesi, veli muvafakatnamesi ve sponsorluk',
          'Serbest meslek: vergi levhası, oda kaydı, gelir beyanı',
        ],
        callout: {
          tone: 'warning',
          text: 'Belgeleriniz başvuran durumunuzla tutarlı olmalıdır. Tutarsız gelir ve seyahat planı en sık ret sebeplerindendir.',
        },
      },
      {
        heading: 'Sık Yapılan Hatalar',
        paragraphs: ['Aşağıdaki hatalar başvurunuzun olumsuz sonuçlanma riskini artırır.'],
        bullets: [
          'Yetersiz veya düzensiz banka hareketleri',
          'Seyahat planı ile rezervasyon tarihlerinin uyuşmaması',
          'Geçersiz veya eksik teminatlı sigorta',
        ],
      },
    ],
    faqs: [
      {
        question: 'Belgeler ne kadar süre geçerli olmalı?',
        answer: 'Pasaport en az 6 ay geçerli olmalı; banka ve gelir belgeleri genellikle son 3 ay içinde olmalıdır.',
      },
    ],
    seo: {
      title: 'Almanya Vizesi İçin Gerekli Belgeler 2026 | VİS VİZE',
      description:
        'Almanya Schengen vizesi için gerekli belgeler: çalışan, işveren, emekli, öğrenci ve serbest meslek profillerine göre güncel evrak listesi.',
      canonical: '/blog/almanya-vizesi-belgeleri',
    },
  },
  {
    slug: 'schengen-hangi-ulkeye-basvurmali',
    title: 'Schengen Vizesinde Hangi Ülkeye Başvurmalısınız?',
    excerpt:
      'Birden fazla Schengen ülkesini ziyaret edecekseniz başvuruyu hangi ülkeye yapacağınızı belirleyen kuralları açıkladık.',
    category: 'schengen',
    status: 'published',
    featured: false,
    author: editorial,
    publishedAt: '2026-02-02',
    updatedAt: '2026-05-20',
    readingMinutes: 5,
    tags: ['Schengen', 'Rehber'],
    relatedCountrySlugs: ['almanya', 'fransa', 'italya'],
    relatedServiceSlugs: ['vize-danismanligi'],
    intro:
      'Schengen başvurusunda doğru ülkeyi seçmek, başvurunuzun reddedilmemesi için önemlidir. İşte temel kurallar.',
    sections: [
      {
        heading: 'Ana Varış Ülkesi Kuralı',
        paragraphs: [
          'Seyahatinizde en uzun süre kalacağınız ülke ana varış ülkesidir ve başvuruyu bu ülkeye yapmanız gerekir.',
        ],
      },
      {
        heading: 'Eşit Süreli Kalışlar',
        paragraphs: [
          'Birden fazla ülkede eşit süre kalacaksanız, Schengen bölgesine ilk giriş yapacağınız ülkeye başvurursunuz.',
        ],
        callout: {
          tone: 'info',
          text: 'Yanlış ülkeye başvuru, başvurunuzun reddedilmesine yol açabilir. Emin değilseniz bizimle birlikte belirleyebilirsiniz.',
        },
      },
    ],
    seo: {
      title: 'Schengen Vizesinde Hangi Ülkeye Başvurmalı? | VİS VİZE',
      description:
        'Birden fazla Schengen ülkesini ziyaret edecekseniz başvuruyu hangi ülkeye yapacağınızı belirleyen ana varış ülkesi kuralını açıklıyoruz.',
      canonical: '/blog/schengen-hangi-ulkeye-basvurmali',
    },
  },
  {
    slug: 'vize-randevusu-nasil-alinir',
    title: 'Vize Randevusu Nasıl Alınır? Süreç ve İpuçları',
    excerpt: 'Başvuru merkezi randevu süreci, yoğunluk dönemleri ve randevu öncesi hazırlık hakkında bilmeniz gerekenler.',
    category: 'rehberler',
    status: 'published',
    featured: false,
    author: editorial,
    publishedAt: '2026-03-12',
    updatedAt: '2026-04-28',
    readingMinutes: 6,
    tags: ['Randevu', 'Rehber'],
    relatedServiceSlugs: ['randevu-destegi'],
    intro:
      'Randevu uygunluğu tamamen resmi başvuru merkezlerine bağlıdır. Bu yazıda süreci ve hazırlığı özetledik.',
    sections: [
      {
        heading: 'Randevu Yoğunluğu',
        paragraphs: [
          'Yaz ayları ve tatil dönemleri randevu yoğunluğunun en yüksek olduğu zamanlardır. Erken planlama önemlidir.',
        ],
      },
      {
        heading: 'Randevu Öncesi Hazırlık',
        paragraphs: ['Randevu gününe evraklarınız eksiksiz ve düzenli şekilde hazır olmalıdır.'],
        bullets: ['Tüm belgelerin asıl ve fotokopileri', 'Randevu onay çıktısı', 'Biyometrik fotoğraf'],
      },
    ],
    seo: {
      title: 'Vize Randevusu Nasıl Alınır? | VİS VİZE',
      description:
        'Vize başvuru merkezi randevu süreci, yoğunluk dönemleri ve randevu öncesi hazırlık hakkında pratik rehber.',
      canonical: '/blog/vize-randevusu-nasil-alinir',
    },
  },
];
