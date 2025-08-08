'use client'

import { useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import AdPlaceholder from '@/components/AdPlaceholder'
import ConversionButton from '@/components/ConversionButton'
import { conversions } from '@/lib/conversions'

const faqCategories = [
  {
    category: 'Genel Sorular',
    questions: [
      {
        q: 'Vize Global hangi hizmetleri sunuyor?',
        a: 'Turistik vize, ticari vize, öğrenci vizesi ve aile birleşimi vizesi dahil olmak üzere dünya genelinde 50\'den fazla ülke için kapsamlı vize danışmanlık hizmetleri sunuyoruz. Hizmetlerimiz evrak hazırlama, başvuru dosyalama, randevu alma ve mülakat hazırlığını içerir.'
      },
      {
        q: 'Vize danışmanlık hizmetinizin ücreti nedir?',
        a: 'Hizmet ücretlerimiz vize türüne ve hedef ülkeye göre değişmektedir. Turistik vize hizmetleri ₺2.500\'den, ticari vizeler ₺3.500\'den ve öğrenci vizeleri ₺3.000\'den başlamaktadır. Ücretler profesyonel danışmanlık, evrak kontrolü ve başvuru yardımını kapsar.'
      },
      {
        q: 'Başarı oranınız nedir?',
        a: 'Tüm vize türlerinde genel olarak %98 başarı oranı sağlıyoruz. Başarı oranları ülkeye göre değişir: Schengen ülkeleri (%93-96), İngiltere (%92), Avustralya (%87). Yüksek başarı oranımız kapsamlı hazırlığımız ve uzman rehberliğimizden kaynaklanmaktadır.'
      }
    ]
  },
  {
    category: 'Başvuru Süreci',
    questions: [
      {
        q: 'Vize başvuru süreci ne kadar sürer?',
        a: 'İşlem süreleri ülke ve vize türüne göre değişir. Schengen vizeleri genellikle 15-20 gün, İngiltere vizeleri 15-25 gün, Avustralya vizeleri 20-30 gün sürer. Planlanan seyahat tarihinden en az 2-3 ay önce başvurmanızı öneririz.'
      },
      {
        q: 'Vize başvurusu için hangi evraklar gerekli?',
        a: 'Genel gereklilikler: geçerli pasaport, doldurulmuş başvuru formu, pasaport fotoğrafları, seyahat sigortası, konaklama belgesi, uçak rezervasyonu, banka ekstresi, iş yazısı ve davet mektubu (varsa). Özel gereklilikler ülke ve vize türüne göre değişir.'
      },
      {
        q: 'Vize onayını garanti ediyor musunuz?',
        a: 'Vize onayını garanti edemeyiz (nihai karar konsolosluk/büyükelçiliğe aittir), ancak %98 başarı oranımız güçlü başvurular hazırlama konusundaki uzmanlığımızı yansıtır. Tüm gerekliliklerin karşılandığından ve evrakların düzgün hazırlandığından emin oluruz.'
      }
    ]
  },
  {
    category: 'Ödeme ve İadeler',
    questions: [
      {
        q: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
        a: 'Kredi/banka kartı, havale ve ofisimizde nakit ödeme dahil çeşitli ödeme yöntemlerini kabul ediyoruz. Belirli hizmetler için ödeme planları mevcuttur. Konsolosluk ücretleri ayrıca ve doğrudan ilgili konsolosluğa ödenir.'
      },
      {
        q: 'Vizem reddedilirse iade politikanız nedir?',
        a: 'Hizmet ücretimiz, vize sonucundan bağımsız olarak sağlanan danışmanlık ve başvuru yardımı içindir. Ancak, bizim hatamızdan dolayı vizeniz reddedilirse ücretsiz yeniden başvuru hizmeti sunuyoruz. Konsolosluk ücretleri iade edilmez.'
      },
      {
        q: 'Gizli ücretler var mı?',
        a: 'Hayır, fiyatlandırmamızda tam şeffaflık sağlıyoruz. Belirtilen ücretimiz tüm hizmetlerimizi kapsar. Konsolosluk ücretleri, tercüme masrafları, kargo ücretleri ve seyahat sigortası ayrı masraflar olarak açıkça belirtilir.'
      }
    ]
  },
  {
    category: 'Özel Durumlar',
    questions: [
      {
        q: 'Acil vize başvurularında yardımcı olabiliyor musunuz?',
        a: 'Evet, acil seyahat ihtiyaçları için express hizmetler sunuyoruz. Evrak hazırlığını hızlandırabilir ve mümkün olan yerlerde öncelikli randevular alabiliyoruz. Ek express hizmet ücretleri uygulanır ve işlem süreleri konsolosluk politikalarına bağlıdır.'
      },
      {
        q: 'Daha önce vize reddim var. Yine de yardımcı olabilir misiniz?',
        a: 'Kesinlikle. Önceden reddedilmiş vakalarda uzmanız. Red nedenlerini analiz eder, endişeleri giderir ve daha güçlü bir başvuru hazırlarız. Red sonrası yeniden başvurularda başarı oranımız %85\'in üzerindedir.'
      },
      {
        q: 'Grup vize başvuruları için hizmet veriyor musunuz?',
        a: 'Evet, aileler, iş heyetleri, tur grupları ve eğitim gezileri için grup başvuruları yapıyoruz. 5 veya daha fazla kişilik gruplar için özel indirimler sunuyoruz ve koordineli randevu planlaması sağlıyoruz.'
      }
    ]
  }
]

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  const toggleItem = (item: string) => {
    setOpenItems(prev =>
      prev.includes(item)
        ? prev.filter(i => i !== item)
        : [...prev, item]
    )
    conversions.track('faq_view', {
      customParams: { question: item }
    })
  }

  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
           q.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Sıkça Sorulan Sorular</h1>
            <p className="text-xl text-secondary mb-8">
              Vize hizmetlerimiz ve başvuru süreci hakkında sık sorulan soruların cevapları
            </p>
            <div className="max-w-xl mx-auto">
              <input
                type="text"
                placeholder="Soruları ara..."
                className="form-input w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Ad Placeholder */}
      <AdPlaceholder width="728px" height="90px" label="Reklam Alanı" />

      {/* FAQ Accordion */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            {filteredFAQs.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">{category.category}</h2>
                <div className="space-y-4">
                  {category.questions.map((item, index) => {
                    const itemKey = `${categoryIndex}-${index}`
                    const isOpen = openItems.includes(itemKey)
                    
                    return (
                      <div key={index} className="card">
                        <button
                          className="w-full flex items-center justify-between text-left"
                          onClick={() => toggleItem(itemKey)}
                        >
                          <h3 className="font-medium pr-4">{item.q}</h3>
                          <ChevronDownIcon 
                            className={`h-5 w-5 text-secondary transition-transform ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        {isOpen && (
                          <div className="mt-4 pt-4 border-t">
                            <p className="text-secondary">{item.a}</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-white">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Hala Sorularınız mı Var?</h2>
            <p className="text-xl text-secondary mb-8">
              Uzman danışmanlarımız vize yolculuğunuzda size yardımcı olmak için burada
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ConversionButton
                href="/contact"
                conversionName="faq_contact"
                conversionValue={10}
                location="faq_bottom"
                className="btn btn-primary"
              >
                Bize Ulaşın
              </ConversionButton>
              <ConversionButton
                href="/application"
                conversionName="faq_apply"
                conversionValue={25}
                location="faq_bottom"
                className="btn btn-outline"
              >
                Başvuruya Başla
              </ConversionButton>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}