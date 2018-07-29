
# cordova-plugin-video-trimmer
截取短视频cordova插件
## 安装
```shell
cordova plugin add https://github.com/waitaction/cordova-plugin-video-trimmer.git
```
例如`cordova plugin add https://github.com/waitaction/cordova-plugin-video-trimmer.git`
## 怎么用

### 初始 cordova-plugin-video-trimmer

```javascript
videoTrimmer.init(function () {
    // 初始化成功
    // todo
});
```

### 从视频选择对话框开始，选择源视频后截取视频片段

```javascript
var dataDirectory = window.cordova.file.dataDirectory;
var outPath = dataDirectory + "test.mp4"; // 输出最终短视频的路径
videoTrimmer.openSelectVideoPage({ outPath: outPath }, function (videoUrl) {
    // 截取视频片段成功，视频片段地址 videoUrl
    // 播放截取后的视频片段
    videoTrimmer.play({ path:videoUrl },function(){ },function(){ }); // 播放
}, function (err) {
    // 截取视频片段失败
});
```

### 打开摄像头录制短视频
```javascript
videoTrimmer.openRecordVideoPage(function (videoUrl) {
    // 截取视频片段成功，视频片段地址 videoUrl
    // todo
}, function (error) { 
    // 截取视频片段失败
});
```

### 输入源视频路径截取视频片段

```javascript
videoTrimmer.openTrimmerPage({ path:sourcePath , outPath:targetPath },function(videoUrl){
    // 截取视频片段成功，视频片段地址 videoUrl
    // todo
},function(error){
    // 截取视频片段失败
});
```


#### 视频截图
<img src="https://github.com/iknow4/iknow.Images/blob/master/gif/videoTrim.gif?raw=true" width="400" height="700" alt="VideoTrim"/>

<img src="https://github.com/iknow4/iknow.Images/blob/master/gif/videoTrim2.gif?raw=true" width="400" height="700" alt="videoTrim2"/>

`cordova-plugin-video-trimmer插件部分代码来源 https://github.com/iknow4/Android-Video-Trimmer `