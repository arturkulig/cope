export function isArray(arg) {
    return typeof arg === "object" && arg instanceof Array;
}

export function isPromise(arg) {
    return typeof arg === "object" && arg instanceof Promise;
}

export function isObject(arg) {
    return typeof arg === "object" && !isNull(arg) && !isArray(arg);
}

export function isFunction(arg) {
    return arg && (typeof arg === "function");
}

export function isUndefined(arg) {
    return arg === undefined;
}

export function isNull(arg) {
    return arg === null;
}

export function isEmpty(arg) {
    return isUndefined(arg) || isNull(arg);
}

export function append(target, source) {
    Object.keys(source).forEach(function (key) {
        target[key] = source[key];
    });
}

export function values(/*Object*/arg) {
    return mapValues(arg, (key)=>arg[key]);
}

export function mapValues(arg, func) {
    return Object.keys(arg).map(func);
}
export function mapObject(arg, func) {
    var mappedObject={};
    Object.keys(arg).forEach((key) => {
        mappedObject[key] = func(arg[key]);
    });
    return mappedObject;
}

export function forEachPromise(arg, func) {
    return arg.forEach(function (single) {
        single.then(func);
    })
}

export function objectIfEmpty(oldArg) {
    if (isEmpty(oldArg)) {
        return {};
    }
    return oldArg;
}

export function arrayIfEmpty(oldArg) {
    if (isEmpty(oldArg)) {
        return [];
    }
    return oldArg;
}

export function toPromise(arg) {
    if (isPromise(arg)) {
        return arg;
    }
    return Promise.resolve(arg);
}

export function execute(func) {
    if (isFunction(func)) {
        return func.apply(undefined, Array.prototype.slice.call(arguments, 1));
    } else {
        return func;
    }
}

export function noop() {
}
export function forceThrow(msg) {
    return ()=> {
        throw new Error(msg);
    }
}

export function getterSetter(subject, key, getter, setter) {
    Object.defineProperty(subject, key, {
        "configurable": false,
        "enumerable": true,
        "get": getter || noop,
        "set": setter || noop
    })
}
