#import <Cordova/CDV.h>
#import "VideoTrim.h"
#import "MainViewController.h"
#import "ViewController.h"

@interface VideoTrim ()

@end

@implementation VideoTrim

/**
 * trim
 *
 * Performs a trim operation on a clip, while encoding it.
 *
 * ARGUMENTS
 * =========
 * fileUri        - input file path
 * trimStart      - time to start trimming
 * trimEnd        - time to end trimming
 * outputFileName - output file name
 * progress:      - optional callback function that receives progress info
 *
 * RESPONSE
 * ========
 *
 * outputFilePath - path to output file
 *
 * @param CDVInvokedUrlCommand command
 * @return void
 */

- (void) trim:(CDVInvokedUrlCommand*)command {
    
    NSLog(@"[Trim]: trim called");
    invokeCommand = command;
    
    // extract arguments
    NSDictionary* options = [command.arguments objectAtIndex:0];
    if ([options isKindOfClass:[NSNull class]]) {
        options = [NSDictionary dictionary];
    }
    
    NSString *inputFilePath = [options objectForKey:@"fileUri"];
    NSNumber* duration = [options objectForKey:@"duration"];
    
    
    UIStoryboard *storyBoard = [UIStoryboard storyboardWithName: @"Trim" bundle: nil];
    
    ViewController *viewController = (ViewController*)[storyBoard instantiateViewControllerWithIdentifier: @"ViewController"];
    
    viewController.delegate = self;
    viewController.data = inputFilePath;
    viewController.timeLimit = duration;
    
    MainViewController *mainVC = (MainViewController*)[[(CDVAppDelegate*)
                                                        [[UIApplication sharedApplication]delegate] window] rootViewController];
    UINavigationController *navController = [[UINavigationController alloc] initWithRootViewController:viewController];
    [mainVC presentViewController: navController animated: true completion: nil];

}



-(void)selectedVideoPath:(NSURL*)videoURL StatusCode:(NSString*)statusCode{
    NSLog(@"Selected Video Path : %@ ",videoURL.absoluteString);
    
    if ([statusCode isEqualToString:@"success"]) {
        [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:videoURL.absoluteString] callbackId:invokeCommand.callbackId];

    }else if([statusCode isEqualToString:@"fail"]){
        [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:statusCode] callbackId:invokeCommand.callbackId];

    }
}

@end
