koa ts kick off 使用ts开发koa项目的基本架子，便于平时随手调研一些技术

## 项目结构


```
├── src
│   ├── controller      //controller层
│   ├── service         //service层
│   ├── routes.ts       //路由
│   └── index.ts        //项目入口index.js
├── ecosystem.config.js //pm2配置
├── nodemon.json        //nodemon配置
├── package.json
└── tsconfig.json       // ts配置文件

```

## 项目构建步骤

## 初始化项目

```
npm init
```
按需输入信息，或者一直回车即可，信息可以后面再package.json中补充

## 安装typescript相关依赖

```
npm i ts-node typescript --save-dev
```

1. ts-node： 可以在node中使用ts
2. typescript： ts的包

### 配置tsconfig
先初始化ts配置文件，执行下面命令

```
npx tsc --init
```

执行完上述命令后生成tsconfig.json配置文件。
该项目将tsconfig配置为下面内容
```
{
  "include": ["./src"],   // 指定需要编译文件 否则默认当前目录下除了exclude之外的所有.ts, .d.ts,.tsx 文件
  "compilerOptions": {
    "module": "commonjs", // 指定生成哪个模块系统代码
    "declaration": false,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "target": "es6",
    "sourceMap": false,       // 用于debug   
    "outDir": "./dist",       //重定向输出目录
    "baseUrl": "./"
  },
  "exclude": ["node_modules"] // 不编译某些文件
}
```

有关ts的详细内容推荐： [ts学习好资料](https://github.com/zhongsp/TypeScript)
关于tsconfig的完整参数文档：
[中文文档](https://www.patrickzhong.com/TypeScript/zh/project-config/compiler-options.html)
[英文文档](https://www.typescriptlang.org/docs/handbook/compiler-options.html)

## 安装koa等基础功能包

```
npm i koa koa-router koa-body koa-parameter koa-static @types/node
```

1. koa：koa功能包
2. koa-router：koa路由
3. koa-body： 解析post等请求中body参数
4. koa-parameter: 校验请求中的基本参数
5. koa-static: 静态文件服务
6. @types/node: n包含ode包中大部分的定义

## 项目基本内容
安装项目结构，分别建立各自文件夹，这里使用一个controller 和一个service

### 入口文件
src/index.ts
```
import * as Koa from 'koa';
import * as path from 'path';
import * as koaStatic from "koa-static";
import { koaBody } from 'koa-body';
import * as parameter from 'koa-parameter';
import globalExceptionHandler from './middleware/exceptions';
import router from './router';

// koa应用
const app = new Koa();
// 注册中间件
// 全局捕获错误
app.use(globalExceptionHandler);
// 静态文件服务 public 文件夹下文件可对外访问
app.use(koaStatic(path.join(__dirname, 'public')));
// 解析body 参数
app.use(koaBody());
// 验证入参
app.use(parameter(app));
// 注册路由
app.use(router.routes());
// 如果请求了不被允许的方法 比如说只实现了 get 这时候请求了post 就会告诉客户端一些信息
app.use(router.allowedMethods());
app.listen(3009, () => console.log('程序已经在3009端口启动'));
```

### 路由
src/router中内容用于应用中的路由注册
```
import * as Router from 'koa-router';
import HelloController from './controller/hello';

const router = new Router();
router.get('/hello', HelloController.hello);
router.post('/sayHey', HelloController.sayHey);

export default router;
```

### 中间件
src/middleware/exceptions.ts 中间件用于全局兜底使用捕获异常
```

// global exception handler
const globalExceptionHandler = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    ctx.body = {
      errMsg: error.message,
      state: false
    };
    ctx.status = 200; // http 响应码
  }
};

export default globalExceptionHandler;
```

### controller层
src/controller/hello.ts 一个简单的controller层
```
import HelloService from '../service//hello';
class HelloController {
  private service: HelloService = new HelloService();

  hello = async ctx => {
    const params = ctx.request.query;
    console.log(`接受到的参数为, name：${params.name}`);
    ctx.body = await this.service.hello();
  };

  sayHey = async ctx => {
    const params = ctx.request.body;
    ctx.verifyParams({
      // 登录信息
      loginUrl: { type: 'string', required: true },
    });
    ctx.body = `接受到的数据, name:${params.name} age: ${params.age}`;
  };

}
export default new HelloController();

```

### service层
src/service/hello.ts 一个简单的service层
```
export default class HelloService {
  hello = () => {
    return 'hello koa ts world ~';
  };
}
```

## 配置eslint
现在一般使用eslint来校验ts即可，无需再使用tslint。两者基本重复，tslint也不再维护了，推荐使用eslint即可

### 安装eslint
```
npm i eslint --save-dev
```

### 初始化eslint配置文件
```
npx eslint --init
```
执行上面命令后，会有一些列的交互式问题，按需选择即可。会自动下载对应的npm包并在本地生成.eslintrc.json配置文件

安装一个解析器
```
@typescript-eslint/parser
```

### 配置.eslintrc.json
这里将其配置为如下内容
```
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "plugins": [
    "@typescript-eslint"
  ],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": { 
    "semi": [2, "always"],
    "no-console": 1 // 如果有console，会抛出错误
  }
}
```

### eslintignore.json
```
touch .eslintignore
```
忽略不需要eslint校验的文件配置内容如下:
```
node_modules
dist
ecosystem.config.js
```

## nodemon
一个很不错的工具包，可以监听本地文件服务的变化，自动重启服务，代替node命令
### 安装

```
npm i nodemon --save-dev
```

### 配置文件
在根目录下新建nodemon.json文件，修改内容如下：
```
{
  "watch": ["src"],   // 监听src文件夹
  "ext": "ts",        // 监听ts文件
  "exec": "ts-node src/index.ts", // 变化之后执行该命令
  "ignore": ["./src/public"]      // 忽略那些命令
}
```
上述配置是监听src文件夹中

### 配置script脚本
在package.json文件中新增一个dev命令，表开发时使用
```
"dev": "nodemon",
```
当执行 npm run dev / yarn dev 时，会根据nodemon.json配置文件执行命令

## pm2
在生产环境使用pm2来守护应用进程

### 安装
```
npm i pm2 --save-dev
```

### 配置文件

```
npx pm2 init
```
执行上述命令生成pm2配置文件ecosystem.config.js, 将其修改为如下内容:
```
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
```

### 配置script命令
在package.json中我们配置如下脚本
```
"scripts": {
    "dev": "nodemon", // 开发调式时使用
    "dev:dist": " nodemon dist/index.js", // 调试构建出的dist包
    "build": "rm -rf dist && tsc",  // 构建生产包
    "cp": "cp -r src/public dist/public", // tsc 只会讲src中ts文件编译成js到dist中，public静态资源文件单独cp过去
    "start": "npm run build && npm run cp && npx pm2 start ecosystem.config.js --env production", // 生产环境运行
    "restart": "npx pm2 restart ecosystem.config.js --env production",  //生产环境重启
    "stop": "npx pm2 stop ecosystem.config.js",     // 停止生产环境应用进程
    "delete": "npx pm2 delete ecosystem.config.js", // 删除生产环境应用进程
    "lint": "eslint . --ext .ts",                   // eslint校验项目代码规范
    "lint:fix": "eslint . --ext .ts --fix",         // eslint校验 & 修复项目代码规范
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```

## .gitignore
配置提交git时忽略的文件
```
node_modules
dist
```

