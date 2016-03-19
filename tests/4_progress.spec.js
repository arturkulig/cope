function noop() {
}
function err(msg, done) {
    return (error)=> {
        console.error(msg);
        console.error(error.toString());
        expect(false).toBe(true);
        (done ? done : noop)();
    }
}
function getTestPromise() {
    var tp = {};
    tp.promise = new Promise(resolve => tp.resolve = resolve);
    return tp;
}
describe('cope', function () {
    describe('is passing reporting progress', function () {
        it('flat phases', function (done) {
            var promises = [
                getTestPromise(),
                getTestPromise(),
                getTestPromise(),
                getTestPromise(),
            ];

            var progresses = [];

            cope
            (()=>promises[0].promise)
            (()=>promises[1].promise)
            (()=>promises[2].promise)
            (()=>promises[3].promise)
            ()
                .then(noop, noop, progress => {
                    progresses.push(progress);
                    if (progress === 1) {
                        expect(progresses).toEqual([
                            1 / 4,
                            2 / 4,
                            3 / 4,
                            4 / 4
                        ]);
                        done();
                    }
                });

            setTimeout(promises[0].resolve, 0);
            setTimeout(promises[1].resolve, 0);
            setTimeout(promises[2].resolve, 0);
            setTimeout(promises[3].resolve, 0);
        });

        it('one array phase', function (done) {
            var promises = [
                getTestPromise(),
                getTestPromise(),
                getTestPromise(),
            ];

            var progresses = [];

            cope
            ([
                ()=>promises[0].promise,
                ()=>promises[1].promise
            ])
            (()=>promises[2].promise)
            ()
                .then(noop, noop, progress => {
                    progresses.push(progress);
                    if (progress === 1) {
                        expect(progresses).toEqual([
                            1 / 4,
                            2 / 4,
                            4 / 4
                        ]);
                        done();
                    }
                });

            setTimeout(promises[0].resolve, 0);
            setTimeout(promises[1].resolve, 0);
            setTimeout(promises[2].resolve, 0);
        });

        fit('one map phase', function (done) {
            var promises = [
                getTestPromise(),
                getTestPromise(),
                getTestPromise(),
            ];

            var progresses = [];

            var currentProgress = 0;

            cope
            ({
                a: ()=>promises[0].promise,
                b: ()=>promises[1].promise
            })
            (result => {
                expect(result).toEqual({a: 1, b: 2});
            })
            ()
                .then(noop, noop, progress => {
                    currentProgress = progress;
                    progresses.push(progress);
                    if (progress === 1) {
                        expect(progresses).toEqual([
                            1 / 4,
                            2 / 4,
                            4 / 4
                        ]);
                        done();
                    }
                });

            setTimeout(() => {
                expect(currentProgress).toBe(0);
                promises[0].resolve(1);
            }, 0);
            setTimeout(() => {
                promises[1].resolve(2);
            }, 0);
            setTimeout(promises[2].resolve, 0);
        });

        it('nested cope phase', function (done) {
            var promises = [
                getTestPromise(),
                getTestPromise(),
                getTestPromise(),
            ];

            var progresses = [];

            cope
            (() => cope
                (()=>promises[0].promise)
                (()=>promises[1].promise)
                ()
            )
            (()=>promises[2].promise)
            ()
                .then(noop, noop, progress => {
                    if (progresses.indexOf(progress) < 0) {
                        // Store only uniq progress numbers
                        // because cope will repeat progress indication
                        // due to it is requested to be recalculated
                        // both on phase end and progress
                        // and 'end' is (progress===1).
                        progresses.push(progress);
                    }
                    if (progress === 1) {
                        expect(progresses).toEqual([
                            1 / 4,
                            2 / 4,
                            4 / 4
                        ]);
                        done();
                    }
                });

            setTimeout(promises[0].resolve, 0);
            setTimeout(promises[1].resolve, 0);
            setTimeout(promises[2].resolve, 0);
        })
    });
});
