# NativeChat plugin for NativeScript

## Prerequisites / Requirements

Follow the [instructions]() in our documentation to enable a mobile channel for your bot.

## Installation

Run the following command from the root of your project:

```
tns plugin add ns-nativechat
```

## Usage 

In code:

```typescript
import { NativeChat } from 'ns-nativechat';

class CustomView extends GridLayout {
    constructor() {
        super();

        const nativeChat = new NativeChat();
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

        this.addChild(nativeChat);
    }
}
```

In xml:

```xml
<Page
    xmlns="http://schemas.nativescript.org/tns.xsd" loaded="pageLoaded" class="page"
    xmlns:ui="ns-nativechat">
    <ui:NativeChat config="{{ nativeChatConfig }}"/>
</Page>
```
```typescript
import { Page } from 'tns-core-modules/ui/page';
import { NativeChat } from 'ns-nativechat';
import { fromObject, EventData } from 'tns-core-modules/data/observable/observable';

export function pageLoaded(args: EventData) {
    let page = <Page>args.object;

    const bindingContext = fromObject({
        nativeChatConfig: {
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
        }  
    });

    page.bindingContext = bindingContext;
}
```

## API

### requiring / importing the plugin

#### JavaScript

```javascript
var NativeChatPlugin = require('ns-nativechat');
var nativeChat = new NativeChatPlugin.NativeChat();

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
```

#### TypeScript

```typescript
import { NativeChat } from 'ns-nativechat';

class CustomView extends GridLayout {
    constructor() {
        super();

        const nativeChat = new NativeChat();
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

        this.addChild(nativeChat);
    }
}
```

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
| gtmId | string | optional | Google Tag Manager ID. Used in combination with the tracking property to track completed conversations. Check [here](https://docs.darvin.ai/docs/1.0/publishing/web/#gtmid-optional) for more information.|


#### User

| Property | Type |  | Description |
| --- | --- | --- | --- |
| name | string | optional | The name of the user. This should be a combination of the first and last name, e.g. John Smith. |
| id | string | optional | The id of the user enables persistent conversations. A valid id value can be any combination of letters, numbers, hyphens, or underscores. |

#### Session

| Property | Type |  | Description |
| --- | --- | --- | --- |
| clear | boolean | optional | If *true*, the bot will start new conversation with the user. |
| context | JSON | optional | A JSON object containing entities to be merged with the conversation context. They can be used as any other entity within the cognitive flow. Be careful to not override other entities used in the cognitive flow. |
| userMessage | string | optional | Used to send a message on the user's behalf if the session is cleared. |

## License

Apache License Version 2.0, January 2004
