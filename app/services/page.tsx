import AdPlaceholder from '@/components/AdPlaceholder'

const services = [
  {
    id: 'aile-arkadas-ziyareti',
    title: 'Aile/Arkadaş Ziyareti',
    description: 'Yurtdışında yaşayan aile üyelerinizi ve arkadaşlarınızı ziyaret için vize başvurusu.',
    features: [
      'Davet mektubu hazırlama',
      'Akrabalık belgelerinin düzenlenmesi',
      'Mali durum belgelerinin kontrolü',
      'Seyahat planı hazırlama',
      'Konsolosluk randevu alma',
      'Başvuru takibi'
    ],
    duration: '10-15 gün'
  },
  {
    id: 'turistik',
    title: 'Turistik',
    description: 'Tatil ve gezi amaçlı seyahatleriniz için turistik vize başvurusu.',
    features: [
      'Otel rezervasyon desteği',
      'Uçak bileti rezervasyonu',
      'Seyahat sigortası düzenleme',
      'Tur programı hazırlama',
      'Evrak hazırlama ve kontrol',
      'Express işlem imkanı'
    ],
    duration: '15-20 gün'
  },
  {
    id: 'ticari-is-seyahati',
    title: 'Ticari / İş Seyahati',
    description: 'İş görüşmeleri, toplantı ve ticari faaliyetler için iş vizesi.',
    features: [
      'Şirket davet mektubu',
      'Ticari evrakların hazırlanması',
      'Toplantı programı düzenleme',
      'Çok girişli vize başvurusu',
      'Hızlı işlem garantisi',
      'VIP randevu hizmeti'
    ],
    duration: '7-15 gün'
  },
  {
    id: 'fuar-katilimi',
    title: 'Fuar Katılımı',
    description: 'Uluslararası fuarlara katılım için özel vize başvuru hizmeti.',
    features: [
      'Fuar kayıt belgelerinin kontrolü',
      'Stant rezervasyon belgeleri',
      'Ticaret odası evrakları',
      'Sektörel danışmanlık',
      'Grup başvuru indirimleri',
      'Fuar sonrası destek'
    ],
    duration: '10-20 gün'
  },
  {
    id: 'kulturel-sportif-kongre',
    title: 'Kültürel/Sportif/Kongre/Etkinlik',
    description: 'Spor müsabakaları, kongreler ve kültürel etkinlikler için vize.',
    features: [
      'Etkinlik davet mektupları',
      'Katılım belgelerinin düzenlenmesi',
      'Konaklama rezervasyonları',
      'Grup organizasyon desteği',
      'Özel etkinlik vizesi',
      'Acil başvuru imkanı'
    ],
    duration: '5-15 gün'
  },
  {
    id: 'ogrenci-gezileri',
    title: 'Öğrenci Gezileri',
    description: 'Okul grupları ve öğrenci organizasyonları için toplu vize başvurusu.',
    features: [
      'Toplu başvuru indirimleri',
      'Okul onay belgelerinin hazırlanması',
      'Veli izin formları',
      'Grup lideri ataması',
      'Öğrenci sigortası desteği',
      'Eğitim tur programı'
    ],
    duration: '15-25 gün'
  },
  {
    id: 'tir-soforu',
    title: 'Tır Şoförü',
    description: 'Uluslararası nakliye şoförleri için çalışma ve geçiş vizesi.',
    features: [
      'Nakliye şirketi evrakları',
      'Güzergah belgelerinin düzenlenmesi',
      'Çoklu geçiş vizesi',
      'Şoför belgelerinin kontrolü',
      'Araç ruhsat işlemleri',
      'Kargo manifest desteği'
    ],
    duration: '10-20 gün'
  },
  {
    id: 'transit-gecis',
    title: 'Transit Geçiş',
    description: 'Başka ülkelere geçiş için transit vize başvuru hizmeti.',
    features: [
      'Transit güzergah planlaması',
      'Bağlantı uçuşu rezervasyonları',
      'Kısa süreli konaklama',
      'Havaalanı transit vizesi',
      'Express işlem',
      '24 saat hızlı çözüm'
    ],
    duration: '3-7 gün'
  },
  {
    id: 'aile-birlestirici',
    title: 'Aile Birleşimi',
    description: 'Yurtdışında yaşayan aile üyeleriyle birleşim için uzun süreli vize.',
    features: [
      'Aile bağı belgelerinin düzenlenmesi',
      'DNA testi koordinasyonu',
      'Mali sponsorluk belgeleri',
      'Dil yeterlilik desteği',
      'Entegrasyon programı bilgilendirmesi',
      'Uzun vadeli destek'
    ],
    duration: '30-90 gün'
  },
  {
    id: 'is-arama',
    title: 'İş Arama',
    description: 'Yurtdışında iş arama imkanı sunan özel vize kategorisi.',
    features: [
      'İş arama vizesi danışmanlığı',
      'CV hazırlama desteği',
      'İş başvuru rehberliği',
      'Dil kursları bilgilendirmesi',
      'Mesleki tanınma süreçleri',
      'İş bulma sonrası destek'
    ],
    duration: '20-40 gün'
  },
  {
    id: 'mavi-kart',
    title: 'Mavi Kart',
    description: 'Almanya Mavi Kart başvurusu ve uzman işçi vizesi hizmetleri.',
    features: [
      'Diploma denklik işlemleri',
      'Mesleki yeterlilik belgesi',
      'İş sözleşmesi kontrolü',
      'Mavi Kart şartları danışmanlığı',
      'Aile birleşimi planlaması',
      'Yerleşim öncesi destek'
    ],
    duration: '30-60 gün'
  },
  {
    id: 'calisma-is-kurma',
    title: 'Çalışma/İş Kurma',
    description: 'Yurtdışında çalışma ve iş kurma amacıyla vize başvuru hizmetleri.',
    features: [
      'İş kurma vizesi danışmanlığı',
      'Yatırım planı hazırlama',
      'İş planı düzenleme',
      'Sermaye transfer işlemleri',
      'Hukuki danışmanlık',
      'Girişimci vizesi desteği'
    ],
    duration: '45-90 gün'
  },
  {
    id: 'erasmus-staj-ogrenim',
    title: 'Erasmus/Staj/Öğrenim',
    description: 'Erasmus, staj programları ve kısa süreli eğitim vizesi.',
    features: [
      'Erasmus+ program desteği',
      'Staj kabul mektubu kontrolü',
      'Eğitim kurumu kayıt belgesi',
      'Burs belgelerinin düzenlenmesi',
      'Konaklama rezervasyonu',
      'Öğrenci sigortası'
    ],
    duration: '15-30 gün'
  },
  {
    id: 'universite-yuksek-okul',
    title: 'Üniversite/Yüksek Okul',
    description: 'Lisans, yüksek lisans ve doktora eğitimi için öğrenci vizesi.',
    features: [
      'Üniversite kabul mektubu kontrolü',
      'Akademik geçmiş belgeleri',
      'Mali yeterlilik kanıtlama',
      'Dil yeterlilik sınavları',
      'Konaklama çözümleri',
      'Eğitim danışmanlığı'
    ],
    duration: '30-60 gün'
  },
  {
    id: 'dil-kursu',
    title: 'Dil Kursu',
    description: 'Yurtdışında dil eğitimi almak için özel öğrenci vizesi.',
    features: [
      'Dil okulu kayıt işlemleri',
      'Kurs seviye testleri',
      'Kısa/uzun süreli program seçenekleri',
      'Konaklama alternatifleri',
      'Öğrenci indirim kartları',
      'Sosyal aktivite programları'
    ],
    duration: '15-25 gün'
  },
  {
    id: 'ulkeye-geri-donus',
    title: 'Ülkeye Geri Dönüş',
    description: 'Vatandaşlığını kaybetmiş kişilerin geri dönüş vizesi işlemleri.',
    features: [
      'Vatandaşlık kaybı belgelerinin incelenmesi',
      'Geri dönüş hakkı araştırması',
      'Hukuki süreç danışmanlığı',
      'Aile durumu değerlendirmesi',
      'Yerleşim planlaması',
      'Sosyal entegrasyon desteği'
    ],
    duration: '60-120 gün'
  },
  {
    id: 'vatandaslik-haklari',
    title: 'Vatandaşlık Hakları',
    description: 'Vatandaşlık hakkı olan kişiler için özel vize ve belge düzenleme.',
    features: [
      'Vatandaşlık hakkı araştırması',
      'Soy belgelerinin düzenlenmesi',
      'Hukuki süreç yönetimi',
      'Belge apostil işlemleri',
      'Tercüme hizmetleri',
      'Süreç takip sistemi'
    ],
    duration: '90-180 gün'
  },
  {
    id: 'diger-konsolosluk-islemleri',
    title: 'Diğer Konsolosluk İşlemleri',
    description: 'Konsolosluklarda yapılan diğer özel işlemler ve belgeler.',
    features: [
      'Belge tasdik işlemleri',
      'Apostil hizmetleri',
      'Tercüme ve noter onayı',
      'Özel durum değerlendirmesi',
      'Konsolosluk randevu alımı',
      'Kapsamlı danışmanlık'
    ],
    duration: '5-30 gün'
  }
]

