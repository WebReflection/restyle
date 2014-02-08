(function (has) {
  'use strict';

  var isArray = Array.isArray || function (arr) {
        return toString.call(arr) === '[object Array]';
      },
      camelFind = /([a-z])([A-Z])/g,
      toString = {}.toString,
      restyle;

  function ReStyle(node, css) {
    this.node = node;
    this.css = css;
  }

  ReStyle.prototype = {
    remove: function () {
      var node = this.node,
        parentNode = node.parentNode;
      if (parentNode) {
        parentNode.removeChild(node);
      }
    },
    valueOf: function () {
      return this.css;
    }
  };

  function camelReplace(m, $1, $2) {
    return $1 + '-' + $2.toLowerCase();
  }

  function create(key, value, prefixes) {
    var
      css = [],
      pixels = typeof value === 'number' ? 'px' : '',
      k = key.replace(camelFind, camelReplace),
      i = prefixes.length;
    while (i--) {
      css.push('-', prefixes[i], '-', k, ':', value, pixels, ';');
    }
    css.push(k, ':', value, pixels, ';');
    return css.join('');
  }

  function generate(css, previous, obj, prefixes) {
    var key, value, i;
    for (key in obj) {
      if (has.call(obj, key)) {
        if (typeof obj[key] === 'object') {
          if (isArray(obj[key])) {
            value = obj[key];
            for (i = 0; i < value.length; i++) {
              css.push(create(property(previous, key), value[i], prefixes));
            }
          } else {
            generate(
              css,
              property(previous, key),
              obj[key],
              prefixes
            );
          }
        } else {
          css.push(create(property(previous, key), obj[key], prefixes));
        }
      }
    }
    return css.join('');
  }

  function parse(obj, prefixes) {
    var
      css = [],
      key,
      value,
      i;
    for (key in obj) {
      if (has.call(obj, key)) {
        value = obj[key];
        if (key.charAt(0) === '@') {
          key = key.slice(1);
          i = (prefixes || '').length;
          while (i--) {
            css.push('@-', prefixes[i], '-', key, '{',
              parse(value, [prefixes[i]]),
            '}');
          }
          css.push('@', key, '{', parse(value, prefixes), '}');
        } else {
          css.push(key, '{', generate([], '', value, prefixes), '}');
        }
      }
    }
    return css.join('');
  }

  function property(previous, key) {
    return previous.length ? previous + '-' + key : key;
  }

  if (typeof document === 'undefined') {
    // in node, by default, no prefixes are used
    restyle = function (obj, prefixes) {
      return parse(obj, prefixes || Array.prototype);
    };
    // useful for different style of require
    restyle.restyle = restyle;
  } else {
    restyle = function (obj, prefixes, doc) {
      var d = doc || document,
        css = parse(obj, prefixes || restyle.prefixes),
        head = d.head ||
          d.getElementsByTagName('head')[0] ||
          d.documentElement,
        node = head.insertBefore(
          d.createElement('style'),
          head.lastChild
        );
      node.type = 'text/css';
      if ('styleSheet' in node) {
        node.styleSheet.cssText = css;
      } else {
        node.appendChild(d.createTextNode(css));
      }
      return new ReStyle(node, css);
    };
  }

  restyle.prefixes = [
    'o',
    'ms',
    'moz',
    'webkit'
  ];

  return restyle;

}({}.hasOwnProperty))