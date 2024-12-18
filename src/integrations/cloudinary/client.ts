// Instead of using the Node.js SDK, we'll use the Upload Widget
export const CLOUDINARY_CLOUD_NAME = 'dxqnlqxa1';
export const CLOUDINARY_API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY;

export const getCloudinarySignature = async () => {
  const response = await fetch('/.netlify/functions/get-cloudinary-signature');
  return response.json();
};