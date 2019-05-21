
var exec = require('cordova/exec');
var Trimmer = function () { }

/**
 * 视频剪辑
 * 输入视频路径，成功输出剪辑后的视频路径
 */
Trimmer.prototype.trimVideo = function (videoPath, success, error) {
    var that = this; var platform = device.platform;
    if (platform.toLowerCase() == "android") {
        this.init(function () {
            var outPath = window.cordova.file.dataDirectory + (new Date()).getTime() + ".mp4"; // 输出路径
            that.openTrimmerPage({ path: videoPath, outPath: outPath }, success, error);
        }, function (error) {
            error(error)
        });
    }
    if (platform.toLowerCase() == "ios") {
        var nativeUrl = videoPath;
        that.iosTrim(
            function (result) {
                success && success(result);
            },
            function (err) {
                error && error(err);
            },
            {
                path: nativeUrl, // path to input video,
                limit: 20, // max limit, only for android
                fileUri: nativeUrl, // for ios
                duration: 15 //for ios
            }
        );

    }
}

/**
 * 从相册选择视频后剪辑
 */
Trimmer.prototype.trimSelectedVideo = function (success, error) {
    var that = this;
    var platform = device.platform;
    if (platform.toLowerCase() == "android") {
        this.init(function () {
            var outPath = window.cordova.file.dataDirectory + (new Date()).getTime() + ".mp4"; // 输出路径
            that.openSelectVideoPage({ outPath: outPath }, success, error);
        }, function (error) {
            error(error)
        });
    }
    if (platform.toLowerCase() == "ios") {
        //先打开选择视频的页面 cordova-plugin-trim
        navigator.camera.getPicture(function (nativeUrl) {
            that.iosTrim(
                function (result) {
                    success && success(result);
                },
                function (err) {
                    error && error(err);
                },
                {
                    path: nativeUrl, // path to input video,
                    limit: 20, // max limit, only for android
                    fileUri: nativeUrl, // for ios
                    duration: 15 //for ios
                }
            );
        }, function (error) {
            console.error(error);
        }, {
                allowEdit: true,
                destinationType: Camera.DestinationType.NATIVE_URI,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                mediaType: Camera.MediaType.VIDEO,
                popoverOptions: new CameraPopoverOptions(300, 300, 100, 100, Camera.PopoverArrowDirection.ARROW_ANY)
            });
    }

}

/**
 * 录像后前辑
 */
Trimmer.prototype.trimRecordedVideo = function (success, error) {
    var that = this;
    var platform = device.platform;
    if (platform.toLowerCase() == "android") {
        this.init(function () {
            var outPath = window.cordova.file.dataDirectory + (new Date()).getTime() + ".mp4"; // 输出路径
            that.openRecordVideoPage({ outPath: outPath }, success, error);
        }, function (error) {
            error(error)
        });
    }
    if (platform.toLowerCase() == "ios") {
        navigator.device.capture.captureVideo(function (mediaFiles) {
            var nativeUrl = mediaFiles[0].fullPath;
            that.iosTrim(
                function (result) {
                    success && success(result);
                },
                function (err) {
                    error && error(err);
                },
                {
                    path: nativeUrl, // path to input video,
                    limit: 20, // max limit, only for android
                    fileUri: nativeUrl, // for ios
                    duration: 15 //for ios
                }
            );
        }, function (err) {
            error(err);
        }, { limit: 1, duration: 20 })

    }
}

/**
 * 播放视频(允许全屏)
 * */
Trimmer.prototype.play = function (videoPath, success, error) {
    // Play a video with callbacks
    var options = {
        successCallback: function () {
            console.log("Video was closed without error.");
            success && success();
        },
        errorCallback: function (errMsg) {
            console.log("Error! " + errMsg);
            error && error(errMsg);
        },
        orientation: 'portrait',//portrait landscape
        shouldAutoClose: true,  // true(default)/false
        controls: true // true(default)/false. Used to hide controls on fullscreen
    };
    window.plugins.streamingMedia.playVideo(videoPath, options);
}

/**
 * 获取视频预览图
 */
Trimmer.prototype.getVideoPreviewImg = function (videoPath, success, error) {
    var platform = device.platform;
    if (platform.toLowerCase() == "android") {
        this.init(function () {
            var outPath = window.cordova.file.dataDirectory + (new Date()).getTime() + ".jpg"; // 输出路径
            exec(success, error, "CordovaTrimmer", "trimVideoImage", [{ path: videoPath, outPath: outPath }]);
        }, function (error) {
            error(error)
        });
    } else {
        alert("获取视频预览图暂时不支持ios，在ios平台不要调用此方法getVideoPreviewImg");
    }

}


/**打开视频截取页 */
Trimmer.prototype.openTrimmerPage = function (opt, success, error) {
    exec(success, error, "CordovaTrimmer", "openTrimmerPage", [opt]);
}

/**打开本地视频列表页 */
Trimmer.prototype.openSelectVideoPage = function (opt, success, error) {
    exec(success, error, "CordovaTrimmer", "openSelectVideoPage", [opt]);
}

/**打开摄像头录制视频 */
Trimmer.prototype.openRecordVideoPage = function (opt, success, error) {
    navigator.device.capture.captureVideo(function (mediaFiles) {
        exec(success, error, "CordovaTrimmer", "openTrimmerPage", [{ path: mediaFiles[0].fullPath, outPath: opt.outPath }]);
    }, function (err) {
        error(err);
    }, { limit: 1, duration: 20 });
}

Trimmer.prototype.trimVideoImage = function (opt, success, error) {
    exec(success, error, "CordovaTrimmer", "trimVideoImage", [opt]);
}

Trimmer.prototype.init = function (success, error) {
    var permissions = cordova.plugins.permissions;
    permissions.hasPermission(permissions.CAMERA, function (status) {
        if (!status.hasPermission) {
            permissions.requestPermissions(
                [permissions.READ_EXTERNAL_STORAGE, permissions.WRITE_EXTERNAL_STORAGE],
                function () {
                    exec(success, error, "CordovaTrimmer", "init", []);
                }, function () {
                    console.warn('Camera permission is not turned on');
                    exec(success, error, "CordovaTrimmer", "init", []);
                });
        } else {
            exec(success, error, "CordovaTrimmer", "init", []);
        }
    });
}

Trimmer.prototype.iosTrim = function (success, error, options) {
    var self = this;
    var win = function (result) {
        if (typeof result.progress !== 'undefined') {
            if (typeof options.progress === 'function') {
                options.progress(result.progress);
            }
        } else {
            success(result);
        }
    };
    exec(win, error, 'VideoTrim', 'trim', [options]);
};

module.exports = new Trimmer();

