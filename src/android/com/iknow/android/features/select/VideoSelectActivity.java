package com.iknow.android.features.select;


import android.app.Activity;
import android.os.Bundle;
import android.support.v7.widget.GridLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import com.iknow.android.MResource;
import com.iknow.android.ZApplication;
import com.iknow.android.features.trim.VideoTrimmerActivity;
import com.iknow.android.models.VideoInfo;
import com.iknow.android.utils.TrimVideoUtil;
import com.iknow.android.widget.SpacesItemDecoration;

import iknow.android.utils.callback.SimpleCallback;
import iknow.android.utils.callback.SingleCallback;


import java.util.List;

import android.util.DisplayMetrics;

public class VideoSelectActivity extends Activity implements View.OnClickListener {

    private VideoSelectAdapter mVideoSelectAdapter;
    private String mVideoPath;
    private ImageView mBtnBack;
    private TextView nextStep;

    @Override
    protected void onCreate(Bundle bundle) {
        super.onCreate(bundle);
        ZApplication.init(this);
        setContentView(MResource.getIdByName(this, "layout", "video_select_layout"));
        GridLayoutManager manager = new GridLayoutManager(this, 4);
        RecyclerView videoSelectRecyclerview = (RecyclerView) findViewById(MResource.getIdByName(this, "id", "video_select_recyclerview"));
        videoSelectRecyclerview.addItemDecoration(new SpacesItemDecoration(5));
        videoSelectRecyclerview.setHasFixedSize(true);
        videoSelectRecyclerview.setAdapter(mVideoSelectAdapter = new VideoSelectAdapter(this));
        videoSelectRecyclerview.setLayoutManager(manager);

        ImageView videoShoot = (ImageView) findViewById(MResource.getIdByName(this, "id", "video_shoot"));
        videoShoot.setOnClickListener(this);

        mBtnBack = (ImageView) findViewById(MResource.getIdByName(this, "id", "mBtnBack"));
        mBtnBack.setOnClickListener(this);

        nextStep = (TextView) findViewById(MResource.getIdByName(this, "id", "next_step"));
        nextStep.setOnClickListener(this);
        nextStep.setTextAppearance(this, MResource.getIdByName(this, "style", "gray_text_18_style"));
        nextStep.setEnabled(false);

        mVideoSelectAdapter.setItemClickCallback(new SingleCallback<Boolean, VideoInfo>() {
            @Override
            public void onSingleCallback(Boolean isSelected, VideoInfo video) {
                if (video != null) mVideoPath = video.getVideoPath();
                nextStep.setEnabled(isSelected);
                nextStep.setTextAppearance(VideoSelectActivity.this, isSelected ? MResource.getIdByName(VideoSelectActivity.this, "style", "blue_text_18_style") : MResource.getIdByName(VideoSelectActivity.this, "style", "gray_text_18_style"));
            }
        });
        DisplayMetrics metrics = this.getResources().getDisplayMetrics();

        int recyclerViewPadding = (int) ((float) 35 * metrics.density + 0.5F);
        int thumbHeight = (int) ((float) 50 * metrics.density + 0.5F);
        TrimVideoUtil.init(metrics.widthPixels, recyclerViewPadding, thumbHeight);

        // Always true pre-M
        TrimVideoUtil.loadVideoFiles(VideoSelectActivity.this, new SimpleCallback() {
            @SuppressWarnings("unchecked")
            @Override
            public void success(Object obj) {
                mVideoSelectAdapter.setVideoData((List<VideoInfo>) obj);
            }
        });

    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
    }

    @Override
    public void onClick(View v) {
        if (v.getId() == mBtnBack.getId()) {
            finish();
        } else if (v.getId() == nextStep.getId()) {
            VideoTrimmerActivity.call(VideoSelectActivity.this, mVideoPath);
        }
    }
}
