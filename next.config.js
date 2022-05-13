const withPWA = require('next-pwa')

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
  useFileSystemPublicRoutes: false,
}

module.exports = withPWA({
  ...nextConfig,
  pwa: {
    dest: 'public',
    register: true,
    scope: '/',
  },
})
