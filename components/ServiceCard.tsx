import Link from 'next/link'
import { CheckIcon } from '@heroicons/react/24/outline'

interface ServiceCardProps {
  title: string
  description: string
  features: string[]
  link: string
}

export default function ServiceCard({ title, description, features, link }: ServiceCardProps) {
  return (
    <div className="card h-full flex flex-col group">
      <div className="mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center text-white text-xl mb-4 group-hover:scale-110 transition-transform">
          {title.includes('Turistik') && '✈️'}
          {title.includes('Ticari') && '💼'}
          {title.includes('Öğrenci') && '🎓'}
        </div>
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600 mb-4 flex-grow">{description}</p>
      <ul className="space-y-2 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <CheckIcon className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
            <span className="text-sm text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
      <Link href={link} className="btn btn-secondary w-full">
        Detaylı Bilgi
      </Link>
    </div>
  )
}