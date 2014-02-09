# restyle object specifications
This page is dedicated to explain with examples how `restyle` objects are parsed and what these will produce as CSS.


### root object
```javascript
restyle({
  selector: object
});
```
A root object might contain one or more selectors as [property names](http://www.ecma-international.org/ecma-262/5.1/#sec-7.6) as it would be for any generic JavaScript object.
`{body:{}}` as well as `{'section#id > ul.class a:first-child':{}}` are all valid selector, and it's possible to combine them within the property name itself, literally as if it was a CSS selector.
```javascript
restyle({
  'html, body'; {
    padding: 0,
    margin: 0,
    width: '100%',
    height: '100%'
  },
  section: {
    textAlign: 'center'
  }
});
```
Above example will produce something like the following CSS:
```css
html, body {
  padding: 0px;
  margin: 0px;
  width: 100%;
  height: 100%;
}
section {
  text-align: center;
}
```

#### @media, @keyframes and special selectors
If the root object has a property which name starts with `@`, its value will be handled as the root of that media or keyframe, for the only exception of `@page` and `@font-face` where values will be handled as regular.
```javascript
restyle({
  'header:before': {
    height: 80,
    content: '"hi, this is header"'
  },
  '@media all and (max-width: 320px)': {
    'header:before': {
      display: 'none'
    },
    body: {
      padding: 0
    }
  }
});
```
The resulting CSS will look like the following:
```css
header:before {
  height: 80px;
  content: "hi, this is header";
}
@media all and (max-width: 320px) {
  header:before {
    display: none;
  },
  body {
    padding: 0px;
  }
}
```
`@keyfarmes` will behave similarly so that the following:
restyle({
  '@keyframes spin': {
    from: {transform: 'rotate(0deg)'},
    to: {transform: 'rotate(360deg)'}
  }
});
will produce the expected CSS as it is for `@media`.


### selector properties
Each selector will address a _key/value pairs_ object.
```javascript
selector: {
  key: value
}
```
In this case, _camelCase_ keys will be transformed into _camel-case_ one so that `fontSize` will produce the CSS property name `font-size` and so on with `lineHeight`, `textDecoration` and all sort of camelCase name you can think about.

The _value_ can be either a `string`, which will be used as it is, a `number`, which will be suffixed as pixel value, an `Object`, which will be used for sub-values of a group, or an `Array`, which will be used to repeat the property name with each entry of this Array.

Following details about each possible value type.

#### value as typeof(string)
This is straightforward, it will simply produce a property with that value.
```javascript
restyle({
  div: {
    background: 'transparent url(image.png) top center no-repeat'
  }
});
```
The outcome will be as simple as the following one:
```css
div {
  background: transparent url(image.png) top center no-repeat;
}
```
Bear in mind that right now there is no logic involved for any special property so that even `content` should be properly escaped.
```javascript
restyle({
  '.icon:before': {
    content: '"\\f123"'
  }
});
```
Producing `.icon:before{content:"\f123";}`

#### value as typeof(number)
Simple to remember, numbers are pixels ... not rounded pixels, not normalized pixels, just exact same value plus the `px` suffix.
```javascript
restyle({
  div: {
    width: 320
  }
});
```
will produce `div{width:320px;}`.

This is particularly handy when used at runtime, but it could simplify some computation via node module too.

#### value as Object
A classic example where an object comes handy, is the `background: transparent url(image.png) top center no-repeat;` one, where many `background` properties are declared at once.

These kind of declarations are usually as hard to remember as multiple arguments invoking a function, something _named arguments_ elegantly solved in many programming languages, hence the need for a nested object.
```javascript
restyle({
  div: {
    background: {
      color: 'transparent',
      image: 'url(image.png)',
      repeat: 'no-repeat',
      position: 'top center'
    }
  }
});
```
The CSS output will mirror as such:
```css
div {
  background-color: transparent;
  background-image: url(image.png);
  background-repeat: no-repeat;
  background-position: top center;
}
```
Remember, `restyle` module aim is not to apply magic, rather to be a robust, simple, and fast parser.
We can always use pre-processor optimizers _after_ a CSS has been produced via `restyle`.

Last, but not least, value objects can contain value objects, i.e.
```javascript
restyle({
  div: {
    border: {
      top: {
        color: '#000',
        style: 'solid',
        width: 1
      },
      bottom: {
        color: 'red',
        style: 'dashed',
        width: 4
      }
    }
  }
});
```
Producing the following CSS
```css
div {
  border-top-color: #000;
  border-top-style: solid;
  border-top-width: 1px;
  border-bottom-color: red;
  border-bottom-style: dashed;
  border-bottom-width: 4px;
}
```
I hope you agree with me value objects can reduce CSS typing and errors quite a lot ;-)

#### value as Array
Since in JavaScript we cannot write twice the same property name without overwriting the previous one or causing errors, `restyle` accepts `Array` values whenever is meant to repeat the property name with each value, i.e.
```javascript
restyle({
  '.flexbox': {
    display: [
      '-webkit-box',
      '-moz-box',
      '-ms-flexbox',
      '-webkit-flex',
      'flex'
    ]
  }
});
```
producing
```css
.flexbox {
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
}
```

Another classic example is the `@font-face` one, where the following CSS:
```css
@font-face {
  font-family: 'restyled';
  font-weight: normal;
  font-style: normal;
  src:url('/fonts/restyled.eot');
  src:url('/fonts/restyled.eot?#iefix') format('embedded-opentype'),
      url('/fonts/restyled.svg#restyled') format('svg'),
      url('/fonts/restyled.woff') format('woff'),
      url('/fonts/restyled.ttf') format('truetype');
}
```
could be generated "_as is_" through:
```javascript
restyle({
  '@font-face': {
    font: {
      family: 'restyled',
      weight: 'normal',
      style: 'normal'
    },
    src: [
      font('restyled.eot'),
      [ // note: this is **inline** as second value
        font('restyled.eot?#iefix', 'embedded-opentype'),
        font('restyled.svg#restyled', 'svg'),
        font('restyled.woff', 'woff'),
        font('restyled.ttf', 'truetype')
      ]
    ]
  }
});
function font(src, type) {
  return "url('" + src + "')" + (
    type ? " format('" + type + "')" : ""
  );
}
```
