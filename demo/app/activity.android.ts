import { setActivityCallbacks, AndroidActivityCallbacks } from "tns-core-modules/ui/frame";
import { NativeChat, IUploadFileActivity, IGeolocationActivity } from "@progress-nativechat/nativescript-nativechat";

const ACCESS_FINE_LOCATION = (android as any).Manifest.permission.ACCESS_FINE_LOCATION;


@JavaProxy("org.myApp.MainActivity")
class Activity extends android.app.Activity implements IUploadFileActivity, IGeolocationActivity {
    private _callbacks: AndroidActivityCallbacks;

    public geolocationCallback: android.webkit.GeolocationPermissions.ICallback;
    public geolocationOrigin: string;

    public uploadFileCallback: android.webkit.ValueCallback<android.net.Uri>;

    protected onCreate(savedInstanceState: android.os.Bundle): void {
        if (!this._callbacks) {
            setActivityCallbacks(this);
        }

        this._callbacks.onCreate(this, savedInstanceState, super.onCreate);
        this.uploadFileCallback = null;
    }

    protected onSaveInstanceState(outState: android.os.Bundle): void {
        this._callbacks.onSaveInstanceState(this, outState, super.onSaveInstanceState);
    }

    protected onStart(): void {
        this._callbacks.onStart(this, super.onStart);
    }

    protected onStop(): void {
        this._callbacks.onStop(this, super.onStop);
    }

    protected onDestroy(): void {
        this._callbacks.onDestroy(this, super.onDestroy);
    }

    public onBackPressed(): void {
        this._callbacks.onBackPressed(this, super.onBackPressed);
    }

    public onRequestPermissionsResult(requestCode: number, permissions: Array<String>, grantResults: Array<number>): void {
        this._callbacks.onRequestPermissionsResult(this, requestCode, permissions, grantResults, undefined /*TODO: Enable if needed*/);

        if (requestCode === NativeChat.LOCATION_REQUEST_CODE &&
            this.geolocationCallback && this.geolocationOrigin) {

            for (let index = 0; index < permissions.length; index++) {
                if (permissions[index] === ACCESS_FINE_LOCATION) {
                    if (grantResults[index] === android.content.pm.PackageManager.PERMISSION_GRANTED) {
                        this.geolocationCallback.invoke(this.geolocationOrigin, true, true);
                    }

                    this.geolocationCallback = null;
                    this.geolocationOrigin = null;
                    break;
                }
            }
        }
    }

    protected onActivityResult(requestCode: number, resultCode: number, data: android.content.Intent): void {
        this._callbacks.onActivityResult(this, requestCode, resultCode, data, super.onActivityResult);
        if (requestCode === NativeChat.SELECT_FILE_RESULT_CODE) {
            this.upload(resultCode, data);
        }
    }

    private upload(resultCode: number, data: android.content.Intent) {
        if (!this.uploadFileCallback) {
            return;
        }

        let uri = null;
        if (resultCode == android.app.Activity.RESULT_OK && data) {
            uri = Array.create(android.net.Uri, 1);
            uri[0] = android.net.Uri.parse(data.getDataString());
        }

        this.uploadFileCallback.onReceiveValue(uri);
        this.uploadFileCallback = null;
    }
}
