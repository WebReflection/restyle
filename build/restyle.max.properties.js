/*jslint forin: true, plusplus: true, indent: 2, browser: true, unparam: true */
/*!
Copyright (C) 2014-2015 by Andrea Giammarchi - @WebReflection

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
restyle.properties = (function(){

var utils = function(){
  var
    angle = function (name) {
      return function (degrees) {
        return name + '(' + deg(degrees) + ')';
      };
    },
    camelCaseFind = /([a-z])([A-Z])/g,
    camelCaseReplace = function (m, $1, $2) {
      return $1 + '-' + $2.toLowerCase();
    },
    deg = function (degrees) {
      return typeof degrees === 'number' ?
        (degrees + 'deg') : degrees;
    },
    doubleQuoteFind = /"/g,
    doubleQuoteReplace = '\\"',
    empty = [],
    hexToRgb = function (hex) {
      var i;
      hex = hex.slice(1);
      if (hex.length < 6) {
        hex = [
          hex[0] + hex[0],
          hex[1] + hex[1],
          hex[2] + hex[2]
        ].join('');
      }
      i = hex.length === 6 ? 0 : 2;
      return [
        parseInt(hex.slice(i, i + 2), 16),
        parseInt(hex.slice(i + 2, i + 4), 16),
        parseInt(hex.slice(i + 4, i + 6), 16),
        i ? (parseInt(hex.slice(0, 2), 16) / 255).toFixed(3) : 1
      ];
    },
    namedFunction = function (name, args) {
      return name + '(' + empty.join.call(args, ',') + ')'
    },
    namedMethod = function (name) {
      return function () {
        return namedFunction(name, arguments);
      };
    },
    separatorFind = /([a-z])-([a-z])/g,
    separatorReplace = function (m, $1, $2) {
      return $1 + $2.toUpperCase();
    },
    utils = {
      $clash: /^(?:top|scroll)$/,
      $global: typeof window === 'undefined' ?
        global : window,
      $camel: function (str) {
        return str.replace(
          separatorFind,
          separatorReplace
        );
      },
      $unCamel: function (str) {
        return str.replace(
          camelCaseFind,
          camelCaseReplace
        );
      },
      abs: Math.abs,
      concat: function () {
        return empty.join.call(arguments, ' ');
      },
      cubicBezier: namedMethod('cubic-bezier'),
      floor: Math.floor,
      hex: function (r, g, b, a) {
        return '#'.concat(
          a == null ? '' : (
            '0' + Math.round(a * 255).toString(16)
          ).slice(-2),
          ('0' + r.toString(16)).slice(-2),
          ('0' + g.toString(16)).slice(-2),
          ('0' + b.toString(16)).slice(-2)
        );
      },
      join: function () {
        return empty.join.call(
          empty.concat.apply(empty, arguments),
          ','
        );
      },
      matrix: namedMethod('matrix'),
      matrix3d: namedMethod('matrix3d'),
      max: Math.max,
      min: Math.min,
      rgb: function rgb(r, g, b) {
        return g == null ?
          rgb.apply(utils, hexToRgb(r)) :
          'rgb(' + [r, g, b] + ')';
      },
      rgba: function rgba(r, g, b, a) {
        return g == null ?
          rgba.apply(utils, hexToRgb(r)) :
          'rgba(' + [r, g, b, a] + ')';
      },
      rotate: angle('rotate'),
      rotate3d: function (x, y, z, degrees) {
        return namedFunction('rotate3d', [x, y, z, deg(degrees)]);
      },
      rotateX: angle('rotateX'),
      rotateY: angle('rotateY'),
      rotateZ: angle('rotateZ'),
      scale: namedMethod('scale'),
      scale3d: namedMethod('scale3d'),
      scaleX: namedMethod('scaleX'),
      scaleY: namedMethod('scaleY'),
      scaleZ: namedMethod('scaleZ'),
      skew: function (x, y) {
        return skew('rotate3d', [deg(x), deg(y)]);
      },
      skewX: angle('skewX'),
      skewY: angle('skewY'),
      perspective: namedMethod('perspective'),
      round: Math.round,
      quote: function (text) {
        return '"' + text.replace(
          doubleQuoteFind,
          doubleQuoteReplace
        ) + '"';
      },
      translate: namedMethod('translate'),
      translate3d: namedMethod('translate3d'),
      translateX: namedMethod('translateX'),
      translateY: namedMethod('translateY'),
      translateZ: namedMethod('translateZ'),
      url: function(src) {
        return 'url(' + utils.quote(src) + ')'
      }
    }
  ;

  return utils;

}();

var properties = Object.create(null);
[].concat(

// if you find something missing please let me know, thanks!

// transitions name
[
  'linear',
  'ease',
  'ease-in',
  'ease-out',
  'ease-in-out',
  'initial'
],
// generic font family
[
  'serif',
  'sans-serif',
  'cursive',
  'fantasy',
  'monospace'
],
// basic colors
[
  'black',
  'silver',
  'gray',
  'white',
  'maroon',
  'red',
  'purple',
  'fuchsia',
  'green',
  'lime',
  'olive',
  'yellow',
  'navy',
  'blue',
  'teal',
  'aqua'
],
// extended colors
[
  'aliceblue',
  'antiquewhite',
  'aqua',
  'aquamarine',
  'azure',
  'beige',
  'bisque',
  'black',
  'blanchedalmond',
  'blue',
  'blueviolet',
  'brown',
  'burlywood',
  'cadetblue',
  'chartreuse',
  'chocolate',
  'coral',
  'cornflowerblue',
  'cornsilk',
  'crimson',
  'cyan',
  'darkblue',
  'darkcyan',
  'darkgoldenrod',
  'darkgray',
  'darkgreen',
  'darkgrey',
  'darkkhaki',
  'darkmagenta',
  'darkolivegreen',
  'darkorange',
  'darkorchid',
  'darkred',
  'darksalmon',
  'darkseagreen',
  'darkslateblue',
  'darkslategray',
  'darkslategrey',
  'darkturquoise',
  'darkviolet',
  'deeppink',
  'deepskyblue',
  'dimgray',
  'dimgrey',
  'dodgerblue',
  'firebrick',
  'floralwhite',
  'forestgreen',
  'fuchsia',
  'gainsboro',
  'ghostwhite',
  'gold',
  'goldenrod',
  'gray',
  'green',
  'greenyellow',
  'grey',
  'honeydew',
  'hotpink',
  'indianred',
  'indigo',
  'ivory',
  'khaki',
  'lavender',
  'lavenderblush',
  'lawngreen',
  'lemonchiffon',
  'lightblue',
  'lightcoral',
  'lightcyan',
  'lightgoldenrodyellow',
  'lightgray',
  'lightgreen',
  'lightgrey',
  'lightpink',
  'lightsalmon',
  'lightseagreen',
  'lightskyblue',
  'lightslategray',
  'lightslategrey',
  'lightsteelblue',
  'lightyellow',
  'lime',
  'limegreen',
  'linen',
  'magenta',
  'maroon',
  'mediumaquamarine',
  'mediumblue',
  'mediumorchid',
  'mediumpurple',
  'mediumseagreen',
  'mediumslateblue',
  'mediumspringgreen',
  'mediumturquoise',
  'mediumvioletred',
  'midnightblue',
  'mintcream',
  'mistyrose',
  'moccasin',
  'navajowhite',
  'navy',
  'oldlace',
  'olive',
  'olivedrab',
  'orange',
  'orangered',
  'orchid',
  'palegoldenrod',
  'palegreen',
  'paleturquoise',
  'palevioletred',
  'papayawhip',
  'peachpuff',
  'peru',
  'pink',
  'plum',
  'powderblue',
  'purple',
  'red',
  'rosybrown',
  'royalblue',
  'saddlebrown',
  'salmon',
  'sandybrown',
  'seagreen',
  'seashell',
  'sienna',
  'silver',
  'skyblue',
  'slateblue',
  'slategray',
  'slategrey',
  'snow',
  'springgreen',
  'steelblue',
  'tan',
  'teal',
  'thistle',
  'tomato',
  'turquoise',
  'violet',
  'wheat',
  'white',
  'whitesmoke',
  'yellow',
  'yellowgreen'
],
// all other properties
[
  'above',
  'absolute',
  'always',
  'armenian',
  'auto',
  'avoid',
  'baseline',
  'below',
  'bidi-override',
  'block',
  'bold',
  'bolder',
  'border-box',
  'bottom',
  'break-word',
  'capitalize',
  'center',
  'center-left',
  'center-right',
  'circle',
  'close-quote',
  'code',
  'collapse',
  'content-box',
  'continuous',
  'cue-after',
  'cue-before',
  'decimal',
  'decimal-leading-zero',
  'digits',
  'disc',
  'embed',
  'far-left',
  'far-right',
  'fast',
  'faster',
  'fixed',
  'georgian',
  'hidden',
  'hide',
  'high',
  'higher',
  'inherit',
  'inline',
  'inline-block',
  'inline-table',
  'invert',
  'italic',
  'justify',
  'left',
  'left-side',
  'leftwards',
  'level',
  'lighter',
  'list-item',
  'loud',
  'low',
  'lower',
  'lower-alpha',
  'lower-greek',
  'lower-latin',
  'lower-roman',
  'lowercase',
  'medium',
  'middle',
  'no-close-quote',
  'no-open-quote',
  'no-repeat',
  'none',
  'normal',
  'nowrap',
  'oblique',
  'once',
  'open-quote',
  'pre',
  'pre-line',
  'pre-wrap',
  'relative',
  'repeat',
  'repeat-x',
  'repeat-y',
  'right',
  'right-side',
  'rightwards',
  'scroll',
  'show',
  'silent',
  'slow',
  'slower',
  'small-caps',
  'soft',
  'spell-out',
  'square',
  'sub',
  'super',
  'table',
  'table-caption',
  'table-cell',
  'table-column',
  'table-column-group',
  'table-footer-group',
  'table-header-group',
  'table-row',
  'table-row-group',
  'text-bottom',
  'text-top',
  'top',
  'transparent',
  'upper-alpha',
  'upper-latin',
  'upper-roman',
  'uppercase',
  'visible',
  'x-fast',
  'x-high',
  'x-loud',
  'x-low',
  'x-slow',
  'x-soft'
]).forEach(function(name){
  properties[utils.$camel(name)] = name;
});

Object.keys(utils).forEach(function(method){
  if (method[0] !== '$') {
    properties[method] = utils[method];
  }
});


return properties;

}());