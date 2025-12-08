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
};

