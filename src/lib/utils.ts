/** Tiny className combiner (avoids pulling in clsx/tailwind-merge for Part 1). */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

/** Two-letter country code -> emoji flag (used where a flag image is absent). */
export function codeToFlag(code: string): string {
  if (!/^[A-Za-z]{2}$/.test(code)) return '🌐';
  const A = 0x1f1e6;
  const base = 'A'.charCodeAt(0);
  return String.fromCodePoint(
    A + (code.toUpperCase().charCodeAt(0) - base),
    A + (code.toUpperCase().charCodeAt(1) - base),
  );
}

/** Normalize Turkish text for accent-insensitive search/sort. */
export function normalizeTr(input: string): string {
  return input
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .trim();
}

export function formatDateTr(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
}
