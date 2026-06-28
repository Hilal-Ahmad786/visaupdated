/**
 * "Geliştiren · PakSoft" credit badge. Translucent — for dark backgrounds
 * (footer). Amber accent.
 */
export function DevCredit() {
  return (
    <a
      href="https://paksoft.com.tr"
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[13.5px] leading-none transition-colors hover:bg-white/10"
    >
      <span className="text-white/60">Geliştiren</span>
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        className="h-[17px] w-[17px] -rotate-12 text-amber-400"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.85 0 3.58-.5 5.08-1.38-.7.13-1.42.21-2.16.21-5.52 0-10-4.48-10-10S9.42 2.83 14.92 2.83c.74 0 1.46.08 2.16.21C15.58 2.5 13.85 2 12 2z" />
      </svg>
      <span className="font-extrabold tracking-[0.025em] text-white transition-colors group-hover:text-amber-400">
        PakSoft
      </span>
    </a>
  );
}
