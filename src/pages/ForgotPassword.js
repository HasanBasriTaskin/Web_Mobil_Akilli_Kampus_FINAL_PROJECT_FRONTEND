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
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2,
                }}
              >
                ✓ Email Gönderildi
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 2, mb: 4 }}>
                Şifre sıfırlama linki email adresinize gönderildi. Lütfen email
                kutunuzu kontrol edin.
              </Typography>
              <Button
                component={Link}
                to="/login"
                variant="contained"
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
                Giriş Sayfasına Dön
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
        '&::before': {
          content: '""',
          position: 'absolute',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          animation: 'float 20s infinite linear',
          '@keyframes float': {
            '0%': { transform: 'translate(0, 0)' },
            '100%': { transform: 'translate(50px, 50px)' },
          },
        },
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
                Şifremi Unuttum
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Email adresinizi girin, size şifre sıfırlama linki gönderelim.
              </Typography>
            </Box>
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
                {isSubmitting ? 'Gönderiliyor...' : 'Gönder'}
              </Button>
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <MuiLink
                  component={Link}
                  to="/login"
                  variant="body2"
                  sx={{
                    color: '#ff6b35',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                      color: '#004e89',
                    },
                  }}
                >
                  Giriş sayfasına dön
                </MuiLink>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default ForgotPassword;

