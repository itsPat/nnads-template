import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_KEY!,
  },
});

export class R2Service {
  private bucket = process.env.CLOUDFLARE_R2_BUCKET_NAME!;

  /**
   * Upload a file to R2
   */
  async uploadFile(
    file: File | Buffer,
    key: string,
    contentType?: string
  ): Promise<string> {
    const body =
      file instanceof File ? Buffer.from(await file.arrayBuffer()) : file;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: body,
      ContentType:
        contentType ||
        (file instanceof File ? file.type : 'application/octet-stream'),
    });

    await r2Client.send(command);
    return this.getPublicUrl(key);
  }

  /**
   * Upload an image with automatic path generation
   */
  async uploadImage(
    file: File,
    userId: string,
    folder: 'uploads' | 'processed' | 'watermarked' = 'uploads'
  ): Promise<string> {
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const key = `${folder}/${userId}/${timestamp}.${extension}`;

    return this.uploadFile(file, key);
  }

  /**
   * Get a file from R2
   */
  async getFile(key: string): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    const response = await r2Client.send(command);

    if (response.Body) {
      // Use the transformToByteArray helper
      const uint8Array = await response.Body.transformToByteArray();
      return Buffer.from(uint8Array);
    }

    return Buffer.alloc(0);
  }

  /**
   * Delete a file from R2
   */
  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    await r2Client.send(command);
  }

  /**
   * Generate a presigned URL for secure uploads
   */
  async getPresignedUploadUrl(
    key: string,
    expiresIn: number = 3600
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return getSignedUrl(r2Client, command, { expiresIn });
  }

  /**
   * Get public URL for a file
   */
  getPublicUrl(key: string): string {
    return `${process.env.CLOUDFLARE_R2_ENDPOINT}/${this.bucket}/${key}`;
  }

  /**
   * Extract key from full URL
   */
  getKeyFromUrl(url: string): string {
    const baseUrl = `${process.env.CLOUDFLARE_R2_ENDPOINT}/${this.bucket}/`;
    return url.replace(baseUrl, '');
  }

  /**
   * Check if file exists
   */
  async fileExists(key: string): Promise<boolean> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });
      await r2Client.send(command);
      return true;
    } catch {
      return false;
    }
  }
}

// Export a singleton instance
export const r2 = new R2Service();
