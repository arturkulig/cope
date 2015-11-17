console.log("\n----------------------------------------------------");
function noop() {
}
function err(msg) {
    return ()=> {
        console.error(msg);
        expect(false).toBe(true);
    }
}
describe("cope", function () {
    it('exists', function () {
        expect(cope).toBeDefined();
        expect(typeof cope).toBe("function");
        expect(typeof cope.clone).toBe("function");
        expect(cope(noop)).not.toBe(cope(noop));
    });
});
