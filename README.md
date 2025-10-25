# DocuScan - Production-Grade Offline Document Scanner

> A complete, production-ready React Native document scanner with advanced features including AI-powered edge detection, perspective correction, OCR, annotations, and comprehensive document management.

[![React Native](https://img.shields.io/badge/React%20Native-0.73-blue.svg)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)]()

## 🌟 Features

### Core Features (Free)
- **📸 Advanced Camera Capture**
  - Real-time edge detection with live overlay
  - Auto-capture when document is stable
  - Manual and auto modes
  - Flash and grid controls
  - Import from photo library

- **✨ Smart Enhancement**
  - 4 filter presets: Color, Magic Color, Grayscale, Black & White
  - Brightness and contrast adjustments
  - Auto white balance
  - Perspective correction
  - Crop with magnifier loupe

- **📄 Multi-Page Documents**
  - Scan multiple pages in one session
  - Drag-to-reorder pages
  - Individual page editing
  - Add/remove pages anytime

- **📁 Document Library**
  - Grid and list view modes
  - Folders and subfolders
  - Tags and metadata
  - Fast search
  - Sort by name or date
  - Batch operations

- **📤 Export & Share**
  - PDF generation
  - Image export (JPG/PNG)
  - Quality options
  - Native share sheet

### Pro Features (IAP)
- **🔍 Offline OCR**
  - Text recognition with Tesseract.js
  - Full-text search across documents
  - Multi-language support
  - Offline indexing

- **✏️ Annotations**
  - Pen drawing with Skia
  - Highlighter tool
  - Shapes (rectangle, circle, arrow)
  - Color picker
  - Stroke width adjustment
  - Flatten on export

- **🎨 Advanced Filters**
  - Additional enhancement presets
  - Professional adjustments
  - Batch processing

- **🔓 No Watermarks**
  - Clean exports
  - Professional quality

## 🏗️ Architecture

### Tech Stack
- **React Native 0.73** - Cross-platform framework
- **TypeScript 5.0** - Type safety
- **Reanimated 3** - 60fps animations
- **React Native Skia** - GPU-accelerated graphics
- **Vision Camera** - High-quality camera
- **SQLite** - Local database
- **Zustand** - State management
- **React Navigation** - Navigation

### Project Structure
```
DocuScan/
├── src/
│   ├── components/
│   │   ├── Button.tsx                    # Animated button
│   │   ├── FAB.tsx                       # Floating action button
│   │   ├── Icon.tsx                      # Icon system
│   │   ├── CameraPreview.tsx             # Advanced camera with edge detection
│   │   ├── CropTool.tsx                  # Crop with magnifier loupe
│   │   ├── AnnotationCanvas.tsx          # Skia drawing canvas
│   │   ├── LoadingSkeleton.tsx           # Loading states
│   │   ├── ErrorBoundary.tsx             # Error handling
│   │   └── DocumentActionsModal.tsx      # Document actions
│   ├── screens/
│   │   ├── OnboardingScreen.tsx          # First-time tutorial
│   │   ├── LibraryScreen.tsx             # Document library
│   │   ├── ScanScreen.tsx                # Camera capture
│   │   ├── ReviewScreen.tsx              # Edit & enhance
│   │   ├── ViewerScreen.tsx              # Document viewer
│   │   ├── SettingsScreen.tsx            # App settings
│   │   └── ProUpgradeScreen.tsx          # Premium upgrade
│   ├── stores/
│   │   ├── libraryStore.ts               # Documents & folders
│   │   ├── scanStore.ts                  # Capture session
│   │   ├── reviewStore.ts                # Enhancement state
│   │   ├── viewerStore.ts                # Viewing & annotations
│   │   ├── ocrStore.ts                   # Text recognition
│   │   └── iapStore.ts                   # In-app purchases
│   ├── services/
│   │   ├── database.ts                   # SQLite operations
│   │   └── imageFilters.ts               # Skia filters
│   ├── utils/
│   │   ├── animations.ts                 # Reanimated helpers
│   │   ├── imageProcessing.ts            # Edge detection & transforms
│   │   ├── pdfGenerator.ts               # PDF creation
│   │   └── helpers.ts                    # General utilities
│   ├── types/
│   │   ├── models.ts                     # Data models
│   │   └── components.ts                 # Component types
│   └── theme/
│       └── index.ts                      # Design system
├── android/                              # Android native code
├── ios/                                  # iOS native code
├── App.tsx                               # App entry point
└── package.json                          # Dependencies
```

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- React Native development environment
- **iOS**: Xcode 14+, CocoaPods
- **Android**: Android Studio, SDK 33+

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Chepman32/DocuScan.git
cd DocuScan
```

2. **Install dependencies**
```bash
npm install
```

3. **iOS setup**
```bash
cd ios
pod install
cd ..
```

4. **Run the app**
```bash
# iOS
npm run ios

# Android
npm run android
```

## 📱 Screens

### 1. Onboarding
- Beautiful introductory slides
- Feature highlights
- Skip option
- Smooth animations

### 2. Library Screen
- Grid/list toggle
- Folder navigation
- Search with filters
- Multi-select actions
- FAB for new scan

### 3. Scan Screen
- Live camera preview
- Real-time edge detection
- Auto/manual capture
- Grid overlay
- Page counter
- Flash control

### 4. Review Screen
- Page carousel
- Filter presets
- Brightness/contrast sliders
- Rotation controls
- Crop with magnifier
- Page reordering
- Multi-page tray

### 5. Viewer Screen
- Continuous scroll
- Pinch-to-zoom
- Page navigation
- OCR integration (Pro)
- Annotation tools (Pro)
- Search highlighting
- Export options

### 6. Settings Screen
- Camera preferences
- Processing options
- Export settings
- Feedback controls
- Pro subscription
- Data management
- About section

### 7. Pro Upgrade Screen
- Feature comparison
- Pricing tiers
- Free trial
- Purchase flow
- Restore purchases

## 🎨 Design System

### Colors
- **Primary**: #007AFF (iOS Blue)
- **Success**: #34C759
- **Warning**: #FF9500
- **Error**: #FF3B30

### Typography
- System fonts (SF Pro on iOS, Roboto on Android)
- Dynamic Type support
- Accessible font sizes

### Animations
- Spring physics (stiffness: 180-320, damping: 14-22)
- Timing curves (Easing.out(Easing.cubic))
- 60fps guaranteed with Reanimated worklets

## 🔧 Configuration

### Camera Permissions

**iOS** (ios/Info.plist):
```xml
<key>NSCameraUsageDescription</key>
<string>DocuScan needs camera access to scan documents</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>DocuScan needs photo library access to import documents</string>
```

**Android** (android/app/src/main/AndroidManifest.xml):
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

## 📊 Data Models

### Document
```typescript
interface Document {
  id: string;
  name: string;
  folderId: string | null;
  pages: Page[];
  createdAt: string;
  updatedAt: string;
  ocrIndexed: boolean;
  tags?: string[];
  thumbnailUri?: string;
}
```

### Page
```typescript
interface Page {
  id: string;
  imageUri: string;
  transforms: PageTransform;
  adjustments: PageAdjustments;
}
```

## 🧪 Testing

```bash
# Run tests
npm test

# Type checking
npm run typecheck

# Linting
npm run lint
```

## 📦 Building for Production

### iOS
```bash
cd ios
xcodebuild -workspace DocuScan.xcworkspace \
  -scheme DocuScan \
  -configuration Release \
  -archivePath DocuScan.xcarchive \
  archive
```

### Android
```bash
cd android
./gradlew assembleRelease
```

## 🔐 Security & Privacy

- **100% Offline**: All processing happens on-device
- **No Cloud**: Documents never leave your device
- **Local Storage**: SQLite database with encryption support
- **Privacy First**: No analytics or tracking by default

## 🎯 Performance

- **60fps animations** - Reanimated worklets on UI thread
- **GPU acceleration** - Skia for image processing
- **Lazy loading** - Virtualized lists
- **Optimized queries** - Indexed database operations
- **Memory efficient** - Proper image handling and cleanup

## 📈 Future Enhancements

- [ ] Cloud sync (optional)
- [ ] Collaborative editing
- [ ] Advanced OCR languages
- [ ] Form field detection
- [ ] Business card scanner
- [ ] Receipt categorization
- [ ] Template system
- [ ] Batch scanning mode
- [ ] AI-powered enhancement
- [ ] Dark mode

## 🤝 Contributing

This is a proprietary project. Please contact the maintainers for contribution guidelines.

## 📄 License

Proprietary - All rights reserved

## 🙏 Acknowledgments

- React Native community
- Shopify (React Native Skia)
- Software Mansion (Reanimated, Gesture Handler)
- Tesseract.js team

## 📞 Support

For issues or questions:
- Create an issue on GitHub
- Email: support@docuscan.app
- Documentation: https://docs.docuscan.app

---

**Built with ❤️ using Claude Code**

*DocuScan - Transform your phone into a powerful document scanner*
