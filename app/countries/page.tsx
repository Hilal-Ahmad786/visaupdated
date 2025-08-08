'use client'

import { useState } from 'react'
import AdPlaceholder from '@/components/AdPlaceholder'
import VisaBanner728x90 from '@/components/ads/VisaBanner728x90'
import ConversionButton from '@/components/ConversionButton'
import { conversions } from '@/lib/conversions'

const countries = [
  {
    region: 'Schengen Bölgesi',
    countries: [
      { name: 'Almanya', flag: '🇩🇪', successRate: 95, processingTime: '15-20 gün', requirements: 'Banka ekstresi, Seyahat sigortası, Otel rezervasyonu' },
      { name: 'Fransa', flag: '🇫🇷', successRate: 93, processingTime: '10-15 gün', requirements: 'Davet mektubu, Mali durum belgesi, Dönüş bileti' },
      { name: 'İtalya', flag: '🇮🇹', successRate: 96, processingTime: '12-18 gün', requirements: 'Konaklama belgesi, Seyahat planı, Sigorta' },
      { name: 'İspanya', flag: '🇪🇸', successRate: 94, processingTime: '15-20 gün', requirements: 'Otel rezervasyonu, Banka ekstresi, Seyahat planı' },
      { name: 'Hollanda', flag: '🇳🇱', successRate: 92, processingTime: '15-20 gün', requirements: 'Sponsor mektubu, Konaklama, Sigorta' },
      { name: 'Belçika', flag: '🇧🇪', successRate: 91, processingTime: '10-15 gün', requirements: 'Seyahat amacı belgesi, Mali yeterlilik, Sigorta' },
      { name: 'Avusturya', flag: '🇦🇹', successRate: 93, processingTime: '10-15 gün', requirements: 'Otel rezervasyonu, Mali belgeler, Seyahat sigortası' },
      { name: 'Portekiz', flag: '🇵🇹', successRate: 92, processingTime: '15-20 gün', requirements: 'Konaklama belgesi, Banka ekstresi, Sigorta' },
      { name: 'Yunanistan', flag: '🇬🇷', successRate: 90, processingTime: '10-15 gün', requirements: 'Otel rezervasyonu, Mali durum, Seyahat sigortası' },
    ]
  },
  {
    region: 'Diğer Avrupa',
    countries: [
      { name: 'İngiltere', flag: '🇬🇧', successRate: 92, processingTime: '15-25 gün', requirements: 'Online başvuru, Biyometrik, Mali belgeler' },
      { name: 'İrlanda', flag: '🇮🇪', successRate: 90, processingTime: '20-25 gün', requirements: 'AVATS başvurusu, Seyahat sigortası, Konaklama' },
      { name: 'İsviçre', flag: '🇨🇭', successRate: 94, processingTime: '10-15 gün', requirements: 'Mali yeterlilik, Konaklama, Seyahat sigortası' },
      { name: 'Norveç', flag: '🇳🇴', successRate: 91, processingTime: '15-20 gün', requirements: 'Davet mektubu, Banka ekstresi, Sigorta' },
      { name: 'İsveç', flag: '🇸🇪', successRate: 92, processingTime: '15-20 gün', requirements: 'Konaklama belgesi, Mali durum, Sigorta' },
    ]
  },
  {
    region: 'Diğer Ülkeler',
    countries: [
      { name: 'Avustralya', flag: '🇦🇺', successRate: 87, processingTime: '20-30 gün', requirements: 'ETA/eVisitor, Sağlık sigortası, Mali yeterlilik' },
      { name: 'Hindistan', flag: '🇮🇳', successRate: 89, processingTime: '5-10 gün', requirements: 'e-Visa başvurusu, Pasaport kopyası, Fotoğraf' },
      { name: 'İsrail', flag: '🇮🇱', successRate: 88, processingTime: '10-15 gün', requirements: 'Davet mektubu, Mali belgeler, Seyahat planı' },
    ]
  }
]

export default function CountriesPage() {
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCountries = countries
    .filter(region => selectedRegion === 'all' || region.region === selectedRegion)
    .map(region => ({
      ...region,
      countries: region.countries.filter(country =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }))
    .filter(region => region.countries.length > 0)

  const handleCountryClick = (countryName: string) => {
    conversions.trackCountrySelect(countryName)
  }

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-16">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Vize Ülkeleri</h1>
            <p className="text-xl text-secondary">
              Dünya genelinde 50+ ülke için yüksek başarı oranları ve 
              her destinasyon için uzman rehberliği ile vize hizmetleri sunuyoruz.
            </p>
          </div>
        </div>
      </section>

      <AdPlaceholder width="728px" height="90px" label="Reklam Alanı">
  <VisaBanner728x90 href="/appointment" />
</AdPlaceholder>
      {/* Filter Section */}
      <section className="py-8 bg-white sticky top-16 z-40 shadow-sm">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Ülke ara..."
                className="form-input w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedRegion('all')}
                className={`btn ${selectedRegion === 'all' ? 'btn-primary' : 'btn-outline'}`}
              >
                Tüm Bölgeler
              </button>
              {countries.map(region => (
                <button
                  key={region.region}
                  onClick={() => setSelectedRegion(region.region)}
                  className={`btn ${selectedRegion === region.region ? 'btn-primary' : 'btn-outline'}`}
                >
                  {region.region}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Countries Grid */}
      <section className="py-16">
        <div className="container">
          {filteredCountries.map((region) => (
            <div key={region.region} className="mb-12">
              <h2 className="text-2xl font-bold mb-6">{region.region}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {region.countries.map((country) => (
                  <div 
                    key={country.name} 
                    className="card hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleCountryClick(country.name)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="text-3xl mb-2">{country.flag}</div>
                        <h3 className="text-xl font-semibold">{country.name}</h3>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">%{country.successRate}</div>
                        <div className="text-xs text-secondary">Başarı Oranı</div>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-secondary">İşlem Süresi:</span>
                        <span className="font-medium">{country.processingTime}</span>
                      </div>
                      <div>
                        <span className="text-secondary">Temel Gereklilikler:</span>
                        <p className="text-xs mt-1">{country.requirements}</p>
                      </div>
                    </div>
                    <ConversionButton
                      href={`/application?country=${country.name.toLowerCase()}`}
                      conversionName="country_apply"
                      conversionValue={15}
                      location={`countries_${country.name.toLowerCase()}`}
                      className="btn btn-primary w-full mt-4"
                    >
                      {country.name} Vizesi İçin Başvur
                    </ConversionButton>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="section-title">Global Erişimimiz</h2>
            <p className="section-subtitle">Dünya çapında olağanüstü sonuçlarla müşterilerimize hizmet veriyoruz</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-secondary">Ülke</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">15.000+</div>
              <div className="text-secondary">İşlem Yapılan Vize</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">%92</div>
              <div className="text-secondary">Ortalama Başarı Oranı</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">7/24</div>
              <div className="text-secondary">Destek</div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}