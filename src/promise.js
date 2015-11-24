import {
    addProgress
}  from './progress';

import {
    addEvents
} from './events';

// - - - - - - - - - - - - - - - - - - - - - - -

/**
 * Progressify a promise
 * @param {Promise} p
 */
function enhancePromise(p) {
    addProgress(p);
    addEvents(p);

    // don't use Promise prototype due to possible usage of other Promise libraries
    var originalThen = p.then;

    p.then = (onResolve, onReject, onProgress) => {
        if (onProgress) {
            p.addListener('progress', onProgress);
        }
        if (onResolve || onReject) {
            return originalThen.call(p, onResolve, onReject);
        } else {
            return p;
        }
    };

    var listenerRemover = () => {
        p.removeListener('progress');
    };
    originalThen.call(p, listenerRemover, listenerRemover);
}

export {
    enhancePromise
}
