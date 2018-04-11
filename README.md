# NativeChat plugin for NativeScript

## Prerequisites / Requirements

## Installation

Run the following command from the root of your project:

```javascript
tns plugin add ns-nativechat
```

## Usage 

In code:

```typescript
import { NativeChat, INativeChatContext } from 'ns-nativechat';

class CustomView extends GridLayout {
    constructor() {
        super();

        const nativeChat = new NativeChat();
        nativeChat.chatContext = {
            botId: '5acddd9715e7187c15f3fc28',
            channelId: 'f91f065c-4079-4fa9-8860-b893e2b81696',
            token: '0570f9a5-6c0e-4b77-b06d-20ce6d5c56d8',
            userMessage: ''
        } as INativeChatContext;

        this.addChild(nativeChat);
    }
}
```

In xml:

```xml
<Page
    xmlns="http://schemas.nativescript.org/tns.xsd" loaded="pageLoaded" class="page"
    xmlns:ui="ns-nativechat">
    <ui:NativeChat chatContext="{{ nativeChatContext }}"/>
</Page>
```
```typescript
import { Page } from 'tns-core-modules/ui/page';
import { NativeChat, INativeChatContext } from 'ns-nativechat';
import { fromObject, EventData } from 'tns-core-modules/data/observable/observable';

export function pageLoaded(args: EventData) {
    let page = <Page>args.object;

    const bindingContext = fromObject({
        nativeChatContext: {
            botId: '5acddd9715e7187c15f3fc28',
            channelId: 'f91f065c-4079-4fa9-8860-b893e2b81696',
            token: '0570f9a5-6c0e-4b77-b06d-20ce6d5c56d8',
            userMessage: ''
        } as INativeChatContext
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

nativeChat.chatContext = {
    botId: '5acddd9715e7187c15f3fc28',
    channelId: 'f91f065c-4079-4fa9-8860-b893e2b81696',
    token: '0570f9a5-6c0e-4b77-b06d-20ce6d5c56d8',
    userMessage: ''
};
```

#### TypeScript

```typescript
import { NativeChat, INativeChatContext } from 'ns-nativechat';

class CustomView extends GridLayout {
    constructor() {
        super();

        const nativeChat = new NativeChat();
        nativeChat.chatContext = {
            botId: '5acddd9715e7187c15f3fc28',
            channelId: 'f91f065c-4079-4fa9-8860-b893e2b81696',
            token: '0570f9a5-6c0e-4b77-b06d-20ce6d5c56d8',
            userMessage: ''
        } as INativeChatContext;

        this.addChild(nativeChat);
    }
}
```

### chatContext

The chatContext should conform to the **INativeChatContext** interface.
 
| Property | Type |  | Description |
| --- | --- | --- | --- |
| botId | string | required | The id of your chat bot. |
| channelId | string | required | The channel id to connect to. |
| token | string | required | An unique token required to connect to the channel. |
| senderId | string | optional | An unique id to identify a user. Check [here](https://docs.darvin.ai/docs/1.0/publishing/web/#reuse-user-sessions) for more information. |
| userMessage | string | optional | A message to be send automatically, on the user’s behalf, when the webchat window is opened. You can send an empty message to simply trigger the bot’s introduction. |
| gtmId | string | optional | Google Tag Manager ID. Used in combination with the tracking property to track completed conversations. Check [here](https://docs.darvin.ai/docs/1.0/publishing/web/#gtmid-optional) for more information.|
| context | object | optional | A JSON object containing entities to be mapped to the user’s context. They can be used as any other entity within the cognitive flow. Be careful to not override other entities used in the cognitive flow. |
    
## License

Apache License Version 2.0, January 2004
