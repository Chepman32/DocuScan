// Advanced Image Filter Service with Skia
import { Skia, ImageFilter, ColorFilter, BlendMode } from '@shopify/react-native-skia';
import type { FilterType } from '@/types/models';

/**
 * Create color matrix filter for different effects
 */
export const createColorMatrixFilter = (type: FilterType): ImageFilter | null => {
  switch (type) {
    case 'grayscale':
      // Grayscale conversion matrix
      return Skia.ImageFilter.MakeColorFilter(
        Skia.ColorFilter.MakeMatrix([
          0.33, 0.33, 0.33, 0, 0,
          0.33, 0.33, 0.33, 0, 0,
          0.33, 0.33, 0.33, 0, 0,
          0,    0,    0,    1, 0,
        ]),
        null
      );

    case 'blackAndWhite':
      // High contrast B&W
      return Skia.ImageFilter.MakeColorFilter(
        Skia.ColorFilter.MakeMatrix([
          1.5,  1.5,  1.5,  0, -0.5,
          1.5,  1.5,  1.5,  0, -0.5,
          1.5,  1.5,  1.5,  0, -0.5,
          0,    0,    0,    1, 0,
        ]),
        null
      );

    case 'magicColor':
      // Enhanced color with better contrast
      return Skia.ImageFilter.MakeColorFilter(
        Skia.ColorFilter.MakeMatrix([
          1.2,  0,    0,    0, 0.05,
          0,    1.2,  0,    0, 0.05,
          0,    0,    1.2,  0, 0.05,
          0,    0,    0,    1, 0,
        ]),
        null
      );

    case 'color':
    default:
      return null;
  }
};

/**
 * Create brightness adjustment filter
 */
export const createBrightnessFilter = (brightness: number): ImageFilter | null => {
  if (brightness === 0) return null;

  // Brightness range: -100 to 100
  const normalizedBrightness = brightness / 100;

  return Skia.ImageFilter.MakeColorFilter(
    Skia.ColorFilter.MakeMatrix([
      1, 0, 0, 0, normalizedBrightness,
      0, 1, 0, 0, normalizedBrightness,
      0, 0, 1, 0, normalizedBrightness,
      0, 0, 0, 1, 0,
    ]),
    null
  );
};

/**
 * Create contrast adjustment filter
 */
export const createContrastFilter = (contrast: number): ImageFilter | null => {
  if (contrast === 0) return null;

  // Contrast range: -100 to 100
  const normalizedContrast = (contrast / 100) + 1;
  const intercept = -(0.5 * normalizedContrast) + 0.5;

  return Skia.ImageFilter.MakeColorFilter(
    Skia.ColorFilter.MakeMatrix([
      normalizedContrast, 0, 0, 0, intercept,
      0, normalizedContrast, 0, 0, intercept,
      0, 0, normalizedContrast, 0, intercept,
      0, 0, 0, 1, 0,
    ]),
    null
  );
};

/**
 * Compose multiple filters
 */
export const composeFilters = (filters: (ImageFilter | null)[]): ImageFilter | null => {
  const validFilters = filters.filter((f): f is ImageFilter => f !== null);

  if (validFilters.length === 0) return null;
  if (validFilters.length === 1) return validFilters[0];

  // Compose filters from right to left
  return validFilters.reduce((composed, filter) => {
    return Skia.ImageFilter.MakeCompose(filter, composed);
  });
};

/**
 * Create complete filter pipeline
 */
export const createFilterPipeline = (
  filterType: FilterType,
  brightness: number,
  contrast: number
): ImageFilter | null => {
  const filters = [
    createColorMatrixFilter(filterType),
    createBrightnessFilter(brightness),
    createContrastFilter(contrast),
  ];

  return composeFilters(filters);
};

/**
 * Sharpen filter for better text readability
 */
export const createSharpenFilter = (amount: number = 1): ImageFilter => {
  // Sharpen kernel
  const kernel = new Float32Array([
    0, -amount, 0,
    -amount, 1 + 4 * amount, -amount,
    0, -amount, 0,
  ]);

  return Skia.ImageFilter.MakeMatrixConvolution(
    { width: 3, height: 3 },
    kernel,
    1,
    0,
    { x: 1, y: 1 },
    'clamp',
    false,
    null
  );
};

/**
 * Blur filter for background separation
 */
export const createBlurFilter = (radius: number): ImageFilter => {
  return Skia.ImageFilter.MakeBlur(radius, radius, 'clamp', null);
};

/**
 * Edge detection filter (for document detection)
 */
export const createEdgeDetectionFilter = (): ImageFilter => {
  // Sobel edge detection kernel
  const kernel = new Float32Array([
    -1, -1, -1,
    -1,  8, -1,
    -1, -1, -1,
  ]);

  return Skia.ImageFilter.MakeMatrixConvolution(
    { width: 3, height: 3 },
    kernel,
    1,
    0,
    { x: 1, y: 1 },
    'clamp',
    false,
    null
  );
};

/**
 * Auto white balance filter
 */
export const createAutoWhiteBalanceFilter = (): ImageFilter => {
  // Simplified auto white balance
  // In production, this would analyze the image first
  return Skia.ImageFilter.MakeColorFilter(
    Skia.ColorFilter.MakeMatrix([
      1.05, 0, 0, 0, 0,
      0, 1.0, 0, 0, 0,
      0, 0, 0.95, 0, 0,
      0, 0, 0, 1, 0,
    ]),
    null
  );
};

/**
 * Sepia filter (vintage effect)
 */
export const createSepiaFilter = (): ImageFilter => {
  return Skia.ImageFilter.MakeColorFilter(
    Skia.ColorFilter.MakeMatrix([
      0.393, 0.769, 0.189, 0, 0,
      0.349, 0.686, 0.168, 0, 0,
      0.272, 0.534, 0.131, 0, 0,
      0, 0, 0, 1, 0,
    ]),
    null
  );
};

/**
 * Posterize filter (reduce colors)
 */
export const createPosterizeFilter = (levels: number = 4): ImageFilter => {
  const scale = 255 / levels;

  return Skia.ImageFilter.MakeColorFilter(
    Skia.ColorFilter.MakeMatrix([
      scale, 0, 0, 0, 0,
      0, scale, 0, 0, 0,
      0, 0, scale, 0, 0,
      0, 0, 0, 1, 0,
    ]),
    null
  );
};

/**
 * Get filter preview description
 */
export const getFilterDescription = (type: FilterType): string => {
  switch (type) {
    case 'color':
      return 'Original colors with enhanced clarity';
    case 'magicColor':
      return 'Auto-enhanced colors and contrast';
    case 'grayscale':
      return 'Black and white conversion';
    case 'blackAndWhite':
      return 'High contrast for text documents';
    default:
      return '';
  }
};

/**
 * Get recommended filter for document type
 */
export const getRecommendedFilter = (documentType: 'text' | 'photo' | 'mixed'): FilterType => {
  switch (documentType) {
    case 'text':
      return 'blackAndWhite';
    case 'photo':
      return 'magicColor';
    case 'mixed':
    default:
      return 'color';
  }
};

/**
 * Batch process multiple images with same filter
 */
export const batchProcessImages = async (
  imageUris: string[],
  filterType: FilterType,
  brightness: number,
  contrast: number,
  onProgress?: (current: number, total: number) => void
): Promise<string[]> => {
  const processedUris: string[] = [];

  for (let i = 0; i < imageUris.length; i++) {
    // In production, this would apply the filter and save
    processedUris.push(imageUris[i]);
    onProgress?.(i + 1, imageUris.length);
  }

  return processedUris;
};
