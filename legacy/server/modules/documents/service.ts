/**
 * Document Management & Object Storage Service
 * Enforces S3-compatible signed URLs, MIME verification, and virus scan simulations
 */

import { Logger } from '../../core/logger';

export interface PresignedUploadResponse {
  uploadUrl: string;
  storageKey: string;
  expiresInSeconds: number;
  maxSizeBytes: number;
  allowedMimeTypes: string[];
}

export class DocumentsService {
  private static ALLOWED_MIME_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/png'
  ];
  private static MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB

  public static generatePresignedUploadUrl(
    userId: string,
    documentType: string,
    fileName: string,
    mimeType: string
  ): PresignedUploadResponse {
    if (!this.ALLOWED_MIME_TYPES.includes(mimeType)) {
      throw new Error(`نوع الملف غير مسموح (${mimeType}). الملفات المقبولة هي PDF و JPEG و PNG فقط.`);
    }

    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storageKey = `kasp-documents/${userId}/${documentType}/${timestamp}_${sanitizedFileName}`;

    // Emulated S3 signed PUT URL with 15-minute validity
    const uploadUrl = `https://storage.kasp.gov.sa/upload?key=${encodeURIComponent(storageKey)}&token=sign_${timestamp}`;

    Logger.info(`Generated presigned upload URL for user ${userId}, type: ${documentType}`);

    return {
      uploadUrl,
      storageKey,
      expiresInSeconds: 900, // 15 mins
      maxSizeBytes: this.MAX_FILE_SIZE_BYTES,
      allowedMimeTypes: this.ALLOWED_MIME_TYPES
    };
  }

  public static verifyUploadedDocument(input: {
    storageKey: string;
    fileSizeBytes: number;
    sha256Checksum: string;
  }) {
    if (input.fileSizeBytes > this.MAX_FILE_SIZE_BYTES) {
      throw new Error('حجم الملف يتجاوز الحد الأقصى المسموح به (15 ميجابايت).');
    }

    // Antivirus simulation
    const passedMalwareScan = true;

    return {
      verified: true,
      passedMalwareScan,
      verifiedAt: new Date().toISOString()
    };
  }
}
