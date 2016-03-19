(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["cope"] = factory();
	else
		root["cope"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var cope = __webpack_require__(1);
	
	module.exports = cope.default;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _coper = __webpack_require__(2);
	
	var coper = _interopRequireWildcard(_coper);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	// - - - - - - - - - - - - - - - - - - - - - - -
	
	function cope(startingFunction) {
	    return cope.clone(null)(startingFunction);
	}
	
	cope.clone = coper.clone;
	
	exports.default = cope;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.clone = exports.create = undefined;
	
	var _progress = __webpack_require__(3);
	
	var _utils = __webpack_require__(4);
	
	var utils = _interopRequireWildcard(_utils);
	
	var _promise = __webpack_require__(5);
	
	var _runner = __webpack_require__(7);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	// - - - - - - - - - - - - - - - - - - - - - - -
	
	function clone(oldChain) {
	    return create(oldChain);
	}
	
	function chain(oldChain, arg) {
	    return create(utils.arrayIfEmpty(oldChain).concat([arg]));
	}
	
	function execute(chain) {
	
	    var coperPromise;
	
	    var recalculateProgress = function recalculateProgress() {
	        coperPromise.progress((0, _progress.sumProgress)(runners));
	    };
	
	    var runners = utils.arrayIfEmpty(chain).map((0, _runner.createPhaseRunnerGenerator)(recalculateProgress));
	
	    var results = [];
	
	    var promiseChain = Promise.resolve();
	
	    var chainRunners = function chainRunners(runner) {
	        promiseChain = promiseChain.then(runner).then(function (result) {
	            results.unshift(result);
	            return results;
	        });
	    };
	
	    runners.forEach(chainRunners);
	
	    coperPromise = promiseChain.then(function () {
	        return results[0];
	    });
	    (0, _promise.enhancePromise)(coperPromise);
	    return coperPromise;
	}
	
	function create() {
	    var currentChain = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
	
	    function coper(arg) {
	        if (!utils.isEmpty(arg)) {
	            return chain(currentChain, arg);
	        } else {
	            return execute(currentChain);
	        }
	    }
	
	    return coper;
	}
	
	exports.create = create;
	exports.clone = clone;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.addProgress = exports.sumProgress = undefined;
	
	var _utils = __webpack_require__(4);
	
	// - - - - - - - - - - - - - - - - - - - - - - -
	
	function sumProgress(progressableArray) {
	    if ((0, _utils.isArray)(progressableArray)) {
	        var progressSum = progressableArray.reduce(function (sum, step) {
	            return sum + (step.progress ? step.progress() : 0);
	        }, 0);
	
	        return progressSum / progressableArray.length;
	    }
	    return 0;
	}
	
	function addProgress(subject) {
	    subject._progress = subject._progress || 0;
	    subject.progress = function (newValue) {
	        if (typeof newValue === "number") {
	            subject._progress = newValue;
	            subject.triggerListener && subject.triggerListener("progress", newValue);
	        }
	        return subject._progress || 0;
	    };
	}
	
	exports.sumProgress = sumProgress;
	exports.addProgress = addProgress;

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.isArray = isArray;
	exports.isPromise = isPromise;
	exports.isObject = isObject;
	exports.isFunction = isFunction;
	exports.isUndefined = isUndefined;
	exports.isNull = isNull;
	exports.isEmpty = isEmpty;
	exports.append = append;
	exports.values = values;
	exports.mapValues = mapValues;
	exports.mapObject = mapObject;
	exports.forEachPromise = forEachPromise;
	exports.objectIfEmpty = objectIfEmpty;
	exports.arrayIfEmpty = arrayIfEmpty;
	exports.toPromise = toPromise;
	exports.execute = execute;
	exports.noop = noop;
	exports.forceThrow = forceThrow;
	exports.getterSetter = getterSetter;
	
	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }
	
	function isArray(arg) {
	    return (typeof arg === "undefined" ? "undefined" : _typeof(arg)) === "object" && arg instanceof Array;
	}
	
	function isPromise(arg) {
	    return (typeof arg === "undefined" ? "undefined" : _typeof(arg)) === "object" && arg instanceof Promise;
	}
	
	function isObject(arg) {
	    return (typeof arg === "undefined" ? "undefined" : _typeof(arg)) === "object" && !isNull(arg) && !isArray(arg);
	}
	
	function isFunction(arg) {
	    return arg && typeof arg === "function";
	}
	
	function isUndefined(arg) {
	    return arg === undefined;
	}
	
	function isNull(arg) {
	    return arg === null;
	}
	
	function isEmpty(arg) {
	    return isUndefined(arg) || isNull(arg);
	}
	
	function append(target, source) {
	    Object.keys(source).forEach(function (key) {
	        target[key] = source[key];
	    });
	}
	
	function values( /*Object*/arg) {
	    return mapValues(arg, function (key) {
	        return arg[key];
	    });
	}
	
	function mapValues(arg, func) {
	    return Object.keys(arg).map(func);
	}
	function mapObject(arg, func) {
	    var mappedObject = {};
	    Object.keys(arg).forEach(function (key) {
	        mappedObject[key] = func(arg[key]);
	    });
	    return mappedObject;
	}
	
	function forEachPromise(arg, func) {
	    return arg.forEach(function (single) {
	        single.then(func);
	    });
	}
	
	function objectIfEmpty(oldArg) {
	    if (isEmpty(oldArg)) {
	        return {};
	    }
	    return oldArg;
	}
	
	function arrayIfEmpty(oldArg) {
	    if (isEmpty(oldArg)) {
	        return [];
	    }
	    return oldArg;
	}
	
	function toPromise(arg) {
	    if (isPromise(arg)) {
	        return arg;
	    }
	    return Promise.resolve(arg);
	}
	
	function execute(func) {
	    if (isFunction(func)) {
	        return func.apply(undefined, Array.prototype.slice.call(arguments, 1));
	    } else {
	        return func;
	    }
	}
	
	function noop() {}
	function forceThrow(msg) {
	    return function () {
	        throw new Error(msg);
	    };
	}
	
	function getterSetter(subject, key, getter, setter) {
	    Object.defineProperty(subject, key, {
	        "configurable": false,
	        "enumerable": true,
	        "get": getter || noop,
	        "set": setter || noop
	    });
	}

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.enhancePromise = undefined;
	
	var _progress = __webpack_require__(3);
	
	var _events = __webpack_require__(6);
	
	// - - - - - - - - - - - - - - - - - - - - - - -
	
	/**
	 * Progressify a promise
	 * @param {Promise} p
	 */
	function enhancePromise(p) {
	    (0, _progress.addProgress)(p);
	    (0, _events.addEvents)(p);
	
	    // don't use Promise prototype due to possible usage of other Promise libraries
	    var originalThen = p.then;
	
	    p.then = function (onResolve, onReject, onProgress) {
	        if (onProgress) {
	            p.addListener('progress', onProgress);
	        }
	        if (onResolve || onReject) {
	            return originalThen.call(p, onResolve, onReject);
	        } else {
	            return p;
	        }
	    };
	
	    var listenerRemover = function listenerRemover() {
	        p.removeListener('progress');
	    };
	    originalThen.call(p, listenerRemover, listenerRemover);
	}
	
	exports.enhancePromise = enhancePromise;

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	function addEvents(subject) {
	
	    var listeners = [];
	
	    subject.addListener = subject.addEventListener = function addEventListener(eventName, listener) {
	        listeners[eventName] = listeners[eventName] || [];
	        if (listener && listeners[eventName].indexOf(listener) < 0) {
	            listeners[eventName].push(listener);
	        }
	        return subject;
	    };
	
	    subject.removeListener = subject.removeEventListener = function (eventName, listener) {
	        listeners[eventName] = listeners[eventName] || [];
	        if (listener) {
	            if (listeners[eventName].indexOf(listener) >= 0) {
	                listeners[eventName].splice(listeners[eventName].indexOf(listener), 1);
	            }
	        } else {
	            listeners[eventName] = null;
	        }
	        return subject;
	    };
	
	    subject.triggerListener = function triggerListener(eventName, eventSubject) {
	        if (listeners[eventName]) {
	            listeners[eventName].forEach(function (listener) {
	                listener.call(undefined, eventSubject !== undefined ? eventSubject : null);
	            });
	        }
	        return subject;
	    };
	}
	
	exports.addEvents = addEvents;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.createPhaseRunnerGenerator = createPhaseRunnerGenerator;
	
	var _progress = __webpack_require__(3);
	
	var _result = __webpack_require__(8);
	
	var _utils = __webpack_require__(4);
	
	// - - - - - - - - - - - - - - - - - - - - - - -
	
	/**
	 * Function that runs a function if function is given
	 * or returns a value if first argument is a value
	 * @param {Function|*} func
	 * @param {Array} args
	 * @returns {*}
	 */
	function resolvePossibleFunc(func, args) {
	    if ((0, _utils.isFunction)(func)) {
	        return func.apply(null, args);
	    } else {
	        return func;
	    }
	} //=include ./result.js
	
	function resolveObjectPhase(phase, previousResult) {
	    return (0, _result.resolveResult)((0, _utils.mapObject)(phase, function (phasePart) {
	        return resolvePossibleFunc(phasePart, previousResult);
	    }));
	}
	
	function resolveArrayPhase(phase, previousResult) {
	    return (0, _result.resolveResult)(phase.map(function (phasePart) {
	        return resolvePossibleFunc(phasePart, previousResult);
	    }));
	}
	
	function resolveFuncPhase(phase, previousResult) {
	    return (0, _result.resolveResult)(resolvePossibleFunc(phase, previousResult));
	}
	
	/**
	 * @callback Phase
	 * @param {...*} previousResults
	 */
	
	/**
	 * @callback ProgressCallback
	 */
	
	/**
	 *
	 * @param {ProgressCallback} progressCb
	 * @returns {createPhaseRunner}
	 */
	
	function createPhaseRunnerGenerator(progressCb) {
	
	    /**
	     * Returns function that will deal with running a phase and reporting a progress
	     * @param {Phase} phase
	     * @returns {runner}
	     */
	    function createPhaseRunner(phase) {
	
	        /**
	         * Function that knows is for running phase that is has in its closure
	         * @param {Array} previousResults
	         */
	        function runner(previousResults) {
	
	            if ((0, _utils.isArray)(phase)) {
	                var _resolveArrayPhase = resolveArrayPhase(phase, previousResults);
	
	                var resultPromise = _resolveArrayPhase.resultPromise;
	                var stepsPromises = _resolveArrayPhase.stepsPromises;
	            } else if ((0, _utils.isObject)(phase)) {
	                var _resolveObjectPhase = resolveObjectPhase(phase, previousResults);
	
	                var resultPromise = _resolveObjectPhase.resultPromise;
	                var stepsPromises = _resolveObjectPhase.stepsPromises;
	            } else {
	                var _resolveFuncPhase = resolveFuncPhase(phase, previousResults);
	
	                var resultPromise = _resolveFuncPhase.resultPromise;
	                var stepsPromises = _resolveFuncPhase.stepsPromises;
	            }
	
	            stepsPromises.forEach(function (step) {
	                step.then(function () {
	                    step.progress(1);
	                    runner.progress((0, _progress.sumProgress)(stepsPromises));
	                    progressCb();
	                }, null, function (progress) {
	                    if (typeof progress === 'number') {
	                        runner.progress((0, _progress.sumProgress)(stepsPromises));
	                        progressCb();
	                    }
	                });
	            });
	
	            return resultPromise;
	        }
	
	        (0, _progress.addProgress)(runner);
	
	        return runner;
	    }
	
	    return createPhaseRunner;
	}

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.resolveResult = resolveResult;
	
	var _utils = __webpack_require__(4);
	
	var _progress = __webpack_require__(3);
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
	// - - - - - - - - - - - - - - - - - - - - - - -
	
	function collectResults(resultsArray) {
	
	    var mergedResult = {};
	
	    resultsArray.forEach(function (result) {
	        if ((0, _utils.isObject)(result) && !(0, _utils.isNull)(result)) {
	            (0, _utils.append)(mergedResult, result);
	        }
	    });
	
	    return mergedResult;
	}
	
	function resolveArray(executionResult) {
	    var stepsPromises = executionResult.map(_utils.toPromise);
	    var resultPromise = Promise.all(stepsPromises);
	
	    return { stepsPromises: stepsPromises, resultPromise: resultPromise };
	}
	
	function resolveMap(executionResult) {
	    var stepsPromises = (0, _utils.mapValues)(executionResult, function (key) {
	        return (0, _utils.toPromise)(executionResult[key]);
	    });
	    var resultPromise = Promise.all((0, _utils.mapValues)(executionResult, function (key) {
	        return (0, _utils.toPromise)(executionResult[key]).then(function (resultPart) {
	            return _defineProperty({}, key, resultPart);
	        });
	    })).then(collectResults);
	
	    return { stepsPromises: stepsPromises, resultPromise: resultPromise };
	}
	
	function resolveAny(executionResult) {
	    var resultPromise = (0, _utils.toPromise)(executionResult);
	    var stepsPromises = [resultPromise];
	
	    return { stepsPromises: stepsPromises, resultPromise: resultPromise };
	}
	
	function resolveResult(executionResult) {
	    if ((0, _utils.isArray)(executionResult)) {
	        /** if is an array of values/Promises */
	
	        var _resolveArray = resolveArray(executionResult);
	
	        var stepsPromises = _resolveArray.stepsPromises;
	        var resultPromise = _resolveArray.resultPromise;
	    } else if (!(0, _utils.isPromise)(executionResult) && (0, _utils.isObject)(executionResult)) {
	        /** if is a map of values/Promises */
	
	        var _resolveMap = resolveMap(executionResult);
	
	        var stepsPromises = _resolveMap.stepsPromises;
	        var resultPromise = _resolveMap.resultPromise;
	    } else {
	        /** if value Promise or just a value */
	
	        var _resolveAny = resolveAny(executionResult);
	
	        var stepsPromises = _resolveAny.stepsPromises;
	        var resultPromise = _resolveAny.resultPromise;
	    }
	
	    stepsPromises.forEach(_progress.addProgress);
	
	    return {
	        stepsPromises: stepsPromises,
	        resultPromise: resultPromise
	    };
	}

/***/ }
/******/ ])
});
;
//# sourceMappingURL=cope.js.map