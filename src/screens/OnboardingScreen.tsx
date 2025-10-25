// Onboarding Screen - First-time user tutorial
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Canvas, Circle, Path, Group, Skia } from '@shopify/react-native-skia';
import { Button } from '@/components/Button';
import { theme } from '@/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface OnboardingScreenProps {
  navigation: any;
}

const SLIDES = [
  {
    title: 'Scan Any Document',
    description: 'Automatically detect edges and capture perfect scans with your camera',
    illustration: 'camera',
    color: '#007AFF',
  },
  {
    title: 'Enhance & Edit',
    description: 'Apply filters, adjust brightness, crop, and rotate your documents',
    illustration: 'edit',
    color: '#34C759',
  },
  {
    title: 'Organize & Search',
    description: 'Create folders, add tags, and find documents instantly',
    illustration: 'folder',
    color: '#5856D6',
  },
  {
    title: 'Export & Share',
    description: 'Create PDFs and share documents anywhere, anytime',
    illustration: 'share',
    color: '#FF9500',
  },
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const translateX = useSharedValue(0);

  const completeOnboarding = async () => {
    await AsyncStorage.setItem('onboarding_completed', 'true');
    navigation.replace('Library');
  };

  const skipOnboarding = async () => {
    await completeOnboarding();
  };

  const nextSlide = () => {
    if (currentIndex < SLIDES.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      completeOnboarding();
    }
  };

  const previousSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Swipe gesture
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      if (Math.abs(event.translationX) > SCREEN_WIDTH * 0.3) {
        if (event.translationX > 0 && currentIndex > 0) {
          previousSlide();
        } else if (event.translationX < 0 && currentIndex < SLIDES.length - 1) {
          nextSlide();
        }
      }
      translateX.value = withSpring(0);
    });

  const renderIllustration = (type: string, color: string) => {
    switch (type) {
      case 'camera':
        return (
          <Canvas style={styles.illustrationCanvas}>
            <Circle cx={120} cy={120} r={80} color={color} opacity={0.2} />
            <Circle cx={120} cy={120} r={50} color={color} />
            <Circle cx={120} cy={120} r={15} color="#FFFFFF" />
          </Canvas>
        );

      case 'edit':
        const rectPath = Skia.Path.Make();
        rectPath.addRect({ x: 60, y: 60, width: 120, height: 120 });
        return (
          <Canvas style={styles.illustrationCanvas}>
            <Path path={rectPath} color={color} opacity={0.2} />
            <Path path={rectPath} color={color} style="stroke" strokeWidth={4} />
            <Circle cx={60} cy={60} r={8} color={color} />
            <Circle cx={180} cy={60} r={8} color={color} />
            <Circle cx={180} cy={180} r={8} color={color} />
            <Circle cx={60} cy={180} r={8} color={color} />
          </Canvas>
        );

      case 'folder':
        const folderPath = Skia.Path.Make();
        folderPath.moveTo(60, 100);
        folderPath.lineTo(60, 180);
        folderPath.lineTo(180, 180);
        folderPath.lineTo(180, 100);
        folderPath.close();
        return (
          <Canvas style={styles.illustrationCanvas}>
            <Path path={folderPath} color={color} opacity={0.2} />
            <Path path={folderPath} color={color} style="stroke" strokeWidth={4} />
          </Canvas>
        );

      case 'share':
        const sharePath = Skia.Path.Make();
        sharePath.moveTo(120, 60);
        sharePath.lineTo(120, 140);
        sharePath.moveTo(120, 60);
        sharePath.lineTo(80, 100);
        sharePath.moveTo(120, 60);
        sharePath.lineTo(160, 100);
        return (
          <Canvas style={styles.illustrationCanvas}>
            <Circle cx={120} cy={120} r={60} color={color} opacity={0.2} />
            <Path path={sharePath} color={color} style="stroke" strokeWidth={6} strokeCap="round" />
            <Circle cx={120} cy={160} r={12} color={color} />
          </Canvas>
        );

      default:
        return null;
    }
  };

  const currentSlide = SLIDES[currentIndex];

  return (
    <GestureDetector gesture={panGesture}>
      <View style={styles.container}>
        {/* Skip button */}
        {currentIndex < SLIDES.length - 1 && (
          <TouchableOpacity style={styles.skipButton} onPress={skipOnboarding}>
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
        )}

        {/* Slide content */}
        <Animated.View
          key={currentIndex}
          entering={FadeIn.duration(400)}
          exiting={FadeOut.duration(200)}
          style={styles.slideContainer}
        >
          {/* Illustration */}
          <View style={styles.illustrationContainer}>
            {renderIllustration(currentSlide.illustration, currentSlide.color)}
          </View>

          {/* Text content */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>{currentSlide.title}</Text>
            <Text style={styles.description}>{currentSlide.description}</Text>
          </View>
        </Animated.View>

        {/* Pagination dots */}
        <View style={styles.pagination}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex && styles.dotActive,
                { backgroundColor: index === currentIndex ? currentSlide.color : theme.colors.borderDark },
              ]}
            />
          ))}
        </View>

        {/* Navigation buttons */}
        <View style={styles.buttonContainer}>
          {currentIndex > 0 && (
            <TouchableOpacity style={styles.backButton} onPress={previousSlide}>
              <Text style={[styles.backButtonText, { color: currentSlide.color }]}>
                Back
              </Text>
            </TouchableOpacity>
          )}

          <View style={{ flex: 1 }} />

          <Button
            title={currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
            onPress={nextSlide}
            variant="primary"
            size="large"
          />
        </View>

        {/* Feature highlights */}
        <View style={styles.featuresContainer}>
          <View style={styles.feature}>
            <View style={[styles.featureIcon, { backgroundColor: `${currentSlide.color}20` }]}>
              <Text style={styles.featureEmoji}>📸</Text>
            </View>
            <Text style={styles.featureText}>Auto Scan</Text>
          </View>
          <View style={styles.feature}>
            <View style={[styles.featureIcon, { backgroundColor: `${currentSlide.color}20` }]}>
              <Text style={styles.featureEmoji}>✨</Text>
            </View>
            <Text style={styles.featureText}>AI Enhance</Text>
          </View>
          <View style={styles.feature}>
            <View style={[styles.featureIcon, { backgroundColor: `${currentSlide.color}20` }]}>
              <Text style={styles.featureEmoji}>🔒</Text>
            </View>
            <Text style={styles.featureText}>100% Private</Text>
          </View>
        </View>
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: 60,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: theme.spacing.lg,
    zIndex: 10,
    padding: theme.spacing.sm,
  },
  skipButtonText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  slideContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  illustrationContainer: {
    width: 240,
    height: 240,
    marginBottom: theme.spacing.xxxl,
  },
  illustrationCanvas: {
    width: 240,
    height: 240,
  },
  textContainer: {
    alignItems: 'center',
    maxWidth: 320,
  },
  title: {
    fontSize: theme.typography.fontSize.display,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  description: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 28,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  backButton: {
    padding: theme.spacing.md,
  },
  backButtonText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xxxl,
    gap: theme.spacing.xl,
  },
  feature: {
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureEmoji: {
    fontSize: 28,
  },
  featureText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.medium,
  },
});
