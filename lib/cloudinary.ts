/**
 * Cloudinary image upload utility
 */

interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
}

export async function uploadImageToCloudinary(
  file: File,
  folder: string = 'chello-yaku/rooms'
): Promise<CloudinaryUploadResponse> {
  // Check if Cloudinary is configured
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
    throw new Error('Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME and CLOUDINARY_API_KEY environment variables.');
  }

  // Create FormData for Cloudinary
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);
  
  // Use unsigned upload if no upload preset is configured
  if (process.env.CLOUDINARY_UPLOAD_PRESET) {
    formData.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET);
  }

  // Upload to Cloudinary
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Cloudinary API Error:', errorText);
    console.error('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
    console.error('API Key provided:', process.env.CLOUDINARY_API_KEY ? 'Yes' : 'No');
    throw new Error(`Cloudinary upload failed (${response.status}): ${errorText}`);
  }

  const result = await response.json() as CloudinaryUploadResponse;
  
  return result;
}

export function getCloudinaryConfig() {
  return {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    isConfigured: !!(process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_API_KEY),
  };
}
