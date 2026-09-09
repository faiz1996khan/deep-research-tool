export type DocumentSourceType = "upload" | "webpage";

export type SupportedDocumentTypes = "pdf" | "docx" | "xlsx" | "txt" | "html";

export interface SourceMetadata {
  sourceType: DocumentSourceType;
  documentId: string;
  fileName?: string;
  mimeType?: string;
  url?: string;
  pageNumber?: number;
  sheetName?: string;
}

export interface LoadDocumentInput {
  buffer: Buffer;
  fileName: string;
  mimeType?: string;
  documentId: string;
}