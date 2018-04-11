var Nativechat = require("ns-nativechat").Nativechat;
var nativechat = new Nativechat();

describe("greet function", function() {
    it("exists", function() {
        expect(nativechat.greet).toBeDefined();
    });
});