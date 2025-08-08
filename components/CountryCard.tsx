interface CountryCardProps {
  name: string
  flag: string
  type: string
  successRate: number
}

export default function CountryCard({ name, flag, type, successRate }: CountryCardProps) {
  return (
    <div className="card text-center p-4 group hover:scale-105 transition-transform cursor-pointer">
      <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">{flag}</div>
      <h4 className="font-bold">{name}</h4>
      <p className="text-sm text-gray-600">{type}</p>
      <div className="mt-2">
        <span className="text-sm font-bold text-green-600">%{successRate}</span>
        <span className="text-xs text-gray-500 block">Başarı Oranı</span>
      </div>
    </div>
  )
}