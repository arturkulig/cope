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

function execute(chain, arg) {
    var coperResult = utils.objectIfEmpty(arg);

    var coperPromise;

    var promiseChain = Promise.resolve(coperResult);

    var recalculateProgress = () => {
        coperPromise.progress(
            progress.sumProgress(runners)
        );
    };

    var runners = utils.arrayIfEmpty(chain).map(createPhaseRunner(recalculateProgress));

    var passResult = (/*any*/result) => {
        if (utils.isObject(result) && utils.isObject(coperResult)) {
            console.log("result:object",result);
            var newCoperResult = {};
            utils.append(newCoperResult, coperResult);
            utils.append(newCoperResult, result);
            return coperResult = newCoperResult;
        } else if (!utils.isUndefined(result)) {
            console.log("result:other",result);
            return coperResult = utils.objectIfEmpty(result);
        }
        console.log("result:same",result);
        return coperResult;
    };

    var chainRunners = (/*Function*/ runner) => {
        promiseChain = promiseChain
            .then(runner)
            .then(passResult);
    };

    runners.forEach(chainRunners);

    coperPromise = promiseChain;
    events.addEvents(coperPromise);
    progress.addProgress(coperPromise);
    return coperPromise;
}

function create(currentChain = []) {

    function coper(arg) {
        if (utils.isFunction(arg)) {
            return chain(currentChain, arg);
        } else {
            return execute(currentChain, arg);
        }
    }

    return coper;

}

export {
    create,
    clone
}
