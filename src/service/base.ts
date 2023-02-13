
class Base { 
  success(data) {
    return {
      state: true,
      data,
    };
  }

  error(errorMsg) {
    return {
      state: false,
      errorMsg,
    };
  }
}

export default Base;