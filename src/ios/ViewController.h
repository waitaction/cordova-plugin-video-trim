//
//  ViewController.h
//  ICGVideoTrimmer
//
//  Created by HuongDo on 1/15/15.
//  Copyright (c) 2015 ichigo. All rights reserved.
//

#import <UIKit/UIKit.h>

@protocol videoTrimDelegate <NSObject>
-(void)selectedVideoPath:(NSURL*)videoURL StatusCode:(NSString*)statusCode;
@end


@interface ViewController : UIViewController<videoTrimDelegate>

@property (nonatomic, retain) NSString *data;
@property (nonatomic, retain) NSNumber *timeLimit;
@property (nonatomic, weak) id <videoTrimDelegate> delegate;

@end

