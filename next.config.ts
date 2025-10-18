import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  // Ensure Next selects the correct workspace root when multiple lockfiles exist
  outputFileTracingRoot: path.join(__dirname),
  // Optimize for production
  images: {
    domains: ['ltueacqcsghhhrrynuet.supabase.co'],
    formats: ['image/webp', 'image/avif'],
  },
  // Enable compression
  compress: true,
  // Add security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

export default nextConfig;