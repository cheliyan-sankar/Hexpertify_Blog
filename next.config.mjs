import { withMicrofrontends } from '@vercel/microfrontends/next/config';
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  basePath: '/blogs',
  assetPrefix: '/blogs',
  images: { unoptimized: true },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'localhost:3001', 'scaling-spork-jj9jvg9rvrjq2pv4p-3001.app.github.dev'],
    },
  },
};

<<<<<<< HEAD:next.config.js
export default withMicrofrontends(nextConfig);
=======
export default nextConfig;
>>>>>>> c8a6bec (fix(next): use ESM next.config.mjs to resolve build import error):next.config.mjs
