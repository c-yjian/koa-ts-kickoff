
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