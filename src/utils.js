
var utils = function(){
  var
    doubleQuoteFind = /"/g,
    doubleQuoteReplace = '\\"',
    camelCaseFind = /([a-z])([A-Z])/g,
    camelCaseReplace = function (m, $1, $2) {
      return $1 + '-' + $2.toLowerCase();
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
      hex: function (r, g, b) {
        return '#'.concat(
          ('0' + r.toString(16)).slice(-2),
          ('0' + g.toString(16)).slice(-2),
          ('0' + b.toString(16)).slice(-2)
        );
      },
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
      url: function(src) {
        return 'url("' + src.replace(
          doubleQuoteFind,
          doubleQuoteReplace
        ) + '");'
      }
    }
  ;
  function hexToRgb(hex) {
    hex = hex.slice(1);
    if (hex.length < 6) {
      hex = [
        hex[0] + hex[0],
        hex[1] + hex[1],
        hex[2] + hex[2]
      ].join('');
    }
    return [
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16),
      (parseInt(hex.slice(6, 8) || 'FF', 16) / 255).toFixed(3)
    ];
  }
  return utils;
}();
