// OCR Store - manages OCR processing
import { create } from 'zustand';
import type { OCRResult } from '@/types/models';

interface OCRState {
  isProcessing: boolean;
  progress: number;
  results: Map<string, OCRResult>; // documentId-pageId -> result
  error: string | null;

  // Actions
  processPage: (documentId: string, pageId: string, imageUri: string) => Promise<void>;
  getResult: (documentId: string, pageId: string) => OCRResult | null;
  clearResults: () => void;
  setProgress: (progress: number) => void;
}

export const useOCRStore = create<OCRState>((set, get) => ({
  isProcessing: false,
  progress: 0,
  results: new Map(),
  error: null,

  processPage: async (documentId, pageId, imageUri) => {
    set({ isProcessing: true, progress: 0, error: null });

    try {
      // Placeholder for actual OCR processing with Tesseract.js
      // In a real implementation, this would:
      // 1. Load the image
      // 2. Process with Tesseract
      // 3. Extract text and bounding boxes
      // 4. Save to database

      // Simulated progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        set({ progress: i });
      }

      // Placeholder result
      const result: OCRResult = {
        documentId,
        pageId,
        text: 'Placeholder OCR text. Real implementation would use Tesseract.js.',
        blocks: [
          {
            text: 'Placeholder text block',
            confidence: 0.95,
            bbox: { x: 10, y: 10, width: 200, height: 30 },
          },
        ],
      };

      set((state) => {
        const results = new Map(state.results);
        results.set(`${documentId}-${pageId}`, result);
        return { results, isProcessing: false, progress: 100 };
      });
    } catch (error) {
      console.error('OCR processing failed:', error);
      set({
        error: error instanceof Error ? error.message : 'OCR processing failed',
        isProcessing: false,
      });
    }
  },

  getResult: (documentId, pageId) => {
    return get().results.get(`${documentId}-${pageId}`) || null;
  },

  clearResults: () => {
    set({ results: new Map(), error: null, progress: 0 });
  },

  setProgress: (progress) => {
    set({ progress });
  },
}));
