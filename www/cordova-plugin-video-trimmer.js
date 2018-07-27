
var exec = require('cordova/exec');
var Trimmer = function () { }
Trimmer.prototype.openTrimmerPage= function(cdvPath,success,error){
    exec(success,error,"TrimmerCordovaPlugin","openTrimmerPage",[cdvPath]);
}
Trimmer.prototype.openSelectVideoPage=function(success,error){
    exec(success,error,"TrimmerCordovaPlugin","openSelectVideoPage",[cdvPath]);
}
module.exports = new Trimmer();




