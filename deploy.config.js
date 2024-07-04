module.exports = {
    apps: [
      {
        name: 'jcwdol130204-web',
        script: 'npm',
        args: 'run serve',
        env: {
          PORT: 2708,
          NODE_ENV: 'production',
        },
        cwd: '/var/www/html/jcwdol130204.purwadhikabootcamp.com/apps/web',
      },
      {
        name: 'jcwdol130204-api',
        script: 'npm',
        args: 'run serve',
        env: {
          PORT: 2808,
          NODE_ENV: 'production',
        },
        cwd: '/var/www/html/jcwdol130204.purwadhikabootcamp.com/apps/api',
      },
    ],
}
