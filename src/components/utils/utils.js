class Utils {
  static isEmpty(value) {
    return (
      value == null || (typeof value === 'string' && value.trim().length === 0) || value == ''
    );
  }
  static isEmptyObject (obj) {
    console.log('Object.keys(obj).length === 0: ', Object.keys(obj).length === 0,
    obj, Object.keys(obj).length,
    Object.keys(obj) )
    return Object.keys(obj).length === 0;
}
  static validatePhoneNumber(value) {
    const regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    return regex.test(value);
  }
  static validateEmail = (email) => {
    const regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
  };
}

export default Utils;
