import AdPlaceholder from '@/components/AdPlaceholder'

const services = [
  {
    id: 'turistik',
    title: 'Turistik Vize',
    description: 'Tatil ve gezi amaçlı vize başvurularınızda komple destek.',
    features: [
      'Evrak hazırlama ve kontrol',
      'Konsolosluk randevu alma',
      'Başvuru formu doldurma yardımı',
      'Seyahat sigortası desteği',
      'Otel rezervasyon desteği',
      'Uçak bileti rezervasyon yardımı'
    ],
    price: '₺2.500',
    duration: '15-30 gün'
  },
  {
    id: 'ticari',
    title: 'Ticari Vize',
    description: 'İş profesyonelleri için hızlı ticari vize hizmetleri.',
    features: [
      'Express işlem imkanı',
      'Davet mektubu hazırlama',
      'Konferans kayıt desteği',
      'Çok girişli vize başvurusu',
      'Öncelikli randevu alma',
      'Ticari evrak kontrolü'
    ],
    price: '₺3.500',
    duration: '7-15 gün'
  },
  {
    id: 'ogrenci',
    title: 'Öğrenci Vizesi',
    description: 'Yurtdışı eğitim için kapsamlı destek.',
    features: [
      'Üniversite başvuru yardımı',
      'Kabul mektubu kontrolü',
      'Mali evrak hazırlama',
      'Konaklama belgesi',
      'Burs danışmanlığı',
      'Yola çıkış öncesi oryantasyon'
    ],
    price: '₺3.000',
    duration: '20-40 gün'
  },
  {
    id: 'aile',
    title: 'Aile Birleşimi',
    description: 'Yurtdışındaki aile üyelerinizle birleşim.',
    features: [
      'İlişki belgelerinin hazırlanması',
      'Sponsor kontrolü',
      'Mali teminat hazırlama',
      'Resmi evrak tercümesi',
      'Konsolosluk görüşme hazırlığı',
      'Sonrası destek'
    ],
    price: '₺4.000',
    duration: '30-60 gün'
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
              İhtiyacınıza özel profesyonel vize danışmanlık hizmetleri. 
              Turistik vizeden aile birleşimine, her alanda yanınızdayız.
            </p>
          </div>
        </div>
      </section>

      <AdPlaceholder width="728px" height="90px" label="Reklam Alanı" />

      {/* Services Grid */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service) => (
              <div key={service.id} id={service.id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-semibold">{service.title}</h3>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{service.price}</div>
                    <div className="text-sm text-secondary">{service.duration}</div>
                  </div>
                </div>
                <p className="text-secondary mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className="btn btn-primary w-full mt-6">
                  Hemen Başla
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
            <p className="section-subtitle">4 adımda basit vize başvuru süreci</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: 1, title: 'Danışmanlık', description: 'Vize uygunluğunuzun ücretsiz değerlendirmesi' },
              { step: 2, title: 'Evrak Hazırlığı', description: 'Tüm gerekli evrakların hazırlanması ve kontrolü' },
              { step: 3, title: 'Başvuru', description: 'Başvurunun yapılması ve randevu alınması' },
              { step: 4, title: 'Takip', description: 'Vize onayına kadar sürecin takibi' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-secondary">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Vize Yolculuğunuza Başlamaya Hazır mısınız?</h2>
          <p className="text-xl mb-8 opacity-90">Deneyimli ekibimizden uzman yardımı alın</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/application" className="btn bg-white text-blue-600 hover:bg-gray-100">
              Başvuruya Başla
            </a>
            <a href="/contact" className="btn border-2 border-white text-white hover:bg-white/10">
              Bize Ulaşın
            </a>
          </div>
        </div>
      </section>
    </>
  )
}