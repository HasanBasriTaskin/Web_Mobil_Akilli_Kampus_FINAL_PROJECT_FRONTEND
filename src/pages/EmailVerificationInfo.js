import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Alert,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import TerminalIcon from '@mui/icons-material/Terminal';

const EmailVerificationInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email');

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
        py: 4,
      }}
    >
      <Container component="main" maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
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
            <Typography
              component="h1"
              variant="h4"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #ff6b35 0%, #004e89 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
                textAlign: 'center',
              }}
            >
              Email Doğrulama Gerekiyor
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
              Hesabınızı kullanmaya başlamak için lütfen email adresinizi doğrulayın.
            </Typography>

            {email && (
              <Box
                sx={{
                  p: 2,
                  bgcolor: '#f8fafc',
                  borderRadius: 2,
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  justifyContent: 'center',
                }}
              >
                <EmailIcon sx={{ color: '#004e89' }} />
                <Typography variant="body2" color="text.secondary">
                  Kayıt olunan email:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                    color: '#004e89',
                  }}
                >
                  {email}
                </Typography>
              </Box>
            )}

            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                📧 Development Ortamında Email Gönderilmez
              </Typography>
              <Typography variant="body2">
                Development ortamında email doğrulama linki backend console'unda görüntülenir.
                Email ayarlarınızı yapılandırmadıysanız, linki backend terminalinden almanız gerekiyor.
              </Typography>
            </Alert>

            <Card sx={{ mb: 3, bgcolor: '#fff7ed', border: '1px solid #fed7aa' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <TerminalIcon sx={{ color: '#9a3412' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#9a3412' }}>
                    Email Doğrulama Linkini Nasıl Bulabilirim?
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" component="div" sx={{ mb: 2 }}>
                  <strong>Adım adım talimatlar:</strong>
                </Typography>
                <Box component="ol" sx={{ pl: 3, mb: 2, lineHeight: 2 }}>
                  <li>
                    <strong>Backend terminal/console penceresini açın</strong> (dotnet run çalıştırdığınız terminal)
                  </li>
                  <li>
                    <strong>"================ EMAILSIMULATOR ================"</strong> başlığını arayın
                  </li>
                  <li>
                    <strong>Email doğrulama linkini bulun</strong> (format: <code style={{ background: '#fef3c7', padding: '2px 4px', borderRadius: '3px' }}>http://localhost:3000/verify-email?userId=...&token=...</code>)
                  </li>
                  <li>
                    <strong>Linki kopyalayıp tarayıcıya yapıştırın</strong> veya doğrudan tıklayın
                  </li>
                  <li>Email doğrulandıktan sonra giriş yapabilirsiniz</li>
                </Box>
                <Alert severity="warning" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>Önemli:</strong> Backend console'unda kayıt olduğunuz anda email doğrulama linki görüntülenir. 
                    Eğer göremiyorsanız, yeni bir kayıt yapın ve hemen console'u kontrol edin.
                  </Typography>
                </Alert>
              </CardContent>
            </Card>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={() => navigate('/login')}
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
                fullWidth
                size="large"
                onClick={() => navigate('/register')}
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
                Yeni Hesap Oluştur
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default EmailVerificationInfo;


