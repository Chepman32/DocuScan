// Viewer Store - manages document viewing
import { create } from 'zustand';
import type { Document, Annotation } from '@/types/models';

interface ViewerState {
  document: Document | null;
  currentPageIndex: number;
  zoomLevel: number;
  searchQuery: string;
  searchResults: Array<{ pageIndex: number; matches: number }>;
  annotationMode: boolean;
  currentAnnotationType: 'pen' | 'highlighter' | 'rectangle' | 'circle' | 'arrow' | null;
  annotations: Map<string, Annotation[]>; // pageId -> annotations
  currentColor: string;
  currentStrokeWidth: number;

  // Actions
  setDocument: (document: Document) => void;
  setCurrentPage: (index: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  setZoom: (level: number) => void;
  resetZoom: () => void;
  searchInDocument: (query: string) => void;
  clearSearch: () => void;
  setAnnotationMode: (enabled: boolean, type?: 'pen' | 'highlighter' | 'rectangle' | 'circle' | 'arrow') => void;
  addAnnotation: (pageId: string, annotation: Annotation) => void;
  removeAnnotation: (pageId: string, annotationId: string) => void;
  clearAnnotations: (pageId: string) => void;
  setAnnotationColor: (color: string) => void;
  setStrokeWidth: (width: number) => void;
  getPageAnnotations: (pageId: string) => Annotation[];
}

export const useViewerStore = create<ViewerState>((set, get) => ({
  document: null,
  currentPageIndex: 0,
  zoomLevel: 1,
  searchQuery: '',
  searchResults: [],
  annotationMode: false,
  currentAnnotationType: null,
  annotations: new Map(),
  currentColor: '#FF0000',
  currentStrokeWidth: 3,

  setDocument: (document) => {
    set({
      document,
      currentPageIndex: 0,
      zoomLevel: 1,
      searchQuery: '',
      searchResults: [],
      annotations: new Map(),
    });
  },

  setCurrentPage: (index) => {
    const { document } = get();
    if (document && index >= 0 && index < document.pages.length) {
      set({ currentPageIndex: index, zoomLevel: 1 });
    }
  },

  nextPage: () => {
    const { document, currentPageIndex } = get();
    if (document && currentPageIndex < document.pages.length - 1) {
      set({ currentPageIndex: currentPageIndex + 1, zoomLevel: 1 });
    }
  },

  previousPage: () => {
    const { currentPageIndex } = get();
    if (currentPageIndex > 0) {
      set({ currentPageIndex: currentPageIndex - 1, zoomLevel: 1 });
    }
  },

  setZoom: (level) => {
    set({ zoomLevel: Math.max(0.5, Math.min(5, level)) });
  },

  resetZoom: () => {
    set({ zoomLevel: 1 });
  },

  searchInDocument: (query) => {
    // This would integrate with OCR results in a real implementation
    set({ searchQuery: query });
    // Placeholder - would search through OCR results
    const results: Array<{ pageIndex: number; matches: number }> = [];
    set({ searchResults: results });
  },

  clearSearch: () => {
    set({ searchQuery: '', searchResults: [] });
  },

  setAnnotationMode: (enabled, type) => {
    set({
      annotationMode: enabled,
      currentAnnotationType: enabled ? type || null : null,
    });
  },

  addAnnotation: (pageId, annotation) => {
    set((state) => {
      const annotations = new Map(state.annotations);
      const pageAnnotations = annotations.get(pageId) || [];
      annotations.set(pageId, [...pageAnnotations, annotation]);
      return { annotations };
    });
  },

  removeAnnotation: (pageId, annotationId) => {
    set((state) => {
      const annotations = new Map(state.annotations);
      const pageAnnotations = annotations.get(pageId) || [];
      annotations.set(
        pageId,
        pageAnnotations.filter((a) => a.id !== annotationId)
      );
      return { annotations };
    });
  },

  clearAnnotations: (pageId) => {
    set((state) => {
      const annotations = new Map(state.annotations);
      annotations.delete(pageId);
      return { annotations };
    });
  },

  setAnnotationColor: (color) => {
    set({ currentColor: color });
  },

  setStrokeWidth: (width) => {
    set({ currentStrokeWidth: width });
  },

  getPageAnnotations: (pageId) => {
    return get().annotations.get(pageId) || [];
  },
}));
