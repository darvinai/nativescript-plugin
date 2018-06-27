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
                context.requestPermissions([ACCESS_FINE_LOCATION], NativeChat.LOCATION_REQUEST_CODE);
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

        if (context.uploadFileCallback != null) {
            context.uploadFileCallback.onReceiveValue(null);
            context.uploadFileCallback = null;
        }

        context.uploadFileCallback = filePathCallback;

        try {
            const intent = fileChooserParams.createIntent();
            context.startActivityForResult(intent, NativeChat.SELECT_FILE_RESULT_CODE);
        } catch (e) {
            context.uploadFileCallback = null;
            android.widget.Toast.makeText(context, 'Cannot open file chooser', android.widget.Toast.LENGTH_LONG).show();

            return false;
        }

        return true;
    }
}