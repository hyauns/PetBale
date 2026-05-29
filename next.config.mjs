/** @type {import('next').NextConfig} */
const nextConfig = {
  // Build a self-contained .next/standalone bundle for Docker — slim runtime image.
  output: 'standalone',

  // Strip the response-time header to avoid leaking the framework.
  poweredByHeader: false,

  // Compress HTTP responses via Next's built-in gzip.
  compress: true,

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.shopify.com' },
      { protocol: 'https', hostname: '**.shopifycdn.com' },
      { protocol: 'https', hostname: 'pub.kudosi.ai' },
      { protocol: 'https', hostname: 'widget-hub-api.alireviews.io' },
      { protocol: 'https', hostname: '**.alireviews.io' },
    ],
  },
}

export default nextConfig
