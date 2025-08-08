'use client'

import { ReactNode } from 'react'
import { conversions } from '@/lib/conversions'
import Link from 'next/link'

interface ConversionButtonProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  conversionName: string
  conversionValue?: number
  location: string
  href?: string
  type?: 'button' | 'submit' | 'reset'
}

export default function ConversionButton({
  children,
  className = 'btn btn-primary',
  onClick,
  conversionName,
  conversionValue,
  location,
  href,
  type = 'button'
}: ConversionButtonProps) {
  const handleClick = () => {
    // Track conversion
    conversions.trackCTAClick(conversionName, location)
    
    // Track additional value if provided
    if (conversionValue) {
      conversions.track('cta_click', {
        value: conversionValue,
        customParams: {
          button_name: conversionName,
          location
        }
      })
    }
    
    // Call original onClick if provided
    if (onClick) {
      onClick()
    }
  }

  // If href is provided, render as Link
  if (href) {
    return (
      <Link href={href} className={className} onClick={handleClick}>
        {children}
      </Link>
    )
  }

  // Otherwise render as button
  return (
    <button type={type} className={className} onClick={handleClick}>
      {children}
    </button>
  )
}