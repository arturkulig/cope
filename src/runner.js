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

/**
 * Function that runs a function if function is given
 * or returns a value if first argument is a value
 * @param {Function|*} func
 * @param {Array} args
 * @returns {*}
 */
function resolvePossibleFunc(func, args) {
    if (isFunction(func)) {
        return func.apply(null, args);
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

export function createPhaseRunnerGenerator(progressCb) {

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


            if (isArray(phase)) {
                var {resultPromise, stepsPromises} = resolveArrayPhase(phase, previousResults);
            }
            else if (isObject(phase)) {
                var {resultPromise, stepsPromises} = resolveObjectPhase(phase, previousResults);
            }
            else {
                var {resultPromise, stepsPromises} = resolveFuncPhase(phase, previousResults);
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

    return createPhaseRunner;
}
