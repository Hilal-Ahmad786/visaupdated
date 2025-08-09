import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'  // This imports the global CSS
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import GoogleAnalytics from '@/components/GoogleAnalytics'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Global Visa - Professional Visa Consultancy',
  description: 'Expert visa consultancy services for Schengen, USA, UK, and more. 98% success rate with 15+ years of experience.',
  keywords: 'visa consultancy, schengen visa, immigration services, visa application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GoogleAnalytics />
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        {/* human signals cookie */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
              function ok(){
                try{ document.cookie = 'human=1; Max-Age=604800; Path=/'; }catch(e){}
                removeEventListener('pointerdown',ok);
                removeEventListener('keydown',ok);
                removeEventListener('scroll',ok);
              }
              addEventListener('pointerdown',ok,{once:true});
              addEventListener('keydown',ok,{once:true});
              addEventListener('scroll',ok,{once:true});
            })();`,
          }}
        />
      </body>
    </html>
  )
}