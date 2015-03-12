/*jslint forin: true, plusplus: true, indent: 2, browser: true, unparam: true */
/*!
Copyright (C) 2014 by Andrea Giammarchi - @WebReflection

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/
var restyle = (function (O) {
  'use strict';

  var
    toString = O.toString,
    has = O.hasOwnProperty,
    camelFind = /([a-z])([A-Z])/g,
    ignoreSpecial = /^@(?:page|font-face)/,
    isMedia = /^@(?:media)/,
    isArray = Array.isArray || function (arr) {
      return toString.call(arr) === '[object Array]';
    },
    empty = [],
    restyle;

  function ReStyle(component, node, css, prefixes, doc) {
    this.component = component;
    this.node = node;
    this.css = css;
    this.prefixes = prefixes;
    this.doc = doc;
  }

  ReStyle.prototype = {
    replace: function (substitute) {
      if (!(substitute instanceof ReStyle)) {
        substitute = restyle(
          this.component, substitute, this.prefixes, this.doc
        );
      }
      this.remove();
      ReStyle.call(
        this,
        substitute.component,
        substitute.node,
        substitute.css,
        substitute.prefixes,
        substitute.doc
      );
    },
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
      i;
    for (i = 0; i < prefixes.length; i++) {
      css.push('-', prefixes[i], '-', k, ':', value, pixels, ';');
    }
    css.push(k, ':', value, pixels, ';');
    return css.join('');
  }

  function property(previous, key) {
    return previous.length ? previous + '-' + key : key;
  }

  function generate(css, previous, obj, prefixes) {
    var key, value, i;
    for (key in obj) {
      if (has.call(obj, key)) {
        if (typeof obj[key] === 'object') {
          if (isArray(obj[key])) {
            value = obj[key];
            for (i = 0; i < value.length; i++) {
              css.push(
                create(property(previous, key), value[i], prefixes)
              );
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
          css.push(
            create(property(previous, key), obj[key], prefixes)
          );
        }
      }
    }
    return css.join('');
  }

  function parse(component, obj, prefixes) {
    var
      css = [],
      at, cmp, special, k, v,
      same, key, value, i, j;
    for (key in obj) {
      if (has.call(obj, key)) {
        at = key.charAt(0) === '@';
        same = at || !component.indexOf(key + ' ');
        cmp = at && isMedia.test(key) ? component : '';
        special = at && !ignoreSpecial.test(key);
        k = special ? key.slice(1) : key;
        value = empty.concat(obj[key]);
        for (i = 0; i < value.length; i++) {
          v = value[i];
          if (special) {
            j = prefixes.length;
            while (j--) {
              css.push('@-', prefixes[j], '-', k, '{',
                parse(cmp, v, [prefixes[j]]),
                '}');
            }
            css.push(key, '{', parse(cmp, v, prefixes), '}');
          } else {
            css.push(
              same ? key : component + key,
              '{', generate([], '', v, prefixes), '}'
            );
          }
        }
      }
    }
    return css.join('');
  }

  // hack to avoid JSLint shenanigans
  if ({undefined: true}[typeof document]) {
    // in node, by default, no prefixes are used
    restyle = function (component, obj, prefixes) {
      if (typeof component === 'object') {
        prefixes = obj;
        obj = component;
        component = '';
      } else {
        component += ' ';
      }
      return parse(component, obj, prefixes || empty);
    };
    // useful for different style of require
    restyle.restyle = restyle;
  } else {
    restyle = function (component, obj, prefixes, doc) {
      if (typeof component === 'object') {
        doc = prefixes;
        prefixes = obj;
        obj = component;
        c = (component = '');
      } else {
        c = component + ' ';
      }
      var c, d = doc || (doc = document),
        css = parse(c, obj, prefixes || (prefixes = restyle.prefixes)),
        head = d.head ||
          d.getElementsByTagName('head')[0] ||
          d.documentElement,
        node = head.insertBefore(
          d.createElement('style'),
          head.lastChild
        );
      node.type = 'text/css';
      // it should have been
      // if ('styleSheet' in node) {}
      // but JSLint bothers in that way
      if (node.styleSheet) {
        node.styleSheet.cssText = css;
      } else {
        node.appendChild(d.createTextNode(css));
      }
      return new ReStyle(component, node, css, prefixes, doc);
    };
  }

  // bringing animation utility in window-aware world only
  if (!{undefined: true}[typeof window]) {
    restyle.animate = (function (g) {

      var type;
      switch (true) {
        case !!g.AnimationEvent:
          type = 'animationend';
          break;
        case !!g.WebKitAnimationEvent:
          type = 'webkitAnimationEnd';
          break;
        case !!g.MSAnimationEvent:
          type = 'MSAnimationEnd';
          break;
        case !!g.OAnimationEvent:
          type = 'oanimationend';
          break;
      }

      ReStyle.prototype.getAnimationDuration = function (el, name) {
        for (var
          chunk, duration,
          classes = el.className.split(/\s+/),
          i = classes.length; i--;
        ) {
          chunk = classes[i];
          if (
            chunk.length &&
            (new RegExp('\\.' + chunk + '(?:|\\{|\\,)([^}]+?)\\}')).test(this.css)
          ) {
            chunk = RegExp.$1;
            if (
              (new RegExp(
                'animation-name:' +
                name +
                ';.*?animation-duration:([^;]+?);'
              )).test(chunk) ||
              (new RegExp(
                'animation:\\s*' + name + '\\s+([^\\s]+?);'
              )).test(chunk)
            ) {
              chunk = RegExp.$1;
              duration = parseFloat(chunk);
              if (duration) {
                return duration * (/[^m]s$/.test(chunk) ? 1000 : 1);
              }
            }
          }
        }
        return -1;
      };

      ReStyle.prototype.animate = type ?
        function animate(el, name, callback) {
          function onAnimationEnd(e) {
            if (e.animationName === name) {
              drop();
              callback.call(el, e);
            }
          }
          function drop() {
            el.removeEventListener(type, onAnimationEnd, false);
          }
          el.addEventListener(type, onAnimationEnd, false);
          return {drop: drop};
        } :
        function animate(el, name, callback) {
          var i, drop, duration = this.getAnimationDuration(el, name);
          if (duration < 0) {
            drop = O;
          } else {
            i = setTimeout(
              function () {
                callback.call(el, {
                  type: 'animationend',
                  animationName: name,
                  currentTarget: el,
                  target: el,
                  stopImmediatePropagation: O,
                  stopPropagation: O,
                  preventDefault: O
                });
              },
              duration
            );
            drop = function () {
              clearTimeout(i);
            };
          }
          return {drop: drop};
        }
      ;
    }(window));
  }

  restyle.customElement = function (name, constructor, proto) {
    var key, prototype = Object.create(constructor.prototype);
    if (proto && proto.css) {
      proto.css = restyle(name, proto.css);
    }
    for (key in proto) {
      prototype[key] = proto[key];
    }
    return document.registerElement(name, {prototype: prototype});
  };

  restyle.prefixes = [
    'webkit',
    'moz',
    'ms',
    'o'
  ];

  return restyle;

/**
 * not sure if TODO since this might be prependend regardless the parser
 *  @namespace url(http://www.w3.org/1999/xhtml);
 *  @charset "UTF-8";
 */

}({}));