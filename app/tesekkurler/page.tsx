// app/tesekkurler/page.tsx
export const metadata = {
    title: 'Teşekkürler | Global Vize',
    description: 'Başvurunuz başarıyla alındı. En kısa sürede sizinle iletişime geçeceğiz.',
  }
  
  export default function TesekkurlerPage() {
    return (
      <>
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-50 to-white py-16">
          <div className="container">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Teşekkürler!</h1>
              <p className="text-xl text-secondary">
                Vize ön başvurunuz başarıyla alınmıştır. En kısa sürede sizinle iletişime geçeceğiz.
              </p>
            </div>
          </div>
        </section>
  
        {/* Card */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-xl mx-auto">
              <div className="card text-center p-8">
                <h2 className="text-2xl font-semibold mb-3 text-primary">Başvurunuz Alındı</h2>
                <p className="text-secondary mb-6">
                  Danışmanlarımız başvurunuzu inceleyip kısa süre içinde sizinle iletişime geçecek.
                </p>
  
                <a href="/" className="btn btn-primary">
                  Ana Sayfaya Dön
                </a>
              </div>
            </div>
          </div>
        </section>
      </>
    )
  }
  