// Get the full URL for an image, handling both relative paths and full URLs
export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a relative path starting with /uploads, prepend the API base URL
  if (imagePath.startsWith('/uploads')) {
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    // Remove /api from the end if it exists
    const baseUrl = apiBaseUrl.replace(/\/api$/, '');
    return `${baseUrl}${imagePath}`;
  }
  
  // Otherwise return as is
  return imagePath;
};