module.exports = {
  apps: [
    {
      name: 'REALM1000 Telco',
      script: './server.js',
      exec_mode: 'cluster',
      instances: 2,
      autorestart: false,
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
}
