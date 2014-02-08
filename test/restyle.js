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
  }
]);
