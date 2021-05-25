module.exports = {
  webpack(config) {
    // config.resolve.modules.push(path.resolve('./'))
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })
    return config
  },
  env: {
    DEVELOPMENT_MONGO_URI:
      'mongodb+srv://rakia:rakiabodyjm4690@cluster0.l89qj.mongodb.net/dvr?retryWrites=true&w=majority',
    PRODUCTION_MONGO_URI:
      'mongodb+srv://rakia:rakiabodyjm4690@cluster0.mlcnz.mongodb.net/dvr?retryWrites=true&w=majority',
  },
}
