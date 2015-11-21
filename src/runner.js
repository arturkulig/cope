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
    isObject,
    isFunction,
    mapObject
} from './utils';

// - - - - - - - - - - - - - - - - - - - - - - -

function resolvePossibleFunc(func, arg) {
    if (isFunction(func)) {
        return func(arg);
    } else {
        return func;
    }
}

function resolveObjectPhase(phase, previousResult) {
    return resolveResult(
        mapObject(
            phase,
            phasePart => resolvePossibleFunc(phasePart, previousResult)
        )
    );
}

function resolveArrayPhase(phase, previousResult) {
    return resolveResult(phase.map(
        phasePart => resolvePossibleFunc(phasePart, previousResult)
    ));
}

function resolveFuncPhase(phase, previousResult) {
    return resolveResult(resolvePossibleFunc(phase, previousResult));
}

export function createPhaseRunner(progressCb) {

    return function (phase) {

        function runner(previousResult) {


            if (isArray(phase)) {
                var {resultPromise, stepsPromises} = resolveArrayPhase(phase, previousResult);
            }
            else if (isObject(phase)) {
                var {resultPromise, stepsPromises} = resolveObjectPhase(phase, previousResult);
            }
            else {
                var {resultPromise, stepsPromises} = resolveFuncPhase(phase, previousResult);
            }

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
}
