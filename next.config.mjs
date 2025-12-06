/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Support for hybrid environment (Vite + Next.js)
  distDir: '.next',
  // Ensure we can import from src
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': './src',
    };
    return config;
  },
  // Silence the Turbopack warning and use it by default
  turbopack: {},
};

export default nextConfig;