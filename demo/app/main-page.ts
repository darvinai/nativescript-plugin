import { EventData, fromObject, fromObjectRecursive } from 'tns-core-modules/data/observable';
import { Page } from 'tns-core-modules/ui/page';


export function pageLoaded(args: EventData) {
    (<Page>args.object).bindingContext = fromObjectRecursive({
        nativeChatConfig: {
            bot: {
                id: '5acddd9715e7187c15f3fc28'
            },
            channel: {
                id: 'f91f065c-4079-4fa9-8860-b893e2b81696',
                token: '0570f9a5-6c0e-4b77-b06d-20ce6d5c56d8'
            },
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
