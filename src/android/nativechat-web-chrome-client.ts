import * as application from 'tns-core-modules/application';
import { NativeChat } from '../nativechat';

const PERMISSION_GRANTED = android.content.pm.PackageManager.PERMISSION_GRANTED;
const ACCESS_FINE_LOCATION = (android as any).Manifest.permission.ACCESS_FINE_LOCATION;

export class NativeChatWebChromeClient extends android.webkit.WebChromeClient {
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