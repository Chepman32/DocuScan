// Library Store - manages documents and folders
import { create } from 'zustand';
import type { Document, Folder } from '@/types/models';
import { db } from '@/services/database';

interface LibraryState {
  documents: Document[];
  folders: Folder[];
  selectedFolderId: string | null;
  viewMode: 'list' | 'grid';
  sortBy: 'name' | 'date';
  sortOrder: 'asc' | 'desc';
  searchQuery: string;
  selectedDocuments: Set<string>;
  isLoading: boolean;

  // Actions
  loadDocuments: (folderId?: string | null) => Promise<void>;
  loadFolders: () => Promise<void>;
  createDocument: (document: Document) => Promise<void>;
  updateDocument: (document: Document) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  deleteDocuments: (ids: string[]) => Promise<void>;
  createFolder: (name: string) => Promise<Folder>;
  updateFolder: (id: string, name: string) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;
  moveDocumentsToFolder: (documentIds: string[], folderId: string | null) => Promise<void>;
  searchDocuments: (query: string) => Promise<void>;
  setSelectedFolder: (folderId: string | null) => void;
  setViewMode: (mode: 'list' | 'grid') => void;
  setSortBy: (sortBy: 'name' | 'date', order: 'asc' | 'desc') => void;
  toggleDocumentSelection: (id: string) => void;
  clearSelection: () => void;
  selectAll: () => void;
}

export const useLibraryStore = create<LibraryState>((set, get) => ({
  documents: [],
  folders: [],
  selectedFolderId: null,
  viewMode: 'grid',
  sortBy: 'date',
  sortOrder: 'desc',
  searchQuery: '',
  selectedDocuments: new Set(),
  isLoading: false,

  loadDocuments: async (folderId) => {
    set({ isLoading: true });
    try {
      const documents = await db.getDocuments(folderId);
      const { sortBy, sortOrder } = get();

      // Sort documents
      documents.sort((a, b) => {
        if (sortBy === 'name') {
          const comparison = a.name.localeCompare(b.name);
          return sortOrder === 'asc' ? comparison : -comparison;
        } else {
          const comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          return sortOrder === 'asc' ? comparison : -comparison;
        }
      });

      set({ documents, isLoading: false });
    } catch (error) {
      console.error('Failed to load documents:', error);
      set({ isLoading: false });
    }
  },

  loadFolders: async () => {
    try {
      const folders = await db.getFolders();
      set({ folders });
    } catch (error) {
      console.error('Failed to load folders:', error);
    }
  },

  createDocument: async (document) => {
    try {
      await db.createDocument(document);
      await get().loadDocuments(get().selectedFolderId);
    } catch (error) {
      console.error('Failed to create document:', error);
      throw error;
    }
  },

  updateDocument: async (document) => {
    try {
      await db.updateDocument(document);
      const { documents } = get();
      set({
        documents: documents.map((doc) => (doc.id === document.id ? document : doc)),
      });
    } catch (error) {
      console.error('Failed to update document:', error);
      throw error;
    }
  },

  deleteDocument: async (id) => {
    try {
      await db.deleteDocument(id);
      const { documents } = get();
      set({ documents: documents.filter((doc) => doc.id !== id) });
    } catch (error) {
      console.error('Failed to delete document:', error);
      throw error;
    }
  },

  deleteDocuments: async (ids) => {
    try {
      for (const id of ids) {
        await db.deleteDocument(id);
      }
      const { documents } = get();
      set({
        documents: documents.filter((doc) => !ids.includes(doc.id)),
        selectedDocuments: new Set(),
      });
    } catch (error) {
      console.error('Failed to delete documents:', error);
      throw error;
    }
  },

  createFolder: async (name) => {
    try {
      const folder: Folder = {
        id: `folder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await db.createFolder(folder);
      await get().loadFolders();
      return folder;
    } catch (error) {
      console.error('Failed to create folder:', error);
      throw error;
    }
  },

  updateFolder: async (id, name) => {
    try {
      await db.updateFolder(id, name);
      await get().loadFolders();
    } catch (error) {
      console.error('Failed to update folder:', error);
      throw error;
    }
  },

  deleteFolder: async (id) => {
    try {
      await db.deleteFolder(id);
      await get().loadFolders();
      if (get().selectedFolderId === id) {
        set({ selectedFolderId: null });
        await get().loadDocuments(null);
      }
    } catch (error) {
      console.error('Failed to delete folder:', error);
      throw error;
    }
  },

  moveDocumentsToFolder: async (documentIds, folderId) => {
    try {
      for (const docId of documentIds) {
        const doc = await db.getDocument(docId);
        if (doc) {
          doc.folderId = folderId;
          await db.updateDocument(doc);
        }
      }
      await get().loadDocuments(get().selectedFolderId);
      set({ selectedDocuments: new Set() });
    } catch (error) {
      console.error('Failed to move documents:', error);
      throw error;
    }
  },

  searchDocuments: async (query) => {
    set({ searchQuery: query, isLoading: true });
    try {
      if (query.trim() === '') {
        await get().loadDocuments(get().selectedFolderId);
      } else {
        const documents = await db.searchDocuments(query);
        set({ documents, isLoading: false });
      }
    } catch (error) {
      console.error('Failed to search documents:', error);
      set({ isLoading: false });
    }
  },

  setSelectedFolder: (folderId) => {
    set({ selectedFolderId: folderId });
    get().loadDocuments(folderId);
  },

  setViewMode: (mode) => {
    set({ viewMode: mode });
  },

  setSortBy: (sortBy, order) => {
    set({ sortBy, sortOrder: order });
    get().loadDocuments(get().selectedFolderId);
  },

  toggleDocumentSelection: (id) => {
    const { selectedDocuments } = get();
    const newSelection = new Set(selectedDocuments);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    set({ selectedDocuments: newSelection });
  },

  clearSelection: () => {
    set({ selectedDocuments: new Set() });
  },

  selectAll: () => {
    const { documents } = get();
    set({ selectedDocuments: new Set(documents.map((doc) => doc.id)) });
  },
}));
