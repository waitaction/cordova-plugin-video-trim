package com.iknow.android;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;

import com.iknow.android.features.select.VideoSelectActivity;
import com.iknow.android.features.trim.VideoTrimmerActivity;
import com.iknow.android.models.VideoInfo;
import com.iknow.android.utils.TrimVideoUtil;
import com.tbruyelle.rxpermissions2.RxPermissions;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.List;

import iknow.android.utils.callback.SimpleCallback;
import io.reactivex.functions.Consumer;

public class TrimmerCordovaPlugin extends CordovaPlugin {

    public static TrimmerCordovaPlugin instance;
    private Activity activity;
    private int REQUEST_GET_TIME = 1;

    public TrimmerCordovaPlugin() {
        TrimmerCordovaPlugin.instance = this;
    }

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
        activity = cordova.getActivity();
    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        JSONObject jsObj = args.getJSONObject(0);


        if (action.equals("openTrimmerPage")) {
            // todo
            String path = jsObj.getString("path");
            final Intent intent = new Intent();
            intent.setClass(this.activity, VideoSelectActivity.class);
            intent.putExtra("path", path);
            this.activity.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    TrimmerCordovaPlugin.this.activity.startActivity(intent);
                }
            });


            //callbackContext.success(path);
            return true;
        }

        if (action.equals("openSelectVideoPage")) {
            callbackContext.success();
            return true;
        }
        return false;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
    }

}
