import { GridLayout } from 'tns-core-modules/ui/layouts/grid-layout';
import { WebView } from 'tns-core-modules/ui/web-view';
import { isAndroid } from "tns-core-modules/platform";
import { Observable, fromObject, EventData } from 'tns-core-modules/data/observable/observable';
import { BindingOptions } from "tns-core-modules/ui/core/bindable";

const NATIVECHAT_ID = "kcChatWindow";
const NATIVECHAT_CONTAINER_ID = "chatbotContainer";
const NATIVECHAT_VERSION = "1.31.0";

export interface NativeChatConfig {
  bot: Bot;
  channel: Channel;
  user?: User;
  session?: Session;
  googleApiKey?: string;
  locale?: string;
  placeholder?: string;
  submitLocationText?: string;
  defaultLocation?: Location;
  css?: string[];
  showDebugConsole: boolean;
  chatServerInstance?: string;
}

export interface Bot {
  id: string;
  avatarUrl?: string;
  name?: string;
}

export interface Channel {
  token: string;
  id: string;
}

export interface User {
  id: string;
  avatarUrl?: string;
  name?: string;
  token?: string;
}

export interface Session {
  clear?: boolean;
  context?: object;
  userMessage?: string;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export class NativeChat extends GridLayout {
  private _webView: WebView;
  private _config: NativeChatConfig;
  private webChatConfig: Observable;

  private _configChangeListener: any = this.configPropertyChange.bind(this);

  set config(value: NativeChatConfig) {
    this.removeConfigChangesListeners(this._config);

    this._config = value;
    this.updateNativeChatConfig();
    this.handleConfigChanges(this._config);
  }

  get config(): NativeChatConfig {
    return this._config;
  }

  constructor() {
    super();

    this.webChatConfig = fromObject({ url: '' });
    this._webView = new WebView();
    const webViewBindingOptions: BindingOptions = {
      sourceProperty: "url",
      targetProperty: "src",
      twoWay: false
    };

    this._webView.bind(webViewBindingOptions, this.webChatConfig);
    this._webView.on('loadFinished', this.webViewLoaded);

    this.addChild(this._webView);
  }

  private webViewLoaded(args) {
    let webview: WebView = <WebView>args.object;
    if (isAndroid) {
      const settings = webview.android.getSettings();
      settings.setDomStorageEnabled(true);
      settings.setDisplayZoomControls(false);
    }
  }

  private configPropertyChange(data: EventData): void {
    this.updateNativeChatConfig();
  }

  private updateNativeChatConfig(): void {
    const config = this._config;
    const botId = config && config.bot && config.bot.id;
    const channel = config && config.channel;
    const channelId = channel && channel.id;
    const channelToken = channel && channel.token;

    if (botId && channelId && channelToken) {
      const chatbotSettings = {
          id: NATIVECHAT_ID,
          origin: "",
          display: {
              mode: "inline",
              containerId: NATIVECHAT_CONTAINER_ID
          },
          chat: config
      };

      const data = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Progress NativeChat</title>
            <script src="https://web-chat.nativechat.com/${NATIVECHAT_VERSION}/sdk/nativechat.js"></script>
            <link href="https://web-chat.nativechat.com/${NATIVECHAT_VERSION}/sdk/nativechat.css" rel="stylesheet" type="text/css">
            <style>
              html, body { height: 100%; margin: 0; padding: 0; }
              #${NATIVECHAT_CONTAINER_ID} { width: 100%; height: 100%; }
            </style>
        </head>
        <body>
          <div id="${NATIVECHAT_CONTAINER_ID}"></div>
          <script>
            window.NativeChat.load(${JSON.stringify(chatbotSettings)});
          </script>
        </body>
        </html>`;

      this.webChatConfig.set('url', data);
    } else {
      this.webChatConfig.set('url', '');
    }
  }

  private handleConfigChanges (config) {
    if (!config) {
      return;
    }

    const isObservable = this.isObservable(config);

    this.attachPropertyChange(config);
    this.attachPropertyChange(isObservable ? config.get("defaultLocation") : config.defaultLocation);
    this.attachPropertyChange(isObservable ? config.get("user") : config.user);

    const session = isObservable ? config.get("session") : config.session;
    const isSessionObservable = this.isObservable(session);

    this.attachPropertyChange(session);
    this.attachPropertyChange(isSessionObservable ? session.get("context") : session.context);
  }

  private attachPropertyChange (config) {
    if (this.isObservable(config)) {
      config.on(Observable.propertyChangeEvent, this._configChangeListener);
    }
  }

  private removeConfigChangesListeners (config) {
    if (!config) {
      return;
    }

    const isObservable = this.isObservable(config);

    this.removePropertyChange(config);
    this.removePropertyChange(isObservable ? config.get("defaultLocation") : config.defaultLocation);
    this.removePropertyChange(isObservable ? config.get("user") : config.user);

    const session = isObservable ? config.get("session") : config.session;
    const isSessionObservable = this.isObservable(session);

    this.removePropertyChange(session);
    this.removePropertyChange(isSessionObservable ? session.get("context") : session.context);
  }

  private removePropertyChange (config) {
    if (this.isObservable(config)) {
      config.off(Observable.propertyChangeEvent, this._configChangeListener);
    }
  }

  private isObservable (objectToTest) {
    return objectToTest && objectToTest.constructor && objectToTest.constructor.prototype instanceof Observable;
  }
}
