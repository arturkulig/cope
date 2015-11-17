function isArray(arg) {
    return typeof arg === "object" && arg instanceof Array;
}

function isPromise(arg) {
    return typeof arg === "object" && arg instanceof Promise;
}

function isObject(arg) {
    return typeof arg === "object" && !isNull(arg) && !isArray(arg);
}

function isFunction(arg) {
    return arg && (typeof arg === "function");
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

function forEachMap(arg, func) {
    return Object.keys(arg).map(func);
}

function forEachPromise(arg, func) {
    return arg.forEach(function (single) {
        single.then(func);
    })
}

function objectIfEmpty(oldArg) {
    if (isEmpty(oldArg)) {
        return {};
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

function noop() {
}
function forceThrow(msg) {
    return ()=> {
        throw new Error(msg);
    }
}

function getterSetter(subject, key, getter, setter) {
    Object.defineProperty(subject, key, {
        "configurable": false,
        "enumerable": true,
        "get": getter || noop,
        "set": setter || noop
    })
}
