module.exports = {
  apps: [
    {
      name: 'website-icon-service',
      script: 'app.js',
      instances: 1, // 设置为1表示单实例运行
      exec_mode: 'fork', // 使用 fork 模式（单实例模式）
      env: {
        NODE_ENV: 'production', // 环境变量
        PORT: 8083, // 服务端口
      },
      watch: false, // 禁用文件监听
      max_memory_restart: '1G', // 内存超限自动重启
      log_date_format: 'YYYY-MM-DD HH:mm:ss', // 日志时间格式
      error_file: 'logs/err.log', // 错误日志文件
      out_file: 'logs/out.log', // 输出日志文件
      merge_logs: true, // 合并日志文件
    },
  ],
};
