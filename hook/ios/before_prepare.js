var fs = require('fs');

var cameraPath = "platforms/ios/" + getName() + "/Plugins/cordova-plugin-camera/CDVCamera.m";
var capturePath = "platforms/ios/" + getName() + "/Plugins/cordova-plugin-camera/CDVCapture.m";

function iOSTrim() {
    var data = fs.readFileSync(cameraPath, 'utf8');
    if (data.indexOf(`cameraPicker.videoMaximumDuration`) > 0) {
        return;
    }
    content = data.replace(/pictureOptions\.allowsEditing;/ig,
        `pictureOptions.allowsEditing;\r` +
        `cameraPicker.videoMaximumDuration = 0.25 * 60.0f;//cordova-plugin-video-trim`);
    fs.writeFileSync(cameraPath, content, 'utf8');
}

function fixedCDVCapture() {
    var code = `- (void)imagePickerController:(UIImagePickerController*)picker didFinishPickingMediaWithInfo:(NSDictionary*)info
{
    __weak CDVImagePicker* cameraPicker = (CDVImagePicker*)picker;
    __weak CDVCapture* weakSelf = self;
    NSString* callbackId = cameraPicker.callbackId;
    dispatch_block_t invoke = ^(void) {
        CDVPluginResult* result = nil;
        UIImage* image = nil;
        NSString* mediaType = [info objectForKey:UIImagePickerControllerMediaType];
        if (!mediaType || [mediaType isEqualToString:(NSString*)kUTTypeImage]) {
            // mediaType is nil then only option is UIImagePickerControllerOriginalImage
            if ([UIImagePickerController respondsToSelector:@selector(allowsEditing)] &&
                (cameraPicker.allowsEditing && [info objectForKey:UIImagePickerControllerEditedImage])) {
                image = [info objectForKey:UIImagePickerControllerEditedImage];
            } else {
                image = [info objectForKey:UIImagePickerControllerOriginalImage];
            }
        }
        if (image != nil) {
            // mediaType was image
            result = [weakSelf processImage:image type:cameraPicker.mimeType forCallbackId:callbackId];
        } else if ([mediaType isEqualToString:(NSString*)kUTTypeMovie]) {
            // process video
            NSString* moviePath = [(NSURL *)[info objectForKey:UIImagePickerControllerMediaURL] path];
            if (moviePath) {
                result = [weakSelf processVideo:moviePath forCallbackId:callbackId];
            }
        }
        if (!result) {
            result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageToErrorObject:CAPTURE_INTERNAL_ERR];
        }
        [weakSelf.commandDelegate sendPluginResult:result callbackId:callbackId];
        pickerController = nil;
    };
    [[picker presentingViewController] dismissViewControllerAnimated:YES completion:invoke];
}
- (void)imagePickerControllerDidCancel:
`;
    var data = fs.readFileSync(capturePath, 'utf8');
    if (data.indexOf(`__weak CDVImagePicker* cameraPicker = (CDVImagePicker*)picker;`) > 0) {
        return;
    }
    content = data.replace(/\- \(void\)imagePickerController:[\s\S]*\- \(void\)imagePickerControllerDidCancel:/ig,
        code);
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
        fixedCDVCapture();
        console.log("*** 注入 cordova-plugin-camera/CDVCamera.m 限制视频时长的代码 ***");
        resolve();
    });
};


