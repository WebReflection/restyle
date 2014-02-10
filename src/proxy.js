// Copyright (C) 2014 by Andrea Giammarchi - @WebReflection
var CSSProxy = new Proxy(
  {
    boundTo: function (method) {
      return this.$[method] || (
        this.$[method] = this._[method].bind(this)
      );
    },
    special: /^(?:top|scroll)$/,
    find: /([a-z])([A-Z])/g,
    replace: function (m, $1, $2) {
      return $1 + '-' + $2.toLowerCase();
    },
    $: {},
    _: {
      hex: function (r, g, b) {
        return '#'.concat(
          ('0' + r.toString(16)).slice(-2),
          ('0' + g.toString(16)).slice(-2),
          ('0' + b.toString(16)).slice(-2)
        );
      },
      url: function(src) {
        return 'url("' + src + '");'
      }
    }
  },
  {
    has: function (target, name) {
      return  window.hasOwnProperty(name) ?
          target.special.test(name) : true;
    },
    hasOwn: function () {
      alert('WUTOWN');
    },
    get: function (target, name, receiver) {
      return target._.hasOwnProperty(name) ?
        target.boundTo(name) :
        name.replace(
          target.find,
          target.replace
        );
    }
  }
);

/**

with (proxy) {
  console.log({
    color: hex(100, 50, 150),
    textAlign: center,
    backgroundRepeat: noRepeat,
    content: noCloseQuote
  });
}

 */

//  with(proxy){alert(fontSize)}
//  with(proxy){alert(hex(100, 100, 100))}