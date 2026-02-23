import { withMicrofrontends } from '@vercel/microfrontends/next/config';
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  assetPrefix: '/blogs',
  images: { unoptimized: true },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'localhost:3001', 'scaling-spork-jj9jvg9rvrjq2pv4p-3001.app.github.dev'],
    },
  },
};

export default withMicrofrontends(nextConfig);
