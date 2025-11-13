/* eslint-disable */
import axios from 'axios';
import { post } from './api';
import { endpoints } from './endpoints';

interface PresignResponse {
  signedRequest: string;
  url: string;
}

/**
 * Get a pre-signed URL from your backend
 */
export const getPresignedUrl = async (
  eventId: number,
  fileName: string,
  fileType: string,
): Promise<PresignResponse> => {
  const data = await post<PresignResponse>(`${endpoints.s3}/signature`, {
    eventId,
    fileName,
    fileType,
  });
  return data;
};

export const uploadFileToS3 = async (file: File, eventId: number): Promise<string> => {
  try {
    const presign = await getPresignedUrl(eventId, file.name, file.type);
    const uploadUrl = presign.signedRequest;

    console.log('Uploading file:', {
      name: file.name,
      type: file.type,
      size: file.size,
      uploadUrl,
    });

    const res = await axios.put(uploadUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
      maxBodyLength: Infinity,
    });

    console.log('S3 upload success:', res.status, res.statusText);
    return presign.url;
  } catch (error: any) {
    console.error('S3 upload error:', {
      message: error.message,
      config: error.config,
      code: error.code,
      response: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};
