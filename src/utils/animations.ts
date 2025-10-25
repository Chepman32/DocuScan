// Animation utilities using Reanimated
import {
  withSpring,
  withTiming,
  Easing,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';

// Spring configurations
export const SpringConfig = {
  gentle: { stiffness: 180, damping: 18 },
  medium: { stiffness: 240, damping: 20 },
  snappy: { stiffness: 320, damping: 22 },
  bouncy: { stiffness: 200, damping: 12 },
};

// Timing configurations
export const TimingConfig = {
  fast: { duration: 220, easing: Easing.out(Easing.cubic) },
  medium: { duration: 300, easing: Easing.inOut(Easing.ease) },
  slow: { duration: 450, easing: Easing.out(Easing.quad) },
};

// Common animation hooks

/**
 * Focus transition animation
 */
export const withFocusTransition = (
  value: SharedValue<number>,
  toValue: number,
  callback?: () => void
) => {
  'worklet';
  value.value = withSpring(toValue, SpringConfig.medium, (finished) => {
    if (finished && callback) {
      runOnJS(callback)();
    }
  });
};

/**
 * Press scale spring animation
 */
export const withPressScale = (
  scale: SharedValue<number>,
  pressed: boolean,
  scaleAmount: number = 0.96
) => {
  'worklet';
  scale.value = withSpring(
    pressed ? scaleAmount : 1,
    SpringConfig.snappy
  );
};

/**
 * Dismiss swipe animation
 */
export const withDismissSwipe = (
  translateX: SharedValue<number>,
  threshold: number,
  onDismiss?: () => void
) => {
  'worklet';
  const shouldDismiss = Math.abs(translateX.value) > threshold;

  if (shouldDismiss) {
    translateX.value = withTiming(
      translateX.value > 0 ? 1000 : -1000,
      TimingConfig.fast,
      (finished) => {
        if (finished && onDismiss) {
          runOnJS(onDismiss)();
        }
      }
    );
  } else {
    translateX.value = withSpring(0, SpringConfig.gentle);
  }
};

/**
 * Enter slide animation
 */
export const withEnterSlide = (
  translateY: SharedValue<number>,
  delay: number = 0
) => {
  'worklet';
  translateY.value = withDelay(
    delay,
    withSpring(0, SpringConfig.medium)
  );
};

/**
 * Exit fade animation
 */
export const withExitFade = (
  opacity: SharedValue<number>,
  callback?: () => void
) => {
  'worklet';
  opacity.value = withTiming(0, TimingConfig.fast, (finished) => {
    if (finished && callback) {
      runOnJS(callback)();
    }
  });
};

/**
 * Rotation animation
 */
export const withRotation = (
  rotation: SharedValue<number>,
  degrees: number
) => {
  'worklet';
  rotation.value = withTiming(degrees, {
    duration: 300,
    easing: Easing.inOut(Easing.ease),
  });
};

/**
 * Shake animation (for errors)
 */
export const withShake = (translateX: SharedValue<number>) => {
  'worklet';
  translateX.value = withSequence(
    withTiming(-10, { duration: 50 }),
    withTiming(10, { duration: 50 }),
    withTiming(-10, { duration: 50 }),
    withTiming(10, { duration: 50 }),
    withTiming(0, { duration: 50 })
  );
};

/**
 * Pulse animation (for attention)
 */
export const withPulse = (scale: SharedValue<number>) => {
  'worklet';
  scale.value = withSequence(
    withSpring(1.1, SpringConfig.snappy),
    withSpring(1, SpringConfig.snappy)
  );
};

/**
 * Bounce animation
 */
export const withBounce = (
  translateY: SharedValue<number>,
  height: number = -20
) => {
  'worklet';
  translateY.value = withSequence(
    withSpring(height, SpringConfig.bouncy),
    withSpring(0, SpringConfig.bouncy)
  );
};

/**
 * Progress ring animation
 */
export const withProgressRing = (
  progress: SharedValue<number>,
  toValue: number
) => {
  'worklet';
  progress.value = withTiming(toValue, {
    duration: 500,
    easing: Easing.inOut(Easing.ease),
  });
};

/**
 * Stagger animation helper
 */
export const getStaggerDelay = (index: number, baseDelay: number = 50): number => {
  return index * baseDelay;
};

// Predefined animated styles

/**
 * Elevation shadow style
 */
export const createElevationStyle = (elevation: SharedValue<number>) => {
  'worklet';
  return {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: elevation.value / 2,
    },
    shadowOpacity: elevation.value * 0.05,
    shadowRadius: elevation.value,
    elevation: elevation.value,
  };
};

/**
 * Scale transform style
 */
export const createScaleStyle = (scale: SharedValue<number>) => {
  'worklet';
  return {
    transform: [{ scale: scale.value }],
  };
};

/**
 * Translate style
 */
export const createTranslateStyle = (
  translateX: SharedValue<number>,
  translateY: SharedValue<number>
) => {
  'worklet';
  return {
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  };
};

/**
 * Fade style
 */
export const createFadeStyle = (opacity: SharedValue<number>) => {
  'worklet';
  return {
    opacity: opacity.value,
  };
};
