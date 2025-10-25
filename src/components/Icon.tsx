// Icon component (using system icons or custom SVG)
import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { IconName } from '@/types/components';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  testID?: string;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = '#000000',
  testID,
}) => {
  // Placeholder for actual icon implementation
  // In a real app, this would use:
  // - react-native-vector-icons
  // - or @shopify/react-native-skia for SVG rendering
  // - or custom icon font

  return (
    <View
      style={[styles.icon, { width: size, height: size, backgroundColor: color }]}
      testID={testID}
      accessible
      accessibilityLabel={`${name} icon`}
    />
  );
};

const styles = StyleSheet.create({
  icon: {
    borderRadius: 4,
  },
});
