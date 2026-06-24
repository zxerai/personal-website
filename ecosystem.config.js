/**
 * PM2 配置文件（备选方案：不使用 Docker，直接用 Node.js + PM2）
 *
 * 适用场景：
 * - 服务器小（< 1GB RAM）
 * - 不想装 Docker
 * - 习惯 PM2 进程管理
 *
 * 启动命令：
 *   pm2 start ecosystem.config.js --env production
 *   pm2 save
 *   pm2 startup
 */

module.exports = {
  apps: [
    {
      name: 'personal-website',
      // standalone 输出会在 .next/standalone/server.js
      script: '.next/standalone/server.js',
      instances: 'max', // 集群模式：按 CPU 核数
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
        HOSTNAME: '0.0.0.0',
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '0.0.0.0',
        NEXT_PUBLIC_SITE_URL: 'https://your-domain.com',
      },
      // 日志
      error_file: 'logs/pm2-error.log',
      out_file: 'logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      // 合并日志（多实例时聚合）
      merge_logs: true,
    },
  ],
};
