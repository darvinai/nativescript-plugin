import * as application from 'tns-core-modules/application';
import { Config } from '../nativechat';

export class NativeChatWebViewClient extends android.webkit.WebViewClient {
    shouldOverrideUrlLoading(webview: android.webkit.WebView, request): boolean { // request: android.webkit.WebResourceRequest | string
        const uri = request.getUrl ? request.getUrl() : android.net.Uri.parse(request);
        const url = uri && uri.toString();
        const openInView = url && (url.startsWith(`https://${Config.webchatUrl}`) || url.startsWith(`http://${Config.webchatUrl}`));
        if (!openInView) {
            const context = application.android.currentContext;
            try {
                context.startActivity(new android.content.Intent(android.content.Intent.ACTION_VIEW, uri));
                return true;
            } catch (error) {
                android.widget.Toast.makeText(context, 'Cannot open url', android.widget.Toast.LENGTH_LONG).show();
            }
       }

        return false;
    }
}