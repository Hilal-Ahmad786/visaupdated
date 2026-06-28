import type { FaqCategory, FaqItem } from '@/types/content';

export const faqCategories: FaqCategory[] = [
  { slug: 'genel', title: 'Genel', description: 'VİS VİZE hizmetleri hakkında temel sorular' },
  { slug: 'schengen', title: 'Schengen', description: 'Schengen vize süreci' },
  { slug: 'belgeler', title: 'Belgeler', description: 'Başvuru evrakları' },
  { slug: 'randevu', title: 'Randevu', description: 'Randevu süreci ve takvimi' },
  { slug: 'ucretler', title: 'Ücretler', description: 'Hizmet ve başvuru ücretleri' },
  { slug: 'takip', title: 'Başvuru Takibi', description: 'Başvuru durumu' },
  { slug: 'ret', title: 'Ret Durumları', description: 'Reddedilen başvurular' },
  { slug: 'veri-gizliligi', title: 'Veri Gizliliği', description: 'KVKK ve kişisel veriler' },
];

export const faqs: FaqItem[] = [
  {
    slug: 'vis-vize-ne-yapar',
    question: 'VİS VİZE tam olarak hangi hizmeti veriyor?',
    answer:
      'VİS VİZE; başvuru türünüze uygun yol haritası çıkarma, evrak hazırlama ve kontrol, randevu organizasyonu ve süreç takibi konularında danışmanlık ve destek hizmeti sunar. Başvuru kararı ve onayı ilgili resmi makamlara aittir.',
    category: 'genel',
    status: 'published',
  },
  {
    slug: 'vize-onayi-garanti-mi',
    question: 'Vize onayını garanti ediyor musunuz?',
    answer:
      'Hayır. Hiçbir danışmanlık firması vize onayını, randevuyu veya işlem süresini garanti edemez. Nihai karar konsolosluk ve ilgili resmi makamlar tarafından verilir. Biz başvurunuzu en doğru ve eksiksiz şekilde hazırlamanıza yardımcı oluruz.',
    category: 'genel',
    status: 'published',
  },
  {
    slug: 'resmi-kurum-musunuz',
    question: 'VİS VİZE resmi bir kurum mu?',
    answer:
      'VİS VİZE resmi bir konsolosluk, büyükelçilik, vize başvuru merkezi veya devlet kurumu değildir. Bağımsız bir danışmanlık ve destek hizmeti sağlayıcısıdır.',
    category: 'genel',
    status: 'published',
  },
  {
    slug: 'schengen-nedir',
    question: 'Schengen vizesi nedir ve hangi ülkeleri kapsar?',
    answer:
      'Schengen vizesi, Schengen bölgesindeki ülkelere kısa süreli (genellikle 90 güne kadar) seyahat imkânı sağlayan ortak bir vizedir. Almanya, Fransa, İtalya, İspanya, Hollanda gibi birçok Avrupa ülkesini kapsar.',
    category: 'schengen',
    status: 'published',
    relatedCountrySlugs: ['almanya', 'fransa', 'italya'],
  },
  {
    slug: 'schengen-hangi-ulkeye-basvurmaliyim',
    question: 'Schengen için hangi ülkeye başvurmalıyım?',
    answer:
      'Genel kural olarak ana varış ülkenize ya da en uzun süre kalacağınız ülkeye başvurursunuz. Eşit süreli kalışlarda ilk giriş yapacağınız ülke esas alınır. Doğru ülkeyi birlikte belirleyebiliriz.',
    category: 'schengen',
    status: 'published',
  },
  {
    slug: 'hangi-belgeler-gerekli',
    question: 'Başvuru için hangi belgeler gerekli?',
    answer:
      'Belgeler ülkeye, vize türüne ve başvuran profiline (çalışan, işveren, emekli, öğrenci, serbest meslek) göre değişir. Genel olarak pasaport, biyometrik fotoğraf, seyahat sağlık sigortası, gelir ve konaklama belgeleri istenir. Profilinize özel listeyi hazırlıyoruz.',
    category: 'belgeler',
    status: 'published',
    relatedServiceSlugs: ['evrak-kontrolu'],
  },
  {
    slug: 'sigorta-zorunlu-mu',
    question: 'Seyahat sağlık sigortası zorunlu mu?',
    answer:
      'Schengen başvuruları için minimum 30.000 Euro teminatlı, tüm Schengen bölgesinde geçerli bir seyahat sağlık sigortası genellikle zorunludur. Diğer ülkelerde koşullar değişebilir.',
    category: 'belgeler',
    status: 'published',
  },
  {
    slug: 'randevu-ne-kadar-surede',
    question: 'Randevu ne kadar sürede alınır?',
    answer:
      'Randevu yoğunluğu ülkeye, sezona ve başvuru merkezinin müsaitliğine göre değişir. Uygunluk tamamen ilgili resmi başvuru merkezine bağlıdır; tarih garantisi verilemez. Süreci sizin adınıza takip ederiz.',
    category: 'randevu',
    status: 'published',
  },
  {
    slug: 'hizmet-ucreti-nedir',
    question: 'Hizmet ücretiniz nedir?',
    answer:
      'Hizmet ücreti; talep edilen destek kapsamına, ülkeye ve başvuru türüne göre belirlenir. Resmi vize harçları ve başvuru merkezi ücretleri hizmet ücretinden ayrıdır. Ön değerlendirme sonrası size net bilgi veririz.',
    category: 'ucretler',
    status: 'published',
  },
  {
    slug: 'basvuru-takibi',
    question: 'Başvurumun durumunu nasıl takip ederim?',
    answer:
      'Başvuru merkezleri genellikle bir referans/takip numarası ile online durum sorgulama sağlar. Süreç boyunca güncellemeleri sizinle paylaşır ve gerekli adımlarda yönlendiririz.',
    category: 'takip',
    status: 'published',
  },
  {
    slug: 'vize-reddi-ne-yapmaliyim',
    question: 'Vizem reddedildi, ne yapmalıyım?',
    answer:
      'Ret gerekçesini birlikte inceleriz. Eksik veya yanlış değerlendirilen noktaları gidererek yeniden başvuru ya da itiraz seçeneklerini değerlendiririz. Her durum kendine özgüdür; garanti verilemez.',
    category: 'ret',
    status: 'published',
  },
  {
    slug: 'verilerim-guvende-mi',
    question: 'Kişisel verilerim güvende mi?',
    answer:
      'Paylaştığınız bilgiler yalnızca başvuru süreciniz kapsamında işlenir ve KVKK kapsamında korunur. Verileriniz onayınız olmadan üçüncü taraflarla pazarlama amacıyla paylaşılmaz.',
    category: 'veri-gizliligi',
    status: 'published',
  },
];
