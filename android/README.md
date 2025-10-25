# Android Configuration

This directory contains the Android-specific code and configuration for DocuScan.

## Setup

1. Ensure Android SDK is installed
2. Configure gradle.properties with signing keys
3. Run `./gradlew assembleRelease` to build

## Permissions Required

- CAMERA: For document scanning
- READ_EXTERNAL_STORAGE: For importing images
- WRITE_EXTERNAL_STORAGE: For exporting PDFs

## Native Modules

- Vision Camera for camera access
- React Native Skia for image processing
- SQLite for local database
