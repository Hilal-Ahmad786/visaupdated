import { ReactNode } from 'react'

interface AdPlaceholderProps {
  width?: string
  height?: string
  label?: string
  children?: ReactNode
}

export default function AdPlaceholder({
  width = '728px',
  height = '90px',
  label = 'Reklam Alanı',
  children,
}: AdPlaceholderProps) {
  return (
    <div className="flex justify-center w-full py-4">
      <div
        className="w-full"
        style={{ maxWidth: width, height }}
      >
        {children ? (
          children
        ) : (
          <div className="h-full w-full flex items-center justify-center rounded-lg border border-dashed text-gray-500">
            <span className="text-sm font-medium">{label}</span>
          </div>
        )}
      </div>
    </div>
  )
}
