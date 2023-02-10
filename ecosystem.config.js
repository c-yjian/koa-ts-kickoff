// pm2 配置文件，可运行 pm2 init生成该配置文件
const { name } = require('./package.json');
const path = require('path');

module.exports = {
  apps: [
    // 数组中每一项都是运行在pm2中的一个应用
    {
      // pm2中应用程序的名称
      name,
      // 应用的入口文件
      script: path.resolve(__dirname, './dist/index.js'),
      // 该应用创建的实例，可以根据服务器的cpu数量来设置实例，以充分利用机器性能.仅在cluster模式有效，默认为fork；
      // instances: require('os').cpus().length,
      instances: 1,
      // 发生异常的情况下自动重启
      autorestart: true,
      // 是否启用监控模式，默认是false。如果设置成true，当应用程序变动时，pm2会自动重载。这里也可以设置你要监控的文件
      watch: true,
      env_production: {
        NODE_ENV: 'production',
        PORT: 8080
      },
    }
  ]
};
