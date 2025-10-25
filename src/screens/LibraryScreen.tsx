// Library Screen - main document list
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import { useLibraryStore } from '@/stores/libraryStore';
import { FAB } from '@/components/FAB';
import { Icon } from '@/components/Icon';
import { formatDate } from '@/utils/helpers';
import type { Document } from '@/types/models';

interface LibraryScreenProps {
  navigation: any;
}

export const LibraryScreen: React.FC<LibraryScreenProps> = ({ navigation }) => {
  const {
    documents,
    folders,
    selectedFolderId,
    viewMode,
    searchQuery,
    selectedDocuments,
    loadDocuments,
    loadFolders,
    searchDocuments,
    setSelectedFolder,
    setViewMode,
    toggleDocumentSelection,
    deleteDocuments,
  } = useLibraryStore();

  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    loadFolders();
    loadDocuments();
  }, []);

  const handleSearch = (text: string) => {
    setSearchText(text);
    searchDocuments(text);
  };

  const handleDocumentPress = (doc: Document) => {
    if (selectedDocuments.size > 0) {
      toggleDocumentSelection(doc.id);
    } else {
      navigation.navigate('Viewer', { documentId: doc.id });
    }
  };

  const handleDocumentLongPress = (doc: Document) => {
    toggleDocumentSelection(doc.id);
  };

  const handleNewScan = () => {
    navigation.navigate('Scan');
  };

  const handleDeleteSelected = async () => {
    await deleteDocuments(Array.from(selectedDocuments));
  };

  const renderDocument = ({ item }: { item: Document }) => {
    const isSelected = selectedDocuments.has(item.id);

    return (
      <TouchableOpacity
        style={[
          viewMode === 'grid' ? styles.gridItem : styles.listItem,
          isSelected && styles.selected,
        ]}
        onPress={() => handleDocumentPress(item)}
        onLongPress={() => handleDocumentLongPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.thumbnail}>
          {item.thumbnailUri ? (
            <Image source={{ uri: item.thumbnailUri }} style={styles.thumbnailImage} />
          ) : (
            <View style={styles.placeholderThumbnail}>
              <Icon name="scan" size={32} color="#CCCCCC" />
            </View>
          )}
          {isSelected && (
            <View style={styles.selectedBadge}>
              <Icon name="check" size={20} color="#FFFFFF" />
            </View>
          )}
        </View>
        <View style={styles.documentInfo}>
          <Text style={styles.documentName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.documentMeta}>
            {item.pages.length} {item.pages.length === 1 ? 'page' : 'pages'}
          </Text>
          <Text style={styles.documentDate}>{formatDate(item.updatedAt)}</Text>
          {item.ocrIndexed && (
            <View style={styles.ocrBadge}>
              <Icon name="ocr" size={12} color="#007AFF" />
              <Text style={styles.ocrText}>OCR</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderFolder = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.folderChip,
        selectedFolderId === item.id && styles.selectedFolderChip,
      ]}
      onPress={() => setSelectedFolder(item.id)}
    >
      <Icon name="folder" size={16} color={selectedFolderId === item.id ? '#FFFFFF' : '#007AFF'} />
      <Text
        style={[
          styles.folderChipText,
          selectedFolderId === item.id && styles.selectedFolderChipText,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Documents</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            style={styles.headerButton}
          >
            <Icon name={viewMode === 'grid' ? 'list' : 'grid'} size={24} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Settings')}
            style={styles.headerButton}
          >
            <Icon name="settings" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#888888" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search documents..."
          value={searchText}
          onChangeText={handleSearch}
          placeholderTextColor="#999999"
        />
      </View>

      {/* Folders */}
      {folders.length > 0 && (
        <View style={styles.foldersContainer}>
          <FlatList
            horizontal
            data={[{ id: null, name: 'All' }, ...folders]}
            renderItem={renderFolder}
            keyExtractor={(item) => item.id || 'all'}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.foldersList}
          />
        </View>
      )}

      {/* Selection toolbar */}
      {selectedDocuments.size > 0 && (
        <View style={styles.selectionToolbar}>
          <Text style={styles.selectionText}>
            {selectedDocuments.size} selected
          </Text>
          <View style={styles.selectionActions}>
            <TouchableOpacity
              onPress={handleDeleteSelected}
              style={styles.toolbarButton}
            >
              <Icon name="delete" size={24} color="#FF3B30" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {/* Move to folder */}}
              style={styles.toolbarButton}
            >
              <Icon name="folder" size={24} color="#007AFF" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {/* Export */}}
              style={styles.toolbarButton}
            >
              <Icon name="share" size={24} color="#007AFF" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Documents list/grid */}
      <FlatList
        data={documents}
        renderItem={renderDocument}
        keyExtractor={(item) => item.id}
        numColumns={viewMode === 'grid' ? 2 : 1}
        key={viewMode} // Force re-render when view mode changes
        contentContainerStyle={styles.documentsList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="scan" size={64} color="#CCCCCC" />
            <Text style={styles.emptyText}>No documents yet</Text>
            <Text style={styles.emptySubtext}>Tap the + button to start scanning</Text>
          </View>
        }
      />

      {/* FAB */}
      {selectedDocuments.size === 0 && (
        <FAB
          icon="add"
          onPress={handleNewScan}
          accessibilityLabel="New scan"
        />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
  },
  foldersContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    marginBottom: 8,
  },
  foldersList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  folderChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    gap: 6,
  },
  selectedFolderChip: {
    backgroundColor: '#007AFF',
  },
  folderChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  selectedFolderChipText: {
    color: '#FFFFFF',
  },
  selectionToolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  selectionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  selectionActions: {
    flexDirection: 'row',
    gap: 16,
  },
  toolbarButton: {
    padding: 8,
  },
  documentsList: {
    padding: 16,
    paddingBottom: 100,
  },
  gridItem: {
    flex: 1,
    margin: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selected: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  thumbnail: {
    aspectRatio: 3 / 4,
    backgroundColor: '#F0F0F0',
    position: 'relative',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  placeholderThumbnail: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#007AFF',
    borderRadius: 20,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  documentInfo: {
    padding: 12,
  },
  documentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  documentMeta: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  documentDate: {
    fontSize: 12,
    color: '#999999',
  },
  ocrBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  ocrText: {
    fontSize: 11,
    color: '#007AFF',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#999999',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#CCCCCC',
    marginTop: 8,
  },
});
