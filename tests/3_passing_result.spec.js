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
    describe('is passing a result', function () {
        it('no phases, empty object', function (done) {
            cope().then(function (nothing) {
                expect(nothing).toEqual({});
                done();
            });
        });
        it('one func phase, plain value', function (done) {
            cope(()=>5)().then(function (five) {
                expect(five).toBe(5);
                done();
            })
        });
        it('one func phase, promise', function (done) {
            cope
            (()=>Promise.resolve(5))
            ()
                .then(function (five) {
                    expect(five).toBe(5);
                    done();
                })
        });
        it('two func phase, plain values', function (done) {
            cope
            (()=>3)
            (wannaBeFive=>wannaBeFive + 2)
            ()
                .then(function (five) {
                    expect(five).toBe(5);
                    done();
                });
        });
        it('two func phase, Promises', function (done) {
            cope
            (()=>Promise.resolve(3))
            (wannaBeFive=> new Promise(
                resolve => setTimeout(() => resolve(wannaBeFive + 2), 10)
            ))
            ()
                .then(function (five) {
                    expect(five).toBe(5);
                    done();
                });
        });
        it('two func phase, Promise of Array', function (done) {
            cope
            (()=>Promise.resolve([3]))
            (three => three[0] + 2)
            ()
                .then(function (five) {
                    expect(five).toBe(5);
                    done();
                });
        });
        it('two func phase, Array of Promise', function (done) {
            cope
            (()=>[
                Promise.resolve({three: 3}),
                {two: 2}
            ])
            (result => result.three + result.two)
            ()
                .then(function (five) {
                    expect(five).toBe(5);
                    done();
                });
        });
    });
});
