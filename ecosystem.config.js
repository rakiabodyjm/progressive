module.exports = {
  apps: [
    {
      name: 'REALM1000 ALPHA FRONTEND',
      script: './server.js',
      exec_mode: 'cluster',
      instances: 2,
      autorestart: false,
      env_production: {
        NODE_ENV: 'production',
        BACKEND_HOSTNAME: `api.caesarcoin.ph`,
        NEXT_PUBLIC_BACKEND_URL: `https://api.caesarcoin.ph`,
      },
      env: {
        NODE_ENV: 'development',
        BACKEND_HOSTNAME: `api.caesarcoin.ph`,
        NEXT_PUBLIC_BACKEND_URL: `https://api.caesarcoin.ph`,
      },
    },
  ],
}
