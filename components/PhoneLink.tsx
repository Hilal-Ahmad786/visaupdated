'use client'

import { conversions } from '@/lib/conversions'

interface PhoneLinkProps {
  phone: string
  displayText?: string
  className?: string
}

export default function PhoneLink({ phone, displayText, className = 'text-primary hover:underline' }: PhoneLinkProps) {
  const handleClick = () => {
    conversions.trackPhoneClick(phone)
  }

  return (
    <a 
      href={`tel:${phone}`}
      className={className}
      onClick={handleClick}
    >
      {displayText || phone}
    </a>
  )
}