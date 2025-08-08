import Link from 'next/link'
import WhatsAppButton from './WhatsAppButton'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Visa Global</h3>
            <p className="text-gray-400">
              15+ yıllık deneyimimiz ve %98 başarı oranımızla profesyonel vize danışmanlık hizmetleri.
            </p>
            <div className="mt-4">
              <WhatsAppButton
                phone="905551234567"
                message="Merhaba, vize danışmanlığı hakkında bilgi almak istiyorum"
                text="WhatsApp'tan Yazın"
                className="btn btn-whatsapp text-sm"
              />
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Hızlı Linkler</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/services" className="hover:text-white transition-colors">Hizmetlerimiz</Link></li>
              <li><Link href="/countries" className="hover:text-white transition-colors">Ülkeler</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">Sıkça Sorulan Sorular</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Hizmetlerimiz</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/services#turistik" className="hover:text-white transition-colors">Turistik Vize</Link></li>
              <li><Link href="/services#ticari" className="hover:text-white transition-colors">Ticari Vize</Link></li>
              <li><Link href="/services#ogrenci" className="hover:text-white transition-colors">Öğrenci Vizesi</Link></li>
              <li><Link href="/services#aile" className="hover:text-white transition-colors">Aile Birleşimi</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">İletişim</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Yenimahalle / Ankara</li>
              <li>
                <a href="tel:08502411527" className="hover:text-white transition-colors">
                0850 241 15 27
                </a>
              </li>
              <li>
                <a href="mailto:tvsvisaglobal@gmail.com" className="hover:text-white transition-colors">
                  tvsvisaglobal@gmail.com
                </a>
              </li>
              <li>Pzt-Cmt: 09:00 - 18:00</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Vize Global. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  )
}