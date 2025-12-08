import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [status, setStatus] = useState('verifying'); // verifying, success, error

  useEffect(() => {
    const verifyEmail = async () => {
      const userId = searchParams.get('userId');
      const token = searchParams.get('token');

      console.log('EmailVerification - userId:', userId);
      console.log('EmailVerification - token:', token ? `${token.substring(0, 20)}...` : 'null');

      if (!userId || !token) {
        setStatus('error');
        showToast('Geçersiz doğrulama linki! Kullanıcı ID veya token eksik.', 'error');
        return;
      }

      try {
        // Token zaten URL-encoded olarak geliyor, tekrar encode etmeye gerek yok
        const response = await authService.verifyEmail(userId, token);
        
        console.log('EmailVerification - response:', response);
        
        // Backend response format: { data, isSuccessful, errors }
        if (response?.isSuccessful || response?.IsSuccessful) {
        setStatus('success');
        showToast('Email doğrulama başarılı!', 'success');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
        } else {
          const errorMessage = response?.errors?.[0] || response?.Errors?.[0] || 'Doğrulama başarısız!';
          throw new Error(errorMessage);
        }
      } catch (error) {
        console.error('EmailVerification - error:', error);
        console.error('EmailVerification - error.response:', error.response);
        setStatus('error');
        
        // Network error kontrolü
        if (!error.response) {
          const networkMessage = error.code === 'ECONNREFUSED' || error.message.includes('Network Error')
            ? 'Backend sunucusuna bağlanılamıyor. Lütfen backend sunucusunun çalıştığından emin olun.'
            : 'Sunucuya bağlanılamıyor. Lütfen internet bağlantınızı kontrol edin.';
          showToast(networkMessage, 'error');
          return;
        }
        
        // Backend'den gelen hata mesajı
        const errorData = error.response?.data;
        const message =
          error.userMessage ||
          errorData?.errors?.[0] ||
          errorData?.Errors?.[0] ||
          errorData?.error?.message ||
          errorData?.message ||
          error.message ||
          'Doğrulama başarısız! Lütfen linkin tamamını kopyaladığınızdan emin olun.';
        showToast(message, 'error');
      }
    };

      verifyEmail();
  }, [searchParams, navigate, showToast]);

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
                <Typography variant="body1" color="text.secondary" sx={{ mt: 2, mb: 2 }}>
                  Email doğrulama linki geçersiz veya süresi dolmuş olabilir.
                </Typography>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: '#fff7ed',
                    borderRadius: 2,
                    border: '1px solid #fed7aa',
                    mb: 3,
                    textAlign: 'left',
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: '#9a3412' }}>
                    💡 Çözüm Önerileri:
                  </Typography>
                  <Typography variant="body2" color="text.secondary" component="div">
                    <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
                      <li>Backend console'unda <strong>"================ EMAILSIMULATOR ================"</strong> başlığını arayın</li>
                      <li>Email doğrulama linkini (verify-email) bulun</li>
                      <li>Linkin tamamını kopyalayıp tarayıcıya yapıştırın</li>
                      <li>Link 24 saat içinde geçerlidir, süresi dolmuşsa yeni kayıt yapın</li>
                      <li>Eğer link bulunamıyorsa, yeni bir kayıt yapın ve hemen console'u kontrol edin</li>
                    </ul>
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/register')}
                    fullWidth
                    size="large"
                    sx={{
                      py: 1.5,
                      fontSize: '1.1rem',
                      borderColor: '#004e89',
                      color: '#004e89',
                      '&:hover': {
                        borderColor: '#ff6b35',
                        color: '#ff6b35',
                        backgroundColor: 'rgba(255, 107, 53, 0.05)',
                      },
                    }}
                  >
                    Yeni Kayıt Yap
                  </Button>
                </Box>
              </>
            )}
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default EmailVerification;

