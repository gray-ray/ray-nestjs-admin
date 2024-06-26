module.exports = {
  apps: [
    {
      name: 'nestjs-app',
      script: 'dist/src/main.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
