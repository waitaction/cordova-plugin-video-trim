package com.iknow.android;

import android.app.Activity;
import android.content.Intent;

import com.iknow.android.features.select.VideoSelectActivity;
import com.iknow.android.features.trim.VideoTrimmerActivity;
import com.iknow.android.interfaces.TrimVideoImgListener;
import com.iknow.android.utils.TrimVideoUtil;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class TrimmerCordovaPlugin extends CordovaPlugin implements TrimVideoImgListener {

    public static TrimmerCordovaPlugin instance;
    public static CallbackContext cdvCallbackContetxt;
    private Activity activity;

    public TrimmerCordovaPlugin() {
        TrimmerCordovaPlugin.instance = this;
    }

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
        activity = cordova.getActivity();

    }

    @Override
    public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) throws JSONException {


        if (action.equals("openTrimmerPage")) {
            JSONObject jsObj = args.getJSONObject(0);
            String path = jsObj.getString("path");
            String outPath = jsObj.getString("outPath");
            Intent intent = new Intent();
            intent.setClass(activity, VideoSelectActivity.class);
            intent.putExtra("path", path);
            intent.putExtra("savePath", outPath);
            TrimmerCordovaPlugin.this.activity.startActivity(intent);
            cdvCallbackContetxt = callbackContext;
            return true;
        }

        if (action.equals("openSelectVideoPage")) {
            JSONObject jsObj = args.getJSONObject(0);
            String path = null;
            if (!jsObj.isNull("path")) {
                path = jsObj.getString("path");
            }
            String outPath = jsObj.getString("outPath");
            Intent intent = new Intent();
            intent.setClass(this.activity, VideoSelectActivity.class);
            intent.putExtra("path", path);
            intent.putExtra("savePath", outPath);
            TrimmerCordovaPlugin.this.activity.startActivity(intent);
            cdvCallbackContetxt = callbackContext;
            return true;
        }
        if (action.equals("trimVideoImage")) {
            JSONObject jsObj = args.getJSONObject(0);
            String path = null;
            if (!jsObj.isNull("path")) {
                path = jsObj.getString("path");
            }
            String outPath = jsObj.getString("outPath");
            TrimVideoUtil.trimImg(activity, path, outPath, this);
            cdvCallbackContetxt = callbackContext;
            return true;
        }
        if (action.equals("init")) {
            ZApplication.init(activity);
            callbackContext.success();
            return true;
        }
        return false;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
    }

    @Override
    public void onStartTrimImg() {

    }

    @Override
    public void onFinishTrimImg(String url) {
        cdvCallbackContetxt.success(url);
    }

    @Override
    public void onCancelTrimImg() {

    }
}
