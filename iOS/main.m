//
//  main.m
//  kiwoticum
//
//  Created by Wolfger Schramm on 22.01.11.
//  Copyright cobra youth communications GmbH 2011. All rights reserved.
//

#import <UIKit/UIKit.h>

int main(int argc, char *argv[]) {
    
    NSAutoreleasePool * pool = [[NSAutoreleasePool alloc] init];
    int retVal = UIApplicationMain(argc, argv, nil, @"kiwoticumAppDelegate");
    [pool release];
    return retVal;
}
