
var proxyHandler = {
  has: function (target, name) {
    return  utils.$global.hasOwnProperty(name) ?
        utils.$clash.test(name) : true;
  },
  get: function (target, name, receiver) {
    return name[0] !== '$' && utils.hasOwnProperty(name) ?
      utils[name] :
      utils.$unCamel(name)
    ;
  }
};
