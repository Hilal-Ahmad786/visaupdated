/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // Add CMS/media host patterns here when configured.
    ],
  },
  async redirects() {
    // Permanent (308) alias redirects for alternative ad-group slugs. Aliases
    // are intentionally excluded from the sitemap. Keep in sync with
    // LANDING_ALIAS_REDIRECTS in src/config/landing-routes.ts.
    const aliases = {
      'almanya-calisma-vizesi': 'almanya-isci-vizesi',
      'hollanda-calisma-vizesi': 'hollanda-isci-vizesi',
      'polonya-calisma-vizesi': 'polonya-isci-vizesi',
    };
    return Object.entries(aliases).map(([from, to]) => ({
      source: `/${from}`,
      destination: `/${to}`,
      permanent: true,
    }));
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
