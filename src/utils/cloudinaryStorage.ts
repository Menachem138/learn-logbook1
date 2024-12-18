import { cloudinary } from '../integrations/cloudinary/client';

export const uploadToCloudinary = async (file: File, folder: string = 'content_library') => {
  try {
    // Convert the file to base64
    const base64Data = await readFileAsBase64(file);
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64Data, {
      folder,
      resource_type: "auto", // Automatically detect if it's an image or video
    });

    return {
      publicId: result.public_id,
      url: result.secure_url,
      resourceType: result.resource_type,
      format: result.format,
      size: result.bytes,
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

export const deleteFromCloudinary = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
};

const readFileAsBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};