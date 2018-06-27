# NativeChat plugin for NativeScript

## Prerequisites / Requirements

Follow the [instructions](https://docs.nativechat.com/docs/1.0/publishing/mobile) in our documentation to enable a mobile channel for your bot.

## Installation

Run the following command from the root of your project:

```bash
tns plugin add @progress-nativechat/nativescript-nativechat
```

## Usage

### JavaScript: How to add the plugin using XML and binding

```xml
<Page loaded="pageLoaded" xmlns:nativechat="@progress-nativechat/nativescript-nativechat">
    <nativechat:NativeChat config="{{ nativeChatConfig }}"/>
</Page>
```

```javascript
exports.pageLoaded = function (args) {
    var page = args.object;
    page.bindingContext = {
        nativeChatConfig: {
            botId: '5acddd9715e7187c15f3fc28',
            channelId: 'f91f065c-4079-4fa9-8860-b893e2b81696',
            channelToken: '0570f9a5-6c0e-4b77-b06d-20ce6d5c56d8',
            user: {
                name: 'John Smith'
            },
            session: {
                clear: true,
                userMessage: 'Book a doctor',
                context: {
                    company: 'Progress Software',
                    phone: '555 555 5555'
                }
            }
        }
    }
};
```

### JavaScript: How to add the plugin directly through code

```javascript
var plugin = require('@progress-nativechat/nativescript-nativechat');

exports.pageLoaded = function (args) {
    var page = args.object;
    var nativeChat = new plugin.NativeChat();

    nativeChat.config = {
        botId: '5acddd9715e7187c15f3fc28',
        channelId: 'f91f065c-4079-4fa9-8860-b893e2b81696',
        channelToken: '0570f9a5-6c0e-4b77-b06d-20ce6d5c56d8',
        user: {
            name: 'John Smith'
        },
        session: {
            clear: true,
            context: {
                company: 'Progress Software',
                phone: '555 555 5555'
            }
        }
    };

    page.content = nativeChat;
};
```

### TypeScript: How to add the plugin using XML and binding

```xml
<Page
    xmlns="http://schemas.nativescript.org/tns.xsd" loaded="pageLoaded" class="page"
    xmlns:nativechat="@progress-nativechat/nativescript-nativechat">
    <nativechat:NativeChat config="{{ nativeChatConfig }}"/>
</Page>
```

```typescript
import { EventData, fromObject } from 'tns-core-modules/data/observable';
import { Page } from 'tns-core-modules/ui/page';

export function pageLoaded(args: EventData) {
    (<Page>args.object).bindingContext = fromObject({
        nativeChatConfig: {
            botId: '5acddd9715e7187c15f3fc28',
            channelId: 'f91f065c-4079-4fa9-8860-b893e2b81696',
            channelToken: '0570f9a5-6c0e-4b77-b06d-20ce6d5c56d8',
            user: {
                name: 'John Smith'
            },
            session: {
                clear: true,
                userMessage: 'Book a doctor',
                context: {
                    company: 'Progress Software',
                    phone: '555 555 5555'
                }
            }
        }
    });
}
```

### TypeScript: How to add the plugin directly through code

```typescript
import { EventData } from 'tns-core-modules/data/observable';
import { NativeChat } from '@progress-nativechat/nativescript-nativechat';
import { Page } from 'tns-core-modules/ui/page';

export function pageLoaded(args: EventData) {
    const chat = new NativeChat();
    (<Page>args.object).content = chat;
    chat.config = {
        botId: '5acddd9715e7187c15f3fc28',
        channelId: 'f91f065c-4079-4fa9-8860-b893e2b81696',
        channelToken: '0570f9a5-6c0e-4b77-b06d-20ce6d5c56d8',
        user: {
            name: 'John Smith'
        },
        session: {
            clear: true,
            userMessage: 'Book a doctor',
            context: {
                company: 'Progress Software',
                phone: '555 555 5555'
            }
        }
    };
}
```

### Angular

Import the NativeChatModule in the app module:

```typescript
import { NativeChatModule } from "@progress-nativechat/nativescript-nativechat/angular";

@NgModule({
    ...
    imports: [
        NativeScriptModule,
        NativeChatModule
    ],
    ...
})
export class AppModule { }
```

Use the plugin in a component:

```typescript
import { Component, OnInit } from "@angular/core";
import { NativeChatConfig } from "@progress-nativechat/nativescript-nativechat";

@Component({
    selector: "ns-app",
    template: `
    <GridLayout class="page">
        <NativeChat [config]="nativeChatConfig"></NativeChat>
    </GridLayout>`
})

export class AppComponent implements OnInit {
    nativeChatConfig: NativeChatConfig;

    ngOnInit(): void {
        this.nativeChatConfig = {
            botId: '5acddd9715e7187c15f3fc28',
            channelId: 'f91f065c-4079-4fa9-8860-b893e2b81696',
            channelToken: '0570f9a5-6c0e-4b77-b06d-20ce6d5c56d8',
            user: {
                name: 'John Smith'
            },
            session: {
                clear: true,
                userMessage: 'Book a doctor',
                context: {
                    company: 'Progress Software',
                    phone: '555 555 5555'
                }
            }
        };
    }
}
```

## API

### config

The *config* property should conform to the **NativeChatConfig** interface.

#### NativeChatConfig

| Property | Type |  | Description |
| --- | --- | --- | --- |
| botId | string | required | The id of your chat bot. |
| channelId | string | required | The channel id to connect to. |
| channelToken | string | required | An unique token required to connect to the channel. |
| user | [User](#user) | optional | Information about the user. |
| session | [Session](#session) | optional | Information about the user session. |
| gtmId | string | optional | Google Tag Manager ID. Used in combination with the tracking property to track completed conversations. Check [here](https://docs.nativechat.com/docs/1.0/publishing/web/#gtmid-optional) for more information.|

#### User

| Property | Type |  | Description |
| --- | --- | --- | --- |
| name | string | optional | The name of the user. This should be a combination of the first and last name, e.g. John Smith. |
| id | string | optional | The id of the user enables persistent conversations. A valid id value can be any combination of letters, numbers, hyphens, or underscores. |

#### Session

| Property | Type |  | Description |
| --- | --- | --- | --- |
| clear | boolean | optional | If *true*, the bot will start new conversation with the user. |
| context | object | optional | A JSON object containing entities to be merged with the conversation context. They can be used as any other entity within the cognitive flow. Be careful to not override other entities used in the cognitive flow. |
| userMessage | string | optional | Used to send a message on the user's behalf if the session is cleared. |

## Enable Functionality

### Android: File Picker

 [extend application activity](https://docs.nativescript.org/angular/core-concepts/android-runtime/advanced-topics/extend-application-activity#extending-activity)

Add the following code to the *onActivityResult* method:

```typescript
import { NativeChat } from "@progress-nativechat/nativescript-nativechat";

protected onActivityResult(requestCode: number, resultCode: number, data: android.content.Intent): void {
    this._callbacks.onActivityResult(this, requestCode, resultCode, data, super.onActivityResult);
    if (requestCode === NativeChat.SELECT_FILE_RESULT_CODE) {
        this.upload(resultCode, data);
    }
}

private upload(resultCode: number, data: android.content.Intent) {
    if (this.uploadFileCallback === null) {
        return;
    }

    let uri = null;
    if (resultCode == android.app.Activity.RESULT_OK) {
        if (data !== null) {
            if (android.os.Build.VERSION.SDK_INT >= 21) {
                uri = Array.create(android.net.Uri, 1);
                uri[0] = android.net.Uri.parse(data.getDataString());
            } else {
                uri = data.getData();
            }
        }
    }

    this.uploadFileCallback.onReceiveValue(uri);
    this.uploadFileCallback = null;
}
```

### Android: Location Picker

### iOS: Location Picker

You have to requiest authorization from the user to use his location. Add *NSLocationWhenInUseUsageDescription* key in the *app/App_Resources/iOS/Info.plist* file.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    ...
    <key>NSLocationWhenInUseUsageDescription</key>
    <string>Can I use your location?</string>
</dict>
</plist>
```

## License

Apache License Version 2.0, January 2004
