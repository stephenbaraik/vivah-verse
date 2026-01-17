import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Add an explicit empty turbopack config to avoid Next complaining
  // when a webpack config is added by plugins (e.g. Sentry)
  turbopack: {},
};

export default nextConfig;
