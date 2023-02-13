import Base from "./base";

export default class HelloService extends Base {
  hello = () => {
    return this.success('hello koa ts world ~');
  };
}
