//=include ./result.js

import {
    sumProgress,
    addProgress
} from './progress';

import {
    resolveResult
} from './result';

import {
    isArray,
    isObject
} from './utils';

// - - - - - - - - - - - - - - - - - - - - - - -

function createArrayPhaseRunner(phase, progressCb) {
    //todo
}
function createMapPhaseRunner(phase, progressCb) {
    //todo
}

function createFuncPhaseRunner(phase, progressCb) {

    function runner(result) {
        var {resultPromise, stepsPromises} = resolveResult(phase(result));

        stepsPromises.forEach(function (step) {
            step.then(() => {
                step.progress(1);
                runner.progress(sumProgress(stepsPromises));
                progressCb();
            });
        });

        return resultPromise;
    }

    addProgress(runner);

    return runner;
}

export function createPhaseRunner(progressCb) {
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
