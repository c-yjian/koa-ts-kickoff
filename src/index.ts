import Koa from 'koa';
import path from 'path';
import koaStatic from "koa-static";
import { koaBody } from 'koa-body';
import parameter from 'koa-parameter';
import globalExceptionHandler from './middleware/exceptions';
import router from './router';

console.log(`当前环境: ${process.env.NODE_ENV}`);
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
