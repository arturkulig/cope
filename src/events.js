function addEvents(subject) {

    var listeners = [];

    subject.addListener
        = subject.addEventListener
        = function addEventListener(eventName, listener) {
        listeners[eventName] = listeners[eventName] || [];
        if (listener && listeners[eventName].indexOf(listener) < 0) {
            listeners[eventName].push(listener);
        }
        return subject;
    };

    subject.removeListener
        = subject.removeEventListener
        = function (eventName, listener) {
        listeners[eventName] = listeners[eventName] || [];
        if (listener) {
            if (listeners[eventName].indexOf(listener) >= 0) {
                listeners[eventName].splice(
                    listeners[eventName].indexOf(listener), 1
                );
            }
        } else {
            listeners[eventName] = null;
        }
        return subject;
    };

    subject.triggerListener = function triggerListener(eventName) {
        if (listeners[eventName]) {
            listeners[eventName].forEach(listener=> {
                listener.call(undefined, this);
            });
        }
        return subject;
    }

}
