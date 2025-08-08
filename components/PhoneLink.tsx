// components/PhoneLink.tsx (Updated)
'use client'

import { PhoneIcon } from '@heroicons/react/24/solid'
import { conversions } from '@/lib/conversions'

interface PhoneLinkProps {
  phone: string
  displayText?: string
  className?: string
  location?: string
}

export default function PhoneLink({ 
  phone, 
  displayText, 
  className = "",
  location = "phone_link" 
}: PhoneLinkProps) {
  const handleClick = () => {
    conversions.trackPhoneClick(phone, location)
  }

  return (
    <a
      href={`tel:${phone}`}
      onClick={handleClick}
      className={`inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${className}`}
    >
      <PhoneIcon className="w-5 h-5" />
      <span>{displayText || phone}</span>
    </a>
  )
}
