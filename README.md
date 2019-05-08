
# cordova-plugin-video-trim
截取短视频cordova插件，目前支持大于`cordova-android@8.0.0`版本
## 安装

先安装依赖项插件

```shell
cordova plugin add cordova-plugin-device
cordova plugin add cordova-plugin-media
cordova plugin add cordova-plugin-media-capture
```
`由于安卓版本碎片化问题，以上依赖项必须手动安装`

正式安装 cordova-plugin-video-trim

```shell
cordova plugin add https://github.com/waitaction/cordova-plugin-video-trim.git
```

## 怎么用

### 初始 cordova-plugin-video-trim

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
videoTrimmer.openRecordVideoPage({outPath:outPath},function (videoUrl) {
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

### 从视频截图封面图

```javascript
videoTrimmer.trimVideoImage({ path:data , outPath:imgPath },function(url){
    $("body").append("<img src='" + url + "' />");
});
```

#### Demo

<img src="https://github.com/iknow4/iknow.Images/blob/master/gif/videoTrim2.gif?raw=true" width="400" height="700" alt="videoTrim2"/>

`cordova-plugin-video-trim插件部分代码来源 https://github.com/iknow4/Android-Video-Trimmer `