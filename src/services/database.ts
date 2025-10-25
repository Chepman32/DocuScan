// SQLite Database Service
import { open } from '@op-engineering/op-sqlite';
import type { Document, Folder, Page, OCRResult } from '@/types/models';

const DB_NAME = 'docuscan.db';

class DatabaseService {
  private db: any;

  async init() {
    try {
      this.db = open({ name: DB_NAME });
      await this.createTables();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error;
    }
  }

  private async createTables() {
    // Folders table
    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS folders (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);

    // Documents table
    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        folder_id TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        ocr_indexed INTEGER DEFAULT 0,
        thumbnail_uri TEXT,
        FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE SET NULL
      )
    `);

    // Pages table
    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS pages (
        id TEXT PRIMARY KEY,
        document_id TEXT NOT NULL,
        image_uri TEXT NOT NULL,
        page_order INTEGER NOT NULL,
        rotation INTEGER DEFAULT 0,
        crop_points TEXT,
        perspective_matrix TEXT,
        filter_type TEXT DEFAULT 'color',
        brightness INTEGER DEFAULT 0,
        contrast INTEGER DEFAULT 0,
        FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
      )
    `);

    // Tags table
    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS tags (
        id TEXT PRIMARY KEY,
        name TEXT UNIQUE NOT NULL
      )
    `);

    // Document tags junction table
    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS document_tags (
        document_id TEXT NOT NULL,
        tag_id TEXT NOT NULL,
        PRIMARY KEY (document_id, tag_id),
        FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
        FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
      )
    `);

    // OCR results table
    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS ocr_results (
        id TEXT PRIMARY KEY,
        document_id TEXT NOT NULL,
        page_id TEXT NOT NULL,
        full_text TEXT,
        blocks_data TEXT,
        FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
        FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE
      )
    `);

    // Create indices for better query performance
    await this.db.execute('CREATE INDEX IF NOT EXISTS idx_documents_folder ON documents(folder_id)');
    await this.db.execute('CREATE INDEX IF NOT EXISTS idx_pages_document ON pages(document_id)');
    await this.db.execute('CREATE INDEX IF NOT EXISTS idx_ocr_document ON ocr_results(document_id)');
  }

  // Folder operations
  async createFolder(folder: Folder): Promise<void> {
    await this.db.execute(
      'INSERT INTO folders (id, name, created_at, updated_at) VALUES (?, ?, ?, ?)',
      [folder.id, folder.name, folder.createdAt, folder.updatedAt]
    );
  }

  async getFolders(): Promise<Folder[]> {
    const result = await this.db.execute('SELECT * FROM folders ORDER BY name ASC');
    return result.rows._array.map((row: any) => ({
      id: row.id,
      name: row.name,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  async updateFolder(id: string, name: string): Promise<void> {
    const now = new Date().toISOString();
    await this.db.execute(
      'UPDATE folders SET name = ?, updated_at = ? WHERE id = ?',
      [name, now, id]
    );
  }

  async deleteFolder(id: string): Promise<void> {
    await this.db.execute('DELETE FROM folders WHERE id = ?', [id]);
  }

  // Document operations
  async createDocument(document: Document): Promise<void> {
    await this.db.execute(
      `INSERT INTO documents (id, name, folder_id, created_at, updated_at, ocr_indexed, thumbnail_uri)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        document.id,
        document.name,
        document.folderId,
        document.createdAt,
        document.updatedAt,
        document.ocrIndexed ? 1 : 0,
        document.thumbnailUri || null,
      ]
    );

    // Insert pages
    for (let i = 0; i < document.pages.length; i++) {
      const page = document.pages[i];
      await this.createPage(document.id, page, i);
    }

    // Insert tags if any
    if (document.tags && document.tags.length > 0) {
      for (const tagName of document.tags) {
        await this.addTagToDocument(document.id, tagName);
      }
    }
  }

  private async createPage(documentId: string, page: Page, order: number): Promise<void> {
    await this.db.execute(
      `INSERT INTO pages (id, document_id, image_uri, page_order, rotation, crop_points,
       perspective_matrix, filter_type, brightness, contrast)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        page.id,
        documentId,
        page.imageUri,
        order,
        page.transforms.rotation || 0,
        page.transforms.cropPoints ? JSON.stringify(page.transforms.cropPoints) : null,
        page.transforms.perspectiveMatrix ? JSON.stringify(page.transforms.perspectiveMatrix) : null,
        page.adjustments.filter,
        page.adjustments.brightness,
        page.adjustments.contrast,
      ]
    );
  }

  async getDocuments(folderId?: string | null): Promise<Document[]> {
    let query = 'SELECT * FROM documents';
    const params: any[] = [];

    if (folderId !== undefined) {
      if (folderId === null) {
        query += ' WHERE folder_id IS NULL';
      } else {
        query += ' WHERE folder_id = ?';
        params.push(folderId);
      }
    }

    query += ' ORDER BY updated_at DESC';

    const result = await this.db.execute(query, params);
    const documents: Document[] = [];

    for (const row of result.rows._array) {
      const pages = await this.getPagesByDocumentId(row.id);
      const tags = await this.getDocumentTags(row.id);

      documents.push({
        id: row.id,
        name: row.name,
        folderId: row.folder_id,
        pages,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        ocrIndexed: row.ocr_indexed === 1,
        tags,
        thumbnailUri: row.thumbnail_uri,
      });
    }

    return documents;
  }

  async getDocument(id: string): Promise<Document | null> {
    const result = await this.db.execute('SELECT * FROM documents WHERE id = ?', [id]);
    if (result.rows.length === 0) return null;

    const row = result.rows._array[0];
    const pages = await this.getPagesByDocumentId(row.id);
    const tags = await this.getDocumentTags(row.id);

    return {
      id: row.id,
      name: row.name,
      folderId: row.folder_id,
      pages,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      ocrIndexed: row.ocr_indexed === 1,
      tags,
      thumbnailUri: row.thumbnail_uri,
    };
  }

  private async getPagesByDocumentId(documentId: string): Promise<Page[]> {
    const result = await this.db.execute(
      'SELECT * FROM pages WHERE document_id = ? ORDER BY page_order ASC',
      [documentId]
    );

    return result.rows._array.map((row: any) => ({
      id: row.id,
      imageUri: row.image_uri,
      transforms: {
        rotation: row.rotation,
        cropPoints: row.crop_points ? JSON.parse(row.crop_points) : undefined,
        perspectiveMatrix: row.perspective_matrix ? JSON.parse(row.perspective_matrix) : undefined,
      },
      adjustments: {
        filter: row.filter_type,
        brightness: row.brightness,
        contrast: row.contrast,
      },
    }));
  }

  async updateDocument(document: Document): Promise<void> {
    const now = new Date().toISOString();
    await this.db.execute(
      `UPDATE documents SET name = ?, folder_id = ?, updated_at = ?,
       ocr_indexed = ?, thumbnail_uri = ? WHERE id = ?`,
      [
        document.name,
        document.folderId,
        now,
        document.ocrIndexed ? 1 : 0,
        document.thumbnailUri || null,
        document.id,
      ]
    );

    // Update pages
    await this.db.execute('DELETE FROM pages WHERE document_id = ?', [document.id]);
    for (let i = 0; i < document.pages.length; i++) {
      await this.createPage(document.id, document.pages[i], i);
    }
  }

  async deleteDocument(id: string): Promise<void> {
    await this.db.execute('DELETE FROM documents WHERE id = ?', [id]);
  }

  async searchDocuments(query: string): Promise<Document[]> {
    const result = await this.db.execute(
      'SELECT * FROM documents WHERE name LIKE ? ORDER BY updated_at DESC',
      [`%${query}%`]
    );

    const documents: Document[] = [];
    for (const row of result.rows._array) {
      const pages = await this.getPagesByDocumentId(row.id);
      const tags = await this.getDocumentTags(row.id);

      documents.push({
        id: row.id,
        name: row.name,
        folderId: row.folder_id,
        pages,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        ocrIndexed: row.ocr_indexed === 1,
        tags,
        thumbnailUri: row.thumbnail_uri,
      });
    }

    return documents;
  }

  // Tag operations
  private async addTagToDocument(documentId: string, tagName: string): Promise<void> {
    // Get or create tag
    let tagId: string;
    const tagResult = await this.db.execute('SELECT id FROM tags WHERE name = ?', [tagName]);

    if (tagResult.rows.length > 0) {
      tagId = tagResult.rows._array[0].id;
    } else {
      tagId = `tag-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      await this.db.execute('INSERT INTO tags (id, name) VALUES (?, ?)', [tagId, tagName]);
    }

    // Link tag to document
    await this.db.execute(
      'INSERT OR IGNORE INTO document_tags (document_id, tag_id) VALUES (?, ?)',
      [documentId, tagId]
    );
  }

  private async getDocumentTags(documentId: string): Promise<string[]> {
    const result = await this.db.execute(
      `SELECT t.name FROM tags t
       INNER JOIN document_tags dt ON t.id = dt.tag_id
       WHERE dt.document_id = ?`,
      [documentId]
    );

    return result.rows._array.map((row: any) => row.name);
  }

  // OCR operations
  async saveOCRResult(result: OCRResult): Promise<void> {
    const id = `ocr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await this.db.execute(
      `INSERT INTO ocr_results (id, document_id, page_id, full_text, blocks_data)
       VALUES (?, ?, ?, ?, ?)`,
      [id, result.documentId, result.pageId, result.text, JSON.stringify(result.blocks)]
    );

    // Mark document as OCR indexed
    await this.db.execute('UPDATE documents SET ocr_indexed = 1 WHERE id = ?', [result.documentId]);
  }

  async getOCRResult(documentId: string, pageId: string): Promise<OCRResult | null> {
    const result = await this.db.execute(
      'SELECT * FROM ocr_results WHERE document_id = ? AND page_id = ?',
      [documentId, pageId]
    );

    if (result.rows.length === 0) return null;

    const row = result.rows._array[0];
    return {
      documentId: row.document_id,
      pageId: row.page_id,
      text: row.full_text,
      blocks: JSON.parse(row.blocks_data),
    };
  }

  async searchOCR(query: string): Promise<Document[]> {
    const result = await this.db.execute(
      `SELECT DISTINCT d.* FROM documents d
       INNER JOIN ocr_results ocr ON d.id = ocr.document_id
       WHERE ocr.full_text LIKE ?
       ORDER BY d.updated_at DESC`,
      [`%${query}%`]
    );

    const documents: Document[] = [];
    for (const row of result.rows._array) {
      const pages = await this.getPagesByDocumentId(row.id);
      const tags = await this.getDocumentTags(row.id);

      documents.push({
        id: row.id,
        name: row.name,
        folderId: row.folder_id,
        pages,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        ocrIndexed: row.ocr_indexed === 1,
        tags,
        thumbnailUri: row.thumbnail_uri,
      });
    }

    return documents;
  }
}

export const db = new DatabaseService();
