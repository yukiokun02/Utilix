module.exports = {
  apps: [{
    name: 'utilitix',
    script: './server/index.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    restart_delay: 4000,
    watch: false
  }]
};