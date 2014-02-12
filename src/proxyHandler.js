
var proxyHandler = {
  has: function (target, name) {
    return name[0] === '$' || (
      utils.$global.hasOwnProperty(name) ?
        utils.$clash.test(name) :
        true
    );
  },
  set: function (target, name, value, receiver) {
    target[name] = value;
  },
  get: function (target, name, receiver) {
    return name[0] === '$' ?
      target[name] || utils.$global[name] : (
      utils.hasOwnProperty(name) ?
        utils[name] :
        utils.$unCamel(name)
    );
  }
};

/* i.e.
with (restyle.proxy) {

  // some variable declaration
  $color = '#ABC';

  // style to return
  ({
    body: {
      color: $color
    }
  });
}
*/

