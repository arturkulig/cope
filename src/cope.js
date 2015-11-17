//=include ./events.js
//=include ./progress.js
//=include ./runner.js

function cope(startingFunction) {

    //if (!isFunction(startingFunction)) {
    //    throw new Error("cope requires function as an argument");
    //}

    return cope.clone(null)(startingFunction);

}

cope.clone = function (oldCoper) {

    var newCoper = createNewCoper();

    if (isObject(oldCoper)) {
        newCoper.chain = newCoper.chain.concat(oldCoper.chain);
    }

    return newCoper;
};

function createNewCoper() {

    function coper(arg) {
        if (isFunction(arg)) {

            /**
             * chain new function
             */
            var newCoper = cope.clone(coper, arg);
            newCoper.chain.push(arg);
            return newCoper;
        } else {

            /**
             * execute chain
             */

            var coperResult;

            var coperPromise;

            var promiseChain = (
                coper.isBusy
                    ? coper.promise
                    : Promise.resolve(!isUndefined(arg) ? arg : coper.result)
            )
                .then(lastResult => coperResult = objectIfEmpty(lastResult));


            var runners = coper.chain.map(
                createPhaseRunner(()=> {
                    var progress = sumProgress(runners);
                    coperPromise.progress(progress);
                    coper.progress(progress);
                })
            );

            runners.forEach(runner=> {
                promiseChain = promiseChain
                    .then(runner)
                    .then(result=> {
                        if (isObject(result) && isObject(coperResult)) {
                            var newCoperResult = {};
                            append(newCoperResult, coperResult);
                            append(newCoperResult, result);
                            return coperResult = newCoperResult;
                        } else if (!isUndefined(result)) {
                            return coperResult = objectIfEmpty(result);
                        }
                        return coperResult;
                    });
            });

            coperPromise = promiseChain.then(
                result => {
                    if (coper.promise === coperPromise) {
                        coper.promise = null;
                    }
                    coper.result = result;
                    coper.reason = null;
                    return result;
                },
                reason => {
                    if (coper.promise === coperPromise) {
                        coper.promise = null;
                    }
                    coper.reason = reason;
                    return Promise.reject(reason);
                }
            );
            addProgress(coperPromise);
            return coper.promise = coperPromise;
        }
    }

    coper.isCoper = true;

    coper.chain = [];
    var originalCoperResult = {};
    coper.result = originalCoperResult;
    coper.reason = null;
    coper.promise = null;

    getterSetter(coper, "isReady",
        () => originalCoperResult !== coper.result && coper.promise === null && coper.reason === null,
        forceThrow("coper state flags cannot be set"));

    getterSetter(coper, "wasReady",
        () => originalCoperResult !== coper.result && coper.reason === null,
        forceThrow("coper state flags cannot be set"));

    getterSetter(coper, "isBusy",
        () => coper.promise !== null,
        forceThrow("coper state flags cannot be set"));

    getterSetter(coper, "isFailed",
        () => coper.promise === null && coper.reason !== null,
        forceThrow("coper state flags cannot be set"));

    addEvents(coper);
    addProgress(coper);

    coper.clone = () => cope.clone(coper);

    return coper;

}

