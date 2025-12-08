import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper function to get user-friendly error message
const getErrorMessage = (error) => {
  // Network error (backend not running or connection refused)
  if (!error.response) {
    if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
      return 'Backend sunucusuna bağlanılamıyor. Lütfen backend sunucusunun çalıştığından emin olun.';
    }
    if (error.code === 'ETIMEDOUT' || error.message.includes('timeout')) {
      return 'Sunucuya bağlanırken zaman aşımı oluştu. Lütfen tekrar deneyin.';
    }
    return 'Sunucuya bağlanılamıyor. Lütfen internet bağlantınızı kontrol edin.';
  }

  // HTTP error responses
  const status = error.response.status;
  const message = error.response?.data?.error?.message || error.response?.data?.message;

  if (message) {
    return message;
  }

  // Default messages for common status codes
  switch (status) {
    case 400:
      return 'Geçersiz istek. Lütfen bilgilerinizi kontrol edin.';
    case 401:
      return 'Giriş yapmanız gerekiyor.';
    case 403:
      return 'Bu işlem için yetkiniz yok.';
    case 404:
      return 'İstenen kaynak bulunamadı.';
    case 500:
      return 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.';
    default:
      return 'Bir hata oluştu. Lütfen tekrar deneyin.';
  }
};

// Response interceptor - Handle token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
          refreshToken,
        });

        const { accessToken } = response.data.data;
        localStorage.setItem('accessToken', accessToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Enhance error with user-friendly message
    error.userMessage = getErrorMessage(error);
    return Promise.reject(error);
  }
);

export default api;

