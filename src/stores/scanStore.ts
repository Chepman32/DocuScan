// Scan Store - manages the scanning session
import { create } from 'zustand';
import type { Page } from '@/types/models';

interface ScanState {
  capturedPages: Page[];
  currentPage: Page | null;
  isCapturing: boolean;
  flashEnabled: boolean;
  gridEnabled: boolean;
  autoCapture: boolean;
  edgeDetectionEnabled: boolean;
  detectedEdges: { x: number; y: number }[] | null;
  isStable: boolean;

  // Actions
  startCapture: () => void;
  stopCapture: () => void;
  capturePage: (imageUri: string, edges?: { x: number; y: number }[]) => void;
  removePage: (pageId: string) => void;
  reorderPages: (fromIndex: number, toIndex: number) => void;
  setFlashEnabled: (enabled: boolean) => void;
  setGridEnabled: (enabled: boolean) => void;
  setAutoCapture: (enabled: boolean) => void;
  setEdgeDetectionEnabled: (enabled: boolean) => void;
  updateDetectedEdges: (edges: { x: number; y: number }[] | null) => void;
  setStable: (stable: boolean) => void;
  resetSession: () => void;
  getScanSession: () => Page[];
}

export const useScanStore = create<ScanState>((set, get) => ({
  capturedPages: [],
  currentPage: null,
  isCapturing: false,
  flashEnabled: false,
  gridEnabled: true,
  autoCapture: true,
  edgeDetectionEnabled: true,
  detectedEdges: null,
  isStable: false,

  startCapture: () => {
    set({ isCapturing: true });
  },

  stopCapture: () => {
    set({ isCapturing: false });
  },

  capturePage: (imageUri, edges) => {
    const pageId = `page-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newPage: Page = {
      id: pageId,
      imageUri,
      transforms: {
        rotation: 0,
        cropPoints: edges,
      },
      adjustments: {
        filter: 'color',
        brightness: 0,
        contrast: 0,
      },
    };

    set((state) => ({
      capturedPages: [...state.capturedPages, newPage],
      currentPage: newPage,
      detectedEdges: null,
      isStable: false,
    }));
  },

  removePage: (pageId) => {
    set((state) => ({
      capturedPages: state.capturedPages.filter((page) => page.id !== pageId),
    }));
  },

  reorderPages: (fromIndex, toIndex) => {
    set((state) => {
      const pages = [...state.capturedPages];
      const [movedPage] = pages.splice(fromIndex, 1);
      pages.splice(toIndex, 0, movedPage);
      return { capturedPages: pages };
    });
  },

  setFlashEnabled: (enabled) => {
    set({ flashEnabled: enabled });
  },

  setGridEnabled: (enabled) => {
    set({ gridEnabled: enabled });
  },

  setAutoCapture: (enabled) => {
    set({ autoCapture: enabled });
  },

  setEdgeDetectionEnabled: (enabled) => {
    set({ edgeDetectionEnabled: enabled });
  },

  updateDetectedEdges: (edges) => {
    set({ detectedEdges: edges });
  },

  setStable: (stable) => {
    set({ isStable: stable });
  },

  resetSession: () => {
    set({
      capturedPages: [],
      currentPage: null,
      detectedEdges: null,
      isStable: false,
    });
  },

  getScanSession: () => {
    return get().capturedPages;
  },
}));
