import api from './api';

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: string;
  updatedAt: string;
}

export const contactService = {
  // Submit contact form
  async submitContact(data: ContactFormData): Promise<{ success: boolean; message: string }> {
    const response = await api.post<{ success: boolean; message: string }>('/contacts', data);
    return response.data;
  },

  // Get all contacts (admin only)
  async getAllContacts(params?: { status?: string; search?: string }): Promise<ContactMessage[]> {
    const response = await api.get<{ contacts: ContactMessage[] }>('/contacts', { params });
    return response.data.contacts;
  },

  // Get single contact (admin only)
  async getContactById(id: string): Promise<ContactMessage> {
    const response = await api.get<{ contact: ContactMessage }>(`/contacts/${id}`);
    return response.data.contact;
  },

  // Update contact status (admin only)
  async updateContactStatus(id: string, status: 'new' | 'read' | 'replied'): Promise<ContactMessage> {
    const response = await api.patch<{ contact: ContactMessage }>(`/contacts/${id}/status`, { status });
    return response.data.contact;
  },

  // Delete contact (admin only)
  async deleteContact(id: string): Promise<void> {
    await api.delete(`/contacts/${id}`);
  }
};