import {
    sumProgress
}  from './progress';

import * as utils from './utils';

import {
    enhancePromise
} from './promise';

import {
    createPhaseRunnerGenerator
} from './runner';

// - - - - - - - - - - - - - - - - - - - - - - -

function clone(oldChain) {
    return create(oldChain);
}

function chain(oldChain, arg) {
    return create(utils.arrayIfEmpty(oldChain).concat([arg]));
}

function execute(chain) {

    var coperPromise;

    var recalculateProgress = () => {
        coperPromise.progress(
            sumProgress(runners)
        );
    };

    var runners = utils.arrayIfEmpty(chain).map(createPhaseRunnerGenerator(recalculateProgress));

    var results = [];

    var promiseChain = Promise.resolve();

    var chainRunners = (runner) => {
        promiseChain = promiseChain
            .then(runner)
            .then(result => {
                results.unshift(result);
                return results;
            });
    };

    runners.forEach(chainRunners);

    coperPromise = promiseChain.then(()=>results[0]);
    enhancePromise(coperPromise);
    return coperPromise;
}

function create(currentChain = []) {

    function coper(arg) {
        if (!utils.isEmpty(arg)) {
            return chain(currentChain, arg);
        } else {
            return execute(currentChain);
        }
    }

    return coper;

}

export {
    create,
    clone
}
