import { CloudinaryResponse, CloudinaryData } from '@/types/cloudinary';
import { CLOUDINARY_CLOUD_NAME } from '../integrations/cloudinary/client';
import { supabase } from '@/integrations/supabase/client';

type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export const cloudinaryResponseToJson = (response: CloudinaryResponse | null): Json => {
  if (!response) return null;
  return {
    publicId: response.publicId,
    url: response.url,
    resourceType: response.resourceType,
    format: response.format,
    size: response.size,
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
    const errorText = await response.text();
    console.error('Cloudinary upload failed:', errorText);
    throw new Error(`Upload failed: ${errorText}`);
  }

  const data = await response.json();
  console.log('Cloudinary response:', data);
  
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
    console.log('Deleting from Cloudinary, public ID:', publicId);
    const { data, error } = await supabase.functions.invoke('delete-cloudinary-asset', {
      body: { publicId },
    });

    if (error) {
      console.error('Error deleting from Cloudinary:', error);
      throw error;
    }

    console.log('Cloudinary deletion response:', data);
    return data?.result === 'ok';
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
};