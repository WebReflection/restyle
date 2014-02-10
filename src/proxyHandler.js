
var proxyHandler = {
  has: function (target, name) {
    return  utils.$global.hasOwnProperty(name) ?
        utils.$clash.test(name) : true;
  },
  get: function (target, name, receiver) {
    return utils.hasOwnProperty(name) ?
      utils[name] :
      utils.$unCamel(name)
    ;
  }
};
