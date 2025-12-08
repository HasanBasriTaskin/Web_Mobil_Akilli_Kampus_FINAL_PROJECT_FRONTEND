import api from './api';

export const authService = {
  // Login
  login: async (email, password) => {
    const response = await api.post('/Auth/login', { email, password });
    return response.data;
  },

  // Register
  register: async (data) => {
    const response = await api.post('/Auth/register', data);
    return response.data;
  },

  // Forgot Password
  forgotPassword: async (email) => {
    const response = await api.post('/Auth/forgot-password', { email });
    return response.data;
  },

  // Verify Email
  verifyEmail: async (userId, token) => {
    const response = await api.post(`/Auth/verify-email?userId=${encodeURIComponent(userId)}&token=${encodeURIComponent(token)}`);
    return response.data;
  },

  // Logout
  logout: async (refreshToken) => {
    // Backend expects { token: refreshToken } and returns 204 No Content
    // 204 No Content responses have no body, so we handle it specially
    try {
      const response = await api.post('/Auth/logout', { token: refreshToken });
      // If response has data, return it; otherwise return success indicator
      return response.data || { success: true };
    } catch (error) {
      // 204 No Content might not have response.data, which is fine
      if (error.response?.status === 204) {
        return { success: true };
      }
      throw error;
    }
  },
};

