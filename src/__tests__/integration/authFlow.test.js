import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import axios from 'axios';
import App from '../../App';
import { AuthProvider } from '../../context/AuthContext';
import { ToastProvider } from '../../context/ToastContext';
import Login from '../../pages/Login';
import Register from '../../pages/Register';
import Dashboard from '../../pages/Dashboard';

const theme = createTheme();

// Mock axios
const mockAxiosInstance = {
  post: jest.fn(),
  get: jest.fn(),
  put: jest.fn(),
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() },
  },
};

jest.mock('axios', () => ({
  __esModule: true,
  default: {
    ...jest.requireActual('axios'),
    create: jest.fn(() => mockAxiosInstance),
    post: jest.fn(),
  },
}));

const renderWithProviders = (component, initialEntries = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <ThemeProvider theme={theme}>
        <ToastProvider>
          <AuthProvider>
            {component}
          </AuthProvider>
        </ThemeProvider>
      </ThemeProvider>
    </MemoryRouter>
  );
};

const renderApp = (initialEntries = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <ThemeProvider theme={theme}>
        <ToastProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ThemeProvider>
      </ThemeProvider>
    </MemoryRouter>
  );
};

describe('Auth Flow Integration Tests', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    jest.clearAllMocks();
    // Reset mock implementations
    mockAxiosInstance.post.mockClear();
    mockAxiosInstance.get.mockClear();
    mockAxiosInstance.put.mockClear();
    axios.post.mockClear();
  });

  describe('Registration Flow', () => {
    test('user can register and is redirected to login', async () => {
      const mockRegisterResponse = {
        data: {
          success: true,
          data: {
            message: 'Kayıt başarılı! Lütfen email adresinizi doğrulayın.',
            user: {
              id: 1,
              name: 'Test User',
              email: 'test@example.com',
              role: 'student',
            },
            accessToken: 'mock_access_token',
            refreshToken: 'mock_refresh_token',
          },
        },
      };

      mockAxiosInstance.post.mockResolvedValueOnce(mockRegisterResponse);

      renderWithProviders(<Register />, ['/register']);

      // Fill registration form
      fireEvent.change(screen.getByLabelText(/ad soyad/i), {
        target: { value: 'Test User' },
      });
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByLabelText(/şifre/i), {
        target: { value: 'Password123' },
      });
      fireEvent.change(screen.getByLabelText(/şifre tekrar/i), {
        target: { value: 'Password123' },
      });

      // Select user type
      const userTypeSelect = screen.getByLabelText(/kullanıcı tipi/i);
      fireEvent.mouseDown(userTypeSelect);
      fireEvent.click(screen.getByText('Öğrenci'));

      await waitFor(() => {
        expect(screen.getByLabelText(/öğrenci numarası/i)).toBeInTheDocument();
      });

      fireEvent.change(screen.getByLabelText(/öğrenci numarası/i), {
        target: { value: '12345' },
      });

      // Select department
      const departmentSelect = screen.getByLabelText(/bölüm/i);
      fireEvent.mouseDown(departmentSelect);
      fireEvent.click(screen.getByText('Bilgisayar Mühendisliği'));

      // Accept terms
      const termsCheckbox = screen.getByLabelText(/kullanım şartlarını kabul ediyorum/i);
      fireEvent.click(termsCheckbox);

      // Submit form
      const submitButton = screen.getByRole('button', { name: /kayıt ol/i });
      fireEvent.click(submitButton);

      // Wait for redirect to login
      await waitFor(() => {
        expect(screen.getByText(/giriş yap/i)).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('Login Flow', () => {
    test('user can login and is redirected to dashboard', async () => {
      const mockLoginResponse = {
        data: {
          success: true,
          data: {
            user: {
              id: 1,
              name: 'Test User',
              email: 'test@example.com',
              role: 'student',
            },
            accessToken: 'mock_access_token',
            refreshToken: 'mock_refresh_token',
          },
        },
      };

      mockAxiosInstance.post.mockResolvedValueOnce(mockLoginResponse);

      renderApp(['/login']);

      // Fill login form
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/şifre/i);

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'Password123' } });

      // Submit form
      const submitButton = screen.getByRole('button', { name: /giriş yap/i });
      fireEvent.click(submitButton);

      // Wait for redirect to dashboard
      await waitFor(() => {
        expect(screen.getByText(/hoş geldiniz/i)).toBeInTheDocument();
      }, { timeout: 3000 });

      // Verify tokens are stored
      expect(localStorage.getItem('accessToken')).toBe('mock_access_token');
      expect(localStorage.getItem('refreshToken')).toBe('mock_refresh_token');
    });

    test('login fails with invalid credentials', async () => {
      const mockErrorResponse = {
        response: {
          status: 401,
          data: {
            success: false,
            error: {
              message: 'Email veya şifre hatalı',
            },
          },
        },
      };

      mockAxiosInstance.post.mockRejectedValueOnce(mockErrorResponse);

      renderWithProviders(<Login />, ['/login']);

      // Fill login form
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'wrong@example.com' },
      });
      fireEvent.change(screen.getByLabelText(/şifre/i), {
        target: { value: 'wrongpassword' },
      });

      // Submit form
      const submitButton = screen.getByRole('button', { name: /giriş yap/i });
      fireEvent.click(submitButton);

      // Wait for error message
      await waitFor(() => {
        expect(screen.getByText(/email veya şifre hatalı/i)).toBeInTheDocument();
      });

      // Verify user is still on login page
      expect(screen.getByText('Giriş Yap')).toBeInTheDocument();
    });
  });

  describe('Protected Routes', () => {
    test('unauthenticated user is redirected to login when accessing dashboard', async () => {
      renderApp(['/dashboard']);

      // Should redirect to login
      await waitFor(() => {
        expect(screen.getByText('Giriş Yap')).toBeInTheDocument();
      });
    });

    test('authenticated user can access dashboard', async () => {
      // Set up authenticated state
      localStorage.setItem('accessToken', 'mock_token');
      localStorage.setItem('refreshToken', 'mock_refresh_token');
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
          role: 'student',
        })
      );

      const mockUserResponse = {
        data: {
          success: true,
          data: {
            id: 1,
            name: 'Test User',
            email: 'test@example.com',
            role: 'student',
          },
        },
      };

      mockAxiosInstance.get.mockResolvedValueOnce(mockUserResponse);

      renderApp(['/dashboard']);

      // Should show dashboard
      await waitFor(() => {
        expect(screen.getByText(/hoş geldiniz/i)).toBeInTheDocument();
      });
    });
  });

  describe('Logout Flow', () => {
    test('user can logout and is redirected to login', async () => {
      // Set up authenticated state
      localStorage.setItem('accessToken', 'mock_token');
      localStorage.setItem('refreshToken', 'mock_refresh_token');
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
          role: 'student',
        })
      );

      const mockLogoutResponse = {
        data: {
          success: true,
          message: 'Çıkış başarılı',
        },
      };

      mockAxiosInstance.post.mockResolvedValueOnce(mockLogoutResponse);

      renderApp(['/dashboard']);

      // Wait for dashboard to load
      await waitFor(() => {
        expect(screen.getByText(/hoş geldiniz/i)).toBeInTheDocument();
      });

      // Click on user menu (IconButton with AccountCircle)
      const userMenuButtons = screen.getAllByRole('button');
      const userMenuButton = userMenuButtons.find(
        (button) => button.querySelector('svg') !== null
      );
      
      if (userMenuButton) {
        fireEvent.click(userMenuButton);

        // Wait for menu to open and click logout
        await waitFor(() => {
          const logoutButton = screen.getByText(/çıkış yap/i);
          fireEvent.click(logoutButton);
        });
      }

      // Wait for redirect to login
      await waitFor(() => {
        expect(screen.getByText('Giriş Yap')).toBeInTheDocument();
      });

      // Verify tokens are removed
      expect(localStorage.getItem('accessToken')).toBeNull();
      expect(localStorage.getItem('refreshToken')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });
  });

  describe('Token Refresh Flow', () => {
    test('token is refreshed when access token expires', async () => {
      // Set up authenticated state
      localStorage.setItem('accessToken', 'expired_token');
      localStorage.setItem('refreshToken', 'valid_refresh_token');
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
          role: 'student',
        })
      );

      // First request fails with 401
      const mock401Error = {
        response: {
          status: 401,
        },
        config: {
          _retry: false,
        },
      };

      // Refresh token succeeds
      const mockRefreshResponse = {
        data: {
          success: true,
          data: {
            accessToken: 'new_access_token',
          },
        },
      };

      // Second request succeeds with new token
      const mockUserResponse = {
        data: {
          success: true,
          data: {
            id: 1,
            name: 'Test User',
            email: 'test@example.com',
            role: 'student',
          },
        },
      };

      mockAxiosInstance.get
        .mockRejectedValueOnce(mock401Error)
        .mockResolvedValueOnce(mockRefreshResponse)
        .mockResolvedValueOnce(mockUserResponse);

      mockAxiosInstance.post.mockResolvedValueOnce(mockRefreshResponse);
      axios.post.mockResolvedValueOnce(mockRefreshResponse);

      renderApp(['/dashboard']);

      // Should eventually show dashboard after token refresh
      await waitFor(() => {
        expect(localStorage.getItem('accessToken')).toBe('new_access_token');
      }, { timeout: 3000 });
    });
  });

  describe('Email Verification Flow', () => {
    test('user can verify email and is redirected to login', async () => {
      const mockVerifyResponse = {
        data: {
          success: true,
          message: 'Email başarıyla doğrulandı',
        },
      };

      mockAxiosInstance.post.mockResolvedValueOnce(mockVerifyResponse);

      renderApp(['/verify-email/test-token']);

      // Wait for verification
      await waitFor(() => {
        expect(screen.getByText(/email doğrulandı/i)).toBeInTheDocument();
      });

      // Should redirect to login after 3 seconds
      await waitFor(() => {
        expect(screen.getByText('Giriş Yap')).toBeInTheDocument();
      }, { timeout: 4000 });
    });
  });

  describe('Password Reset Flow', () => {
    test('user can reset password and is redirected to login', async () => {
      const mockResetResponse = {
        data: {
          success: true,
          message: 'Şifre başarıyla sıfırlandı',
        },
      };

      mockAxiosInstance.post.mockResolvedValueOnce(mockResetResponse);

      renderApp(['/reset-password/test-token']);

      // Fill password reset form
      fireEvent.change(screen.getByLabelText(/yeni şifre/i), {
        target: { value: 'NewPassword123' },
      });
      fireEvent.change(screen.getByLabelText(/yeni şifre tekrar/i), {
        target: { value: 'NewPassword123' },
      });

      // Submit form
      const submitButton = screen.getByRole('button', { name: /şifreyi değiştir/i });
      fireEvent.click(submitButton);

      // Wait for success message
      await waitFor(() => {
        expect(screen.getByText(/şifre başarıyla değiştirildi/i)).toBeInTheDocument();
      });

      // Should redirect to login after 2 seconds
      await waitFor(() => {
        expect(screen.getByText('Giriş Yap')).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('Forgot Password Flow', () => {
    test('user can request password reset', async () => {
      const mockForgotPasswordResponse = {
        data: {
          success: true,
          message: 'Şifre sıfırlama linki email adresinize gönderildi',
        },
      };

      mockAxiosInstance.post.mockResolvedValueOnce(mockForgotPasswordResponse);

      renderApp(['/forgot-password']);

      // Fill email
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' },
      });

      // Submit form
      const submitButton = screen.getByRole('button', { name: /gönder/i });
      fireEvent.click(submitButton);

      // Wait for success message
      await waitFor(() => {
        expect(screen.getByText(/email gönderildi/i)).toBeInTheDocument();
      });
    });
  });
});

