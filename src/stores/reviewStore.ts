// Review Store - manages review and enhancement
import { create } from 'zustand';
import type { Page, FilterType } from '@/types/models';

interface ReviewState {
  pages: Page[];
  currentPageIndex: number;
  selectedFilter: FilterType;
  brightness: number;
  contrast: number;
  cropMode: boolean;
  tempCropPoints: { x: number; y: number }[] | null;

  // Actions
  setPages: (pages: Page[]) => void;
  setCurrentPage: (index: number) => void;
  applyFilter: (filter: FilterType) => void;
  adjustBrightness: (value: number) => void;
  adjustContrast: (value: number) => void;
  rotatePage: (degrees: 90 | -90 | 180) => void;
  setCropMode: (enabled: boolean) => void;
  updateCropPoints: (points: { x: number; y: number }[]) => void;
  applyCrop: () => void;
  retryCrop: () => void;
  deletePage: (index: number) => void;
  reorderPages: (fromIndex: number, toIndex: number) => void;
  getCurrentPage: () => Page | null;
  getAllPages: () => Page[];
  resetAdjustments: () => void;
}

export const useReviewStore = create<ReviewState>((set, get) => ({
  pages: [],
  currentPageIndex: 0,
  selectedFilter: 'color',
  brightness: 0,
  contrast: 0,
  cropMode: false,
  tempCropPoints: null,

  setPages: (pages) => {
    set({ pages, currentPageIndex: 0 });
    const currentPage = pages[0];
    if (currentPage) {
      set({
        selectedFilter: currentPage.adjustments.filter,
        brightness: currentPage.adjustments.brightness,
        contrast: currentPage.adjustments.contrast,
      });
    }
  },

  setCurrentPage: (index) => {
    const { pages } = get();
    if (index >= 0 && index < pages.length) {
      const page = pages[index];
      set({
        currentPageIndex: index,
        selectedFilter: page.adjustments.filter,
        brightness: page.adjustments.brightness,
        contrast: page.adjustments.contrast,
        tempCropPoints: null,
        cropMode: false,
      });
    }
  },

  applyFilter: (filter) => {
    set((state) => {
      const pages = [...state.pages];
      const page = pages[state.currentPageIndex];
      if (page) {
        page.adjustments.filter = filter;
      }
      return { pages, selectedFilter: filter };
    });
  },

  adjustBrightness: (value) => {
    set((state) => {
      const pages = [...state.pages];
      const page = pages[state.currentPageIndex];
      if (page) {
        page.adjustments.brightness = value;
      }
      return { pages, brightness: value };
    });
  },

  adjustContrast: (value) => {
    set((state) => {
      const pages = [...state.pages];
      const page = pages[state.currentPageIndex];
      if (page) {
        page.adjustments.contrast = value;
      }
      return { pages, contrast: value };
    });
  },

  rotatePage: (degrees) => {
    set((state) => {
      const pages = [...state.pages];
      const page = pages[state.currentPageIndex];
      if (page) {
        page.transforms.rotation = (page.transforms.rotation + degrees) % 360;
        if (page.transforms.rotation < 0) {
          page.transforms.rotation += 360;
        }
      }
      return { pages };
    });
  },

  setCropMode: (enabled) => {
    set({ cropMode: enabled });
    if (!enabled) {
      set({ tempCropPoints: null });
    }
  },

  updateCropPoints: (points) => {
    set({ tempCropPoints: points });
  },

  applyCrop: () => {
    set((state) => {
      const pages = [...state.pages];
      const page = pages[state.currentPageIndex];
      if (page && state.tempCropPoints) {
        page.transforms.cropPoints = state.tempCropPoints;
      }
      return { pages, cropMode: false, tempCropPoints: null };
    });
  },

  retryCrop: () => {
    set({ tempCropPoints: null, cropMode: true });
  },

  deletePage: (index) => {
    set((state) => {
      const pages = state.pages.filter((_, i) => i !== index);
      let newIndex = state.currentPageIndex;
      if (newIndex >= pages.length) {
        newIndex = Math.max(0, pages.length - 1);
      }
      return { pages, currentPageIndex: newIndex };
    });
  },

  reorderPages: (fromIndex, toIndex) => {
    set((state) => {
      const pages = [...state.pages];
      const [movedPage] = pages.splice(fromIndex, 1);
      pages.splice(toIndex, 0, movedPage);
      return { pages };
    });
  },

  getCurrentPage: () => {
    const { pages, currentPageIndex } = get();
    return pages[currentPageIndex] || null;
  },

  getAllPages: () => {
    return get().pages;
  },

  resetAdjustments: () => {
    set((state) => {
      const pages = [...state.pages];
      const page = pages[state.currentPageIndex];
      if (page) {
        page.adjustments = {
          filter: 'color',
          brightness: 0,
          contrast: 0,
        };
      }
      return {
        pages,
        selectedFilter: 'color',
        brightness: 0,
        contrast: 0,
      };
    });
  },
}));
