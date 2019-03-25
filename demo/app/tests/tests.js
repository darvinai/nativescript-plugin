var NativeChat = require("@progress-nativechat/nativescript-nativechat").NativeChat;

describe("NativeChat", function () {
    it("exists", function () {
        expect(NativeChat).toBeDefined();
    });

    it("can be instantiated", function () {
        var nativeChat = new NativeChat();
        expect(nativeChat).toBeDefined();
    });
});