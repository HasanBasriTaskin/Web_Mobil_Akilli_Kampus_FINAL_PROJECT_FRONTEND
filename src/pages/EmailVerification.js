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
          {status === 'verifying' && (
            <>
              <CircularProgress sx={{ mb: 2 }} />
              <Typography variant="h6">Email doğrulanıyor...</Typography>
            </>
          )}

          {status === 'success' && (
            <>
              <Typography variant="h5" gutterBottom color="success.main">
                ✓ Email Doğrulandı
              </Typography>
              <Typography variant="body1" sx={{ mt: 2, mb: 3 }}>
                Email adresiniz başarıyla doğrulandı. 3 saniye içinde giriş
                sayfasına yönlendirileceksiniz...
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/login')}
                fullWidth
              >
                Giriş Sayfasına Git
              </Button>
            </>
          )}

          {status === 'error' && (
            <>
              <Typography variant="h5" gutterBottom color="error.main">
                Doğrulama Başarısız
              </Typography>
              <Typography variant="body1" sx={{ mt: 2, mb: 3 }}>
                Email doğrulama linki geçersiz veya süresi dolmuş olabilir.
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/login')}
                fullWidth
              >
                Giriş Sayfasına Dön
              </Button>
            </>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default EmailVerification;

