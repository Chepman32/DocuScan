// Advanced Camera Preview with Vision Camera
import React, { useCallback, useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import { Camera, useCameraDevice, useFrameProcessor } from 'react-native-vision-camera';
import { Canvas, Path, Circle, Skia } from '@shopify/react-native-skia';
import { runOnJS } from 'react-native-reanimated';
import { detectEdges, checkStability } from '@/utils/imageProcessing';
import type { CropPoint } from '@/types/models';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface CameraPreviewProps {
  flashEnabled: boolean;
  gridEnabled: boolean;
  edgeDetectionEnabled: boolean;
  onEdgesDetected: (edges: CropPoint[] | null) => void;
  onStableDetected: (stable: boolean) => void;
  onCapture?: () => void;
}

export const CameraPreview: React.FC<CameraPreviewProps> = ({
  flashEnabled,
  gridEnabled,
  edgeDetectionEnabled,
  onEdgesDetected,
  onStableDetected,
  onCapture,
}) => {
  const camera = useRef<Camera>(null);
  const device = useCameraDevice('back');
  const [hasPermission, setHasPermission] = useState(false);
  const [detectedEdges, setDetectedEdges] = useState<CropPoint[] | null>(null);
  const [isStable, setIsStable] = useState(false);
  const previousEdgesRef = useRef<CropPoint[] | null>(null);

  useEffect(() => {
    checkCameraPermission();
  }, []);

  const checkCameraPermission = async () => {
    const status = await Camera.getCameraPermissionStatus();
    if (status === 'granted') {
      setHasPermission(true);
    } else {
      const newStatus = await Camera.requestCameraPermission();
      setHasPermission(newStatus === 'granted');
    }
  };

  // Frame processor for edge detection
  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';

    if (!edgeDetectionEnabled) return;

    // In production, this would use native vision processing
    // For now, we'll call JS-based detection periodically
    if (frame.timestamp % 15 === 0) {
      // Process every 15th frame
      runOnJS(processFrame)(frame);
    }
  }, [edgeDetectionEnabled]);

  const processFrame = useCallback(async (frame: any) => {
    try {
      // In production, this would be native edge detection
      const edges = await detectEdges('frame-uri');

      if (edges) {
        const stable = checkStability(previousEdgesRef.current, edges);
        previousEdgesRef.current = edges;

        setDetectedEdges(edges);
        setIsStable(stable);
        onEdgesDetected(edges);
        onStableDetected(stable);
      }
    } catch (error) {
      console.error('Frame processing error:', error);
    }
  }, [onEdgesDetected, onStableDetected]);

  const takePhoto = useCallback(async () => {
    if (!camera.current) return;

    try {
      const photo = await camera.current.takePhoto({
        flash: flashEnabled ? 'on' : 'off',
        enableShutterSound: true,
        qualityPrioritization: 'quality',
      });

      console.log('Photo taken:', photo.path);
      onCapture?.();
    } catch (error) {
      console.error('Failed to take photo:', error);
    }
  }, [flashEnabled, onCapture]);

  // Create Skia path for detected edges
  const createEdgePath = () => {
    if (!detectedEdges || detectedEdges.length !== 4) return null;

    const path = Skia.Path.Make();
    const scaledEdges = detectedEdges.map(point => ({
      x: point.x * SCREEN_WIDTH,
      y: point.y * SCREEN_HEIGHT,
    }));

    path.moveTo(scaledEdges[0].x, scaledEdges[0].y);
    scaledEdges.slice(1).forEach(point => {
      path.lineTo(point.x, point.y);
    });
    path.close();

    return path;
  };

  if (!hasPermission || !device) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionMessage}>
          {/* Permission message UI would go here */}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
        frameProcessor={frameProcessor}
        pixelFormat="yuv"
      />

      {/* Grid overlay */}
      {gridEnabled && (
        <Canvas style={StyleSheet.absoluteFill} pointerEvents="none">
          {/* Vertical lines */}
          <Path
            path={`M ${SCREEN_WIDTH / 3} 0 L ${SCREEN_WIDTH / 3} ${SCREEN_HEIGHT}`}
            color="rgba(255, 255, 255, 0.3)"
            style="stroke"
            strokeWidth={1}
          />
          <Path
            path={`M ${(SCREEN_WIDTH * 2) / 3} 0 L ${(SCREEN_WIDTH * 2) / 3} ${SCREEN_HEIGHT}`}
            color="rgba(255, 255, 255, 0.3)"
            style="stroke"
            strokeWidth={1}
          />
          {/* Horizontal lines */}
          <Path
            path={`M 0 ${SCREEN_HEIGHT / 3} L ${SCREEN_WIDTH} ${SCREEN_HEIGHT / 3}`}
            color="rgba(255, 255, 255, 0.3)"
            style="stroke"
            strokeWidth={1}
          />
          <Path
            path={`M 0 ${(SCREEN_HEIGHT * 2) / 3} L ${SCREEN_WIDTH} ${(SCREEN_HEIGHT * 2) / 3}`}
            color="rgba(255, 255, 255, 0.3)"
            style="stroke"
            strokeWidth={1}
          />
        </Canvas>
      )}

      {/* Edge detection overlay */}
      {edgeDetectionEnabled && detectedEdges && (
        <Canvas style={StyleSheet.absoluteFill} pointerEvents="none">
          {createEdgePath() && (
            <>
              <Path
                path={createEdgePath()!}
                color={isStable ? 'rgba(52, 199, 89, 0.3)' : 'rgba(255, 204, 0, 0.3)'}
                style="fill"
              />
              <Path
                path={createEdgePath()!}
                color={isStable ? 'rgba(52, 199, 89, 0.9)' : 'rgba(255, 204, 0, 0.9)'}
                style="stroke"
                strokeWidth={3}
              />
              {/* Corner circles */}
              {detectedEdges.map((point, index) => (
                <Circle
                  key={index}
                  cx={point.x * SCREEN_WIDTH}
                  cy={point.y * SCREEN_HEIGHT}
                  r={8}
                  color={isStable ? 'rgba(52, 199, 89, 0.9)' : 'rgba(255, 204, 0, 0.9)'}
                />
              ))}
            </>
          )}
        </Canvas>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  permissionMessage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
