/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@titanstate/core',
    '@titanstate/react',
    '@titanstate/persist',
    '@titanstate/query',
    '@titanstate/worker',
    '@titanstate/devtools',
    '@titanstate/types',
  ],
};

module.exports = nextConfig;

