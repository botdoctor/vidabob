import api from './api';

export const uploadService = {
  // Upload single image
  async uploadSingle(file: File): Promise<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await api.post<{
      message: string;
      url: string;
      filename: string;
      originalName: string;
      size: number;
    }>('/upload/single', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return {
      url: response.data.url,
      filename: response.data.filename,
    };
  },

  // Upload multiple images
  async uploadMultiple(files: File[]): Promise<Array<{ url: string; filename: string }>> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });
    
    const response = await api.post<{
      message: string;
      files: Array<{
        url: string;
        filename: string;
        originalName: string;
        size: number;
      }>;
    }>('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.files.map(file => ({
      url: file.url,
      filename: file.filename,
    }));
  },
};