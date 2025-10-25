// Pro Upgrade Screen - Premium features and pricing
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeIn,
  ZoomIn,
} from 'react-native-reanimated';
import { Icon } from '@/components/Icon';
import { Button } from '@/components/Button';
import { useIAPStore } from '@/stores/iapStore';
import { theme } from '@/theme';

interface ProUpgradeScreenProps {
  navigation: any;
}

const FEATURES = [
  {
    icon: 'ocr' as const,
    title: 'Offline OCR',
    description: 'Extract and search text from your documents',
    premium: true,
  },
  {
    icon: 'annotation' as const,
    title: 'Annotations',
    description: 'Add notes, highlights, and drawings',
    premium: true,
  },
  {
    icon: 'filter' as const,
    title: 'Advanced Filters',
    description: 'Professional enhancement presets',
    premium: true,
  },
  {
    icon: 'export' as const,
    title: 'No Watermarks',
    description: 'Clean exports without branding',
    premium: true,
  },
  {
    icon: 'folder' as const,
    title: 'Unlimited Documents',
    description: 'No limits on your document library',
    premium: true,
  },
  {
    icon: 'settings' as const,
    title: 'Priority Support',
    description: 'Get help when you need it',
    premium: true,
  },
];

export const ProUpgradeScreen: React.FC<ProUpgradeScreenProps> = ({ navigation }) => {
  const { isPro, products, isLoading, purchasePro, restorePurchases } = useIAPStore();
  const [selectedProduct, setSelectedProduct] = useState(products[1]?.productId || '');
  const [purchasing, setPurchasing] = useState(false);

  const handlePurchase = async () => {
    if (!selectedProduct) return;

    setPurchasing(true);
    try {
      const success = await purchasePro(selectedProduct);
      if (success) {
        navigation.goBack();
      }
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    setPurchasing(true);
    try {
      const restored = await restorePurchases();
      if (restored) {
        navigation.goBack();
      }
    } finally {
      setPurchasing(false);
    }
  };

  if (isPro) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="close" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.alreadyProContainer}>
          <Animated.View entering={ZoomIn.duration(500)}>
            <Icon name="check" size={80} color={theme.colors.success} />
          </Animated.View>
          <Text style={styles.alreadyProTitle}>You're already Pro!</Text>
          <Text style={styles.alreadyProSubtitle}>
            Enjoy all premium features
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="close" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleRestore} disabled={purchasing}>
          <Text style={styles.restoreButton}>Restore</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <Animated.View entering={FadeIn.duration(600)} style={styles.hero}>
          <View style={styles.badge}>
            <Icon name="star" size={32} color="#FFD700" />
          </View>
          <Text style={styles.heroTitle}>DocuScan Pro</Text>
          <Text style={styles.heroSubtitle}>
            Professional document scanning with advanced features
          </Text>
        </Animated.View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          {FEATURES.map((feature, index) => (
            <Animated.View
              key={feature.title}
              entering={FadeInDown.delay(index * 100).duration(500)}
              style={styles.featureItem}
            >
              <View style={styles.featureIcon}>
                <Icon name={feature.icon} size={24} color={theme.colors.primary} />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
              {feature.premium && (
                <View style={styles.premiumBadge}>
                  <Text style={styles.premiumBadgeText}>PRO</Text>
                </View>
              )}
            </Animated.View>
          ))}
        </View>

        {/* Pricing */}
        <View style={styles.pricingContainer}>
          <Text style={styles.pricingTitle}>Choose Your Plan</Text>

          {products.map((product) => {
            const isYearly = product.productId.includes('yearly');
            const isLifetime = product.productId.includes('lifetime');
            const isSelected = selectedProduct === product.productId;

            return (
              <TouchableOpacity
                key={product.productId}
                style={[styles.pricingOption, isSelected && styles.pricingOptionSelected]}
                onPress={() => setSelectedProduct(product.productId)}
              >
                {isYearly && (
                  <View style={styles.saveBadge}>
                    <Text style={styles.saveBadgeText}>SAVE 33%</Text>
                  </View>
                )}
                {isLifetime && (
                  <View style={[styles.saveBadge, { backgroundColor: '#FFD700' }]}>
                    <Text style={[styles.saveBadgeText, { color: '#000' }]}>BEST VALUE</Text>
                  </View>
                )}

                <View style={styles.pricingContent}>
                  <View style={styles.pricingLeft}>
                    <View
                      style={[
                        styles.radioButton,
                        isSelected && styles.radioButtonSelected,
                      ]}
                    >
                      {isSelected && <View style={styles.radioButtonInner} />}
                    </View>
                    <View>
                      <Text style={styles.pricingName}>{product.title.replace('DocuScan Pro ', '')}</Text>
                      <Text style={styles.pricingDescription}>{product.description}</Text>
                    </View>
                  </View>
                  <Text style={styles.pricingPrice}>{product.price}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Terms */}
        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            • Payment charged to your account at confirmation{'\n'}
            • Subscription auto-renews unless cancelled 24h before period ends{'\n'}
            • Manage subscriptions in Account Settings{'\n'}
            • All processing happens on-device
          </Text>
        </View>
      </ScrollView>

      {/* CTA Button */}
      <View style={styles.ctaContainer}>
        <Button
          title={purchasing ? 'Processing...' : 'Start Free Trial'}
          onPress={handlePurchase}
          disabled={purchasing || !selectedProduct || isLoading}
          size="large"
          fullWidth
          icon={
            purchasing ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : undefined
          }
        />
        <Text style={styles.ctaSubtext}>7 days free, then {products[1]?.price}/year</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  restoreButton: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  scrollView: {
    flex: 1,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxxl,
    paddingHorizontal: theme.spacing.xl,
  },
  badge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  heroTitle: {
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  heroSubtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  premiumBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  premiumBadgeText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    color: '#000000',
  },
  pricingContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  pricingTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  pricingOption: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  pricingOptionSelected: {
    borderColor: theme.colors.primary,
  },
  saveBadge: {
    position: 'absolute',
    top: -8,
    right: 16,
    backgroundColor: theme.colors.success,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  saveBadgeText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    color: '#FFFFFF',
  },
  pricingContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pricingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: theme.spacing.md,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: theme.colors.primary,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primary,
  },
  pricingName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
  },
  pricingDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  pricingPrice: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  termsContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  termsText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textTertiary,
    lineHeight: 18,
  },
  ctaContainer: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  ctaSubtext: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
  alreadyProContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  alreadyProTitle: {
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.sm,
  },
  alreadyProSubtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
  },
});
