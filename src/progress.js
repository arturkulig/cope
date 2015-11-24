import {
    isArray
} from './utils';

// - - - - - - - - - - - - - - - - - - - - - - -

function sumProgress(progressableArray) {
    if (isArray(progressableArray)) {
        var progressSum = progressableArray.reduce((sum, step) => {
            return sum + (step.progress ? step.progress() : 0);
        }, 0);

        return progressSum / progressableArray.length;
    }
    return 0;
}

function addProgress(subject) {
    subject._progress = subject._progress || 0;
    subject.progress = function (newValue) {
        if (typeof newValue === "number") {
            subject._progress = newValue;
            subject.triggerListener && subject.triggerListener("progress", newValue);
        }
        return subject._progress || 0;
    };
}

export {
    sumProgress,
    addProgress
}
