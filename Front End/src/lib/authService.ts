import api from './api';

export interface User {
  id: string;
  email?: string;
  username: string;
  role: 'admin' | 'reseller';
  commissionRate?: number;
  createdAt: string;
}

export interface LoginCredentials {
  username?: string;
  email?: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  // Login user with optional role specification
  async login(credentials: LoginCredentials, expectedRole?: 'admin' | 'reseller'): Promise<AuthResponse> {
    const loginData = expectedRole 
      ? { ...credentials, role: expectedRole }
      : credentials;
    
    console.log('authService.login sending:', loginData);
    
    const response = await api.post<any>('/auth/login', loginData);
    
    // Verify role if specified
    if (expectedRole && response.data.user.role !== expectedRole) {
      throw new Error(`Access denied. This login is for ${expectedRole}s only.`);
    }
    
    // The token is set as an HTTP-only cookie by the server
    // We just return the user data
    return {
      user: response.data.user,
      token: 'cookie' // Placeholder since token is in HTTP-only cookie
    };
  },

  // Logout user
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error);
    }
  },

  // Get current user
  async getCurrentUser(): Promise<User> {
    const response = await api.get<{ user: User }>('/auth/me');
    return response.data.user;
  },

  // Check if user is authenticated by trying to get current user
  async isAuthenticated(): Promise<boolean> {
    try {
      await this.getCurrentUser();
      return true;
    } catch {
      return false;
    }
  },

  // Get stored token (not applicable with HTTP-only cookies)
  getToken(): string | null {
    return null; // Not accessible with HTTP-only cookies
  }
};