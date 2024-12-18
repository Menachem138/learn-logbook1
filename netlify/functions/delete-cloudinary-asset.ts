import { Handler } from '@netlify/functions';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.VITE_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.VITE_CLOUDINARY_API_KEY,
  api_secret: process.env.VITE_CLOUDINARY_API_SECRET,
});

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  try {
    const { publicId } = JSON.parse(event.body || '{}');
    
    if (!publicId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Public ID is required' }),
      };
    }

    const result = await cloudinary.uploader.destroy(publicId);

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error('Error deleting asset:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to delete asset' }),
    };
  }
};