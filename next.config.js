/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['react-simple-maps', 'd3-geo'],
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
}
module.exports = nextConfig
