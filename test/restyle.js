//remove:
var restyle = require('../build/restyle.node.js');
//:remove


var hasDOM = typeof document !== typeof hasDOM;

wru.test([
  {
    name: 'basics',
    test: function () {
      var
        length = hasDOM && document.getElementsByTagName('style').length,
        initialStyle = hasDOM && window.getComputedStyle &&
          getComputedStyle(document.body, null).getPropertyValue('background-color'),
        obj = restyle(
          {
            body: {
              background: '#EEE'
            }
          },
          []
        );
      wru.assert('parsed correctly', obj == 'body{background:#EEE;}');
      if (hasDOM) {
        wru.assert('node inserted',
          document.getElementsByTagName('style').length === length + 1
        );
        if (initialStyle) {
          wru.assert('it restyled',
            initialStyle !== getComputedStyle(document.body, null).getPropertyValue('background-color')
          );
        }
        obj.remove();
        wru.assert('node removed',
          document.getElementsByTagName('style').length === length
        );
        if (initialStyle) {
          wru.assert('it de-restyled',
            initialStyle === getComputedStyle(document.body, null).getPropertyValue('background-color')
          );
        }
      }
    }
  },{
    name: 'nested properties',
    test: function () {
      var obj = restyle(
        {
          body: {
            background: {
              color: '#999',
              image: 'url("/favicon.ico")'
            },
            padding: 100
          },
          div: {
            font: {
              family: 'sans-serif',
              size: 32
            }
          }
        },
        []
      );
      setTimeout(wru.async(function(){
        wru.assert(obj == ''.concat(
          'body{',
            'background-color:#999;',
            'background-image:url("/favicon.ico");',
            'padding:100px;',
          '}',
          'div{',
            'font-family:sans-serif;',
            'font-size:32px;',
          '}'
        ));
        if (hasDOM) obj.remove();
      }), 1000);
    }
  },{
    name: '@keyframes',
    test: function () {
      var obj = restyle({
        'body > div': {
          animation: {
            name: 'spin',
            duration: '4s'
          }
        },
        '@keyframes spin': {
          from: {
            transform: 'rotate(0deg)'
          },
          to: {
            transform: 'rotate(360deg)'
          }
        }
      }, hasDOM ? null : restyle.prefixes);
      // should produce the following
      wru.log(obj == ''.concat(
        'body > div{',
          '-webkit-animation-name:spin;',
          '-moz-animation-name:spin;',
          '-ms-animation-name:spin;',
          '-o-animation-name:spin;',
          'animation-name:spin;',
          '-webkit-animation-duration:4s;',
          '-moz-animation-duration:4s;',
          '-ms-animation-duration:4s;',
          '-o-animation-duration:4s;',
          'animation-duration:4s;',
        '}',
        '@-webkit-keyframes spin{',
          'from{',
            '-webkit-transform:rotate(0deg);',
            'transform:rotate(0deg);',
          '}',
          'to{',
            '-webkit-transform:rotate(360deg);',
            'transform:rotate(360deg);',
          '}',
        '}',
        '@-moz-keyframes spin{',
          'from{',
            '-moz-transform:rotate(0deg);',
            'transform:rotate(0deg);',
          '}',
          'to{',
            '-moz-transform:rotate(360deg);',
            'transform:rotate(360deg);',
          '}',
        '}',
        '@-ms-keyframes spin{',
          'from{',
            '-ms-transform:rotate(0deg);',
            'transform:rotate(0deg);',
          '}',
          'to{',
            '-ms-transform:rotate(360deg);',
            'transform:rotate(360deg);',
          '}',
        '}',
        '@-o-keyframes spin{',
          'from{',
            '-o-transform:rotate(0deg);',
            'transform:rotate(0deg);',
          '}',
          'to{',
            '-o-transform:rotate(360deg);',
            'transform:rotate(360deg);',
          '}',
        '}',
        '@keyframes spin{',
          'from{',
            '-webkit-transform:rotate(0deg);',
            '-moz-transform:rotate(0deg);',
            '-ms-transform:rotate(0deg);',
            '-o-transform:rotate(0deg);',
            'transform:rotate(0deg);',
          '}',
          'to{',
            '-webkit-transform:rotate(360deg);',
            '-moz-transform:rotate(360deg);',
            '-ms-transform:rotate(360deg);',
            '-o-transform:rotate(360deg);',
            'transform:rotate(360deg);',
          '}',
        '}'
      ));
      setTimeout(wru.async(function(){
        hasDOM && obj.remove();
        wru.assert('it probably spinned');
      }), 2000);
    }
  },{
    name: 'camel to CSS',
    test: function() {
      var obj = restyle({
        body: {
          marginLeft: 32
        }
      }, []);
      wru.assert(obj == ''.concat(
        'body{',
          'margin-left:32px;',
        '}'
      ));
      if (hasDOM) obj.remove();
    }
  },{
    name: 'single property as Array',
    test: function () {
      var obj = restyle({
        '.flexbox': {
          display: [
            '-webkit-box',
            '-moz-box',
            '-ms-flexbox',
            '-webkit-flex',
            'flex'
          ]
        }
      }, []);
      wru.assert(obj == ''.concat(
        '.flexbox{',
          'display:-webkit-box;',
          'display:-moz-box;',
          'display:-ms-flexbox;',
          'display:-webkit-flex;',
          'display:flex;',
        '}'
      ));
      if (hasDOM) obj.remove();
    }
  },{
    name: 'nested with nested with nested ...',
    test: function () {
      var obj = restyle({
        body: {
          any: {
            thing: {
              i: {
                want: 'OK'
              }
            }
          },
          background: {
            position: {
              x: 10,
              y: '50%'
            }
          }
        }
      }, []);
      wru.assert(obj == ''.concat(
        'body{',
          'any-thing-i-want:OK;',
          'background-position-x:10px;',
          'background-position-y:50%;',
        '}'
      ));
      if (hasDOM) obj.remove();
    }
  },{
    name: '@page and @font-face declarations',
    test: function () {
      var obj = restyle({
        '@page :pseudo-class': {
          margin: '2in'
        },
        '@font-face': {
          font: {
            family: 'restyled',
            weight: 'normal',
            style: 'bold'
          }
        }
      }, []);
      wru.assert(obj == ''.concat(
        '@page :pseudo-class{',
          'margin:2in;',
        '}',
        '@font-face{',
          'font-family:restyled;',
          'font-weight:normal;',
          'font-style:bold;',
        '}'
      ));
      if (hasDOM) obj.remove();
    }
  },{
    name: 'replace',
    test: function () {
      var o = restyle({i:{display:'none'}}, ['test']),
          node = o.node,
          css = o.css;
      if (typeof document !== 'undefined') {
        o.replace({i:{display:'block'}});
        wru.assert('previous node removed', !node.parentNode);
        wru.assert('current node in place', !!o.node.parentNode);
        wru.assert('CSS is different', css !== o.css);
        wru.assert('same prefixes', o.prefixes.join(',') === 'test');
      }
    }
  },{
    name: 'component - basic',
    test: function () {
      var obj = restyle('x-component', {i:{display:'none'}}, []);
      wru.assert(obj == ''.concat(
        'x-component i{',
          'display:none;',
        '}'
      ));
      if (hasDOM) obj.remove();
    }
  },{
    name: 'component - advanced',
    test: function () {
      var obj = restyle(
        'x-component',
        {
          'div': {
            animation: {
              name: 'spin',
              duration: '4s'
            }
          },
          '@media (max-width: 600px)': {
            'div': {
              display: 'none'
            }
          },
          '@keyframes spin': {
            from: {
              transform: 'rotate(0deg)'
            },
            to: {
              transform: 'rotate(360deg)'
            }
          },
          '@font-face': {
            font: {
              family: 'restyled',
              weight: 'normal',
              style: 'bold'
            }
          }
        },
        ['webkit']
      );
      wru.assert(obj == ''.concat(
        'x-component div{',
          '-webkit-animation-name:spin;',
          'animation-name:spin;',
          '-webkit-animation-duration:4s;',
          'animation-duration:4s;',
        '}',
        '@-webkit-media (max-width: 600px){',
          'x-component div{-webkit-display:none;display:none;}',
        '}',
        '@media (max-width: 600px){',
          'x-component div{-webkit-display:none;display:none;}',
        '}',
        '@-webkit-keyframes spin{',
          'from{-webkit-transform:rotate(0deg);transform:rotate(0deg);}',
          'to{-webkit-transform:rotate(360deg);transform:rotate(360deg);}',
        '}',
        '@keyframes spin{',
          'from{-webkit-transform:rotate(0deg);transform:rotate(0deg);}',
          'to{-webkit-transform:rotate(360deg);transform:rotate(360deg);}',
        '}',
        '@font-face{',
          '-webkit-font-family:restyled;',
          'font-family:restyled;',
          '-webkit-font-weight:normal;',
          'font-weight:normal;',
          '-webkit-font-style:bold;',
          'font-style:bold;',
        '}'
      ));
      if (hasDOM) obj.remove();
    }
  },{
    name: 'same name for self description',
    test: function () {
      var obj = restyle('x-component', {'x-component':{display:'none'}}, []);
      // should not create x-component x-component
      wru.assert(obj == ''.concat(
        'x-component{',
          'display:none;',
        '}'
      ));
      if (hasDOM) obj.remove();
    }
  },{
    name: 'customElement',
    test: function () {
      var i = 0;
      if (typeof document === 'undefined') {
        document = {};
      }
      document.registerElement = function (name, constructor, proto) {
        i++;
      };
      if (!Object.create) Object.create = function(p){return p};
      var obj = restyle.customElement('x-test', function () {}, {});
      wru.assert(i === 1);
    }
  },{
    name: 'customElement via is',
    test: function () {
      var prefixes = restyle.prefixes,
          args;
      restyle.prefixes = [];
      document.registerElement = function (name, descriptor) {
        args = [name, descriptor];
      };
      restyle.customElement(
        'x-clock',
        function () {},
        {
          'extends': 'div',
          css: {
            'input': {border: 0}
          }
        }
      );
      wru.assert(args[0] === 'x-clock');
      wru.assert(
        (args[1].prototype.css.valueOf()) ===
        'div[is=x-clock] input{border:0px;}'
      );
      restyle.prefixes = prefixes;
    }
  }, {
    name: 'empty string for same component',
    test: function () {
      var prefixes = restyle.prefixes,
          args;
      restyle.prefixes = [];
      document.registerElement = function (name, descriptor) {
        args = [name, descriptor];
      };
      restyle.customElement(
        'x-dafuq',
        function () {},
        {
          css: {
            '': {fontSize: 37}
          }
        }
      );
      wru.assert(args[0] === 'x-dafuq');
      wru.assert(
        (args[1].prototype.css.valueOf()) ===
        'x-dafuq{font-size:37px;}'
      );
      restyle.prefixes = prefixes;
    }
  }, {
    name: 'ampersand for same component',
    test: function () {
      var prefixes = restyle.prefixes,
          args;
      restyle.prefixes = [];
      document.registerElement = function (name, descriptor) {
        args = [name, descriptor];
      };
      restyle.customElement(
        'x-dafuq',
        function () {},
        {
          css: {
            '&': {fontSize: 37}
          }
        }
      );
      wru.assert(args[0] === 'x-dafuq');
      wru.assert(
        (args[1].prototype.css.valueOf()) ===
        'x-dafuq{font-size:37px;}'
      );
      restyle.prefixes = prefixes;
    }
  }, {
    name: 'natural Array style',
    test: function () {
      wru.assert(restyle([
        'a',
        'p', {
          height: 50
        }
      ]) === 'a{height:50px;}p{height:50px;}');
    }
  }, {
    name: 'natural Array style with component',
    test: function () {
      wru.assert(restyle('custom-element', [
        'a',
        'p', {
          height: 50
        }
      ]) === 'custom-element a{height:50px;}custom-element p{height:50px;}');
    }
  }, {
    name: 'self reference with classes',
    test: function () {
      wru.assert(
        restyle('comp', {'&.test .a,&.test .b':{width:100}}) ===
        'comp.test .a,comp.test .b{width:100px;}'
      );
    }
  }
]);
