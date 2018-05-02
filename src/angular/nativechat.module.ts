import { NgModule } from "@angular/core";
import { registerElement } from "nativescript-angular/element-registry";

import { DIRECTIVES } from "./nativechat.directives";

@NgModule({
    declarations: [DIRECTIVES],
    exports: [DIRECTIVES],
})
export class NativeChatModule { }

registerElement("NativeChat", () => require("../index").NativeChat);