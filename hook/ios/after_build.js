var fs = require('fs');

var cameraPath = "platforms/ios/" + getName() + "/Plugins/cordova-plugin-camera/CDVCamera.m";
var capturePath = "platforms/ios/" + getName() + "/Plugins/cordova-plugin-media-capture/CDVCapture.m";

function iOSTrim() {
    var data = fs.readFileSync(cameraPath, 'utf8');
    if (data.indexOf(`cameraPicker.videoMaximumDuration`) > 0) {
        return;
    }
    content = data.replace("pictureOptions.allowsEditing;",
        `pictureOptions.allowsEditing;\r` +
        `cameraPicker.videoMaximumDuration = 0.25 * 60.0f;//cordova-plugin-video-trim`);

    content = content.replace(
`    NSString* moviePath = [[info objectForKey:UIImagePickerControllerMediaURL] absoluteString];
    return [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:moviePath];`,
        `   NSString* moviePath = [[info objectForKey:UIImagePickerControllerMediaURL] path];
    NSArray* spliteArray = [moviePath componentsSeparatedByString: @"/"];
    NSString* lastString = [spliteArray lastObject];
    NSError *error;
    NSFileManager *fileManager = [NSFileManager defaultManager];
    NSString *documentsDirectory = [NSHomeDirectory() stringByAppendingPathComponent:@"tmp"];
    NSString *filePath = [documentsDirectory stringByAppendingPathComponent:lastString];
    [fileManager copyItemAtPath:moviePath toPath:filePath error:&error];
    return [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:filePath];
`);

    fs.writeFileSync(cameraPath, content, 'utf8');
}

function fixedCDVCapture() {
    var sCode =
        `- (void)imagePickerController:(UIImagePickerController*)picker didFinishPickingMediaWithInfo:(NSDictionary*)info\n` +
        `{\n` +
        `    CDVImagePicker* cameraPicker = (CDVImagePicker*)picker;\n` +
        `    NSString* callbackId = cameraPicker.callbackId;\n` +
        `\n` +
        `    [[picker presentingViewController] dismissViewControllerAnimated:YES completion:nil];\n` +
        `\n` +
        `    CDVPluginResult* result = nil;\n` +
        `\n` +
        `    UIImage* image = nil;\n` +
        `    NSString* mediaType = [info objectForKey:UIImagePickerControllerMediaType];\n` +
        `    if (!mediaType || [mediaType isEqualToString:(NSString*)kUTTypeImage]) {\n` +
        `        // mediaType is nil then only option is UIImagePickerControllerOriginalImage\n` +
        `        if ([UIImagePickerController respondsToSelector:@selector(allowsEditing)] &&\n` +
        `            (cameraPicker.allowsEditing && [info objectForKey:UIImagePickerControllerEditedImage])) {\n` +
        `            image = [info objectForKey:UIImagePickerControllerEditedImage];\n` +
        `        } else {\n` +
        `            image = [info objectForKey:UIImagePickerControllerOriginalImage];\n` +
        `        }\n` +
        `    }\n` +
        `    if (image != nil) {\n` +
        `        // mediaType was image\n` +
        `        result = [self processImage:image type:cameraPicker.mimeType forCallbackId:callbackId];\n` +
        `    } else if ([mediaType isEqualToString:(NSString*)kUTTypeMovie]) {\n` +
        `        // process video\n` +
        `        NSString* moviePath = [(NSURL *)[info objectForKey:UIImagePickerControllerMediaURL] path];\n` +
        `        if (moviePath) {\n` +
        `            result = [self processVideo:moviePath forCallbackId:callbackId];\n` +
        `        }\n` +
        `    }\n` +
        `    if (!result) {\n` +
        `        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageToErrorObject:CAPTURE_INTERNAL_ERR];\n` +
        `    }\n` +
        `    [self.commandDelegate sendPluginResult:result callbackId:callbackId];\n` +
        `    pickerController = nil;\n` +
        `}`;


    var code = `- (void)imagePickerController:(UIImagePickerController*)picker didFinishPickingMediaWithInfo:(NSDictionary*)info
{
    //这段方法由cordova-plugin-video-trim注入
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
`;
    var data = fs.readFileSync(capturePath, 'utf8');
    if (data.indexOf(`__weak CDVImagePicker* cameraPicker = (CDVImagePicker*)picker;`) > 0) {
        return;
    }
    content = data.replace(sCode, code);
    fs.writeFileSync(capturePath, content, 'utf8');
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


