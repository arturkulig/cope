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
        it('without a phase', function (done) {
            var c = cope();
            expect(typeof c).toBe('object');
            c.then(done);
        });
        it('with a func phase', function (done) {
            var c = cope(noop);
            var p = c();
            expect(typeof c).toBe('function');
            expect(typeof p).toBe('object');
            p.then(done);
        });
        it('with a array phase', function (done) {
            cope([
                ()=>null,
                ()=>null
            ])().then(done);
        });
        it('with a object phase', function (done) {
            cope({
                a: ()=>null,
                b: ()=>null
            })().then(done);
        });
    });
});
