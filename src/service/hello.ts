import Base from "./base";

export default class HelloService extends Base {
  hello = () => {
    return this.success('Hello koa ts world ~');
  };
}
