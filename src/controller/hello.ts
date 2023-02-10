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
