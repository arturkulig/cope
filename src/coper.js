import * as progress from './progress';

import * as events from './events';

import * as utils from './utils';

import {
    enhancePromise
} from './promise';

import {
    createPhaseRunner
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

    var promiseChain = Promise.resolve();

    var recalculateProgress = () => {
        coperPromise.progress(
            progress.sumProgress(runners)
        );
    };

    var runners = utils.arrayIfEmpty(chain).map(createPhaseRunner(recalculateProgress));

    var chainRunners = (/*Function*/ runner) => {
        promiseChain = promiseChain.then(runner);
    };

    runners.forEach(chainRunners);

    coperPromise = promiseChain;
    events.addEvents(coperPromise);
    progress.addProgress(coperPromise);
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
