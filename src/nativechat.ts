import { GridLayout } from 'tns-core-modules/ui/layouts/grid-layout';
import { WebView } from 'tns-core-modules/ui/web-view';
import { isAndroid } from "tns-core-modules/platform"
import { Observable, fromObject, EventData } from 'tns-core-modules/data/observable/observable';
import * as application from 'tns-core-modules/application';
import * as builder from 'tns-core-modules/ui/builder'

const webchatUrl = 'https://webchat.nativechat.com/v1';

const PERMISSION_GRANTED = android.content.pm.PackageManager.PERMISSION_GRANTED;
const ACCESS_FINE_LOCATION = (android as any).Manifest.permission.ACCESS_FINE_LOCATION;

export interface NativeChatConfig {
    botId: string;
    channelId: string;
    channelToken: string;
    gtmId?: string;
    session?: Session;
    user?: User;
}

export interface User {
    id?: string;
    name?: string;
}

export interface Session {
    clear?: boolean;
    context?: object;
    userMessage?: string;
}

export interface IUploadFileActivity {
    uploadCallback: android.webkit.ValueCallback<android.net.Uri>;
}

export interface IGeolocationActivity {
    geolocationCallback: android.webkit.GeolocationPermissions.ICallback;
    geolocationOrigin: string;
}

class CustomWebChromeClient extends android.webkit.WebChromeClient {
    onGeolocationPermissionsShowPrompt(origin: string, callback: android.webkit.GeolocationPermissions.ICallback) {
        const context = application.android.currentContext;

        context.geolocationCallback = null;
        context.geolocationOrigin = null;

        const fineLocationPermission = context.checkSelfPermission(ACCESS_FINE_LOCATION);
        if (fineLocationPermission !== PERMISSION_GRANTED) {
            context.geolocationCallback = callback;
            context.geolocationOrigin = origin;
            try {
                context.requestPermissions([ACCESS_FINE_LOCATION], NativeChat.REQUEST_LOCATION_CODE);
            } catch (e) {
                context.geolocationCallback = null;
                context.geolocationOrigin = null;
                android.widget.Toast.makeText(context, 'Cannot request location permissions.', android.widget.Toast.LENGTH_LONG).show();
            }
        } else {
            callback.invoke(origin, true, false);
        }
    }

    onShowFileChooser(
        webview: android.webkit.WebView,
        filePathCallback: android.webkit.ValueCallback<android.net.Uri>,
        fileChooserParams
    ): boolean {
        const context = application.android.currentContext;

        if (context.uploadCallback != null) {
            context.uploadCallback.onReceiveValue(null);
            context.uploadCallback = null;
        }

        context.uploadCallback = filePathCallback;

        try {
            const intent = fileChooserParams.createIntent();
            console.log(intent);
            context.startActivityForResult(intent, NativeChat.SELECT_FILE_RESULT_CODE);
        } catch (e) {
            context.uploadCallback = null;
            android.widget.Toast.makeText(context, 'Cannot open file chooser', android.widget.Toast.LENGTH_LONG).show();

            return false;
        }

        return true;
    }

    shouldOverrideUrlLoading(webview: android.webkit.WebView, url: string): boolean {
        if (url !== null && (url.startsWith("http://") || url.startsWith("https://"))) {
            const context = application.android.currentContext;

            try {
                context.startActivity(new android.content.Intent(android.content.Intent.ACTION_VIEW, android.net.Uri.parse(url)));
                return true;
            } catch (error) {
                android.widget.Toast.makeText(context, 'Cannot open url', android.widget.Toast.LENGTH_LONG).show();
            }
        }

        return false;
    }
}

export class NativeChat extends GridLayout {
    public static SELECT_FILE_RESULT_CODE = 100;
    public static REQUEST_LOCATION_CODE = 200;

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
            settings.setAppCacheEnabled(true);
            settings.setDatabaseEnabled(true);

            webview.android.setWebChromeClient(new CustomWebChromeClient());
        }
    }

    private configPropertyChange(data: EventData): void {
        this.updateUrl();
    }

    private updateUrl(): void {
        if (this._config && this._config.botId && this._config.channelId && this._config.channelToken) {
            let url = `${webchatUrl}?botId=${encodeURIComponent(this._config.botId)}`;
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
