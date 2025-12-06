import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  CircularProgress,
} from '@mui/material';
import { authService } from '../services/authService';
import { useToast } from '../context/ToastContext';

const EmailVerification = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [status, setStatus] = useState('verifying'); // verifying, success, error

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await authService.verifyEmail(token);
        setStatus('success');
        showToast('Email doğrulama başarılı!', 'success');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (error) {
        setStatus('error');
        const message =
          error.response?.data?.error?.message || 'Doğrulama başarısız!';
        showToast(message, 'error');
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setStatus('error');
    }
  }, [token, navigate, showToast]);

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
            {status === 'verifying' && (
              <>
                <CircularProgress
                  sx={{
                    mb: 3,
                    color: '#ff6b35',
                  }}
                  size={60}
                />
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #ff6b35 0%, #004e89 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Email doğrulanıyor...
                </Typography>
              </>
            )}

            {status === 'success' && (
              <>
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
                  ✓ Email Doğrulandı
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 2, mb: 4 }}>
                  Email adresiniz başarıyla doğrulandı. 3 saniye içinde giriş
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
              </>
            )}

            {status === 'error' && (
              <>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: '#dc2626',
                    mb: 2,
                  }}
                >
                  Doğrulama Başarısız
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 2, mb: 4 }}>
                  Email doğrulama linki geçersiz veya süresi dolmuş olabilir.
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
                  Giriş Sayfasına Dön
                </Button>
              </>
            )}
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default EmailVerification;

