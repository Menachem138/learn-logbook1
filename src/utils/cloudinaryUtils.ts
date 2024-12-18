import { CloudinaryResponse, CloudinaryData } from '@/types/cloudinary';
import { Json } from '@/integrations/supabase/types';
import { CLOUDINARY_CLOUD_NAME } from '../integrations/cloudinary/client';

export const cloudinaryResponseToJson = (response: CloudinaryResponse | null): Json => {
  if (!response) return null;
  return {
    publicId: response.publicId,
    url: response.url,
    resourceType: response.resourceType,
    format: response.format,
    size: response.size,
  } as Json;
};

export const jsonToCloudinaryResponse = (json: Json): CloudinaryResponse | null => {
  if (!json || typeof json !== 'object') return null;
  const data = json as Record<string, any>;
  return {
    publicId: data.publicId,
    url: data.url,
    resourceType: data.resourceType,
    format: data.format,
    size: data.size,
  };
};

export const uploadToCloudinary = async (file: File): Promise<CloudinaryResponse> => {
  console.log('Uploading to Cloudinary with cloud name:', CLOUDINARY_CLOUD_NAME);
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'content_library');

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    console.error('Cloudinary upload failed:', await response.text());
    throw new Error('Upload failed');
  }

  const data = await response.json();
  
  return {
    publicId: data.public_id,
    url: data.secure_url,
    resourceType: data.resource_type,
    format: data.format,
    size: data.bytes,
  };
};

export const deleteFromCloudinary = async (publicId: string): Promise<boolean> => {
  try {
    const response = await fetch('/.netlify/functions/delete-cloudinary-asset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicId }),
    });

    if (!response.ok) {
      throw new Error('Delete failed');
    }

    const result = await response.json();
    return result.result === 'ok';
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
};