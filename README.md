# DocuScan - Offline Document Scanner

A production-grade React Native document scanner app with advanced features including edge detection, perspective correction, filters, OCR, and annotations.

## Features

### Core Features
- **Camera Capture**: Live edge detection with auto-capture
- **Edge Detection**: Automatic document boundary detection
- **Perspective Correction**: Auto-straighten scanned documents
- **Multi-page Documents**: Scan and organize multiple pages
- **Enhancement Filters**: Color, Magic Color, Grayscale, Black & White
- **Document Library**: Organize with folders and tags
- **Search**: Find documents by name or content (with OCR)
- **Export**: PDF and image export with sharing

### Pro Features (IAP)
- **OCR**: Offline text recognition with search
- **Annotations**: Pen, highlighter, shapes, and arrows
- **Advanced Filters**: Additional enhancement presets
- **No Watermarks**: Remove watermarks from exports

## Tech Stack

- **React Native 0.73**: Cross-platform mobile framework
- **TypeScript**: Type-safe development
- **Reanimated 3**: 60fps animations and gestures
- **Skia**: GPU-accelerated graphics and image processing
- **Vision Camera**: High-quality camera capture
- **SQLite**: Local database for documents
- **Zustand**: State management
- **React Navigation**: Navigation system

## Project Structure

```
DocuScan/
├── src/
│   ├── components/      # Reusable UI components
│   ├── screens/         # Main application screens
│   ├── stores/          # Zustand state stores
│   ├── services/        # Database and external services
│   ├── utils/           # Utility functions
│   └── types/           # TypeScript type definitions
├── android/             # Android native code
├── ios/                 # iOS native code
└── App.tsx              # Application entry point
```

## Installation

### Prerequisites
- Node.js >= 18
- React Native development environment set up
- iOS: Xcode and CocoaPods
- Android: Android Studio and SDK

### Setup

1. Install dependencies:
```bash
npm install
```

2. iOS setup:
```bash
cd ios && pod install && cd ..
```

3. Run the app:
```bash
# iOS
npm run ios

# Android
npm run android
```

## Architecture

### State Management
The app uses Zustand with separate stores for each feature:
- `libraryStore`: Document library and folders
- `scanStore`: Camera capture session
- `reviewStore`: Image enhancement and editing
- `viewerStore`: Document viewing and annotations
- `ocrStore`: OCR processing
- `iapStore`: In-app purchases

### Data Flow
1. **Capture**: Camera → Edge Detection → Scan Store
2. **Review**: Scan Store → Enhancement → Review Store
3. **Save**: Review Store → Database → Library Store
4. **View**: Library Store → Viewer Store → Display

### Offline-First
All features work offline:
- Local SQLite database
- On-device image processing
- Local OCR (Tesseract.js)
- No cloud dependency

## Development

### Type Checking
```bash
npm run typecheck
```

### Linting
```bash
npm run lint
```

### Testing
```bash
npm test
```

## Performance

- **60fps animations** with Reanimated worklets
- **GPU-accelerated** image processing with Skia
- **Lazy loading** for document thumbnails
- **Optimized database** queries with indices
- **Memory efficient** image handling

## License

Proprietary - All rights reserved

## Author

Built with Claude Code
