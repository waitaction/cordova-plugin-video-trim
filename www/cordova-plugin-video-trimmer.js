
var exec = require('cordova/exec');
var Trimmer = function () { }
/**打开视频剪切页 */
Trimmer.prototype.openTrimmerPage = function (opt, success, error) {
    exec(success, error, "CordovaTrimmer", "openTrimmerPage", [opt]);
}
/**打开本地视频列表页 */
Trimmer.prototype.openSelectVideoPage = function (success, error) {
    exec(success, error, "CordovaTrimmer", "openSelectVideoPage", []);
}
/**播放 */
Trimmer.prototype.play = function (opt, success, error) {
    exec(success, error, "CordovaTrimmer", "play", [opt]);
}
/**打开摄像头录制视频 */
Trimmer.prototype.openTakeVideoPage = function (success, error) {
    exec(success, error, "CordovaTrimmer", "openTakeVideoPage", [opt]);
}
module.exports = new Trimmer();




