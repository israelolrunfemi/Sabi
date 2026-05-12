import { env } from '../config/env.config';
import crypto from 'crypto';

export const uploadToCloudinary = async (
  imageBase64: string,
  mimeType: string,
  folder = 'sabi/buyer-requests'
): Promise<string | null> => {
  if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
    return null;
  }

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signaturePayload = `folder=${folder}&timestamp=${timestamp}${env.CLOUDINARY_API_SECRET}`;
  const signature = crypto.createHash('sha1').update(signaturePayload).digest('hex');
  const form = new FormData();

  form.append('file', `data:${mimeType};base64,${imageBase64}`);
  form.append('folder', folder);
  form.append('timestamp', timestamp);
  form.append('api_key', env.CLOUDINARY_API_KEY);
  form.append('signature', signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: form,
    }
  );

  if (!response.ok) {
    throw new Error(`Cloudinary upload failed with status ${response.status}`);
  }

  const result = (await response.json()) as { secure_url?: string };
  return result.secure_url ?? null;
};
