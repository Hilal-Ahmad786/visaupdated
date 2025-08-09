/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export', // Enable static HTML export
  images: {
    unoptimized: true, // Required for static export if using next/image
  },
};

module.exports = nextConfig;
