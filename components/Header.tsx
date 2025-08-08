'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import ConversionButton from './ConversionButton'

const navigation = [
  { name: 'Ana Sayfa', href: '/' },
  { name: 'Hizmetlerimiz', href: '/services' },
  { name: 'Ülkeler', href: '/countries' },
  { name: 'Blog', href: '/blog' },
  { name: 'S.S.S', href: '/faq' },
  { name: 'İletişim', href: '/contact' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="navbar">
      <nav className="container">
        <div className="flex items-center justify-between py-4">
          {/* Logo - Left */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Vize Global</span>
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden lg:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA Button - Right */}
          <div className="hidden lg:block">
            <ConversionButton
              href="/application"
              conversionName="header_apply"
              conversionValue={25}
              location="header"
              className="btn btn-primary"
            >
              Online Başvuru
            </ConversionButton>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t bg-white">
          <div className="container py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block py-3 text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <ConversionButton
              href="/application"
              conversionName="mobile_apply"
              conversionValue={25}
              location="mobile_header"
              className="btn btn-primary w-full mt-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              Online Başvuru
            </ConversionButton>
          </div>
        </div>
      )}
    </header>
  )
}