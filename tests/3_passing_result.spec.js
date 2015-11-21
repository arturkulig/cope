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
        it('no phases, nothing', function (done) {
            cope().then(function (nothing) {
                expect(nothing).toBeUndefined();
                done();
            });
        });
        it('one passing phase, plain value', function (done) {
            cope(5)().then(function (five) {
                expect(five).toBe(5);
                done();
            })
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
            (three=> new Promise(
                resolve => setTimeout(() => resolve(three + 2), 10)
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
            (arrayOfThree => arrayOfThree[0] + 2)
            ()
                .then(function (five) {
                    expect(five).toBe(5);
                    done();
                });
        });
        it('two func phase, Array of Promises', function (done) {
            cope
            (()=>[
                Promise.resolve(3),
                2
            ])
            (result => result[0] + result[1])
            ()
                .then(function (five) {
                    expect(five).toBe(5);
                    done();
                });
        });
        it('two func phase, Map of Promises', function (done) {
            cope
            (()=> {
                return {
                    "3": Promise.resolve(3),
                    "2": 2
                }
            })
            (result => result['3'] + result['2'])
            ()
                .then(function (five) {
                    expect(five).toBe(5);
                    done();
                });
        });
        it('two func phase, include array phase', function (done) {
            cope
            ([
                ()=>2,
                ()=>Promise.resolve(1),
                Promise.resolve(1),
                1
            ])
            (result => result[0] + result[1] + result[2] + result[3])
            ()
                .then(function (five) {
                    expect(five).toBe(5);
                    done();
                });
        });
        it('two func phase, include object phase', function (done) {
            cope
            ({
                a: ()=>2,
                b: ()=>Promise.resolve(1),
                c: Promise.resolve(1),
                d: 1
            })
            (result => result.a + result.b + result.c + result.d)
            ()
                .then(function (five) {
                    expect(five).toBe(5);
                    done();
                });
        });
    });
});
