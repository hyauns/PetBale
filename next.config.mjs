/** @type {import('next').NextConfig} */
const nextConfig = {
  // Build a self-contained .next/standalone bundle for Docker — slim runtime image.
  output: 'standalone',

  // Strip the response-time header to avoid leaking the framework.
  poweredByHeader: false,

  // Compress HTTP responses via Next's built-in gzip.
  compress: true,

  // Tree-shake framer-motion to per-route chunks instead of the full barrel.
  // (lucide-react is already on Next's default optimize list.)
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },

  images: {
    // Prefer AVIF, then WebP — both far smaller than the source PNG/JPEG.
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.shopify.com' },
      { protocol: 'https', hostname: '**.shopifycdn.com' },
      { protocol: 'https', hostname: 'pub.kudosi.ai' },
      { protocol: 'https', hostname: 'widget-hub-api.alireviews.io' },
      { protocol: 'https', hostname: '**.alireviews.io' },
    ],
  },

  // Immutable, year-long caching for self-hosted fonts and static images.
  // These assets are content-addressed by filename and never mutate in place.
  async headers() {
    return [
      {
        source: '/fonts/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },
}

export default nextConfig
