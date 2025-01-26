import { Cloudinary } from '@cloudinary/url-gen';

export const CLOUDINARY_CLOUD_NAME = 'dxrl4mtlw';

export const cloudinary = new Cloudinary({
  cloud: {
    cloudName: CLOUDINARY_CLOUD_NAME
  }
});
