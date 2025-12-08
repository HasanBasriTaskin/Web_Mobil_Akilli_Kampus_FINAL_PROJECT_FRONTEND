import api from './api';

export const authService = {
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
};

