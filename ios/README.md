# iOS Configuration

This directory contains the iOS-specific code and configuration for DocuScan.

## Setup

1. Ensure Xcode is installed
2. Run `pod install` from this directory
3. Open DocuScan.xcworkspace in Xcode

## Permissions Required

- Camera: NSCameraUsageDescription
- Photo Library: NSPhotoLibraryUsageDescription
- Photo Library Add: NSPhotoLibraryAddUsageDescription

## Native Modules

- Vision Camera for camera access
- React Native Skia for image processing
- SQLite for local database

## App Store

- Configure signing in Xcode
- Update Info.plist with privacy descriptions
- Configure IAP products in App Store Connect
