import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { parse } from 'csv-parse/sync';
import multer from 'multer';

const s3AccessKey = process.env.S3_ACCESS_KEY as string;
const s3SecretKey = process.env.S3_SECRET_KEY as string;
const bucketName = process.env.BUCKET_NAME as string;
const bucketRegion = process.env.BUCKET_REGION as string;

const s3 = new S3Client({
  credentials: {
    accessKeyId: s3AccessKey,
    secretAccessKey: s3SecretKey,
  },
  region: bucketRegion,
});

export const upload = multer({
  storage: multer.memoryStorage(),
});

export const getURLFromS3 = async (getObjectParams: { Key: string }) => {
  const command = new GetObjectCommand({
    ...getObjectParams,
    Bucket: bucketName,
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

  return url;
};

export const getCSVFromS3 = async (getObjectParams: { Key: string }) => {
  try {
    const command = new GetObjectCommand({
      ...getObjectParams,
      Bucket: bucketName,
    });

    const response = await s3.send(command);

    if (!response.Body) {
      throw new Error('Response body is undefined');
    }

    const stringData = await response.Body.transformToString();

    if (!stringData) {
      throw new Error('Failed to transform body to string');
    }

    const records = parse(stringData, {
      columns: true,
      skip_empty_lines: true,
    });

    return records;
  } catch (error) {
    console.error('Error fetching file from S3:', error);
    throw error;
  }
};

export const uploadFileToS3 = async (uploadObjectParams: {
  Key: string;
  Body: Buffer;
  ContentType: string;
}) => {
  const command = new PutObjectCommand({
    ...uploadObjectParams,
    Bucket: bucketName,
  });

  await s3.send(command);

  return;
};

export const deleteFileFromS3 = async (deleteObjectParams: { Key: string }) => {
  const command = new DeleteObjectCommand({
    ...deleteObjectParams,
    Bucket: bucketName,
  });

  await s3.send(command);

  return;
};
