function sumProgress(progressableArray) {
    if (isArray(progressableArray)) {
        return progressableArray.reduce((sum, step)=> {
                return sum + (step.progress ? step.progress() : 0);
            }) / progressableArray.length;
    }
    return 0;
}

function addProgress(subject) {
    subject._progress = subject._progress || 0;
    subject.progress = function (newValue) {
        if (typeof newValue === "number") {
            subject._progress = newValue;
            subject.triggerListener && subject.triggerListener("progress");
        }
        return subject._progress;
    };
}
