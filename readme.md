#cope.js [![Build Status](https://travis-ci.org/arturkulig/cope.svg?branch=master)](https://travis-ci.org/arturkulig/cope)

---

##Idea

**cope** is ment as a replacement to **[co](https://github.com/tj/co)** for environments where you can't or don't want yet to use generator functions.
Where **co** manages generator function that has to yield Promises and resumes function when these Promises are resolved, **cope** deals with sets of function that return Promises.
Basically same things can be achieved with **co** and **cope**, but, of course, in different ways.

##Simple examples
Let's say (for the sake of keeping this example very simple) that getting *two* requires *three* and operation of addition is worth separating.
###vanilla example
```javascript
var three = Promise.resolve(3);
three
	.then(three => {
		return Promise.resolve(three - 1)
			.then( two => {
				return {three,two};
			});
	})
	.then(five => console.log(five); /* 5 */);
```
###co example
```javascript
co(function *(){
	var three = yield Promise.resolve(3);
	var two = yield Promise.resolve(three - 1);
	return three + two;
}).then(five => console.log(five); /* 5 */);
```
### cope example
```javascript
cope(()=>Promise.resolve(3))
	((three) => Promise.resolve(three - 1))
	((two,three) => three + two)
	()
	.then(five => console.log(five); /* 5 */);
```
---

##Installation
> npm install arturkulig/cope --save

or..
> bower install arturkulig/cope --save

##Usage

`cope` can be used as ES5:(CommonJS/AMD/global)/ES6 module.

ES6
```javascript
import cope from 'path_to_dist_folder/cope.es6.js';
```

AMD
```javascript
define(['path_to_dist_folder/cope.js'], function (copeModule) {
    //do stuff
});
```

Global registration
```html
<script src="path_to_dist_folder/cope.js"></script>
<script>
	var cope = window.cope;
</script>
```

##Example

>TODO

---
#Docs

>TODO
