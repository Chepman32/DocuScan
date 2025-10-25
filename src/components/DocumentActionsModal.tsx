// Document Actions Modal
import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import Animated, { FadeIn, SlideInDown, FadeOut } from 'react-native-reanimated';
import { Icon } from './Icon';
import { Button } from './Button';
import { theme } from '@/theme';
import type { Document, Folder } from '@/types/models';

interface DocumentActionsModalProps {
  visible: boolean;
  document: Document;
  folders: Folder[];
  onClose: () => void;
  onRename: (newName: string) => void;
  onMove: (folderId: string | null) => void;
  onDelete: () => void;
  onExport: () => void;
  onShare: () => void;
}

type ActionMode = 'main' | 'rename' | 'move';

export const DocumentActionsModal: React.FC<DocumentActionsModalProps> = ({
  visible,
  document,
  folders,
  onClose,
  onRename,
  onMove,
  onDelete,
  onExport,
  onShare,
}) => {
  const [mode, setMode] = useState<ActionMode>('main');
  const [newName, setNewName] = useState(document.name);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(
    document.folderId
  );

  const handleRename = () => {
    if (newName.trim() && newName !== document.name) {
      onRename(newName.trim());
      onClose();
    }
  };

  const handleMove = () => {
    if (selectedFolderId !== document.folderId) {
      onMove(selectedFolderId);
      onClose();
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Document',
      `Are you sure you want to delete "${document.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            onDelete();
            onClose();
          },
        },
      ]
    );
  };

  const renderMainActions = () => (
    <View style={styles.actionsContainer}>
      <TouchableOpacity
        style={styles.actionItem}
        onPress={() => setMode('rename')}
      >
        <View style={styles.actionIcon}>
          <Icon name="edit" size={24} color={theme.colors.primary} />
        </View>
        <Text style={styles.actionText}>Rename</Text>
        <Icon name="chevron-right" size={20} color={theme.colors.textTertiary} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionItem}
        onPress={() => setMode('move')}
      >
        <View style={styles.actionIcon}>
          <Icon name="folder" size={24} color={theme.colors.primary} />
        </View>
        <Text style={styles.actionText}>Move to Folder</Text>
        <Icon name="chevron-right" size={20} color={theme.colors.textTertiary} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionItem}
        onPress={() => {
          onExport();
          onClose();
        }}
      >
        <View style={styles.actionIcon}>
          <Icon name="export" size={24} color={theme.colors.primary} />
        </View>
        <Text style={styles.actionText}>Export as PDF</Text>
        <Icon name="chevron-right" size={20} color={theme.colors.textTertiary} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionItem}
        onPress={() => {
          onShare();
          onClose();
        }}
      >
        <View style={styles.actionIcon}>
          <Icon name="share" size={24} color={theme.colors.primary} />
        </View>
        <Text style={styles.actionText}>Share</Text>
        <Icon name="chevron-right" size={20} color={theme.colors.textTertiary} />
      </TouchableOpacity>

      <View style={styles.divider} />

      <TouchableOpacity
        style={styles.actionItem}
        onPress={handleDelete}
      >
        <View style={[styles.actionIcon, { backgroundColor: 'rgba(255, 59, 48, 0.1)' }]}>
          <Icon name="delete" size={24} color={theme.colors.error} />
        </View>
        <Text style={[styles.actionText, { color: theme.colors.error }]}>Delete</Text>
        <Icon name="chevron-right" size={20} color={theme.colors.textTertiary} />
      </TouchableOpacity>
    </View>
  );

  const renderRenameMode = () => (
    <View style={styles.modeContainer}>
      <View style={styles.modeHeader}>
        <TouchableOpacity onPress={() => setMode('main')}>
          <Icon name="chevron-left" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={styles.modeTitle}>Rename Document</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newName}
          onChangeText={setNewName}
          placeholder="Document name"
          placeholderTextColor={theme.colors.textTertiary}
          autoFocus
          selectTextOnFocus
        />
      </View>

      <Button
        title="Save"
        onPress={handleRename}
        disabled={!newName.trim() || newName === document.name}
        fullWidth
      />
    </View>
  );

  const renderMoveMode = () => (
    <View style={styles.modeContainer}>
      <View style={styles.modeHeader}>
        <TouchableOpacity onPress={() => setMode('main')}>
          <Icon name="chevron-left" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={styles.modeTitle}>Move to Folder</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.folderList}>
        <TouchableOpacity
          style={[
            styles.folderItem,
            selectedFolderId === null && styles.folderItemSelected,
          ]}
          onPress={() => setSelectedFolderId(null)}
        >
          <Icon
            name="folder"
            size={20}
            color={selectedFolderId === null ? theme.colors.primary : theme.colors.textSecondary}
          />
          <Text
            style={[
              styles.folderText,
              selectedFolderId === null && styles.folderTextSelected,
            ]}
          >
            No Folder
          </Text>
          {selectedFolderId === null && (
            <Icon name="check" size={20} color={theme.colors.primary} />
          )}
        </TouchableOpacity>

        {folders.map((folder) => (
          <TouchableOpacity
            key={folder.id}
            style={[
              styles.folderItem,
              selectedFolderId === folder.id && styles.folderItemSelected,
            ]}
            onPress={() => setSelectedFolderId(folder.id)}
          >
            <Icon
              name="folder"
              size={20}
              color={
                selectedFolderId === folder.id
                  ? theme.colors.primary
                  : theme.colors.textSecondary
              }
            />
            <Text
              style={[
                styles.folderText,
                selectedFolderId === folder.id && styles.folderTextSelected,
              ]}
            >
              {folder.name}
            </Text>
            {selectedFolderId === folder.id && (
              <Icon name="check" size={20} color={theme.colors.primary} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Button
        title="Move"
        onPress={handleMove}
        disabled={selectedFolderId === document.folderId}
        fullWidth
      />
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
        style={styles.overlay}
      >
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        />

        <Animated.View
          entering={SlideInDown.springify()}
          exiting={FadeOut.duration(200)}
          style={styles.modal}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.handle} />
            <Text style={styles.documentName} numberOfLines={1}>
              {document.name}
            </Text>
            <Text style={styles.documentInfo}>
              {document.pages.length} {document.pages.length === 1 ? 'page' : 'pages'}
            </Text>
          </View>

          {/* Content */}
          {mode === 'main' && renderMainActions()}
          {mode === 'rename' && renderRenameMode()}
          {mode === 'move' && renderMoveMode()}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.borderRadius.xxl,
    borderTopRightRadius: theme.borderRadius.xxl,
    maxHeight: '80%',
  },
  header: {
    alignItems: 'center',
    paddingTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.borderDark,
    borderRadius: 2,
    marginBottom: theme.spacing.md,
  },
  documentName: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  documentInfo: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  actionsContainer: {
    paddingBottom: theme.spacing.xl,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    flex: 1,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.sm,
    marginHorizontal: theme.spacing.lg,
  },
  modeContainer: {
    padding: theme.spacing.lg,
  },
  modeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  modeTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
  },
  inputContainer: {
    marginBottom: theme.spacing.xl,
  },
  input: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  folderList: {
    maxHeight: 300,
    marginBottom: theme.spacing.xl,
  },
  folderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  folderItemSelected: {
    backgroundColor: theme.colors.selected,
  },
  folderText: {
    flex: 1,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
  folderTextSelected: {
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});
