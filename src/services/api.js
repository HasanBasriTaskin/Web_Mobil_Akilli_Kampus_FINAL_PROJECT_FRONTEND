import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token to headers (except for public endpoints)
api.interceptors.request.use(
  (config) => {
    // Public endpoints that don't require authentication
    const publicEndpoints = [
      '/Auth/login',
      '/Auth/register',
      '/Auth/forgot-password',
      '/Auth/verify-email',
    ];
    
    // Check if this is a public endpoint
    const isPublicEndpoint = publicEndpoints.some(endpoint => 
      config.url?.includes(endpoint)
    );
    
    // Only add token if it's not a public endpoint
    if (!isPublicEndpoint) {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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
  const responseData = error.response?.data || {};
  
  // Handle backend response format (both camelCase and PascalCase)
  const errors = responseData?.errors || responseData?.Errors;
  if (errors && Array.isArray(errors) && errors.length > 0) {
    return errors[0];
  }
  
  const message = responseData?.error?.message || 
                  responseData?.Error?.Message || 
                  responseData?.message || 
                  responseData?.Message;

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

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Enhance error with user-friendly message
    error.userMessage = getErrorMessage(error);
    return Promise.reject(error);
  }
);

export default api;

