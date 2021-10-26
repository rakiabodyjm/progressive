/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  webpack(config) {
    // config.resolve.modules.push(path.resolve('./'))
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })
    return config
  },
  webpack5: true,
  typescript: {
    ignoreBuildErrors: false,
  },
}
module.exports = nextConfig
