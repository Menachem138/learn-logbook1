import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { cloudinary } from '../config/cloudinary';
import { CLOUDINARY_CLOUD_NAME } from '../config/cloudinary';

export interface MediaResponse {
  publicId: string;
  url: string;
  resourceType: string;
  format: string;
  size: number;
}

export const pickImage = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
  if (status !== 'granted') {
    throw new Error('Permission to access media library was denied');
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  if (!result.canceled) {
    return result.assets[0];
  }
  
  return null;
};

export const uploadToCloudinary = async (uri: string): Promise<MediaResponse> => {
  try {
    const formData = new FormData();
    
    // Create file object from uri
    const filename = uri.split('/').pop() || 'image';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image';
    
    formData.append('file', {
      uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
      type,
      name: filename,
    } as any);
    
    formData.append('upload_preset', 'content_library');
    formData.append('folder', 'mobile_uploads');

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (!response.ok) {
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
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};
