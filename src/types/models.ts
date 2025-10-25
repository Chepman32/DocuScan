// Data Models for DocuScan

export interface Page {
  id: string;
  imageUri: string;
  transforms: PageTransform;
  adjustments: PageAdjustments;
}

export interface PageTransform {
  rotation: number; // 0, 90, 180, 270
  cropPoints?: CropPoint[];
  perspectiveMatrix?: number[];
}

export interface CropPoint {
  x: number;
  y: number;
}

export interface PageAdjustments {
  filter: FilterType;
  brightness: number; // -100 to 100
  contrast: number; // -100 to 100
}

export type FilterType = 'color' | 'magicColor' | 'grayscale' | 'blackAndWhite';

export interface Document {
  id: string;
  name: string;
  folderId: string | null;
  pages: Page[];
  createdAt: string;
  updatedAt: string;
  ocrIndexed: boolean;
  tags?: string[];
  thumbnailUri?: string;
}

export interface Folder {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  documentCount?: number;
}

export interface OCRResult {
  documentId: string;
  pageId: string;
  text: string;
  blocks: TextBlock[];
}

export interface TextBlock {
  text: string;
  confidence: number;
  bbox: BoundingBox;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Annotation {
  id: string;
  type: AnnotationType;
  points: Point[];
  color: string;
  strokeWidth: number;
  opacity: number;
}

export type AnnotationType = 'pen' | 'highlighter' | 'rectangle' | 'circle' | 'arrow';

export interface Point {
  x: number;
  y: number;
}

export interface ExportOptions {
  format: 'pdf' | 'jpg' | 'png';
  quality?: number; // 1-100 for jpg
  includeAnnotations: boolean;
}

export interface IAPProduct {
  productId: string;
  type: 'subscription' | 'one-time';
  price: string;
  currency: string;
  title: string;
  description: string;
}

export interface IAPState {
  isPro: boolean;
  products: IAPProduct[];
  activeSubscription: string | null;
  restoreAvailable: boolean;
}
