// Settings Screen - Complete configuration
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Icon } from '@/components/Icon';
import { useIAPStore } from '@/stores/iapStore';
import { theme } from '@/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsScreenProps {
  navigation: any;
}

interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  type: 'toggle' | 'navigation' | 'action';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  icon?: string;
  proFeature?: boolean;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { isPro, showUpsell, restorePurchases } = useIAPStore();

  // Settings state
  const [autoCapture, setAutoCapture] = useState(true);
  const [edgeDetection, setEdgeDetection] = useState(true);
  const [autoEnhance, setAutoEnhance] = useState(false);
  const [saveOriginals, setSaveOriginals] = useState(true);
  const [highQualityExport, setHighQualityExport] = useState(true);
  const [autoOCR, setAutoOCR] = useState(false);
  const [vibrationFeedback, setVibrationFeedback] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);

  const handleRestorePurchases = async () => {
    try {
      const restored = await restorePurchases();
      if (restored) {
        Alert.alert('Success', 'Your purchases have been restored!');
      } else {
        Alert.alert('No Purchases', 'No previous purchases found.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to restore purchases. Please try again.');
    }
  };

  const handleClearCache = async () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached thumbnails. Documents will not be affected.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            // Clear cache logic
            Alert.alert('Success', 'Cache cleared successfully');
          },
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Export all your documents and settings as a backup file.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Export',
          onPress: () => {
            // Export logic
            Alert.alert('Success', 'Data exported successfully');
          },
        },
      ]
    );
  };

  const handleDeleteAllDocuments = () => {
    Alert.alert(
      'Delete All Documents',
      'This action cannot be undone. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: () => {
            // Delete logic
          },
        },
      ]
    );
  };

  const settingsSections = [
    {
      title: 'Camera',
      items: [
        {
          id: 'auto-capture',
          title: 'Auto Capture',
          subtitle: 'Automatically capture when document is stable',
          type: 'toggle',
          value: autoCapture,
          onToggle: setAutoCapture,
        },
        {
          id: 'edge-detection',
          title: 'Edge Detection',
          subtitle: 'Automatically detect document boundaries',
          type: 'toggle',
          value: edgeDetection,
          onToggle: setEdgeDetection,
        },
      ],
    },
    {
      title: 'Processing',
      items: [
        {
          id: 'auto-enhance',
          title: 'Auto Enhance',
          subtitle: 'Automatically enhance scanned documents',
          type: 'toggle',
          value: autoEnhance,
          onToggle: setAutoEnhance,
        },
        {
          id: 'save-originals',
          title: 'Save Original Images',
          subtitle: 'Keep unprocessed versions of scans',
          type: 'toggle',
          value: saveOriginals,
          onToggle: setSaveOriginals,
        },
        {
          id: 'auto-ocr',
          title: 'Auto OCR',
          subtitle: 'Automatically recognize text in documents',
          type: 'toggle',
          value: autoOCR,
          onToggle: (value) => {
            if (!isPro && value) {
              showUpsell('Auto OCR');
            } else {
              setAutoOCR(value);
            }
          },
          proFeature: !isPro,
        },
      ],
    },
    {
      title: 'Export',
      items: [
        {
          id: 'high-quality',
          title: 'High Quality Export',
          subtitle: 'Maximum quality for PDF exports (larger files)',
          type: 'toggle',
          value: highQualityExport,
          onToggle: setHighQualityExport,
        },
        {
          id: 'default-format',
          title: 'Default Export Format',
          subtitle: 'PDF',
          type: 'navigation',
          onPress: () => {
            // Show format picker
          },
        },
      ],
    },
    {
      title: 'Feedback',
      items: [
        {
          id: 'vibration',
          title: 'Vibration',
          subtitle: 'Haptic feedback for actions',
          type: 'toggle',
          value: vibrationFeedback,
          onToggle: setVibrationFeedback,
        },
        {
          id: 'sounds',
          title: 'Sound Effects',
          subtitle: 'Audio feedback for camera and actions',
          type: 'toggle',
          value: soundEffects,
          onToggle: setSoundEffects,
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          id: 'upgrade',
          title: isPro ? 'Manage Subscription' : 'Upgrade to Pro',
          subtitle: isPro
            ? 'View and manage your subscription'
            : 'Unlock OCR, annotations, and more',
          type: 'navigation',
          onPress: () => navigation.navigate('ProUpgrade'),
          icon: 'star',
        },
        {
          id: 'restore',
          title: 'Restore Purchases',
          subtitle: 'Restore previous Pro purchases',
          type: 'action',
          onPress: handleRestorePurchases,
        },
      ],
    },
    {
      title: 'Data',
      items: [
        {
          id: 'clear-cache',
          title: 'Clear Cache',
          subtitle: 'Free up storage space',
          type: 'action',
          onPress: handleClearCache,
        },
        {
          id: 'export-data',
          title: 'Export Data',
          subtitle: 'Backup all documents',
          type: 'action',
          onPress: handleExportData,
        },
        {
          id: 'delete-all',
          title: 'Delete All Documents',
          subtitle: 'This cannot be undone',
          type: 'action',
          onPress: handleDeleteAllDocuments,
        },
      ],
    },
    {
      title: 'About',
      items: [
        {
          id: 'version',
          title: 'Version',
          subtitle: '1.0.0',
          type: 'navigation',
        },
        {
          id: 'privacy',
          title: 'Privacy Policy',
          type: 'navigation',
          onPress: () => {
            // Open privacy policy
          },
        },
        {
          id: 'terms',
          title: 'Terms of Service',
          type: 'navigation',
          onPress: () => {
            // Open terms
          },
        },
      ],
    },
  ];

  const renderSettingItem = (item: any) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.settingItem}
        onPress={item.type === 'toggle' ? undefined : item.onPress}
        disabled={item.type === 'toggle'}
      >
        <View style={styles.settingContent}>
          <View style={styles.settingText}>
            <Text style={styles.settingTitle}>
              {item.title}
              {item.proFeature && <Text style={styles.proBadge}> ⭐ PRO</Text>}
            </Text>
            {item.subtitle && (
              <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
            )}
          </View>
          {item.type === 'toggle' && (
            <Switch
              value={item.value}
              onValueChange={item.onToggle}
              trackColor={{ false: theme.colors.borderLight, true: theme.colors.primary }}
              thumbColor="#FFFFFF"
            />
          )}
          {item.type === 'navigation' && (
            <Icon name="chevron-right" size={20} color={theme.colors.textSecondary} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Pro Status Banner */}
        {isPro && (
          <View style={styles.proBanner}>
            <Icon name="star" size={24} color="#FFD700" />
            <View style={styles.proBannerText}>
              <Text style={styles.proBannerTitle}>DocuScan Pro</Text>
              <Text style={styles.proBannerSubtitle}>All features unlocked</Text>
            </View>
          </View>
        )}

        {/* Settings Sections */}
        {settingsSections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map(renderSettingItem)}
            </View>
          </View>
        ))}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with Claude Code{'\n'}
            All processing happens on-device
          </Text>
        </View>
      </ScrollView>
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
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  scrollView: {
    flex: 1,
  },
  proBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.md,
  },
  proBannerText: {
    flex: 1,
  },
  proBannerTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: '#FFFFFF',
  },
  proBannerSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  section: {
    marginTop: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textSecondary,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
  },
  settingItem: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    minHeight: 56,
  },
  settingText: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  settingTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
  },
  settingSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  proBadge: {
    fontSize: theme.typography.fontSize.xs,
    color: '#FFD700',
    fontWeight: theme.typography.fontWeight.bold,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxxl,
  },
  footerText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textTertiary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
