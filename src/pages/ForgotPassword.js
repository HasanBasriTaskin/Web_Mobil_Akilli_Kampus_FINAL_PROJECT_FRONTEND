import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Link as MuiLink,
} from '@mui/material';
import { authService } from '../services/authService';
import { useToast } from '../context/ToastContext';
import TextInput from '../components/TextInput';

const schema = yup.object({
  email: yup.string().email('Geçerli bir email giriniz').required('Email zorunludur'),
});

const ForgotPassword = () => {
  const { showToast } = useToast();
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      await authService.forgotPassword(data.email);
      setIsSubmitted(true);
      showToast('Şifre sıfırlama linki email adresinize gönderildi', 'success');
    } catch (error) {
      const message =
        error.response?.data?.error?.message || 'Bir hata oluştu!';
      showToast(message, 'error');
    }
  };

  if (isSubmitted) {
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
            <Typography variant="h5" gutterBottom>
              Email Gönderildi
            </Typography>
            <Typography variant="body1" sx={{ mt: 2, mb: 3 }}>
              Şifre sıfırlama linki email adresinize gönderildi. Lütfen email
              kutunuzu kontrol edin.
            </Typography>
            <Button component={Link} to="/login" variant="contained" fullWidth>
              Giriş Sayfasına Dön
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
            Şifremi Unuttum
          </Typography>
          <Typography variant="body2" align="center" sx={{ mb: 3, mt: 2 }}>
            Email adresinizi girin, size şifre sıfırlama linki gönderelim.
          </Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <TextInput
              control={control}
              name="email"
              label="Email"
              type="email"
              autoComplete="email"
              autoFocus
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Gönderiliyor...' : 'Gönder'}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <MuiLink component={Link} to="/login" variant="body2">
                Giriş sayfasına dön
              </MuiLink>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ForgotPassword;

