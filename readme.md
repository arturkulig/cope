# cope.js [![Build Status](https://travis-ci.org/arturkulig/cope.svg?branch=master)](https://travis-ci.org/arturkulig/cope)

---

## Idea

**cope** is ment as a replacement to **[co](https://github.com/tj/co)** for environments where you can't or don't want yet to use generator functions, but it comes with a bonus of progress reporting what **co** won't be able to do cause of possibility of using loops inside of generator function.

Where **co** manages generator function that has to yield Promises and resumes function when these Promises are resolved, **cope** deals with sets of function that return Promises.
Basically same things can be achieved with **co** and **cope**, but, of course, in different ways.

## Comparison examples
Let's say (for the sake of keeping this example very simple) that getting *two* requires *three* and operation of addition is worth separating.

### vanilla example
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

### co example

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

## Installation
> npm install arturkulig/cope --save

## Usage

`cope` is packed with UMD, so can be used as CommonJS/AMD/global/ES6 module.

ES6 example
```javascript
import cope from 'path_to_dist_folder/cope.js';
```

CommonJS
```javascript
var cope = require('cope');
```

Global registration
```html
<script src="path_to_dist_folder/cope.js"></script>
<script>
	var cope = window.cope;
</script>
```

## Basic example

```javascript
cope
	//so like this we start we define a queue
(fetch('/api/something'))
	// this will download something from some backend
(response => response.json())
	// with fetch we have to transform response to an object if it's json
(json => console.log(json))
	// so currently we are just previewing the response
()
	// and with this will actually run the queue
```

You can reuse once defined queue.

```javascript
setInterval(
	cope
	(fetch('/api/something'))
	(response => response.json())
	(json => console.log(json)),
	1000
);
```

## Advanced examples

### Progress reporting
Due to lib returning enhanced Promise you can do progress reporting inside a component or a store where you hold such information.

```javascript
cope
(()=>asyncTask1())
(()=>asyncTask2())
(()=>asyncTask3())
(()=>asyncTask4())
().then(
	(result) => console.log("done!", result),
	(reason) => console.log("oopsies!", reason),
	(progress) => console.log("almost done: ", progress*100, "%")
)
```
..so if everything goes OK, it should output

	almost done: 25%
	almost done: 50%
	almost done: 75%
	almost done: 100%
	done!

### Nesting

If nesting copes you still get most precise progress result. Let's change previous example a little bit.

```javascript
cope
(() => cope
		(()=>asyncTask1())
		(()=>asyncTask2())
(() => asyncTask3())
().then(
	(result) => console.log("done!", result),
	(reason) => console.log("oopsies!", reason),
	(progress) => console.log("almost done: ", progress*100, "%")
)
```

..again, if everything goes OK, it should output

	almost done: 25%
	almost done: 50%
	almost done: 100%
	done!
