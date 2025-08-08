'use client'

import { conversions } from '@/lib/conversions'

interface EmailLinkProps {
  email: string
  subject?: string
  body?: string
  displayText?: string
  className?: string
}

export default function EmailLink({ 
  email, 
  subject = '', 
  body = '',
  displayText,
  className = 'text-primary hover:underline'
}: EmailLinkProps) {
  const handleClick = () => {
    conversions.track('email_click', {
      customParams: { email_address: email }
    })
  }

  const mailtoUrl = `mailto:${email}${subject || body ? '?' : ''}${subject ? `subject=${encodeURIComponent(subject)}` : ''}${subject && body ? '&' : ''}${body ? `body=${encodeURIComponent(body)}` : ''}`

  return (
    <a 
      href={mailtoUrl}
      className={className}
      onClick={handleClick}
    >
      {displayText || email}
    </a>
  )
}