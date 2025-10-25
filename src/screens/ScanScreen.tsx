// Scan Screen - camera capture with edge detection
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useScanStore } from '@/stores/scanStore';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { detectEdges, checkStability } from '@/utils/imageProcessing';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ScanScreenProps {
  navigation: any;
}

export const ScanScreen: React.FC<ScanScreenProps> = ({ navigation }) => {
  const {
    capturedPages,
    flashEnabled,
    gridEnabled,
    autoCapture,
    edgeDetectionEnabled,
    detectedEdges,
    isStable,
    capturePage,
    setFlashEnabled,
    setGridEnabled,
    setAutoCapture,
    updateDetectedEdges,
    setStable,
  } = useScanStore();

  const [previousEdges, setPreviousEdges] = useState<any>(null);
  const stabilityCheckInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Simulate edge detection updates
    if (edgeDetectionEnabled) {
      stabilityCheckInterval.current = setInterval(async () => {
        const edges = await detectEdges('placeholder-uri');
        updateDetectedEdges(edges);

        if (edges && previousEdges) {
          const stable = checkStability(previousEdges, edges);
          setStable(stable);

          if (stable && autoCapture) {
            handleCapture();
          }
        }

        setPreviousEdges(edges);
      }, 500);
    }

    return () => {
      if (stabilityCheckInterval.current) {
        clearInterval(stabilityCheckInterval.current);
      }
    };
  }, [edgeDetectionEnabled, autoCapture, previousEdges]);

  const handleCapture = () => {
    // Placeholder for actual camera capture
    // In a real implementation:
    // - Use react-native-vision-camera to capture photo
    // - Apply edge detection if enabled
    // - Save to temporary storage
    // - Add to scan session

    const mockImageUri = `file:///path/to/image-${Date.now()}.jpg`;
    capturePage(mockImageUri, detectedEdges || undefined);
  };

  const handleDone = () => {
    if (capturedPages.length === 0) {
      navigation.goBack();
    } else {
      navigation.navigate('Review', { pages: capturedPages });
    }
  };

  const handleImportFromGallery = () => {
    // Placeholder for gallery import
    // In a real implementation:
    // - Use react-native-image-picker
    // - Allow multi-select
    // - Process each image
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Camera preview placeholder */}
      <View style={styles.cameraPreview}>
        <View style={styles.cameraPlaceholder}>
          <Icon name="camera" size={64} color="#FFFFFF" />
          <Text style={styles.cameraText}>Camera Preview</Text>
          <Text style={styles.cameraSubtext}>
            In a production app, this would show the camera feed
          </Text>
        </View>

        {/* Grid overlay */}
        {gridEnabled && (
          <View style={styles.gridOverlay}>
            <View style={[styles.gridLine, styles.gridLineVertical, { left: '33%' }]} />
            <View style={[styles.gridLine, styles.gridLineVertical, { left: '66%' }]} />
            <View style={[styles.gridLine, styles.gridLineHorizontal, { top: '33%' }]} />
            <View style={[styles.gridLine, styles.gridLineHorizontal, { top: '66%' }]} />
          </View>
        )}

        {/* Edge detection overlay */}
        {edgeDetectionEnabled && detectedEdges && (
          <View style={styles.edgeOverlay}>
            <View
              style={[
                styles.edgeIndicator,
                isStable && styles.edgeIndicatorStable,
              ]}
            />
            {isStable && autoCapture && (
              <View style={styles.autoCaptureBadge}>
                <Text style={styles.autoCaptureBadgeText}>AUTO CAPTURE</Text>
              </View>
            )}
          </View>
        )}

        {/* Top controls */}
        <View style={styles.topControls}>
          <TouchableOpacity
            onPress={() => setFlashEnabled(!flashEnabled)}
            style={styles.controlButton}
          >
            <Icon
              name="flash"
              size={24}
              color={flashEnabled ? '#FFD700' : '#FFFFFF'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setGridEnabled(!gridEnabled)}
            style={styles.controlButton}
          >
            <Icon
              name="grid"
              size={24}
              color={gridEnabled ? '#007AFF' : '#FFFFFF'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.controlButton}
          >
            <Icon name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Page counter */}
        {capturedPages.length > 0 && (
          <View style={styles.pageCounter}>
            <Icon name="scan" size={16} color="#FFFFFF" />
            <Text style={styles.pageCounterText}>
              {capturedPages.length} {capturedPages.length === 1 ? 'page' : 'pages'}
            </Text>
          </View>
        )}
      </View>

      {/* Bottom controls */}
      <View style={styles.bottomControls}>
        <TouchableOpacity
          onPress={handleImportFromGallery}
          style={styles.bottomButton}
        >
          <Icon name="folder" size={32} color="#007AFF" />
          <Text style={styles.bottomButtonText}>Import</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleCapture}
          style={styles.captureButton}
        >
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleDone}
          style={styles.bottomButton}
        >
          <Icon name="check" size={32} color="#34C759" />
          <Text style={styles.bottomButtonText}>Done</Text>
        </TouchableOpacity>
      </View>

      {/* Settings bar */}
      <View style={styles.settingsBar}>
        <TouchableOpacity
          onPress={() => setAutoCapture(!autoCapture)}
          style={styles.settingToggle}
        >
          <Text style={[styles.settingText, autoCapture && styles.settingTextActive]}>
            Auto
          </Text>
        </TouchableOpacity>
        <View style={styles.settingDivider} />
        <TouchableOpacity
          onPress={() => {/* Open filter selector */}}
          style={styles.settingToggle}
        >
          <Text style={styles.settingText}>Color</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  cameraPreview: {
    flex: 1,
    position: 'relative',
  },
  cameraPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1C1C1E',
  },
  cameraText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 16,
  },
  cameraSubtext: {
    fontSize: 14,
    color: '#999999',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  gridLineVertical: {
    width: 1,
    height: '100%',
  },
  gridLineHorizontal: {
    height: 1,
    width: '100%',
  },
  edgeOverlay: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
    padding: 40,
  },
  edgeIndicator: {
    flex: 1,
    borderWidth: 2,
    borderColor: 'rgba(255, 204, 0, 0.8)',
    borderRadius: 8,
  },
  edgeIndicatorStable: {
    borderColor: 'rgba(52, 199, 89, 0.8)',
  },
  autoCaptureBadge: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    backgroundColor: 'rgba(52, 199, 89, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  autoCaptureBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  topControls: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  controlButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 22,
  },
  pageCounter: {
    position: 'absolute',
    top: 16,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  pageCounterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bottomControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 32,
    backgroundColor: '#000000',
  },
  bottomButton: {
    alignItems: 'center',
    gap: 4,
  },
  bottomButtonText: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#CCCCCC',
  },
  captureButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#000000',
  },
  settingsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 16,
    backgroundColor: '#000000',
    gap: 16,
  },
  settingToggle: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  settingText: {
    fontSize: 14,
    color: '#999999',
  },
  settingTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  settingDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#333333',
  },
});
