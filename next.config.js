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
    NEXT_PUBLIC_PRODUCTION_URL: 'https://dito.realm1000.com',
    NEXT_PUBLIC_DEVELOPMENT_URL: 'http://192.168.1.13:4000',
    GOOGLE_EMAIL: 'rakiabodyjm@gmail.com',
    GOOGLE_PASSWORD: 'jotrlfelacwmyxao',
  },
}
