import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: { unoptimized: true },
  serverExternalPackages: ['mysql2']
};
export default nextConfig;
