
# cordova-plugin-video-trim
短视频剪辑cordova插件

| 开发环境        | 版本    |
| --------------- | ------- |
| cordova         | ≥ 9.0.0 |
| cordova-android | ≥8.0.0  |

> 视频剪辑需要在手机设备运行，安卓虚拟机无法剪辑

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

``` javascript
  videoTrim.trimVideo(videoPath,trimSuccess,trimFail);
  function trimSuccess(result) {
      console.log('trimSuccess, path: ' + result);
  }
  function trimFail(err) {
      console.log('trimFail, err: ' + err);
  }
```

### 从相册选择视频后剪辑
``` javascript
  videoTrim.trimSelectedVideo(trimSuccess,trimFail);
  function trimSuccess(filePath) {
      console.log('trimSuccess, path: ' + filePath);
  }
  function trimFail(err) {
      console.log('trimFail, err: ' + err);
  }
```

### 录像后前辑

``` javascript
  videoTrim.trimRecordedVideo(trimSuccess,trimFail);
  function trimSuccess(filePath) {
      console.log('trimSuccess, path: ' + filePath);
  }
  function trimFail(err) {
      console.log('trimFail, err: ' + err);
  }
```

### 获取视频预览图

``` javascript
 videoTrim.getVideoPreviewImg(videoPath,
    function(url){
        $("body").append("<img src='" + url + "' />");
    },
    function(){
        console.log('error');
    }
);
```

### 播放视频(允许全屏)

``` javascript
videoTrim.play(videoPath,success,error);
function success(){

}
function error(){

}
```

## Demo

#### 示例项目：`https://github.com/waitaction/cordova-plugin-video-trim-demo`

<img src="https://github.com/iknow4/iknow.Images/blob/master/gif/videoTrim2.gif?raw=true" width="400" height="700" alt="videoTrim2"/>

感谢开源项目`https://github.com/iknow4/Android-Video-Trimmer`提供部分安卓代码

## 推荐

websql-orm `https://github.com/waitaction/websql-orm`

