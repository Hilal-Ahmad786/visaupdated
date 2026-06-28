import { Clock, FileCheck2, Globe2, ShieldCheck } from 'lucide-react';

const items = [
  { Icon: Globe2, label: 'Türkiye Geneli Online Hizmet' },
  { Icon: FileCheck2, label: 'Başvuru Türünüze Özel Evrak Listesi' },
  { Icon: Clock, label: 'Süreç Takibi ve Yönlendirme' },
  { Icon: ShieldCheck, label: 'KVKK Uyumlu Güvenli Süreç' },
];

export function TrustStrip() {
  return (
    <div className="border-y border-line bg-white">
      <div className="container-content grid grid-cols-2 gap-4 py-6 lg:grid-cols-4">
        {items.map(({ Icon, label }) => (
          <div key={label} className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold-surface text-gold">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-sm font-medium text-ink">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
