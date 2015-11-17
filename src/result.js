function collectResults(resultsArray) {
    console.log("results", "collect", resultsArray);
    var mergedResult = {};

    resultsArray.forEach((result)=> {
        if (isObject(result) && !isNull(result)) {
            append(mergedResult, result);
        }
    });

    return mergedResult;
}

function createResultResolver(executionResult) {
    var resultPromise,
        stepsPromises;
    if (isArray(executionResult)) {
        console.log("result", "array", executionResult);
        stepsPromises = executionResult.map(toPromise);
        resultPromise = Promise.all(stepsPromises).then(collectResults);
    } else if (!isPromise(executionResult) && isObject(executionResult)) {
        console.log("result", "map", executionResult);
        stepsPromises = forEachMap(executionResult, function (key) {
            return new Promise(function (resolve, reject) {
                Promise.resolve(executionResult[key]).then(function (resultPart) {
                    var resultPartContainer = {};
                    resultPartContainer[key] = resultPart;
                    resolve(resultPartContainer);
                }, reject);
            })
        });
        resultPromise = Promise.all(stepsPromises).then(collectResults);
    } else {
        console.log("result", "any", executionResult);
        /** if value Promise or just a value */
        resultPromise = toPromise(executionResult);
        stepsPromises = [resultPromise];
    }

    stepsPromises.forEach(addProgress);

    return {
        stepsPromises,
        resultPromise
    };

}
