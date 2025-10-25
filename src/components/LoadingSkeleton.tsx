// Loading Skeleton Component
import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { theme } from '@/theme';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
}) => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width, height, borderRadius },
        animatedStyle,
        style,
      ]}
    />
  );
};

// Document Card Skeleton
export const DocumentCardSkeleton: React.FC<{ isGrid?: boolean }> = ({ isGrid = true }) => {
  return (
    <View style={[styles.cardSkeleton, isGrid ? styles.gridCard : styles.listCard]}>
      <Skeleton
        width={isGrid ? '100%' : 100}
        height={isGrid ? 150 : 100}
        borderRadius={8}
      />
      <View style={styles.cardContent}>
        <Skeleton width="80%" height={16} style={styles.titleSkeleton} />
        <Skeleton width="60%" height={14} style={styles.subtitleSkeleton} />
        <Skeleton width="40%" height={12} />
      </View>
    </View>
  );
};

// Document List Skeleton
export const DocumentListSkeleton: React.FC<{ isGrid?: boolean; count?: number }> = ({
  isGrid = true,
  count = 6,
}) => {
  return (
    <View style={isGrid ? styles.gridContainer : styles.listContainer}>
      {Array.from({ length: count }).map((_, index) => (
        <DocumentCardSkeleton key={index} isGrid={isGrid} />
      ))}
    </View>
  );
};

// Page Thumbnail Skeleton
export const PageThumbnailSkeleton: React.FC = () => {
  return (
    <View style={styles.thumbnailSkeleton}>
      <Skeleton width={60} height={80} borderRadius={8} />
    </View>
  );
};

// Settings Item Skeleton
export const SettingsItemSkeleton: React.FC = () => {
  return (
    <View style={styles.settingsItemSkeleton}>
      <View style={styles.settingsItemLeft}>
        <Skeleton width={40} height={40} borderRadius={20} />
        <View style={styles.settingsItemText}>
          <Skeleton width={120} height={16} style={styles.titleSkeleton} />
          <Skeleton width={180} height={14} />
        </View>
      </View>
      <Skeleton width={40} height={24} borderRadius={12} />
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: theme.colors.borderLight,
  },
  cardSkeleton: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  gridCard: {
    flex: 1,
    margin: theme.spacing.sm,
  },
  listCard: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
    marginHorizontal: theme.spacing.lg,
  },
  cardContent: {
    padding: theme.spacing.md,
  },
  titleSkeleton: {
    marginBottom: theme.spacing.xs,
  },
  subtitleSkeleton: {
    marginBottom: theme.spacing.xs,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: theme.spacing.md,
  },
  listContainer: {
    padding: theme.spacing.md,
  },
  thumbnailSkeleton: {
    marginRight: theme.spacing.sm,
  },
  settingsItemSkeleton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    flex: 1,
  },
  settingsItemText: {
    flex: 1,
  },
});
