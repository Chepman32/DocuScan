// PDF generation utilities
import type { Document as DocuDocument, ExportOptions, Page } from '@/types/models';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';

/**
 * Generate PDF from document
 */
export const generatePDF = async (
  document: DocuDocument,
  options: ExportOptions
): Promise<string> => {
  try {
    // Placeholder for actual PDF generation
    // In a real implementation, this would:
    // 1. Create a PDF document using react-native-pdf-lib
    // 2. Add each page as an image
    // 3. If includeAnnotations, flatten annotations onto images
    // 4. Set metadata (title, author, etc.)
    // 5. Save to file system
    // 6. Return file URI

    const pdfPath = `${RNFS.DocumentDirectoryPath}/${document.name}.pdf`;

    console.log(`Generating PDF: ${document.name}`);
    console.log(`Pages: ${document.pages.length}`);
    console.log(`Include annotations: ${options.includeAnnotations}`);

    // Mock PDF generation
    // In production, would use:
    // const pdf = PDFDocument.create();
    // for (const page of document.pages) {
    //   const image = await loadImage(page.imageUri);
    //   pdf.addPage(image);
    // }
    // await pdf.write(pdfPath);

    return pdfPath;
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw error;
  }
};

/**
 * Export document as images (JPG or PNG)
 */
export const exportAsImages = async (
  document: DocuDocument,
  options: ExportOptions
): Promise<string[]> => {
  try {
    const exportedPaths: string[] = [];

    for (let i = 0; i < document.pages.length; i++) {
      const page = document.pages[i];
      const ext = options.format === 'jpg' ? 'jpg' : 'png';
      const filename = `${document.name}_page_${i + 1}.${ext}`;
      const filepath = `${RNFS.DocumentDirectoryPath}/${filename}`;

      // In a real implementation:
      // 1. Load the image
      // 2. Apply any pending transformations
      // 3. Flatten annotations if needed
      // 4. Convert format if needed
      // 5. Compress based on quality
      // 6. Save to file

      console.log(`Exporting page ${i + 1} as ${ext}`);

      exportedPaths.push(filepath);
    }

    return exportedPaths;
  } catch (error) {
    console.error('Image export failed:', error);
    throw error;
  }
};

/**
 * Share document
 */
export const shareDocument = async (
  filePath: string,
  mimeType: string = 'application/pdf'
): Promise<void> => {
  try {
    const shareOptions = {
      title: 'Share Document',
      url: `file://${filePath}`,
      type: mimeType,
      failOnCancel: false,
    };

    await Share.open(shareOptions);
  } catch (error) {
    console.error('Share failed:', error);
    throw error;
  }
};

/**
 * Save to Files app (iOS) or Downloads (Android)
 */
export const saveToFiles = async (
  sourcePath: string,
  filename: string
): Promise<string> => {
  try {
    // Platform-specific implementation
    // iOS: Move to shared documents directory
    // Android: Move to Downloads folder

    const destPath = `${RNFS.DownloadDirectoryPath}/${filename}`;
    await RNFS.copyFile(sourcePath, destPath);

    console.log(`Saved to: ${destPath}`);
    return destPath;
  } catch (error) {
    console.error('Save to files failed:', error);
    throw error;
  }
};

/**
 * Calculate estimated PDF size
 */
export const estimatePDFSize = (pages: Page[]): number => {
  // Rough estimation: ~200KB per page
  return pages.length * 200 * 1024;
};

/**
 * Validate export options
 */
export const validateExportOptions = (options: ExportOptions): boolean => {
  if (!['pdf', 'jpg', 'png'].includes(options.format)) {
    return false;
  }

  if (options.format === 'jpg') {
    if (!options.quality || options.quality < 1 || options.quality > 100) {
      return false;
    }
  }

  return true;
};

/**
 * Get export filename with timestamp
 */
export const getExportFilename = (
  documentName: string,
  format: 'pdf' | 'jpg' | 'png'
): string => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const safeName = documentName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  return `${safeName}_${timestamp}.${format}`;
};

/**
 * Batch export multiple documents
 */
export const batchExport = async (
  documents: DocuDocument[],
  options: ExportOptions
): Promise<string[]> => {
  const exportedFiles: string[] = [];

  for (const doc of documents) {
    if (options.format === 'pdf') {
      const pdfPath = await generatePDF(doc, options);
      exportedFiles.push(pdfPath);
    } else {
      const imagePaths = await exportAsImages(doc, options);
      exportedFiles.push(...imagePaths);
    }
  }

  return exportedFiles;
};

/**
 * Clean up temporary export files
 */
export const cleanupExportFiles = async (filePaths: string[]): Promise<void> => {
  for (const path of filePaths) {
    try {
      const exists = await RNFS.exists(path);
      if (exists) {
        await RNFS.unlink(path);
      }
    } catch (error) {
      console.error(`Failed to delete ${path}:`, error);
    }
  }
};
