
var exec = require('cordova/exec');

var Trimmer = function () { }
Trimmer.prototype.test = function () {
    exec(success, error, "tt", "init", []);
    return device.platform == 'Android';
}


module.exports = new Trimmer();




