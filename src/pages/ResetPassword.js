import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { authService } from '../services/authService';
import { useToast } from '../context/ToastContext';
import TextInput from '../components/TextInput';

const schema = yup.object({
  password: yup
    .string()
    .min(8, 'Şifre en az 8 karakter olmalıdır')
    .matches(/[A-Z]/, 'Şifre en az bir büyük harf içermelidir')
    .matches(/[0-9]/, 'Şifre en az bir rakam içermelidir')
    .required('Şifre zorunludur'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Şifreler eşleşmiyor')
    .required('Şifre tekrarı zorunludur'),
});

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);

  const email = searchParams.get('email');
  const token = searchParams.get('token');

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data) => {
    if (!email || !token) {
      showToast('Geçersiz şifre sıfırlama linki! Email veya token eksik.', 'error');
      return;
    }

    try {
      const response = await authService.resetPassword(email, token, data.password, data.confirmPassword);
      
      // Backend response format: { data, isSuccessful, errors }
      if (response?.isSuccessful || response?.IsSuccessful) {
      setIsSuccess(true);
      showToast('Şifreniz başarıyla değiştirildi', 'success');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      } else {
        const errorMessage = response?.errors?.[0] || response?.Errors?.[0] || 'Şifre sıfırlama başarısız!';
        throw new Error(errorMessage);
      }
    } catch (error) {
      const responseData = error.response?.data || {};
      const message =
        error.userMessage ||
        responseData?.errors?.[0] ||
        responseData?.Errors?.[0] ||
        responseData?.error?.message ||
        responseData?.message ||
        error.message ||
        'Şifre sıfırlama başarısız!';
      showToast(message, 'error');
    }
  };

  if (isSuccess) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 30%, #004e89 70%, #1a6ba3 100%)',
        }}
      >
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Paper
              elevation={24}
              sx={{
                p: 5,
                width: '100%',
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: 4,
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #06a77d 0%, #2dd4bf 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2,
                }}
              >
                ✓ Şifre Başarıyla Değiştirildi
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 2, mb: 4 }}>
                Yeni şifrenizle giriş yapabilirsiniz. 2 saniye içinde giriş
                sayfasına yönlendirileceksiniz...
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/login')}
                fullWidth
                size="large"
                sx={{
                  py: 1.5,
                  fontSize: '1.1rem',
                  background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #004e89 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #e55a2b 0%, #e0841a 50%, #003d6b 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 10px 20px rgba(255, 107, 53, 0.4)',
                  },
                }}
              >
                Giriş Sayfasına Git
              </Button>
            </Paper>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 30%, #004e89 70%, #1a6ba3 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container component="main" maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Paper
            elevation={24}
            sx={{
              p: 5,
              width: '100%',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 4,
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography
                component="h1"
                variant="h4"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #ff6b35 0%, #004e89 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                }}
              >
                Şifre Sıfırla
              </Typography>
            </Box>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
              <TextInput
                control={control}
                name="password"
                label="Yeni Şifre"
                type="password"
                autoComplete="new-password"
                autoFocus
              />
              <TextInput
                control={control}
                name="confirmPassword"
                label="Yeni Şifre Tekrar"
                type="password"
                autoComplete="new-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  mt: 4,
                  mb: 2,
                  py: 1.5,
                  fontSize: '1.1rem',
                  background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #004e89 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #e55a2b 0%, #e0841a 50%, #003d6b 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 10px 20px rgba(255, 107, 53, 0.4)',
                  },
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Kaydediliyor...' : 'Şifreyi Değiştir'}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default ResetPassword;

