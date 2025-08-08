'use client'

import { useState } from 'react'
import AdPlaceholder from '@/components/AdPlaceholder'
import VisaBanner728x90 from '@/components/ads/VisaBanner728x90'
import ConversionButton from '@/components/ConversionButton'
import { conversions } from '@/lib/conversions'

const blogPosts = [
  {
    id: 1,
    title: '2024 Schengen Vize Başvuru Rehberi',
    excerpt: 'Schengen vizesi başvurusu hakkında bilmeniz gereken her şey: evraklar, gereklilikler ve başarı ipuçları.',
    author: 'Ayşe Yılmaz',
    date: '2024-01-15',
    readTime: '8 dk okuma',
    category: 'Rehberler',
    image: '/blog/schengen-guide.jpg'
  },
  {
    id: 2,
    title: 'İngiltere Vize Mülakatı İpuçları',
    excerpt: 'İngiltere vize mülakatınıza bu kanıtlanmış ipuçları ve sık sorulan sorularla hazırlanın.',
    author: 'Mehmet Demir',
    date: '2024-01-10',
    readTime: '6 dk okuma',
    category: 'İpuçları',
    image: '/blog/uk-interview.jpg'
  },
  {
    id: 3,
    title: 'Dijital Göçebe Vizeleri: En İyi 10 Ülke',
    excerpt: 'Dijital göçebe vizesi sunan en iyi ülkeleri keşfedin ve dünyayı gezerken uzaktan çalışın.',
    author: 'Elif Kaya',
    date: '2024-01-05',
    readTime: '10 dk okuma',
    category: 'Trendler',
    image: '/blog/digital-nomad.jpg'
  },
  {
    id: 4,
    title: 'Yaygın Vize Red Nedenleri ve Nasıl Önlenir',
    excerpt: 'En yaygın vize red nedenlerini ve başvurunuzu nasıl güçlendireceğinizi öğrenin.',
    author: 'Ali Öztürk',
    date: '2023-12-28',
    readTime: '7 dk okuma',
    category: 'Rehberler',
    image: '/blog/rejection-reasons.jpg'
  },
  {
    id: 5,
    title: 'Almanya Öğrenci Vizesi Gereklilikleri',
    excerpt: 'Almanya\'da eğitim almak isteyen öğrenciler için vize gereklilikleri, maliyetler ve başvuru süreci.',
    author: 'Zeynep Aydın',
    date: '2023-12-20',
    readTime: '9 dk okuma',
    category: 'Eğitim',
    image: '/blog/germany-student.jpg'
  },
  {
    id: 6,
    title: 'Seyahat Sigortası: Vizeniz İçin Neden Önemli',
    excerpt: 'Vize başvurularında seyahat sigortasının önemi ve doğru poliçeyi nasıl seçeceğiniz.',
    author: 'Murat Can',
    date: '2023-12-15',
    readTime: '5 dk okuma',
    category: 'İpuçları',
    image: '/blog/travel-insurance.jpg'
  }
]

const categories = ['Tümü', 'Rehberler', 'İpuçları', 'Trendler', 'Eğitim', 'Haberler']

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('Tümü')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'Tümü' || post.category === selectedCategory
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleBlogClick = (title: string) => {
    conversions.trackBlogRead(title, 180) // 3 dakika ortalama okuma süresi
  }

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-16">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Vize Blog & Kaynaklar</h1>
            <p className="text-xl text-secondary">
              Uzman danışmanlarımızdan en güncel vize haberleri, başvuru ipuçları 
              ve ülkeye özel rehberlerle güncel kalın.
            </p>
          </div>
        </div>
      </section>

      {/* Ad Placeholder */}
      <AdPlaceholder width="728px" height="90px" label="Reklam Alanı">
  <VisaBanner728x90 href="/appointment" />
</AdPlaceholder>
      {/* Filter Section */}
      <section className="py-8 bg-white">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Makale ara..."
                className="form-input w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`btn ${selectedCategory === category ? 'btn-primary' : 'btn-outline'}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article 
                key={post.id} 
                className="card hover:shadow-xl transition-all cursor-pointer group"
                onClick={() => handleBlogClick(post.title)}
              >
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl mb-4 group-hover:scale-105 transition-transform"></div>
                <div className="flex items-center gap-4 text-sm text-secondary mb-3">
                  <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-medium">
                    {post.category}
                  </span>
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{post.title}</h3>
                <p className="text-secondary mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary">Yazan: {post.author}</span>
                  <ConversionButton
                    href={`/blog/${post.id}`}
                    conversionName="blog_read"
                    conversionValue={2}
                    location={`blog_list_${post.id}`}
                    className="text-primary hover:underline font-medium"
                  >
                    Devamını Oku →
                  </ConversionButton>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Bültenimize Abone Olun</h2>
            <p className="text-xl mb-8 opacity-90">
              Haftalık vize güncellemeleri, başvuru ipuçları ve özel teklifler alın
            </p>
            <form 
              className="flex gap-4"
              onSubmit={(e) => {
                e.preventDefault()
                const form = e.target as HTMLFormElement
                const email = (form.elements.namedItem('email') as HTMLInputElement).value
                conversions.trackNewsletterSignup(email)
                alert('Başarıyla abone oldunuz!')
              }}
            >
              <input
                type="email"
                name="email"
                placeholder="E-posta adresinizi girin"
                className="form-input flex-1 text-gray-900"
                required
              />
              <ConversionButton
                type="submit"
                conversionName="newsletter_signup"
                conversionValue={5}
                location="blog_page_footer"
                className="btn bg-white text-blue-600 hover:bg-gray-100"
              >
                Abone Ol
              </ConversionButton>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}