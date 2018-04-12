import { GridLayout } from 'tns-core-modules/ui/layouts/grid-layout';
import { WebView } from 'tns-core-modules/ui/web-view';
import { isAndroid } from "tns-core-modules/platform"
import { Observable, fromObject, EventData } from 'tns-core-modules/data/observable/observable';

const builder = require('tns-core-modules/ui/builder');
const webchatUrl = 'https://webchat.darvin.ai/v1';

export interface INativeChatContext {
  botId: string;
  channelId: string;
  token: string;
  senderId: string;
  userMessage: string;
  gtmId: string;
  context: object;
}

export class NativeChat extends GridLayout {
  private _webView: WebView;
  private _chatContext: INativeChatContext;

  private webchatContext: Observable;

  set chatContext(value: INativeChatContext) {
    if (this._chatContext && this._chatContext.constructor.prototype instanceof Observable) {
      (<any>this._chatContext).off('propertyChange', this.contextPropertyChange.bind(this));
    }

    this._chatContext = value;

    this.updateUrl();

    if (this._chatContext && this._chatContext.constructor.prototype instanceof Observable) {
      (<any>this._chatContext).on('propertyChange', this.contextPropertyChange.bind(this));
    }
  }

  get chatContext(): INativeChatContext {
    return this._chatContext;
  }

  constructor() {
    super();
    this.webchatContext = fromObject({ url: '' });
    this._webView = builder.load(__dirname + '/nativechat.xml') as WebView;
    this._webView.bindingContext = this.webchatContext;
    this._webView.on('loadFinished', this.webViewLoaded); // TODO: why can't bind in xml

    this.addChild(this._webView);
  }

  private webViewLoaded(args) {
    var webview: WebView = <WebView>args.object;
    if (isAndroid) {
      const settings = webview.android.getSettings();
      settings.setDomStorageEnabled(true);
      settings.setDisplayZoomControls(false);
    }
  }

  private contextPropertyChange(data: EventData): void {
    this.updateUrl();
  }

  private updateUrl(): void {
    if (this._chatContext && this._chatContext.botId && this._chatContext.channelId && this._chatContext.token) {
      let url = `${webchatUrl}?botId=${encodeURIComponent(this._chatContext.botId)}&channelId=${encodeURIComponent(this._chatContext.channelId)}&token=${encodeURIComponent(this._chatContext.token)}`;

      if (this._chatContext.userMessage != null) {
        url += `&userMessage=${encodeURIComponent(this._chatContext.userMessage)}`;
      }

      if (this._chatContext.gtmId != null) {
        url += `&gtmId=${encodeURIComponent(this._chatContext.gtmId)}`;
      }

      if (this._chatContext.context != null) {
        url += `$context=${encodeURIComponent(JSON.stringify(this._chatContext.context))}`;
      }

      if (this._chatContext.senderId != null) {
        url += `$senderId=${encodeURIComponent(this._chatContext.senderId)}`;
      }

      this.webchatContext.set('url', url);
    } else {
      this.webchatContext.set('url', '');
    }
  }
}
