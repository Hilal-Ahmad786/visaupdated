'use client';

import { MapPin } from 'lucide-react';
import { useState } from 'react';

/**
 * Click-to-load map. No third-party embed is loaded until the user explicitly
 * opts in — keeps the page lightweight and consent-friendly (no map cookies
 * before consent). Real embed URL comes from settings/admin in Part 2.
 */
export function MapPlaceholder({ embedUrl }: { embedUrl?: string }) {
  const [loaded, setLoaded] = useState(false);

  if (loaded && embedUrl) {
    return (
      <iframe
        title="Ofis konumu"
        src={embedUrl}
        className="h-72 w-full rounded-card border border-line"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    );
  }

  return (
    <div className="grid h-72 w-full place-items-center rounded-card border border-dashed border-line bg-surface text-center">
      <div>
        <MapPin className="mx-auto h-8 w-8 text-ink-muted" aria-hidden="true" />
        <p className="mt-2 text-sm text-ink-soft">
          {embedUrl
            ? 'Haritayı görüntülemek için onaylayın. (Harita sağlayıcısı çerez kullanabilir.)'
            : 'Ofis konum bilgisi yakında eklenecektir.'}
        </p>
        {embedUrl && (
          <button type="button" onClick={() => setLoaded(true)} className="btn-outline mt-3 text-sm">
            Haritayı Yükle
          </button>
        )}
      </div>
    </div>
  );
}
