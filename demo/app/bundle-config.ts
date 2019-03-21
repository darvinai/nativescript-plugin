import "tns-core-modules/globals";
if (global.TNS_WEBPACK) {
    global.registerModule('@progress-nativechat/nativescript-nativechat', () => require('@progress-nativechat/nativescript-nativechat'));
}