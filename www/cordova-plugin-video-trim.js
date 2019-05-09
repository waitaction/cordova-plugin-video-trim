
var exec = require('cordova/exec');
var Trimmer = function () { }

/**
 * 视频剪辑
 * 输入视频路径，成功输出剪辑后的视频路径
 */
Trimmer.prototype.trimVideo = function (videoPath, success, error) {
    var that = this;
    this.init(function () {
        var outPath = window.cordova.file.dataDirectory + (new Date()).getTime() + ".mp4"; // 输出路径
        that.openTrimmerPage({ path: videoPath, outPath: outPath }, success, error);
    }, function (error) {
        error(error)
    });
}

/**
 * 从相册选择视频后剪辑
 */
Trimmer.prototype.trimSelectedVideo = function (success, error) {
    var that = this;
    this.init(function () {
        var outPath = window.cordova.file.dataDirectory + (new Date()).getTime() + ".mp4"; // 输出路径
        that.openSelectVideoPage({ outPath: outPath }, success, error);
    }, function (error) {
        error(error)
    });
}

/**
 * 录像后前辑
 */
Trimmer.prototype.trimRecordedVideo = function (success, error) {
    var that = this;
    this.init(function () {
        var outPath = window.cordova.file.dataDirectory + (new Date()).getTime() + ".mp4"; // 输出路径
        that.openRecordVideoPage({ outPath: outPath }, success, error);
    }, function (error) {
        error(error)
    });
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
Trimmer.prototype.getVideoPreviewImg = function (opt, success, error) {
    this.init(function () {
        exec(success, error, "CordovaTrimmer", "trimVideoImage", [opt]);
    }, function (error) {
        error(error)
    });
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
    exec(success, error, "CordovaTrimmer", "init", []);
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

