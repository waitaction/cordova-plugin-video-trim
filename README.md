`重构中，该插件暂时不可用`

# cordova-plugin-video-trim
短视频剪辑cordova插件

| 开发环境        | 版本    |
| --------------- | ------- |
| cordova         | ≥ 9.0.0 |
| cordova-android | ≥8.0.0  |


## 安装

``` shell
cordova plugin add cordova-plugin-video-trim
```

## 方法列表
| 方法                         | 描述                 |
| ---------------------------- | -------------------- |
| videoTrim.trimVideo          | 视频剪辑             |
| videoTrim.trimSelectedVideo  | 从相册选择视频后剪辑 |
| videoTrim.trimRecordedVideo  | 录像后前辑           |
| videoTrim.play               | 播放视频(允许全屏)   |
| videoTrim.getVideoPreviewImg | 获取视频预览图       |


### 视频剪辑

```javascript
  videoTrim.trimVideo(videoPath,trimSuccess,trimFail);
  function trimSuccess(result) {
      console.log('trimSuccess, path: ' + result);
  }
  function trimFail(err) {
      console.log('trimFail, err: ' + err);
  }
```

### 从相册选择视频后剪辑
```javascript
  videoTrim.trimSelectedVideo(trimSuccess,trimFail);
  function trimSuccess(filePath) {
      console.log('trimSuccess, path: ' + filePath);
  }
  function trimFail(err) {
      console.log('trimFail, err: ' + err);
  }
```

### 录像后前辑

```javascript
  videoTrim.trimRecordedVideo(trimSuccess,trimFail);
  function trimSuccess(filePath) {
      console.log('trimSuccess, path: ' + filePath);
  }
  function trimFail(err) {
      console.log('trimFail, err: ' + err);
  }
```

### 获取视频预览图

```javascript
videoTrim.getVideoPreviewImg({ path:data , outPath:imgPath },
    function(url){
        $("body").append("<img src='" + url + "' />");
    }
);
```

## Demo

<img src="https://github.com/iknow4/iknow.Images/blob/master/gif/videoTrim2.gif?raw=true" width="400" height="700" alt="videoTrim2"/>

`cordova-plugin-video-trim插件部分代码来自 https://github.com/iknow4/Android-Video-Trimmer `

