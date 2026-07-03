import type { CountryProfile } from './types';

/**
 * Country facts used to compose natural, non-templated Turkish content. Notes and
 * FAQs are intentionally cautious: no fees, processing times, validity periods or
 * legal rules are asserted as fixed fact (these change and are the authorities'
 * domain). City lists reflect where authorised application points are commonly
 * located and are framed as "verify the current arrangement".
 */
export const COUNTRY_PROFILES: Record<string, CountryProfile> = {
  almanya: {
    slug: 'almanya',
    name: 'Almanya',
    dative: "Almanya'ya",
    locative: "Almanya'da",
    genitive: "Almanya'nın",
    applicationCities: ['İstanbul', 'Ankara', 'İzmir', 'Antalya', 'Bursa', 'Gaziantep'],
    notes: [
      "Almanya, Türkiye'den en yoğun vize başvurusu alan ülkelerden biridir; bu nedenle randevu ve evrak planlamasının erkenden yapılması önem taşır.",
      'Başvurular; ikamet ettiğiniz ile bağlı olarak İstanbul, Ankara, İzmir ve diğer illerdeki yetkili başvuru merkezleri üzerinden alınır. Size uygun başvuru noktasını birlikte belirleriz.',
      'Almanya başvurularında evrakların eksiksiz, kendi içinde tutarlı ve doğru formatta sunulması sürecin sağlıklı ilerlemesi açısından belirleyicidir.',
    ],
    countryFaq: {
      question: 'Almanya vize başvurusu hangi şehirlerden yapılabiliyor?',
      answer:
        'Almanya başvuruları, ikamet ettiğiniz ile göre İstanbul, Ankara, İzmir ve diğer bazı illerdeki yetkili başvuru merkezleri üzerinden alınmaktadır. Hangi başvuru noktasının sizin için uygun olduğunu profilinize göre değerlendirir; güncel uygulamayı ilgili resmi makam ve başvuru merkezi kaynaklarından teyit etmenizi öneririz.',
    },
  },
  fransa: {
    slug: 'fransa',
    name: 'Fransa',
    dative: "Fransa'ya",
    locative: "Fransa'da",
    genitive: "Fransa'nın",
    applicationCities: ['İstanbul', 'Ankara', 'İzmir'],
    notes: [
      'Fransa başvurularında seyahat amacının belgelerle tutarlı biçimde ortaya konması önem taşır.',
      "Başvurular İstanbul, Ankara ve İzmir'deki yetkili başvuru merkezleri üzerinden alınır; bölgenize en uygun noktayı birlikte planlarız.",
      'Çok girişli (multiple entry) talepleriniz varsa seyahat geçmişiniz ve planınız buna göre kurgulanmalıdır.',
    ],
    countryFaq: {
      question: 'Fransa vizesi başvurusu için hangi başvuru merkezleri kullanılıyor?',
      answer:
        'Fransa başvuruları İstanbul, Ankara ve İzmir gibi illerdeki yetkili başvuru merkezleri aracılığıyla yapılmaktadır. Size uygun başvuru noktası ve güncel prosedür; ikamet yerinize ve başvuru türünüze göre değişebilir. Güncel bilgiyi ilgili resmi kaynaklardan teyit etmenizi öneririz.',
    },
  },
  hollanda: {
    slug: 'hollanda',
    name: 'Hollanda',
    dative: "Hollanda'ya",
    locative: "Hollanda'da",
    genitive: "Hollanda'nın",
    applicationCities: ['İstanbul', 'Ankara', 'İzmir'],
    notes: [
      'Hollanda başvurularında konaklama, seyahat planı ve finansal belgelerin birbiriyle uyumlu olması beklenir.',
      'Kısa süreli (Schengen) ve uzun süreli (MVV) başvurular farklı süreçlere tabidir; hangi yönde ilerlemeniz gerektiğini profilinize göre değerlendiririz.',
      'Başvurular yetkili başvuru merkezleri üzerinden alınır; size uygun başvuru noktasını birlikte belirleriz.',
    ],
    countryFaq: {
      question: 'Hollanda kısa süreli ve uzun süreli vize arasındaki fark nedir?',
      answer:
        'Turistik veya ticari kısa süreli ziyaretler genellikle Schengen vizesi kapsamındadır; çalışma, aile birleşimi veya öğrenim gibi uzun süreli amaçlar ise ayrı bir başvuru sürecine (MVV) tabi olabilir. Amacınıza uygun doğru yönü belirlememiz için ön değerlendirme yaparız; nihai değerlendirme ilgili resmi makamlara aittir.',
    },
  },
  yunanistan: {
    slug: 'yunanistan',
    name: 'Yunanistan',
    dative: "Yunanistan'a",
    locative: "Yunanistan'da",
    genitive: "Yunanistan'ın",
    applicationCities: ['İstanbul', 'İzmir', 'Ankara', 'Edirne'],
    notes: [
      "Türkiye'ye coğrafi yakınlığı nedeniyle Yunanistan, kısa süreli seyahatlerde sık tercih edilen ülkelerdendir.",
      'Ada ve kara sınırı seyahatlerinde planlanan giriş-çıkış noktaları ile konaklama bilgilerinin belgelerle tutarlı olması beklenir.',
      'Başvurular İstanbul, İzmir, Ankara ve Edirne gibi illerdeki yetkili noktalar üzerinden alınabilir; bölgenize uygun seçeneği birlikte planlarız.',
    ],
    countryFaq: {
      question: 'Yunanistan adaları için ayrı bir vize mi gerekiyor?',
      answer:
        'Yunanistan adaları da Schengen bölgesine dahildir ve genel olarak Schengen vizesi kapsamında değerlendirilir. Belirli dönemlerde uygulanabilen kısa süreli kolaylıklar değişkenlik gösterebildiğinden, güncel uygulamayı ilgili resmi makamlardan teyit etmenizi ve seyahat planınızı buna göre kurgulamanızı öneririz.',
    },
  },
  macaristan: {
    slug: 'macaristan',
    name: 'Macaristan',
    dative: "Macaristan'a",
    locative: "Macaristan'da",
    genitive: "Macaristan'ın",
    applicationCities: ['İstanbul', 'Ankara'],
    notes: [
      'Macaristan, Orta Avrupa seyahatlerinde ve Schengen bölgesine giriş planlarında tercih edilen ülkelerdendir.',
      "Başvurular genellikle İstanbul ve Ankara'daki yetkili noktalar üzerinden alınır; size uygun başvuru noktasını birlikte belirleriz.",
      "Seyahatinizin ağırlıklı olarak Macaristan'da geçeceğini gösteren tutarlı bir plan, başvuru dosyanızı güçlendirir.",
    ],
    countryFaq: {
      question: 'Macaristan vize başvurusu nereden yapılıyor?',
      answer:
        "Macaristan başvuruları genellikle İstanbul ve Ankara'daki yetkili başvuru noktaları üzerinden yürütülür. Uygun başvuru noktası ve güncel prosedür ikamet yerinize göre değişebilir; güncel bilgiyi resmi kaynaklardan teyit etmenizi öneririz.",
    },
  },
  danimarka: {
    slug: 'danimarka',
    name: 'Danimarka',
    dative: "Danimarka'ya",
    locative: "Danimarka'da",
    genitive: "Danimarka'nın",
    applicationCities: ['İstanbul', 'Ankara'],
    notes: [
      'Danimarka başvurularında seyahat amacının ve finansal durumun net biçimde belgelenmesi beklenir.',
      'Başvurular yetkili başvuru merkezleri üzerinden alınır; kısa ve uzun süreli başvurular farklı süreçlere tabi olabilir.',
      'İskandinav ülkelerine yönelik başvurularda konaklama ve davet belgelerinin tutarlılığı önem taşır.',
    ],
    countryFaq: {
      question: 'Danimarka vizesi başvurusu nasıl yürütülüyor?',
      answer:
        'Danimarka başvuruları yetkili başvuru merkezleri üzerinden alınır ve amaca göre kısa süreli (Schengen) veya uzun süreli süreçlere ayrılır. Size uygun süreci ön değerlendirmeyle belirleriz; güncel başvuru noktası ve prosedürleri ilgili resmi makamlardan teyit etmenizi öneririz.',
    },
  },
  avusturya: {
    slug: 'avusturya',
    name: 'Avusturya',
    dative: "Avusturya'ya",
    locative: "Avusturya'da",
    genitive: "Avusturya'nın",
    applicationCities: ['İstanbul', 'Ankara', 'İzmir'],
    notes: [
      'Avusturya; hem turistik hem de eğitim ve iş amaçlı seyahatlerde sık tercih edilen bir Schengen ülkesidir.',
      "Başvurular İstanbul, Ankara ve İzmir'deki yetkili noktalar üzerinden alınır; bölgenize uygun seçeneği birlikte planlarız.",
      'Seyahat planı, konaklama ve finansal belgelerin birbiriyle uyumlu olması dosyanızı güçlendirir.',
    ],
    countryFaq: {
      question: 'Avusturya vizesi için başvuru nereden yapılıyor?',
      answer:
        "Avusturya başvuruları genellikle İstanbul, Ankara ve İzmir'deki yetkili başvuru noktaları üzerinden yapılmaktadır. Uygun başvuru noktası ikamet yerinize göre değişebilir; güncel uygulamayı resmi kaynaklardan teyit etmenizi öneririz.",
    },
  },
  polonya: {
    slug: 'polonya',
    name: 'Polonya',
    dative: "Polonya'ya",
    locative: "Polonya'da",
    genitive: "Polonya'nın",
    applicationCities: ['İstanbul', 'Ankara'],
    notes: [
      'Polonya; öğrenim, çalışma ve turistik amaçlı seyahatlerde giderek daha fazla tercih edilen bir ülkedir.',
      "Başvurular İstanbul ve Ankara'daki yetkili noktalar üzerinden alınır; size uygun başvuru noktasını birlikte belirleriz.",
      'Uzun süreli (ulusal / D tipi) ve kısa süreli (Schengen) başvurular farklı süreçlere tabi olabilir; doğru yönü profilinize göre değerlendiririz.',
    ],
    countryFaq: {
      question: 'Polonya kısa süreli ve uzun süreli vize arasında nasıl bir fark var?',
      answer:
        'Turistik ve kısa süreli ziyaretler genellikle Schengen vizesi kapsamındayken; çalışma veya öğrenim gibi uzun süreli amaçlar ulusal (D tipi) vize sürecine tabi olabilir. Amacınıza uygun doğru süreci ön değerlendirmeyle belirleriz; nihai karar ilgili resmi makamlara aittir.',
    },
  },
};

/** Country <select> options for the landing lead form (value = slug). */
export const LANDING_COUNTRY_OPTIONS = Object.values(COUNTRY_PROFILES).map((c) => ({
  value: c.slug,
  label: c.name,
}));

export function getCountryProfile(slug: string): CountryProfile {
  const profile = COUNTRY_PROFILES[slug];
  if (!profile) throw new Error(`Unknown country profile: ${slug}`);
  return profile;
}
