//
//  VideoEditor.h
//
//  Created by Josh Bavari on 01-14-2014
//  Modified by Ross Martin on 01-29-2015
//

#import <Foundation/Foundation.h>
#import <AVFoundation/AVFoundation.h>
#import <AssetsLibrary/ALAssetsLibrary.h>
#import <MediaPlayer/MediaPlayer.h>
#import "ViewController.h"
#import <Cordova/CDV.h>


@interface VideoTrim : CDVPlugin<videoTrimDelegate> {
    CDVInvokedUrlCommand *invokeCommand;
}

- (void) trim:(CDVInvokedUrlCommand*)command;

@end
