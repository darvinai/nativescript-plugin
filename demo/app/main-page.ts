import * as observable from 'tns-core-modules/data/observable';
import * as pages from 'tns-core-modules/ui/page';
import { NativeChat } from 'ns-nativechat';

export function pageLoaded(args: observable.EventData) {
    let page = <pages.Page>args.object;

    const bindingContext = observable.fromObject({
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

    page.bindingContext = bindingContext;
}
