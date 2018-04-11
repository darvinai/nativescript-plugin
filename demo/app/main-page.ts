import * as observable from 'tns-core-modules/data/observable';
import * as pages from 'tns-core-modules/ui/page';
import { NativeChat, INativeChatContext } from 'ns-nativechat';

// Event handler for Page 'loaded' event attached in main-page.xml
export function pageLoaded(args: observable.EventData) {
    // Get the event sender
    let page = <pages.Page>args.object;

    const bindingContext = observable.fromObject({
        nativeChatContext: {
            botId: '5acddd9715e7187c15f3fc28',
            channelId: 'f91f065c-4079-4fa9-8860-b893e2b81696',
            token: '0570f9a5-6c0e-4b77-b06d-20ce6d5c56d8',
            userMessage: '',
            gtmId: ''
        } as INativeChatContext
    });

    page.bindingContext = bindingContext;
}
