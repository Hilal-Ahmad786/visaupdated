interface AdPlaceholderProps {
  width?: string
  height?: string
  label?: string
}

export default function AdPlaceholder({ 
  width = '728px', 
  height = '90px', 
  label = 'Reklam Alanı' 
}: AdPlaceholderProps) {
  return (
    <div className="flex justify-center w-full py-4">
      <div 
        className="ad-placeholder"
        style={{ width: '100%', maxWidth: width, height }}
      >
        <span className="text-sm font-medium">{label}</span>
      </div>
    </div>
  )
}