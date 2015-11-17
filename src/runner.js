//=include ./result.js

function createArrayPhaseRunner(phase, progressCb) {
    //todo
}
function createMapPhaseRunner(phase, progressCb) {
    //todo
}

function createFuncPhaseRunner(phase, progressCb) {

    function runner(result) {
        console.log("runner", "run");
        var {resultPromise, stepsPromises} = createResultResolver(phase(result));

        stepsPromises.forEach(function (step) {
            step.then(() => {
                step.progress(1);
                runner.progress(sumProgress(stepsPromises));
                progressCb();
            });
        });

        console.log("runner", "promise", result);
        resultPromise.then(r=>console.log("runner", "result", r));

        return resultPromise;
    }

    addProgress(runner);

    return runner;
}

function createPhaseRunner(progressCb) {

    return function (phase) {
        if (isArray(phase)) {
            return createArrayPhaseRunner(phase, progressCb);
        } else if (isObject(phase)) {
            return createMapPhaseRunner(phase, progressCb);
        } else {
            return createFuncPhaseRunner(phase, progressCb);
        }
    }
}
