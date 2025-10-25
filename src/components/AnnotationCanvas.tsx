// Advanced Annotation Canvas with Skia
import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Canvas,
  Path,
  Circle,
  Rect,
  Line,
  Skia,
  PaintStyle,
  StrokeCap,
  StrokeJoin,
} from '@shopify/react-native-skia';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import type { Annotation, AnnotationType, Point } from '@/types/models';
import { generateId } from '@/utils/helpers';

interface AnnotationCanvasProps {
  width: number;
  height: number;
  annotations: Annotation[];
  currentType: AnnotationType;
  currentColor: string;
  currentStrokeWidth: number;
  onAnnotationAdd: (annotation: Annotation) => void;
  onAnnotationUpdate: (id: string, annotation: Annotation) => void;
  enabled: boolean;
}

export const AnnotationCanvas: React.FC<AnnotationCanvasProps> = ({
  width,
  height,
  annotations,
  currentType,
  currentColor,
  currentStrokeWidth,
  onAnnotationAdd,
  onAnnotationUpdate,
  enabled,
}) => {
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  // Create Skia path from points
  const createPathFromPoints = (points: Point[]): string => {
    if (points.length === 0) return '';

    const path = Skia.Path.Make();
    path.moveTo(points[0].x, points[0].y);

    if (currentType === 'pen' || currentType === 'highlighter') {
      // Smooth curve for pen/highlighter
      for (let i = 1; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        path.quadTo(points[i].x, points[i].y, xc, yc);
      }
      if (points.length > 1) {
        const last = points[points.length - 1];
        path.lineTo(last.x, last.y);
      }
    }

    return path.toSVGString();
  };

  // Pan gesture for drawing
  const panGesture = Gesture.Pan()
    .enabled(enabled)
    .onStart((event) => {
      setIsDrawing(true);
      setCurrentPath([{ x: event.x, y: event.y }]);
    })
    .onUpdate((event) => {
      setCurrentPath((prev) => [...prev, { x: event.x, y: event.y }]);
    })
    .onEnd(() => {
      if (currentPath.length > 1) {
        const annotation: Annotation = {
          id: generateId('annotation'),
          type: currentType,
          points: currentPath,
          color: currentColor,
          strokeWidth: currentStrokeWidth,
          opacity: currentType === 'highlighter' ? 0.4 : 1,
        };
        onAnnotationAdd(annotation);
      }
      setCurrentPath([]);
      setIsDrawing(false);
    });

  // Render annotation based on type
  const renderAnnotation = (annotation: Annotation) => {
    const { type, points, color, strokeWidth, opacity } = annotation;

    switch (type) {
      case 'pen':
        return (
          <Path
            key={annotation.id}
            path={createPathFromPoints(points)}
            color={color}
            style="stroke"
            strokeWidth={strokeWidth}
            strokeCap="round"
            strokeJoin="round"
            opacity={opacity}
          />
        );

      case 'highlighter':
        return (
          <Path
            key={annotation.id}
            path={createPathFromPoints(points)}
            color={color}
            style="stroke"
            strokeWidth={strokeWidth * 3}
            strokeCap="butt"
            opacity={0.4}
          />
        );

      case 'rectangle':
        if (points.length < 2) return null;
        const rectX = Math.min(points[0].x, points[points.length - 1].x);
        const rectY = Math.min(points[0].y, points[points.length - 1].y);
        const rectW = Math.abs(points[points.length - 1].x - points[0].x);
        const rectH = Math.abs(points[points.length - 1].y - points[0].y);
        return (
          <Rect
            key={annotation.id}
            x={rectX}
            y={rectY}
            width={rectW}
            height={rectH}
            color={color}
            style="stroke"
            strokeWidth={strokeWidth}
            opacity={opacity}
          />
        );

      case 'circle':
        if (points.length < 2) return null;
        const centerX = (points[0].x + points[points.length - 1].x) / 2;
        const centerY = (points[0].y + points[points.length - 1].y) / 2;
        const radius = Math.sqrt(
          Math.pow(points[points.length - 1].x - points[0].x, 2) +
          Math.pow(points[points.length - 1].y - points[0].y, 2)
        ) / 2;
        return (
          <Circle
            key={annotation.id}
            cx={centerX}
            cy={centerY}
            r={radius}
            color={color}
            style="stroke"
            strokeWidth={strokeWidth}
            opacity={opacity}
          />
        );

      case 'arrow':
        if (points.length < 2) return null;
        const start = points[0];
        const end = points[points.length - 1];
        const angle = Math.atan2(end.y - start.y, end.x - start.x);
        const arrowSize = 15;

        // Arrow head points
        const arrowPoint1 = {
          x: end.x - arrowSize * Math.cos(angle - Math.PI / 6),
          y: end.y - arrowSize * Math.sin(angle - Math.PI / 6),
        };
        const arrowPoint2 = {
          x: end.x - arrowSize * Math.cos(angle + Math.PI / 6),
          y: end.y - arrowSize * Math.sin(angle + Math.PI / 6),
        };

        const arrowPath = Skia.Path.Make();
        arrowPath.moveTo(start.x, start.y);
        arrowPath.lineTo(end.x, end.y);
        arrowPath.moveTo(arrowPoint1.x, arrowPoint1.y);
        arrowPath.lineTo(end.x, end.y);
        arrowPath.lineTo(arrowPoint2.x, arrowPoint2.y);

        return (
          <Path
            key={annotation.id}
            path={arrowPath}
            color={color}
            style="stroke"
            strokeWidth={strokeWidth}
            strokeCap="round"
            strokeJoin="round"
            opacity={opacity}
          />
        );

      default:
        return null;
    }
  };

  return (
    <GestureDetector gesture={panGesture}>
      <View style={[styles.container, { width, height }]}>
        <Canvas style={StyleSheet.absoluteFill}>
          {/* Render existing annotations */}
          {annotations.map(renderAnnotation)}

          {/* Render current drawing */}
          {isDrawing && currentPath.length > 0 && (
            <Path
              path={createPathFromPoints(currentPath)}
              color={currentColor}
              style="stroke"
              strokeWidth={currentType === 'highlighter' ? currentStrokeWidth * 3 : currentStrokeWidth}
              strokeCap={currentType === 'pen' ? 'round' : 'butt'}
              strokeJoin="round"
              opacity={currentType === 'highlighter' ? 0.4 : 1}
            />
          )}
        </Canvas>
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
});
