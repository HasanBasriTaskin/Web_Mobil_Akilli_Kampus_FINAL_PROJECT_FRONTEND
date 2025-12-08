import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/authService';
import { useToast } from './ToastContext';

// JWT decode helper
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

// Initial state
const getInitialState = () => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  let user = null;

  if (accessToken) {
    const decoded = decodeJWT(accessToken);
    if (decoded) {
      user = {
        id: decoded.sub,
        email: decoded.email,
        fullName: decoded.FullName || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || '',
        roles: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || [],
      };
    }
  }

  return {
    user,
    accessToken,
    refreshToken,
    isLoading: false,
    isAuthenticated: !!accessToken,
  };
};

// Action types
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        isLoading: false,
      };
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Auth Provider
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, getInitialState());
  const { showToast } = useToast();

  // Load user from localStorage on mount
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken && !state.user) {
      const decoded = decodeJWT(accessToken);
      if (decoded) {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: {
            user: {
              id: decoded.sub,
              email: decoded.email,
              fullName: decoded.FullName || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || '',
              roles: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || [],
            },
            accessToken,
            refreshToken: localStorage.getItem('refreshToken'),
          },
        });
      }
    }
  }, []);

  const login = async (email, password) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

      const response = await authService.login(email, password);

      // Backend response format kontrolü
      console.log('Login response (full):', JSON.stringify(response, null, 2));
      console.log('Login response.isSuccessful:', response?.isSuccessful);
      console.log('Login response.IsSuccessful:', response?.IsSuccessful);
      console.log('Login response.payload:', response?.payload);
      console.log('Login response.Payload:', response?.Payload);
      console.log('Login response.data:', response?.data);
      console.log('Login response.Data:', response?.Data);

      // Backend response format: { IsSuccessful: true/false, Data: {...}, Errors: [...] }
      const isSuccessful = response?.isSuccessful || response?.IsSuccessful || false;
      const payload = response?.payload || response?.Payload || response?.data || response?.Data;

      if (isSuccessful && payload) {
        const { accessToken, refreshToken } = payload;

        // Decode JWT to get user info
        const decoded = decodeJWT(accessToken);
        const user = decoded
          ? {
              id: decoded.sub,
              email: decoded.email,
              fullName: decoded.FullName || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || '',
              roles: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || [],
            }
          : null;

        // Save tokens to localStorage
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user, accessToken, refreshToken },
        });

        showToast('Giriş başarılı!', 'success');
        return { success: true, user };
      } else {
        // Backend'den gelen hata mesajını detaylı logla
        console.error('Login error response (full):', JSON.stringify(response, null, 2));
        console.error('Login error response keys:', Object.keys(response || {}));
        console.error('Login error response.isSuccessful:', response?.isSuccessful);
        console.error('Login error response.errors:', response?.errors);
        console.error('Login error response.Errors:', response?.Errors);
        console.error('Login error response.message:', response?.message);
        console.error('Login error response.Message:', response?.Message);
        
        // Backend'den gelen hata mesajını göster (tüm olası formatları kontrol et)
        const errorMessage = 
          response?.errors?.[0] ||
          response?.Errors?.[0] ||
          (Array.isArray(response?.errors) && response.errors.length > 0 ? response.errors[0] : null) ||
          (Array.isArray(response?.Errors) && response.Errors.length > 0 ? response.Errors[0] : null) ||
          response?.message ||
          response?.Message ||
          response?.error?.message ||
          response?.Error?.Message ||
          'Giriş başarısız';
        
        console.error('Login error message (final):', errorMessage);
        
        // Email doğrulanmamış kontrolü
        const isEmailNotVerified = errorMessage.includes('aktif değil') || errorMessage.includes('doğrulayın');
        
        showToast(errorMessage, 'error');
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        return { 
          success: false, 
          error: errorMessage,
          requiresEmailVerification: isEmailNotVerified
        };
      }
    } catch (error) {
      console.error('Login catch error:', error);
      console.error('Error response data:', error.response?.data);
      
      // Backend response format: {data: null, isSuccessful: false, errors: Array(1)}
      const errorData = error.response?.data;
      const errorMessage =
        errorData?.errors?.[0] ||
        errorData?.Errors?.[0] ||
        errorData?.message ||
        errorData?.error?.message ||
        error.userMessage ||
        'Giriş yapılırken bir hata oluştu';
      
      showToast(errorMessage, 'error');
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      
      // Email doğrulanmamışsa özel bir flag döndür
      const isEmailNotVerified = errorMessage.includes('aktif değil') || errorMessage.includes('doğrulayın');
      return { 
        success: false, 
        error: errorMessage,
        requiresEmailVerification: isEmailNotVerified
      };
    }
  };

  const logout = async () => {
    try {
      const refreshToken = state.refreshToken || localStorage.getItem('refreshToken');
      
      // Call logout API to invalidate refresh token
      if (refreshToken) {
        try {
          await authService.logout(refreshToken);
        } catch (error) {
          // Even if API call fails, continue with local logout
          console.error('Logout API error:', error);
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage and state
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      showToast('Çıkış yapıldı', 'success');
    }
  };

  const value = {
    ...state,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

