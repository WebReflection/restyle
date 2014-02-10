# restyle VS absurd by examples
Taking [absurd.js](http://krasimir.github.io/absurd/) test page, here something you might want to compare.

Bear in mind I am stating the obvious all over in this page since `restyle` once again does not add any magic, it's rather a 1:1 with CSS representation.

Check [specs.md](https://github.com/WebReflection/restyle/blob/master/specs.md#restyle-object-specifications) if you want to know more about `restyle` syntax specs.

### basic object

#### absurd
```javascript
api.add({
	body: {
		marginTop: "20px",
		width: "100%"
	},
	header: {
		width: "100%"
	}
});
```
will produce
```css
body {
  margin-top: 20px;
}
body, header {
  width: 100%;
}
```
note that `body` and `header` have been magically grouped with the same property.

#### restyle
```javascript
restyle({
  body: {
    marginTop: 20
  },
  'body, header': {
    width: '100%'
  }
});
```
will produce exactly same CSS


### nesting

#### absurd
```javascript
api.add({
	body: {
		marginTop: "20px",
		width: "100%",
		p: {
			color: "#BADA55"
		}
	}
});
```
will produce
```css
body {
  margin-top: 20px;
  width: 100%;
}
body p {
  color: #BADA55;
}
```

#### restyle
```javascript
restyle({
  body: {
    marginTop: 20,
    width: '100%'
  },
  'body p': {
    color: '#BADA55'
  }
});
```
will produce exactly same CSS


### pseudo-classes

#### absurd
```javascript
api.add({
	body: {
		a: {
			color: "#FFF",
			":hover": {
				textDecoration: "none"
			},
			":after": {
				display: "block",
				content: "---"
			}
		}
	}
});
```
will produce
```css
body a {
  color: #FFF;
}
body a:hover {
  text-decoration: none;
}
body a:after {
  display: block;
  content: ---;
}
```

#### restyle
```javascript
restyle({
  'body a': {
    color: '#FFF'
  },
  'body a:hover': {
    textDecoration: 'none'
  },
  'body a:after': {
    display: 'block',
    content: '---'
  }
});
```
will produce exactly same CSS


### JS variables and functions

#### absurd
```javascript
var themeColor = "#BADA55";
var textStyles = function(size) {
	return {
		color: themeColor,
		fontSize: size + "px",
		lineHeight: size + "px"
	}
}
api.add({
	body: {
		color: function() {
			return "#000"
		},
		p: textStyles(16),
		h1: [
			textStyles(50),
			{ lineHeight: "60px" } 
		]
	}
});
```
will produce
```css
body {
  color: #000;
}
body p, body h1 {
  color: #BADA55;
}
body p {
  font-size: 16px;
  line-height: 16px;
}
body h1 {
  font-size: 50px;
  line-height: 60px;
}
```

#### restyle
```javascript
var themeColor = '#BADA55';
var textStyles = function(fs, lh) {
  return {
    fontSize: fs,
    lineHeight: lh || fs
  }
}
restyle({
  body: {
    color: '#000'
  },
  'body p, body h1': {
    color: themeColor
  },
  'body p': textStyles(16),
  'body h1': textStyles(50, 60)
});
```
will produce exactly same CSS.


### media queries

#### absurd
```javascript
api.add({
	body: {
		".wrapper": {
			width: "940px",
			"@media all (min-width: 550px)": {
				width: "400px"
			}
		},
		p: {
			"@media all (min-width: 550px)": {
				fontSize: "20px"
			}	
		}
	}
});
```
will produce
```css
body .wrapper {
  width: 940px;
}
@media all (min-width: 550px) {
  body .wrapper {
    width: 400px;
  }
  body p {
    font-size: 20px;
  }
}
```

#### restyle
```javascript
restyle({
  'body .wrapper': {
    width: 940,
  },
  '@media all (min-width: 550px)': {
    'body .wrapper': {
      width: 400
    },
    'body p': {
      fontSize: 20
    }
  }
});
```
will produce exactly same CSS.


### mixins

In this case `restyle` has a very simple implementation, values as `Array`
```javascript
function red() {
  return {
    color: '#FFF',
    background: '#A30'
  };
}
function bordered() {
  return {
    border: '1px solid black'
  };
}
restyle({
  '.red-bordered': [
    red(),
    bordered()
  ]
});
```
Due simplicity of its parser, the generated layout will look like the following:
```css
.red-bordered {
  color: #FFF;
  background: #A30;
}
.red-bordered {
  border: 1px solid black;
}
```
Once again, `restyle` goal is to "just work" in the smallest, simplest, yet efficient way to think CSS via JS objects.


### Conclusions
Other cases are probably not possible in `restyle` as well as few `restyle` cases are not possible in `absurd`.

In few words, this comparison is to show that there is really nothing behind `restyle` about components, storage, HTML, etc, etc, at least now you hopefully know what is `restyle` about and how you should use it.