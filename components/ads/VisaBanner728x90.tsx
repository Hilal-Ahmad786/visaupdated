'use client'
import Link from 'next/link'

export default function VisaBanner728x90({ href = '/application' }) {
  return (
    <Link href={href} aria-label="Ankara Vize Danışmanlığı — Hemen Başvur" className="block h-full w-full">
      <div className="h-full w-full max-w-[728px] rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white flex items-center justify-between px-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center rounded-lg bg-white/15 p-2">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="5"/>
              <path d="M12 7c1.5 1.8 1.5 6.2 0 8M9 9.5h6M9 14.5h6"/>
            </svg>
          </div>
          <div>
            <div className="font-semibold text-xl">Ankara Vize Danışmanlığı</div>
            <div className="text-white/90 text-sm">Tüm vize işlemlerinizde uzman destek</div>
          </div>
        </div>
        <span className="inline-flex items-center rounded-full bg-white text-blue-700 px-4 h-9 font-medium hover:bg-blue-50 transition">
          Hemen Başvur
        </span>
      </div>
    </Link>
  )
}
