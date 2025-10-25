// Advanced Crop Tool with Magnifier Loupe
import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Canvas, Circle, Path, Image as SkiaImage, useImage, Paint } from '@shopify/react-native-skia';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import type { CropPoint } from '@/types/models';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CropToolProps {
  imageUri: string;
  initialCropPoints: CropPoint[];
  onCropPointsChange: (points: CropPoint[]) => void;
  width: number;
  height: number;
}

export const CropTool: React.FC<CropToolProps> = ({
  imageUri,
  initialCropPoints,
  onCropPointsChange,
  width,
  height,
}) => {
  const [cropPoints, setCropPoints] = useState<CropPoint[]>(initialCropPoints);
  const [activeMagnifier, setActiveMagnifier] = useState<number | null>(null);

  // Magnifier position
  const magnifierX = useSharedValue(0);
  const magnifierY = useSharedValue(0);
  const magnifierScale = useSharedValue(0);

  const image = useImage(imageUri);

  // Handle crop point drag
  const createHandleGesture = (index: number) => {
    return Gesture.Pan()
      .onStart(() => {
        magnifierScale.value = withSpring(1);
        runOnJS(setActiveMagnifier)(index);
      })
      .onUpdate((event) => {
        const newX = Math.max(0, Math.min(1, event.x / width));
        const newY = Math.max(0, Math.min(1, event.y / height));

        magnifierX.value = event.x;
        magnifierY.value = event.y - 120; // Position above finger

        const newPoints = [...cropPoints];
        newPoints[index] = { x: newX, y: newY };
        runOnJS(setCropPoints)(newPoints);
        runOnJS(onCropPointsChange)(newPoints);
      })
      .onEnd(() => {
        magnifierScale.value = withSpring(0);
        runOnJS(setActiveMagnifier)(null);
      });
  };

  // Animated magnifier style
  const magnifierStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: magnifierX.value },
      { translateY: magnifierY.value },
      { scale: magnifierScale.value },
    ],
  }));

  // Create path for crop outline
  const createCropPath = () => {
    const path = new Path();
    const scaledPoints = cropPoints.map(p => ({
      x: p.x * width,
      y: p.y * height,
    }));

    path.moveTo(scaledPoints[0].x, scaledPoints[0].y);
    scaledPoints.slice(1).forEach(p => path.lineTo(p.x, p.y));
    path.close();

    return path;
  };

  return (
    <View style={[styles.container, { width, height }]}>
      <Canvas style={StyleSheet.absoluteFill}>
        {/* Display image */}
        {image && (
          <SkiaImage
            image={image}
            x={0}
            y={0}
            width={width}
            height={height}
            fit="contain"
          />
        )}

        {/* Dimmed overlay outside crop area */}
        <Path path={createCropPath()} color="rgba(0, 0, 0, 0.5)" style="fill" invertClip />

        {/* Crop border */}
        <Path
          path={createCropPath()}
          color="#007AFF"
          style="stroke"
          strokeWidth={2}
        />

        {/* Crop handles */}
        {cropPoints.map((point, index) => (
          <Circle
            key={index}
            cx={point.x * width}
            cy={point.y * height}
            r={12}
            color="#007AFF"
          >
            <Circle cx={0} cy={0} r={10} color="#FFFFFF" />
          </Circle>
        ))}
      </Canvas>

      {/* Interactive handles */}
      {cropPoints.map((point, index) => {
        const gesture = createHandleGesture(index);
        return (
          <GestureDetector key={index} gesture={gesture}>
            <View
              style={[
                styles.handle,
                {
                  left: point.x * width - 20,
                  top: point.y * height - 20,
                },
              ]}
            />
          </GestureDetector>
        );
      })}

      {/* Magnifier loupe */}
      {activeMagnifier !== null && (
        <Animated.View style={[styles.magnifier, magnifierStyle]}>
          <Canvas style={styles.magnifierCanvas}>
            {image && (
              <>
                {/* Magnified portion */}
                <Circle cx={50} cy={50} r={50} color="#FFFFFF" />
                <SkiaImage
                  image={image}
                  x={0}
                  y={0}
                  width={100}
                  height={100}
                  fit="cover"
                />
                {/* Crosshair */}
                <Path
                  path="M 50 40 L 50 60 M 40 50 L 60 50"
                  color="#007AFF"
                  style="stroke"
                  strokeWidth={1.5}
                />
              </>
            )}
          </Canvas>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  handle: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    // Transparent touch target
  },
  magnifier: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#007AFF',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  magnifierCanvas: {
    width: 100,
    height: 100,
  },
});
