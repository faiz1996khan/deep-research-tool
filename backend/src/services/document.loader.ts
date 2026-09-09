import { Document } from "@langchain/core/documents";
import * as cheerio from "cheerio";
import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";
import * as XLSX from "xlsx";
import path from "node:path";
import { config } from "../config";
import { randomUUID } from "node:crypto";
import { LoadDocumentInput, SourceMetadata, SupportedDocumentTypes } from "../models/documents";

export class DocumentLoaderService {
  async load(input: LoadDocumentInput):Promise<Document[]> {
      const extention = this.getExtension(input.fileName);
      switch(extention) {
          case "txt":
              return this.loadText(input);
          case "html":
              return this.loadHtml(input);
          case "docx":
              return this.loadDocx(input);
          case "xlsx":
              return this.loadXlsx(input);
          case "pdf":
              return this.loadPdf(input);
          default:
              throw new Error(`.${extention} not supported`);
      }
  }

  private async loadText(input: LoadDocumentInput):Promise<Document[]> {
    const content = input.buffer.toString("utf-8");

    const metadata: SourceMetadata = {
      sourceType: "upload",
      documentId: input.documentId,
      fileName: input.fileName,
      mimeType: input.mimeType,
    };

    return [new Document({id:randomUUID(),pageContent: content,metadata})];
  }

  private async loadHtml(input: LoadDocumentInput):Promise<Document[]>{
    const html = input.buffer.toString("utf-8");
    const $ = cheerio.load(html);

    $("script, style, noscript").remove();

    const content = $("body").text().replace(/\s+/g, " ").trim();

    const metadata: SourceMetadata = {
      sourceType: "webpage",
      documentId: input.documentId,
      fileName: input.fileName,
      mimeType: input.mimeType,
    };

    return [new Document({id:randomUUID(),pageContent: content,metadata})];
  }

  private async loadDocx(input: LoadDocumentInput):Promise<Document[]>{
    const result = await mammoth.extractRawText({
      buffer: input.buffer,
    });

    const metadata: SourceMetadata = {
      sourceType: "upload",
      documentId: input.documentId,
      fileName: input.fileName,
      mimeType: input.mimeType,
    };

    return [new Document({id:randomUUID(),pageContent: result.value,metadata})];
  }

  private async loadXlsx(input: LoadDocumentInput):Promise<Document[]> {
    const workbook = XLSX.read(input.buffer,{type:"buffer"});

    return workbook.SheetNames.map((sheetName) => {
      const worksheet = workbook.Sheets[sheetName];

      const content = XLSX.utils.sheet_to_txt(worksheet);

      const metadata: SourceMetadata = {
        sourceType: "upload",
        documentId: input.documentId,
        fileName: input.fileName,
        mimeType: input.mimeType,
        sheetName,
      };

      return new Document({id:randomUUID(),pageContent: content,metadata});
    });
  }

  private async loadPdf(input: LoadDocumentInput): Promise<Document[]> {
    const parser = new PDFParse({ data: input.buffer});

    try {
      const result = await parser.getText();

      const metadata: SourceMetadata = {
        sourceType: "upload",
        documentId: input.documentId,
        fileName: input.fileName,
        mimeType: input.mimeType,
      };

      return [new Document({pageContent: result.text,metadata})];
    }
    finally {
      await parser.destroy();
    }
  }

  private getExtension(fileName: string): SupportedDocumentTypes {
    const extension = path.extname(fileName).toLowerCase().replace(".", "") as SupportedDocumentTypes;

    if (!(config.supportedDocTypes.split(",").includes(extension))) {
      throw new Error(`Unsupported document type: .${extension}`);
    }

    return extension;
  }
}