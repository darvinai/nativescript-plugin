import { GridLayout } from 'tns-core-modules/ui/layouts/grid-layout';
import { WebView } from 'tns-core-modules/ui/web-view';
import { isAndroid } from "tns-core-modules/platform"
import { Observable, fromObject, EventData } from 'tns-core-modules/data/observable/observable';
import * as builder from 'tns-core-modules/ui/builder'

import { NativeChatConfig } from './models';
import { NativeChatWebChromeClient } from './android/nativechat-web-chrome-client';
import { NativeChatWebViewClient } from './android/nativechat-web-view-client';

export const Config = {
    webchatUrl: 'webchat.nativechat.com',
    webchatVersion: 'v1'
};

export class NativeChat extends GridLayout {
    public static platform = {
        android: {
            SELECT_FILE_RESULT_CODE: 100,
            LOCATION_REQUEST_CODE: 200
        }
    };

    private _webView: WebView;
    private _config: NativeChatConfig;

    private webChatConfig: Observable;

    set config(value: NativeChatConfig) {
        if (this._config && this._config.constructor.prototype instanceof Observable) {
            (<any>this._config).off('propertyChange', this.configPropertyChange.bind(this));
        }

        this._config = value;
        this.updateUrl();

        if (this._config && this._config.constructor.prototype instanceof Observable) {
            (<any>this._config).on('propertyChange', this.configPropertyChange.bind(this));
        }
    }

    get config(): NativeChatConfig {
        return this._config;
    }

    constructor() {
        super();
        this.webChatConfig = fromObject({ url: '' });
        this._webView = builder.load(__dirname + '/nativechat.xml') as WebView;
        this._webView.bindingContext = this.webChatConfig;
        this._webView.on('loadFinished', this.webViewLoaded);

        this.addChild(this._webView);
    }

    private webViewLoaded(args) {
        var webview: WebView = <WebView>args.object;
        if (isAndroid) {
            var settings = webview.android.getSettings();
            settings.setDomStorageEnabled(true);
            settings.setDisplayZoomControls(false);
            settings.setBuiltInZoomControls(false);
            settings.setAppCacheEnabled(true);
            settings.setDatabaseEnabled(true);
            settings.setJavaScriptEnabled(true);

            webview.android.setWebChromeClient(new NativeChatWebChromeClient());
            webview.android.setWebViewClient(new NativeChatWebViewClient());
        }
    }

    private configPropertyChange(data: EventData): void {
        this.updateUrl();
    }

    private updateUrl(): void {
        if (this._config && this._config.botId && this._config.channelId && this._config.channelToken) {
            let url = `https://${Config.webchatUrl}/${Config.webchatVersion}?botId=${encodeURIComponent(this._config.botId)}`;
            url += `&channelId=${encodeURIComponent(this._config.channelId)}`;
            url += `&token=${encodeURIComponent(this._config.channelToken)}`;

            if (this._config.user) {
                if (this._config.user.name) {
                    url += `&user=${encodeURIComponent(JSON.stringify({ name: this._config.user.name }))}`;
                }

                if (this._config.user.id) {
                    url += `&senderId=${encodeURIComponent(this._config.user.id)}`;
                }
            }

            if (this._config.session) {
                if (this._config.session.context) {
                    url += `&context=${encodeURIComponent(JSON.stringify(this._config.session.context))}`;
                }

                if (this._config.session.clear) {
                    url += `&newSession=true`;
                }

                if (this._config.session.clear || this._config.session.userMessage) {
                    url += `&userMessage=${encodeURIComponent(this._config.session.userMessage || '')}`;
                }
            }

            if (this._config.gtmId != null) {
                url += `&gtmId=${encodeURIComponent(this._config.gtmId)}`;
            }

            this.webChatConfig.set('url', url);
        } else {
            this.webChatConfig.set('url', '');
        }
    }
}
