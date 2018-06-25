import { setActivityCallbacks, AndroidActivityCallbacks } from "tns-core-modules/ui/frame";


const SELECT_FILE_RESULT_CODE = 100;

@JavaProxy("org.myApp.MainActivity")
class Activity extends android.app.Activity {
    private _callbacks: AndroidActivityCallbacks;
    
    public uploadCallback: android.webkit.ValueCallback<android.net.Uri>;

    protected onCreate(savedInstanceState: android.os.Bundle): void {
        if (!this._callbacks) {
            setActivityCallbacks(this);
        }

        this._callbacks.onCreate(this, savedInstanceState, super.onCreate);
        this.uploadCallback = null;
    }

    // public onRequestPermissionsResult(requestCode: number, permissions: Array<String>, grantResults: Array<number>): void {
    //     this._callbacks.onRequestPermissionsResult(this, requestCode, permissions, grantResults, undefined /*TODO: Enable if needed*/);
    // }

    protected onActivityResult(requestCode: number, resultCode: number, data: android.content.Intent): void {
        this._callbacks.onActivityResult(this, requestCode, resultCode, data, super.onActivityResult);
        if (requestCode === SELECT_FILE_RESULT_CODE) {
            this.upload(resultCode, data);
        }
    }

    private upload(resultCode: number, data: android.content.Intent) {
        if (this.uploadCallback === null) {
            return;
        }

        let uri = null;
        if (resultCode == android.app.Activity.RESULT_OK) {
            if (data !== null) {
                if (android.os.Build.VERSION.SDK_INT >= 21) {
                    uri = android.net.Uri.parse(data.getDataString());
                } else {
                    uri = data.getData();
                }
            }
        }

        this.uploadCallback.onReceiveValue(uri);
        this.uploadCallback = null;
    }
}
