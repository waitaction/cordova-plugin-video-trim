package com.iknow.android.features.trim;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.text.TextUtils;
import com.iknow.android.MResource;
import com.iknow.android.ZApplication;
import com.iknow.android.interfaces.CompressVideoListener;
import com.iknow.android.interfaces.TrimVideoListener;
import com.iknow.android.utils.CompressVideoUtil;
import com.iknow.android.widget.VideoTrimmerView;


public class VideoTrimmerActivity extends Activity implements TrimVideoListener {

    private static final String TAG = "jason";
    private static final String VIDEO_PATH_KEY = "path";
    public static final int VIDEO_TRIM_REQUEST_CODE = 0x001;
    private ProgressDialog mProgressDialog;
    private VideoTrimmerView trimmerView;

    public static void call(Activity from, String videoPath) {
        if (!TextUtils.isEmpty(videoPath)) {
            Bundle bundle = new Bundle();
            bundle.putString(VIDEO_PATH_KEY, videoPath);
            Intent intent = new Intent(from, VideoTrimmerActivity.class);
            intent.putExtras(bundle);
            from.startActivityForResult(intent, VIDEO_TRIM_REQUEST_CODE);
        }
    }

    @Override
    protected void onCreate(Bundle bundle) {
        super.onCreate(bundle);
        ZApplication.init(this);
        setContentView(MResource.getIdByName(this, "layout", "activity_trimmer_layout"));
        Bundle bd = getIntent().getExtras();
        String path = "";
        if (bd != null){
            path = bd.getString(VIDEO_PATH_KEY);
        }
        trimmerView = (VideoTrimmerView)findViewById(MResource.getIdByName(this, "id", "trimmer_view"));
        if (trimmerView != null) {
            trimmerView.setOnTrimVideoListener(this);
            trimmerView.initVideoByURI(Uri.parse(path));
        }
    }

    @Override
    public void onResume() {
        super.onResume();
    }

    @Override
    public void onPause() {
        super.onPause();
        trimmerView.onVideoPause();
        trimmerView.setRestoreState(true);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        trimmerView.onDestroy();
    }

    @Override
    public void onStartTrim() {
        buildDialog(getResources().getString(MResource.getIdByName(this, "string", "trimming"))).show();
    }

    @Override
    public void onFinishTrim(String in) {
        //TODO: please handle your trimmed video url here!!!
        String out = "/storage/emulated/0/Android/data/com.iknow.android/cache/compress.mp4";
        buildDialog(getResources().getString(MResource.getIdByName(this, "string", "compressing"))).show();
        CompressVideoUtil.compress(this, in, out, new CompressVideoListener() {
            @Override
            public void onSuccess(String message) {
            }

            @Override
            public void onFailure(String message) {
            }

            @Override
            public void onFinish() {
                if (mProgressDialog.isShowing()) mProgressDialog.dismiss();
                finish();
            }
        });
    }

    @Override
    public void onCancel() {
        trimmerView.onDestroy();
        finish();
    }

    private ProgressDialog buildDialog(String msg) {
        if (mProgressDialog == null) {
            mProgressDialog = ProgressDialog.show(this, "", msg);
        }
        mProgressDialog.setMessage(msg);
        return mProgressDialog;
    }
}
