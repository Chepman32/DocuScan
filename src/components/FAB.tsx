// Floating Action Button with animations
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Icon } from './Icon';
import { SpringConfig } from '@/utils/animations';
import type { IconName } from '@/types/components';

interface FABProps {
  onPress: () => void;
  icon: IconName;
  size?: number;
  backgroundColor?: string;
  iconColor?: string;
  testID?: string;
  accessibilityLabel?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const FAB: React.FC<FABProps> = ({
  onPress,
  icon,
  size = 56,
  backgroundColor = '#007AFF',
  iconColor = '#FFFFFF',
  testID,
  accessibilityLabel,
}) => {
  const scale = useSharedValue(1);
  const elevation = useSharedValue(8);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    shadowOpacity: 0.3,
    shadowRadius: elevation.value,
    shadowOffset: {
      width: 0,
      height: elevation.value / 2,
    },
    elevation: elevation.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.9, SpringConfig.snappy);
    elevation.value = withTiming(4, { duration: 150, easing: Easing.out(Easing.cubic) });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, SpringConfig.snappy);
    elevation.value = withSpring(8, SpringConfig.medium);
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.fab,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
        },
        animatedStyle,
      ]}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
    >
      <Icon name={icon} size={size * 0.5} color={iconColor} />
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
  },
});
