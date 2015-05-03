restyle
=======

[![build status](https://secure.travis-ci.org/WebReflection/restyle.png)](http://travis-ci.org/WebReflection/restyle)

**new** 10 minutes intro about [restyle.js in vimeo](https://vimeo.com/86671874)

This project has been somehow inspired by [absurd.js](http://krasimir.github.io/absurd/) but it is not exactly the same.

You can check [restyle specifications](https://github.com/WebReflection/restyle/blob/master/specs.md#restyle-object-specifications) or go directly to a [face 2 face against absurd](https://github.com/WebReflection/restyle/blob/master/VS.md#restyle-vs-absurd-by-examples) but the long story short is that no JavaScript library out there fits in about 1KB and feels as natural as `restyle` does in typing CSS.

Good news is, you can choose more now but let's see what's in the menu here ;-)

### In A Nutshell
`restyle` is a function able to transform the following:

```javascript
// we are in a browser
// defining some style at runtime
var myStyle = (function(){

  // some function helper
  function getSomeNumber(boundary) {
    return Math.floor(Math.random() * (boundary + 1));
  }

  // something we could reuse all over
  function hex(red, green, blue) {
    return '#'.concat(
      ('0' + red.toString(16)).slice(-2),
      ('0' + green.toString(16)).slice(-2),
      ('0' + blue.toString(16)).slice(-2)
    );
  }

  // the fresh new appended style object wrap
  return restyle({
    body: {
      backgroundColor: hex(100, 60, 25),
      padding: {
        top: 50,
        left: '30%'
      }
    },
    '.component > li': {
      width: window.innerWidth,
      height: getSomeNumber(200)
    },
    '.component > .icon-spinner': {
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
  });
}());
```

into this runtime appended and generated cross browser CSS style:

```css
body {
  background-color: #643c19;
  padding-top: 50px;
  padding-left: 30%;
}

.component > li {
  width: 1251px;
  height: 182px;
}

.component > .icon-spinner {
  -webkit-animation-name: spin;
  -moz-animation-name: spin;
  -ms-animation-name: spin;
  -o-animation-name: spin;
  animation-name: spin;
  -webkit-animation-duration: 4s;
  -moz-animation-duration: 4s;
  -ms-animation-duration: 4s;
  -o-animation-duration: 4s;
  animation-duration: 4s;
}

@-webkit-keyframes spin {
  from {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  to {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@-moz-keyframes spin {
  from {
    -moz-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  to {
    -moz-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@-ms-keyframes spin {
  from {
    -ms-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  to {
    -ms-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@-o-keyframes spin {
  from {
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  to {
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes spin {
  from {
    -webkit-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  to {
    -webkit-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
```

with the ability to drop all those styles at once:

```javascript
myStyle.remove();
```


### New In Version 0.4
It is now possible to simplify transitions through the `transition` public static method method.
```js
var transition = restyle.transition(
  genericElement,
  from: {
    opacity: '0',
    height: 34
  },
  to: {
    opacity: '1' // will keep height 34
  },
  function onTransitionEnd(e) {
    console.log('transition completed');
    e.detail.clean(); // remove related styles
  }
);
```

It is also possible to create multiple transitions from a starting point.
```js
var transition = restyle.transition(
  genericElement,
  from: {
    opacity: '0',
    height: 0
  },
  to: [{
    height: 200 // will keep opacity '0'
  }{
    opacity: '1' // will keep height 200
  }],
  function onTransitionEnd(e) {
    console.log('transition completed');
    e.detail.clean(); // remove related styles
  }
);
```
In latter case the final callback happens when last transition is completed.

At any time it is possible to ignore the callback via `transition.drop()` or to clean all styles and transitions via `transition.clean()`.

Please note that unless explicitly done, related styles will not be dropped.

If you need to keep the transition end CSS please add a class and after that clean everything else.



### New In Version 0.3
It is now possible to simplify animations through the `animate` method.

```js
// a generic animation style
var glowAnimation = restyle({
  '@keyframes glow-animation': {
    '0%':   { boxShadow: '0px 0px 0px 0px rgba(255,255,255,1)' },
    '100%': { boxShadow: '0px 0px 32px 16px rgba(255,255,255,1)' }
  },
  '.glow': {
    animation: {
      name: 'glow-animation',
      duration: '1s',
      direction: 'normal'
    }
  }
});

// glowing function
function glow(el, callback) {
  el.classList.add('glow');
  return glowAnimation.animate(el, 'glow-animation', callback);
}

// whenever is needed
document.querySelector('#link')
  .addEventListener('click', function (e) {
    // glow
    glow(e.currentTarget, function (event) {
      console.log(event);
    });
  });

```
The fallback is based on `setTimeout` and the returned object has a `.drop()` method able to cancel the animation end event.
The duration is retrieved automatically when the fallback is used.
Please note the fallback is compatible with `s` or `ms` as seconds or milliseconds and nothing else.

It is possible to retrieve an animation duration through the `.getAnimationDuration(domElement, animationName)` method which returns `-1` in case of failure.


### New In Version 0.2
The signature has been improved to accept a first argument representing a generic container/component prefix.
```js
var compStyle = restyle('my-component-name', {
  'div.large': {
    width: '100%'
  },
  span: {
    display: 'none'
  }
});
```
Above code will produce a CSS similar to the following one:
```css
my-component-name div.large {
  width: 100%;
}
my-component-name span {
  display: none;
}
```
This can be very handy when you have to style [Custom Elements](https://github.com/WebReflection/document-register-element#document-register-element) or generic reusable web components.


### Signature
```javascript

restyle(
  [component, ] // an optional string used to auto prefix all styles under a node/component
  Object        // a JSONish object as spec'd
  [, prefixes]  // optional prefixes
                // as node.js module this is by default an empty array
                //  generating prefixes-less CSS for other pre/post processors
                // in browsers this is by default all vendors prefixes
                //  without bothering much that -webkit-background does not even exist
                //  browsers will simply ignore CSS that is meaningless

  [, document]  // browsers only, eventually a different document from another realm
):Object;

```

### Specifications
The first `Object` parameter in `restyle` signature is spec'd as such:
```

selector        any CSS selector
                {
                  body: {
                    // ... 
                  },
                  'ul.dat > li:first-child': {
                    // ...
                  }
                }

property        a property name or a group name
                {
                  div: {
                    // properties
                    width: 256, // will result in "256px"
                    transform: 'rotate(360deg)',
                    background: 'transparent url(image.png) 0 0'
                  }
                }
                camelCase will be translated into camel-case
                (backgroundImage => background-image)

value           the property value or a group of properties
                if int, will be set as 'px' value

group           key/value properties names/values object
                or
                an Array of possible values for the property
                {
                  div: {
                    // group
                    background: {
                      color: 'transparent',
                      image: 'url(image.png)',
                      position: '0 0'
                    }
                  }
                }
                or
                {
                  '.flexbox': {
                    // mutiple values
                    display: [
                      '-webkit-box',
                      '-moz-box',
                      '-ms-flexbox',
                      '-webkit-flex',
                      'flex'
                    ]
                  }
                }

special         keyframes, media queries,
                anything that starts with @
                {
                  div: {
                    // as before
                  },
                  // special selectors
                  '@keyframes spin': {
                    // cpecialContent
                  }
                }

specialContent  everything supported by restyle as CSS
                {
                  // special selectors
                  '@keyframes spin': {
                    // properties => values or groups
                    '0%':   {transform: 'rotate(0deg)'},
                    '100%': {transform: 'rotate(360deg)'}
                  },
                  '@media all and (color)': {
                    'body': {
                      background: randomRainbow()
                    }
                  }
                }

```

### Reason & Benefits
Here a list of bullets to support `restyle` idea, grouped by usage.

#### As DOM Runtime

  * all values, groups, and even keys, can be generated at runtime after features detection or states
  * all vendor prefixes are placed automatically, no redundant CSS to write or download
  * all changes are confined in a single style element that can be dropped at any time
  * it can be used to style custom components preserving the overall application size
  * it fits in less than 1KB minzipped

#### As node.js module or Preprocessor

  * compared to Sass, Stylus, Less, and others, there's nothing new to learn: it's basically JSON that transpile to CSS
  * can be used upfront other preprocessors such beautifiers, cross platform transformers, etc.
  * CSS can be exported as generic JS modules, with the ability to include, require, and use any sort of utility able to simplify CSS creation, aggregate objects upfront for unified style, anything else you might think would be useful
  * it's simple, fast and straightforward

#### Compatibility

  * `restyle` is compatible with new browsers but also old as _IE6_ . If in doubt, [check the live test](http://webreflection.github.io/restyle/test/)
  * every node.js is able to use `restyle` too as the Travis passing build on top says ;-)

### Examples
It is possible to test them [directly in this page](http://webreflection.github.io/restyle/) but here few examples.
```javascript
// this example code
restyle({
  'html, body': {
    margin: 0,
    padding: 0,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    textAlign: 'center',
    fontFamily: 'sans-serif'
  },
  section: {
    margin: 'auto',
    marginTop: 20
  }
}, []);
```

It will generate a style with the following content.

```
html, body {
    margin: 0px;
    padding: 0px;
    width: 100%;
    height: 100%;
    overflow: hidden;
    text-align: center;
    font-family: sans-serif;
}

section {
    margin: auto;
    margin-top: 20px;
}
```

Things become more interesting with more complex CSS and prefixed support:
```javascript
restyle({
  'div > button:first-child': {
    transform: 'rotate(30deg)'
  }
}, ['moz', 'webkit']);
```

will result in

```css
div > button:first-child {
  -webkit-transform: rotate(30deg);
  -moz-transform: rotate(30deg);
  transform: rotate(30deg);
}
```

while this little piece of code:

```javascript
restyle({
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
});
```

will produce the following

```css
body > div{
  -webkit-animation-name:spin;
  -moz-animation-name:spin;
  -ms-animation-name:spin;
  -o-animation-name:spin;
  animation-name:spin;
  -webkit-animation-duration:4s;
  -moz-animation-duration:4s;
  -ms-animation-duration:4s;
  -o-animation-duration:4s;
  animation-duration:4s;
}
@-webkit-keyframes spin{
  from{
    -webkit-transform:rotate(0deg);
    transform:rotate(0deg);
  }
  to{
    -webkit-transform:rotate(360deg);
    transform:rotate(360deg);
  }
}
@-moz-keyframes spin{
  from{
    -moz-transform:rotate(0deg);
    transform:rotate(0deg);
  }
  to{
    -moz-transform:rotate(360deg);
    transform:rotate(360deg);
  }
}
@-ms-keyframes spin{
  from{
    -ms-transform:rotate(0deg);
    transform:rotate(0deg);
  }
  to{
    -ms-transform:rotate(360deg);
    transform:rotate(360deg);
  }
}
@-o-keyframes spin{
  from{
    -o-transform:rotate(0deg);
    transform:rotate(0deg);
  }
  to{
    -o-transform:rotate(360deg);
    transform:rotate(360deg);
  }
}
@keyframes spin{
  from{
    -webkit-transform:rotate(0deg);
    -moz-transform:rotate(0deg);
    -ms-transform:rotate(0deg);
    -o-transform:rotate(0deg);
    transform:rotate(0deg);
  }
  to{
    -webkit-transform:rotate(360deg);
    -moz-transform:rotate(360deg);
    -ms-transform:rotate(360deg);
    -o-transform:rotate(360deg);
    transform:rotate(360deg);
  }
}
```

### Special Features
There are few tricks hidden in the simple `restyle` logic where `Array` values are able to combine multiple declarations at once.

#### multiple values, same property
The most classic example here would be `flex-box` _mess_, simplified through a variable
```javascript
var flexBox = [
  '-webkit-box',
  '-moz-box',
  '-ms-flexbox',
  '-webkit-flex',
  'flex'
];
```
reusable whenever it's needed:
```javascript
restyle({
  'div.container': {
    display: flexBox
  }
});
```
resulting into the following CSS
```css
div.container {
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
}
```

#### multiple styles, same selector
Another example would be _mixins_ or reusable functions in order to define some grouped style and reuse this whenever is needed.
```javascript
function flexbox() {
  return {
    display: [
      '-webkit-box',
      '-moz-box',
      '-ms-flexbox',
      '-webkit-flex',
      'flex'
    ]
  };
}
function flex(values) {
  return {
    boxFlex: values,
    flex: values
  };
}
function order(value) {
  return {
    boxOrdinalGroup: value,
    flexOrder: value,
    order: value
  };
}
restyle({
  '.wrapper': flexbox(),
  '.item': [
    flex('1 200px'),
    order(2)
  ]
});
```
Above is a `restyle` example of [ths Sass one](http://css-tricks.com/snippets/css/a-guide-to-flexbox/) showed in CSS tricks.



### What Is NOT
Just to be clear what `restyle` is not a CSS validator, beautifier, or uglifier, plus it is not responsible or capable of making everything magically works.

As example, `flex-box` is not fixed, neither early or non standard implementation of any feature.
However, **you can simply combine** a common class fix for flex-box and use `restyle` to add more or simply specify other properties, there are no implicit limits in what you can write through `restyle`.

**You are free to fix things** indeed by your own, deciding very specific CSS accordingly with the browser if done at runtime or simply trusting other pre-processors if done on the server side with the benefit that the object will be reused in both worlds, as example:

```javascript
var flexValue = '1 200px',
    orderValue = 2,
    flexBox = [
      '-webkit-box',
      '-moz-box',
      '-ms-flexbox',
      '-webkit-flex',
      'flex'
    ];

var flex = restyle({
  '.wrapper': {
    display: flexBox
  },
  '.item': {
    boxFlex: flexValue,
    flex: flexValue,
    boxOrdinalGroup: orderValue,
    flexOrder: orderValue,
    order: orderValue
  }
});
```

### F.A.Q.

  * **why so many prefixes in the DOM version ?** Not influent at runtime, invisible via node, but I've hopefully [replied to this here](http://webreflection.blogspot.com/2014/02/restylejs-simplified-css-approach.html#prefixes) already ;-)
  * **should I serve all CSS only via `restyle` at runtime?** you can do whatever you want. You can combine normal CSS with restyle in order to add special FX only or new features where prefixes are a mess. You can use restyle only to fix things that need to be fixed for browsers that support JS. You can use only `restyle` if your app depends on JavaScript so there's no way it's going to be used or useful at all without JS enabled. You chose, don't blame the tool, it's here to help when needed ;-)
  * **what's the difference with absurd.js?** by the time I am writing this, `restyle` works better for WebApp development at runtime and wins in size and performance but it cannot compete against `absurd` on the server side since it does nothing that `absurd` does, only the object syntax is similar. Bear in mind I've said **similar** but **not identical**, `absurd.js` is by design not able to solve a property name from a tagName while `restyle` simply represents CSS without magic involved.
  * **can I use `restyle` for serving both server and client at runtime?** Yes, again, you can use `restyle` as you wish. On the server, you can use same logic you would apply on the client and maybe chose to serve that pre-processed file inside a noscript as external link, using `restyle` for all other JS centric cases or for **graceful enhancement** without compromising the layout. CSS modules can be shared, reused, the same, both pre-processed as CSS behind other pre-processors, or just with all prefixes generated at runtime for more complex scenarios. Go wild, still respect your site/app users ;-)
  * **didn't Netscape with [JSSS](http://en.wikipedia.org/wiki/JavaScript_Style_Sheets) ... bla bla?** probably you didn't read what `restyle` is, neither what JSSS proposal was. Please take a minute to understand again what is this about, and feel free to use JSSS if you think that's even an option.

If you have any hint about some syntax that could improve `restyle` ease please let me know, thanks.
