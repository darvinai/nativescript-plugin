import { Session } from "./session";
import { User } from "./user";

export interface NativeChatConfig {
    botId: string;
    channelId: string;
    channelToken: string;
    gtmId?: string;
    session?: Session;
    user?: User;
}
