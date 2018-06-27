export declare class NativeChatWebChromeClient extends android.webkit.WebChromeClient {
    onGeolocationPermissionsShowPrompt(origin: string, callback: android.webkit.GeolocationPermissions.ICallback): void;
    onShowFileChooser(webview: android.webkit.WebView, filePathCallback: android.webkit.ValueCallback<android.net.Uri>, fileChooserParams: any): boolean;
}
