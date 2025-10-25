// Review Screen - crop and enhance pages
import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { useReviewStore } from '@/stores/reviewStore';
import { useLibraryStore } from '@/stores/libraryStore';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import type { FilterType, Page } from '@/types/models';
import { generateId } from '@/utils/helpers';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ReviewScreenProps {
  navigation: any;
  route: any;
}

const FILTERS: { type: FilterType; label: string }[] = [
  { type: 'color', label: 'Color' },
  { type: 'magicColor', label: 'Magic' },
  { type: 'grayscale', label: 'Grayscale' },
  { type: 'blackAndWhite', label: 'B&W' },
];

export const ReviewScreen: React.FC<ReviewScreenProps> = ({ navigation, route }) => {
  const { pages: routePages } = route.params;

  const {
    pages,
    currentPageIndex,
    selectedFilter,
    brightness,
    contrast,
    cropMode,
    setPages,
    setCurrentPage,
    applyFilter,
    adjustBrightness,
    adjustContrast,
    rotatePage,
    setCropMode,
    deletePage,
    getAllPages,
  } = useReviewStore();

  const { createDocument } = useLibraryStore();

  useEffect(() => {
    setPages(routePages);
  }, [routePages]);

  const handleSave = async () => {
    const finalPages = getAllPages();
    if (finalPages.length === 0) {
      navigation.goBack();
      return;
    }

    const document = {
      id: generateId('doc'),
      name: `Scan ${new Date().toLocaleDateString()}`,
      folderId: null,
      pages: finalPages,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ocrIndexed: false,
    };

    try {
      await createDocument(document);
      navigation.navigate('Library');
    } catch (error) {
      console.error('Failed to save document:', error);
    }
  };

  const currentPage = pages[currentPageIndex];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Review & Enhance</Text>
        <TouchableOpacity onPress={handleSave}>
          <Icon name="check" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Page preview */}
      <View style={styles.previewContainer}>
        {currentPage && (
          <View style={styles.preview}>
            <View style={styles.previewPlaceholder}>
              <Icon name="scan" size={64} color="#CCCCCC" />
              <Text style={styles.previewText}>Page {currentPageIndex + 1}</Text>
              <Text style={styles.previewFilter}>Filter: {selectedFilter}</Text>
              {brightness !== 0 && (
                <Text style={styles.previewAdjustment}>Brightness: {brightness}</Text>
              )}
              {contrast !== 0 && (
                <Text style={styles.previewAdjustment}>Contrast: {contrast}</Text>
              )}
            </View>

            {/* Crop corners overlay (when in crop mode) */}
            {cropMode && (
              <View style={styles.cropOverlay}>
                <View style={[styles.cropHandle, styles.cropHandleTL]} />
                <View style={[styles.cropHandle, styles.cropHandleTR]} />
                <View style={[styles.cropHandle, styles.cropHandleBR]} />
                <View style={[styles.cropHandle, styles.cropHandleBL]} />
              </View>
            )}
          </View>
        )}
      </View>

      {/* Tools */}
      <View style={styles.toolsContainer}>
        {/* Filters */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Filter</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filterButtons}>
              {FILTERS.map((filter) => (
                <TouchableOpacity
                  key={filter.type}
                  onPress={() => applyFilter(filter.type)}
                  style={[
                    styles.filterButton,
                    selectedFilter === filter.type && styles.filterButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      selectedFilter === filter.type && styles.filterButtonTextActive,
                    ]}
                  >
                    {filter.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Adjustments */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Adjustments</Text>
          <View style={styles.adjustmentControls}>
            <View style={styles.adjustmentRow}>
              <Icon name="settings" size={16} color="#666666" />
              <Text style={styles.adjustmentLabel}>Brightness</Text>
              <Text style={styles.adjustmentValue}>{brightness}</Text>
            </View>
            <View style={styles.adjustmentRow}>
              <Icon name="settings" size={16} color="#666666" />
              <Text style={styles.adjustmentLabel}>Contrast</Text>
              <Text style={styles.adjustmentValue}>{contrast}</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            onPress={() => rotatePage(-90)}
            style={styles.actionButton}
          >
            <Icon name="rotate" size={24} color="#007AFF" />
            <Text style={styles.actionButtonText}>Rotate</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setCropMode(!cropMode)}
            style={[styles.actionButton, cropMode && styles.actionButtonActive]}
          >
            <Icon name="crop" size={24} color={cropMode ? '#FFFFFF' : '#007AFF'} />
            <Text
              style={[
                styles.actionButtonText,
                cropMode && styles.actionButtonTextActive,
              ]}
            >
              Crop
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (pages.length > 1) {
                deletePage(currentPageIndex);
              }
            }}
            style={styles.actionButton}
            disabled={pages.length === 1}
          >
            <Icon name="delete" size={24} color={pages.length === 1 ? '#CCCCCC' : '#FF3B30'} />
            <Text
              style={[
                styles.actionButtonText,
                pages.length === 1 && styles.actionButtonTextDisabled,
              ]}
            >
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Page thumbnails */}
      <View style={styles.thumbnailContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.thumbnailList}>
            {pages.map((page, index) => (
              <TouchableOpacity
                key={page.id}
                onPress={() => setCurrentPage(index)}
                style={[
                  styles.thumbnail,
                  index === currentPageIndex && styles.thumbnailActive,
                ]}
              >
                <View style={styles.thumbnailPlaceholder}>
                  <Text style={styles.thumbnailText}>{index + 1}</Text>
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => navigation.navigate('Scan')}
              style={styles.addPageButton}
            >
              <Icon name="add" size={24} color="#007AFF" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  previewContainer: {
    flex: 1,
    padding: 16,
  },
  preview: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  previewPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F0F0',
  },
  previewText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666666',
    marginTop: 12,
  },
  previewFilter: {
    fontSize: 14,
    color: '#999999',
    marginTop: 8,
  },
  previewAdjustment: {
    fontSize: 12,
    color: '#999999',
    marginTop: 4,
  },
  cropOverlay: {
    ...StyleSheet.absoluteFillObject,
    margin: 20,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
  },
  cropHandle: {
    position: 'absolute',
    width: 24,
    height: 24,
    backgroundColor: '#007AFF',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 12,
  },
  cropHandleTL: { top: -12, left: -12 },
  cropHandleTR: { top: -12, right: -12 },
  cropHandleBR: { bottom: -12, right: -12 },
  cropHandleBL: { bottom: -12, left: -12 },
  toolsContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  section: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 12,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  adjustmentControls: {
    gap: 12,
  },
  adjustmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  adjustmentLabel: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
  },
  adjustmentValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    minWidth: 40,
    textAlign: 'right',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
  },
  actionButton: {
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  actionButtonActive: {
    backgroundColor: '#007AFF',
  },
  actionButtonText: {
    fontSize: 12,
    color: '#007AFF',
  },
  actionButtonTextActive: {
    color: '#FFFFFF',
  },
  actionButtonTextDisabled: {
    color: '#CCCCCC',
  },
  thumbnailContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  thumbnailList: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  thumbnail: {
    width: 60,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbnailActive: {
    borderColor: '#007AFF',
  },
  thumbnailPlaceholder: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnailText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666666',
  },
  addPageButton: {
    width: 60,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
  },
});
