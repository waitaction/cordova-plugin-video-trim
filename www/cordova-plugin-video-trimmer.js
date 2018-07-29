
var exec = require('cordova/exec');
var Trimmer = function () { }

/**打开视频截取页 */
Trimmer.prototype.openTrimmerPage = function (opt, success, error) {
    exec(success, error, "CordovaTrimmer", "openTrimmerPage", [opt]);
}

/**打开本地视频列表页 */
Trimmer.prototype.openSelectVideoPage = function (opt, success, error) {
    exec(success, error, "CordovaTrimmer", "openSelectVideoPage", [opt]);
}

/**播放 */
Trimmer.prototype.play = function (opt, success, error) {
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
    window.plugins.streamingMedia.playVideo(opt.path, options);
}

/**打开摄像头录制视频 */
Trimmer.prototype.openRecordVideoPage = function (success, error) {
    navigator.device.capture.captureVideo(function (mediaFiles) {
        exec(success, error, "CordovaTrimmer", "openTrimmerPage", [{ path: mediaFiles[0].fullPath }]);
    }, function (err) {
        error(err);
    }, { limit: 1, duration: 20 });
}

Trimmer.prototype.init = function (success, error) {
    exec(success, error, "CordovaTrimmer", "init", []);
}

module.exports = new Trimmer();

