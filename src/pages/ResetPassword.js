import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  const { token } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);

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
    try {
      await authService.resetPassword(token, data.password);
      setIsSuccess(true);
      showToast('Şifreniz başarıyla değiştirildi', 'success');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      const message =
        error.response?.data?.error?.message || 'Şifre sıfırlama başarısız!';
      showToast(message, 'error');
    }
  };

  if (isSuccess) {
    return (
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Paper elevation={3} sx={{ p: 4, width: '100%', textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom color="success.main">
              Şifre Başarıyla Değiştirildi
            </Typography>
            <Typography variant="body1" sx={{ mt: 2, mb: 3 }}>
              Yeni şifrenizle giriş yapabilirsiniz. 2 saniye içinde giriş
              sayfasına yönlendirileceksiniz...
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/login')}
              fullWidth
            >
              Giriş Sayfasına Git
            </Button>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Şifre Sıfırla
          </Typography>
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
              sx={{ mt: 3, mb: 2 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Kaydediliyor...' : 'Şifreyi Değiştir'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ResetPassword;

