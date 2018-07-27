
var exec = require('cordova/exec');
var Trimmer = function () { }
Trimmer.prototype.openTrimmerPage= function(opt,success,error){
    exec(success,error,"CordovaTrimmer","openTrimmerPage",[opt]);
}
Trimmer.prototype.openSelectVideoPage=function(success,error){
    exec(success,error,"CordovaTrimmer","openSelectVideoPage",[cdvPath]);
}
module.exports = new Trimmer();




