(function (has) {
  'use strict';

  var restyle;

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

  function create(key, value, prefixes) {
    var
      css = [],
      pixels = typeof value === 'number' ? 'px' : '',
      i = prefixes.length;
    while (i--) {
      css.push('-', prefixes[i], '-', key, ':', value, pixels, ';');
    }
    css.push(key, ':', value, pixels, ';');
    return css.join('');
  }

  function generate(obj, prefixes) {
    var
      css = [],
      key,
      value,
      k;
    for (key in obj) {
      if (has.call(obj, key)) {
        if (typeof obj[key] === 'object') {
          value = obj[key];
          for (k in value) {
            if (has.call(value, k)) {
              css.push(create(key + '-' + k, value[k], prefixes));
            }
          }
        } else {
          css.push(create(key, obj[key], prefixes));
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
          css.push(key, '{', generate(value, prefixes), '}');
        }
      }
    }
    return css.join('');
  }

  if (typeof document === 'undefined') {
    restyle = function (obj, prefixes) {
      return parse(obj, prefixes || restyle.prefixes);
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