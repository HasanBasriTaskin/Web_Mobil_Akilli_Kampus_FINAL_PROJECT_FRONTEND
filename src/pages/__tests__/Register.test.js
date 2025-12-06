import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Register from '../Register';
import { ToastProvider } from '../../context/ToastContext';

const theme = createTheme();

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <ToastProvider>
          {component}
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('Register Component', () => {
  test('renders register form', () => {
    renderWithProviders(<Register />);
    
    expect(screen.getByText('Kayıt Ol')).toBeInTheDocument();
    expect(screen.getByLabelText(/ad soyad/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/kullanıcı tipi/i)).toBeInTheDocument();
  });

  test('shows student number field when student is selected', async () => {
    renderWithProviders(<Register />);
    
    const userTypeSelect = screen.getByLabelText(/kullanıcı tipi/i);
    
    fireEvent.mouseDown(userTypeSelect);
    const studentOption = screen.getByText('Öğrenci');
    fireEvent.click(studentOption);

    await waitFor(() => {
      expect(screen.getByLabelText(/öğrenci numarası/i)).toBeInTheDocument();
    });
  });

  test('shows validation errors for empty required fields', async () => {
    renderWithProviders(<Register />);
    
    const submitButton = screen.getByRole('button', { name: /kayıt ol/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/ad soyad zorunludur/i)).toBeInTheDocument();
      expect(screen.getByText(/email zorunludur/i)).toBeInTheDocument();
    });
  });

  test('validates password requirements', async () => {
    renderWithProviders(<Register />);
    
    const passwordInput = screen.getByLabelText(/şifre/i);
    const submitButton = screen.getByRole('button', { name: /kayıt ol/i });

    fireEvent.change(passwordInput, { target: { value: 'short' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/şifre en az 8 karakter olmalıdır/i)).toBeInTheDocument();
    });
  });

  test('validates password match', async () => {
    renderWithProviders(<Register />);
    
    const passwordInput = screen.getByLabelText(/şifre/i);
    const confirmPasswordInput = screen.getByLabelText(/şifre tekrar/i);
    const submitButton = screen.getByRole('button', { name: /kayıt ol/i });

    fireEvent.change(passwordInput, { target: { value: 'Password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'Password456' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/şifreler eşleşmiyor/i)).toBeInTheDocument();
    });
  });

  test('requires terms and conditions acceptance', async () => {
    renderWithProviders(<Register />);
    
    const nameInput = screen.getByLabelText(/ad soyad/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/şifre/i);
    const confirmPasswordInput = screen.getByLabelText(/şifre tekrar/i);
    const submitButton = screen.getByRole('button', { name: /kayıt ol/i });

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'Password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/kullanım şartlarını kabul etmelisiniz/i)).toBeInTheDocument();
    });
  });
});

