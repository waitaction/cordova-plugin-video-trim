package com.iknow.android.features.select;

import android.content.Context;
import android.support.annotation.NonNull;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.TextView;
import com.iknow.android.MResource;
import com.iknow.android.models.VideoInfo;
import com.iknow.android.utils.TrimVideoUtil;
import com.nostra13.universalimageloader.core.ImageLoader;
import java.util.ArrayList;
import iknow.android.utils.DateUtil;
import iknow.android.utils.callback.SingleCallback;
import java.util.List;

public class VideoSelectAdapter extends RecyclerView.Adapter<VideoSelectAdapter.VideoViewHolder> {

    private Context context;
    private List<VideoInfo> mVideoListData = new ArrayList();
    private SingleCallback<Boolean, VideoInfo> mSingleCallback;
    private ArrayList<VideoInfo> videoSelect = new ArrayList();
    private ArrayList<ImageView> selectIconList = new ArrayList();
    private boolean isSelected = false;

    VideoSelectAdapter(Context context) {
        this.context = context;
    }

    @NonNull
    @Override
    public VideoViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        final LayoutInflater inflater = LayoutInflater.from(parent.getContext());
        return new VideoViewHolder(inflater.inflate(MResource.getIdByName(this.context, "layout", "video_select_gridview_item"), null));
    }

    @Override
    public void onBindViewHolder(@NonNull VideoViewHolder holder, int position) {
        VideoInfo video = mVideoListData.get(position);
        holder.durationTv.setText(DateUtil.convertSecondsToTime(video.getDuration() / 1000));
        String videoPath = TrimVideoUtil.getVideoFilePath(video.getVideoPath());
        ImageLoader.getInstance().displayImage(videoPath, holder.videoCover);
    }

    @Override
    public int getItemCount() {
        return mVideoListData.size();
    }

    void setVideoData(List<VideoInfo> videos) {
        mVideoListData.addAll(videos);
        notifyDataSetChanged();
    }

    void setItemClickCallback(final SingleCallback<Boolean, VideoInfo> singleCallback) {
        this.mSingleCallback = singleCallback;
    }

    class VideoViewHolder extends RecyclerView.ViewHolder {

        ImageView videoCover, selectIcon;
        View videoItemView, videoSelectPanel;
        TextView durationTv;

        VideoViewHolder(final View itemView) {
            super(itemView);
            videoItemView = itemView.findViewById(MResource.getIdByName(VideoSelectAdapter.this.context, "id", "video_view"));
            videoCover = (ImageView) itemView.findViewById(MResource.getIdByName(VideoSelectAdapter.this.context, "id", "cover_image"));
            durationTv = (TextView) itemView.findViewById(MResource.getIdByName(VideoSelectAdapter.this.context, "id", "video_duration"));
            videoSelectPanel = itemView.findViewById(MResource.getIdByName(VideoSelectAdapter.this.context, "id", "video_select_panel"));
            selectIcon = (ImageView) itemView.findViewById(MResource.getIdByName(VideoSelectAdapter.this.context, "id", "select"));
            int size = VideoSelectAdapter.this.context.getResources().getDisplayMetrics().widthPixels / 4; //    DeviceUtil.getDeviceWidth() / 4;
            FrameLayout.LayoutParams params = (FrameLayout.LayoutParams) videoCover.getLayoutParams();
            params.width = size;
            params.height = size;
            videoCover.setLayoutParams(params);
            videoSelectPanel.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    VideoInfo videoInfo = mVideoListData.get(getAdapterPosition());
                    if (videoSelect.size() > 0) {
                        if (videoInfo.equals(videoSelect.get(0))) {
                            selectIcon.setImageResource(MResource.getIdByName(VideoSelectAdapter.this.context, "drawable", "icon_video_unselected"));
                            clearAll();
                            isSelected = false;
                        } else {
                            selectIconList.get(0).setImageResource(MResource.getIdByName(VideoSelectAdapter.this.context, "drawable", "icon_video_unselected"));
                            clearAll();
                            addData(videoInfo);
                            selectIcon.setImageResource(MResource.getIdByName(VideoSelectAdapter.this.context, "drawable", "icon_video_selected"));
                            isSelected = true;
                        }
                    } else {
                        clearAll();
                        addData(videoInfo);
                        selectIcon.setImageResource(MResource.getIdByName(VideoSelectAdapter.this.context, "drawable", "icon_video_selected"));
                        isSelected = true;
                    }
                    mSingleCallback.onSingleCallback(isSelected, mVideoListData.get(getAdapterPosition()));
                }
            });
        }

        private void addData(VideoInfo videoInfo) {
            videoSelect.add(videoInfo);
            selectIconList.add(selectIcon);
        }
    }

    private void clearAll() {
        videoSelect.clear();
        selectIconList.clear();
    }
}
