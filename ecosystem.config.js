module.exports = {
  apps: [{
    name: "website-icon-service",
    script: "./dist/app.js",
    instances: 2,
    exec_mode: "cluster",
    env: {
      NODE_ENV: "development",
      PORT: 3000
    },
    env_production: {
      NODE_ENV: "production",
      PORT: 8083
    },
    watch: false,
    max_memory_restart: '1G',
    log_date_format: "YYYY-MM-DD HH:mm:ss",
    error_file: "logs/err.log",
    out_file: "logs/out.log",
    merge_logs: true
  }]
};