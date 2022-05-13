module.exports = {
  apps: [
    {
      name: 'REALM1000 ALPHA FRONTEND',
      script: './server.js',
      exec_mode: 'cluster',
      instances: 2,
      autorestart: true,
      env: {
        NODE_ENV: 'production',
        BACKEND_HOSTNAME: 'telco.ap.ngrok.io/api',
        NEXT_PUBLIC_BACKEND_URL: 'https://telco.ap.ngrok.io/api',
      },
    },
  ],
}