export default function ServicesPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-16">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Hizmetlerimiz</h1>
            <p className="text-xl text-secondary">
              Her türlü vize ihtiyacınız için profesyonel danışmanlık hizmetleri. 
              18 farklı kategoride uzman ekibimizle yanınızdayız.
            </p>
          </div>
        </div>
      </section>

      <AdPlaceholder width="728px" height="90px" label="Reklam Alanı" />

      {/* Services Grid */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.id} id={service.id} className="card h-full flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold">{service.title}</h3>
                  <div className="text-right">
                    <div className="text-sm text-secondary">{service.duration}</div>
                    <div className="text-xs text-gray-500">İşlem Süresi</div>
                  </div>
                </div>
                <p className="text-secondary mb-6 flex-grow">{service.description}</p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1 text-sm">✓</span>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className="btn btn-primary w-full mt-auto">
                  {service.title} Başvurusu
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="section-title">Başvuru Sürecimiz</h2>
            <p className="section-subtitle">4 adımda basit ve güvenilir vize başvuru süreci</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: 1, title: 'Danışmanlık', description: 'Vize türü ve gerekliliklerinin belirlenmesi' },
              { step: 2, title: 'Evrak Hazırlığı', description: 'Tüm gerekli evrakların hazırlanması ve kontrolü' },
              { step: 3, title: 'Başvuru', description: 'Başvurunun yapılması ve randevu alınması' },
              { step: 4, title: 'Takip', description: 'Vize onayına kadar sürecin takibi ve bilgilendirme' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-400 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-xl font-bold shadow-lg">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2 text-lg">{item.title}</h3>
                <p className="text-sm text-secondary">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="section-title">Neden Vize Global?</h2>
            <p className="section-subtitle">18 farklı vize kategorisinde uzman hizmet</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold mb-2">%98 Başarı Oranı</h3>
              <p className="text-sm text-secondary">Tüm vize kategorilerinde yüksek başarı oranı</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold mb-2">Hızlı İşlem</h3>
              <p className="text-sm text-secondary">Express başvuru ve acil durum çözümleri</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="font-semibold mb-2">Kapsamlı Hizmet</h3>
              <p className="text-sm text-secondary">18 farklı vize kategorisinde uzman danışmanlık</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-orange-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="font-semibold mb-2">15+ Yıl Deneyim</h3>
              <p className="text-sm text-secondary">Binlerce başarılı vize başvurusu deneyimi</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Hangi Vize Türü İçin Yardıma İhtiyacınız Var?</h2>
          <p className="text-xl mb-8 opacity-90">Uzman danışmanlarımızdan ücretsiz ön değerlendirme alın</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/application" className="btn bg-white text-blue-600 hover:bg-gray-100 btn-lg">
              Başvuruya Başla
            </a>
            <a href="/contact" className="btn border-2 border-white text-white hover:bg-white/10 btn-lg">
              Ücretsiz Danışmanlık
            </a>
          </div>
        </div>
      </section>
    </>
  )
}