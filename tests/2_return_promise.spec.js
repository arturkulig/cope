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

describe('cope', function () {
    describe('returns a promise', function () {
        it('without a func', function (done) {
            var c = cope();
            expect(typeof c).toBe('object');
            c.then(done);
        });
        it('with a func', function (done) {
            var c = cope(noop);
            var p = c();
            expect(typeof c).toBe('function');
            expect(typeof p).toBe('object');
            p.then(done);
        });
        it('with a func returning a value', function (done) {
            var c = cope(()=>42);
            var p = c();
            expect(typeof c).toBe('function');
            expect(typeof p).toBe('object');
            p.then(done);
        });
        it('with a func returning a promise', function (done) {
            var ctrl = 0;
            var c = cope(() => new Promise(resolve=> {
                setTimeout(()=> {
                    console.log("bum");
                    ctrl = 1;
                    resolve();
                }, 10);
            }));
            var p = c();

            expect(typeof c).toBe('function');
            expect(typeof p).toBe('object');

            p
                .then(()=> {
                    (ctrl ? done : err('cope finished too fast'))();
                })
                .catch(err('cope failed', done));
        });
        it('with a func returning an array of promises', function (done) {
            var ctrl = 0;
            var promises = [1, 2].map(()=> {
                var cont = {};
                cont.promise = new Promise(resolve=> {
                    cont.resolve = resolve;
                });
                return cont;
            });
            var c = cope(()=>promises.map(cont=>cont.promise));
            var p = c();

            expect(typeof c).toBe('function');
            expect(typeof p).toBe('object');

            p
                .then(()=> {
                    (ctrl ? done : err('cope finished too fast', done))();
                })
                .catch(err('cope failed', done));

            setTimeout(()=> {
                ctrl = 1;
                promises.forEach((cont, i)=>cont.resolve(i));
            });
        });
        it('with a func returning a map of promises', function (done) {
            var ctrl = 0;
            var promises = [1, 2].map(()=> {
                var cont = {};
                cont.promise = new Promise(resolve=> {
                    cont.resolve = resolve;
                });
                return cont;
            });
            var c = cope(()=> {
                return {
                    a: promises[0].promise,
                    b: promises[1].promise
                }
            });
            var p = c();

            expect(typeof c).toBe('function');
            expect(typeof p).toBe('object');

            p
                .then(()=> {
                    (ctrl ? done : err('cope finished too fast', done))();
                })
                .catch(err('cope failed', done));

            setTimeout(()=> {
                ctrl = 1;
                promises.forEach((cont, i)=>cont.resolve(i));
            });
        });
    });
});
