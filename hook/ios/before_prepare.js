var fs = require('fs');

var cameraPath = "platforms/ios/" + getName() + "/Plugins/cordova-plugin-camera/CDVCamera.m";

function iOSTrim() {
    var data = fs.readFileSync(cameraPath, 'utf8');
    var content = data.match(/pictureOptions\.allowsEditing;/ig)[0]
    content = content.replace(/pictureOptions\.allowsEditing;/ig,
        `pictureOptions.allowsEditing;\r` +
        `cameraPicker.videoMaximumDuration = 0.25 * 60.0f;//cordova-plugin-video-trim`);
    fs.writeFileSync(cameraPath, content, 'utf8');
}

function getName() {
    var configXmlPath = 'config.xml';
    var data = fs.readFileSync(configXmlPath, 'utf8');
    var mStr = data.match(/<name>.*?<\/name>/ig)[0];
    var name = mStr.replace("<name>", "").replace("</name>", "");
    return name;
}

module.exports = function (context) {
    return new Promise(function (resolve) {
        iOSTrim();
        console.log("*** 注入 cordova-plugin-camera/CDVCamera.m 限制视频时长的代码 ***");
        resolve();
    });
};
