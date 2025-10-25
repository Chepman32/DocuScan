// Viewer Screen - view and annotate documents
import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Share,
} from 'react-native';
import { useViewerStore } from '@/stores/viewerStore';
import { useLibraryStore } from '@/stores/libraryStore';
import { useIAPStore } from '@/stores/iapStore';
import { Icon } from '@/components/Icon';
import { generatePDF, shareDocument } from '@/utils/pdfGenerator';

interface ViewerScreenProps {
  navigation: any;
  route: any;
}

export const ViewerScreen: React.FC<ViewerScreenProps> = ({ navigation, route }) => {
  const { documentId } = route.params;

  const {
    document,
    currentPageIndex,
    zoomLevel,
    searchQuery,
    annotationMode,
    currentAnnotationType,
    setDocument,
    setCurrentPage,
    nextPage,
    previousPage,
    setZoom,
    searchInDocument,
    setAnnotationMode,
  } = useViewerStore();

  const { documents } = useLibraryStore();
  const { isPro, showUpsell } = useIAPStore();

  useEffect(() => {
    const doc = documents.find((d) => d.id === documentId);
    if (doc) {
      setDocument(doc);
    }
  }, [documentId, documents]);

  const handleExport = async () => {
    if (!document) return;

    try {
      const pdfPath = await generatePDF(document, {
        format: 'pdf',
        includeAnnotations: true,
      });
      await shareDocument(pdfPath);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleOCR = () => {
    if (!isPro) {
      showUpsell('OCR');
      return;
    }
    // Navigate to OCR processing
  };

  const handleAnnotation = (type: 'pen' | 'highlighter' | 'rectangle' | 'circle' | 'arrow') => {
    if (!isPro) {
      showUpsell('Annotations');
      return;
    }
    setAnnotationMode(true, type);
  };

  if (!document) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Icon name="scan" size={64} color="#CCCCCC" />
          <Text style={styles.emptyText}>Document not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentPage = document.pages[currentPageIndex];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={24} color="#007AFF" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {document.name}
          </Text>
          <Text style={styles.headerSubtitle}>
            Page {currentPageIndex + 1} of {document.pages.length}
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('DocumentActions', { documentId })}>
          <Icon name="more" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Search bar */}
      {searchQuery !== '' && (
        <View style={styles.searchBar}>
          <Icon name="search" size={16} color="#666666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search in document..."
            value={searchQuery}
            onChangeText={searchInDocument}
            placeholderTextColor="#999999"
          />
          <TouchableOpacity onPress={() => searchInDocument('')}>
            <Icon name="close" size={16} color="#666666" />
          </TouchableOpacity>
        </View>
      )}

      {/* Page viewer */}
      <ScrollView
        style={styles.pageViewer}
        contentContainerStyle={styles.pageViewerContent}
        minimumZoomScale={0.5}
        maximumZoomScale={5}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pageContainer}>
          <View style={styles.pagePlaceholder}>
            <Icon name="scan" size={64} color="#CCCCCC" />
            <Text style={styles.pageText}>Page {currentPageIndex + 1}</Text>
            <Text style={styles.pageSubtext}>Zoom: {Math.round(zoomLevel * 100)}%</Text>
          </View>

          {/* Annotation overlay */}
          {annotationMode && (
            <View style={styles.annotationOverlay}>
              <View style={styles.annotationBadge}>
                <Text style={styles.annotationBadgeText}>
                  {currentAnnotationType?.toUpperCase()} MODE
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Navigation arrows */}
      <View style={styles.navigationArrows}>
        <TouchableOpacity
          onPress={previousPage}
          disabled={currentPageIndex === 0}
          style={styles.navArrow}
        >
          <Icon
            name="chevron-left"
            size={32}
            color={currentPageIndex === 0 ? '#CCCCCC' : '#007AFF'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={nextPage}
          disabled={currentPageIndex === document.pages.length - 1}
          style={styles.navArrow}
        >
          <Icon
            name="chevron-right"
            size={32}
            color={currentPageIndex === document.pages.length - 1 ? '#CCCCCC' : '#007AFF'}
          />
        </TouchableOpacity>
      </View>

      {/* Toolbar */}
      <View style={styles.toolbar}>
        <TouchableOpacity
          onPress={() => searchInDocument(searchQuery === '' ? ' ' : '')}
          style={styles.toolButton}
        >
          <Icon name="search" size={24} color="#007AFF" />
          <Text style={styles.toolButtonText}>Search</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleOCR} style={styles.toolButton}>
          <Icon name="ocr" size={24} color={isPro ? '#007AFF' : '#999999'} />
          <Text style={[styles.toolButtonText, !isPro && styles.toolButtonTextDisabled]}>
            OCR {!isPro && '⭐'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleAnnotation('pen')}
          style={styles.toolButton}
        >
          <Icon name="annotation" size={24} color={isPro ? '#007AFF' : '#999999'} />
          <Text style={[styles.toolButtonText, !isPro && styles.toolButtonTextDisabled]}>
            Annotate {!isPro && '⭐'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleExport} style={styles.toolButton}>
          <Icon name="share" size={24} color="#007AFF" />
          <Text style={styles.toolButtonText}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* Annotation tools (when in annotation mode) */}
      {annotationMode && isPro && (
        <View style={styles.annotationTools}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.annotationToolsList}>
              {(['pen', 'highlighter', 'rectangle', 'circle', 'arrow'] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => handleAnnotation(type)}
                  style={[
                    styles.annotationTool,
                    currentAnnotationType === type && styles.annotationToolActive,
                  ]}
                >
                  <Icon
                    name="annotation"
                    size={20}
                    color={currentAnnotationType === type ? '#FFFFFF' : '#007AFF'}
                  />
                  <Text
                    style={[
                      styles.annotationToolText,
                      currentAnnotationType === type && styles.annotationToolTextActive,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                onPress={() => setAnnotationMode(false)}
                style={styles.annotationToolDone}
              >
                <Text style={styles.annotationToolDoneText}>Done</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      )}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#000000',
  },
  pageViewer: {
    flex: 1,
  },
  pageViewerContent: {
    padding: 16,
  },
  pageContainer: {
    aspectRatio: 3 / 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F8F8',
  },
  pageText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666666',
    marginTop: 12,
  },
  pageSubtext: {
    fontSize: 14,
    color: '#999999',
    marginTop: 4,
  },
  annotationOverlay: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },
  annotationBadge: {
    position: 'absolute',
    top: 16,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  annotationBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  navigationArrows: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    pointerEvents: 'box-none',
  },
  navArrow: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 24,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  toolButton: {
    alignItems: 'center',
    gap: 4,
  },
  toolButtonText: {
    fontSize: 11,
    color: '#007AFF',
  },
  toolButtonTextDisabled: {
    color: '#999999',
  },
  annotationTools: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  annotationToolsList: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  annotationTool: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    gap: 6,
  },
  annotationToolActive: {
    backgroundColor: '#007AFF',
  },
  annotationToolText: {
    fontSize: 14,
    color: '#007AFF',
    textTransform: 'capitalize',
  },
  annotationToolTextActive: {
    color: '#FFFFFF',
  },
  annotationToolDone: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#34C759',
  },
  annotationToolDoneText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999999',
    marginTop: 16,
  },
});
