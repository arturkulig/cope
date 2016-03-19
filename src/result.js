import {
    isObject,
    isArray,
    isNull,
    append,
    mapValues,
    isPromise,
    toPromise
} from './utils';

import {
    addProgress
} from './progress';

// - - - - - - - - - - - - - - - - - - - - - - -

function collectResults(resultsArray) {

    var mergedResult = {};

    resultsArray.forEach((result)=> {
        if (isObject(result) && !isNull(result)) {
            append(mergedResult, result);
        }
    });

    return mergedResult;
}

function resolveArray(executionResult) {
    var stepsPromises = executionResult.map(toPromise);
    var resultPromise = Promise.all(stepsPromises);

    return {stepsPromises, resultPromise};
}

function resolveMap(executionResult) {
    var stepsPromises = mapValues(executionResult, key => toPromise(executionResult[key]));
    var resultPromise = Promise.all(mapValues(executionResult, function (key) {
        return toPromise(executionResult[key])
            .then(function (resultPart) {
                return {[key]: resultPart};
            });
    })).then(collectResults);

    return {stepsPromises, resultPromise};
}

function resolveAny(executionResult) {
    var resultPromise = toPromise(executionResult);
    var stepsPromises = [resultPromise];

    return {stepsPromises, resultPromise};
}

export function resolveResult(executionResult) {
    if (isArray(executionResult)) {
        /** if is an array of values/Promises */
        var {stepsPromises,resultPromise} = resolveArray(executionResult);
    } else if (!isPromise(executionResult) && isObject(executionResult)) {
        /** if is a map of values/Promises */
        var {stepsPromises,resultPromise} = resolveMap(executionResult);
    } else {
        /** if value Promise or just a value */
        var {stepsPromises,resultPromise} = resolveAny(executionResult);
    }

    stepsPromises.forEach(addProgress);

    return {
        stepsPromises,
        resultPromise
    };

}
