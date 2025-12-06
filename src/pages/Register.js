import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Container,
  Paper,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  Box,
  Link as MuiLink,
} from '@mui/material';
import { authService } from '../services/authService';
import { useToast } from '../context/ToastContext';
import TextInput from '../components/TextInput';
import SelectInput from '../components/SelectInput';

const schema = yup.object({
  name: yup.string().required('Ad Soyad zorunludur'),
  email: yup.string().email('Geçerli bir email giriniz').required('Email zorunludur'),
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
  userType: yup.string().required('Kullanıcı tipi seçiniz'),
  studentNumber: yup.string().when('userType', {
    is: 'student',
    then: (schema) => schema.required('Öğrenci numarası zorunludur'),
  }),
  departmentId: yup.string().required('Bölüm seçiniz'),
  terms: yup.boolean().oneOf([true], 'Kullanım şartlarını kabul etmelisiniz'),
});

const Register = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      userType: '',
      studentNumber: '',
      departmentId: '',
      terms: false,
    },
  });

  const userType = watch('userType');

  // Mock departments - backend'den gelecek
  const departments = [
    { value: '1', label: 'Bilgisayar Mühendisliği' },
    { value: '2', label: 'Elektrik-Elektronik Mühendisliği' },
    { value: '3', label: 'Endüstri Mühendisliği' },
  ];

  const onSubmit = async (data) => {
    try {
      await authService.register(data);
      showToast(
        'Kayıt başarılı! Lütfen email adresinizi doğrulayın.',
        'success'
      );
      navigate('/login');
    } catch (error) {
      const message =
        error.userMessage || error.response?.data?.error?.message || 'Kayıt başarısız!';
      showToast(message, 'error');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 30%, #004e89 70%, #1a6ba3 100%)',
        py: 4,
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
      <Container component="main" maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
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
                Kayıt Ol
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Yeni hesap oluşturun
              </Typography>
            </Box>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
            <TextInput control={control} name="name" label="Ad Soyad" />
            <TextInput
              control={control}
              name="email"
              label="Email"
              type="email"
              autoComplete="email"
            />
            <SelectInput
              control={control}
              name="userType"
              label="Kullanıcı Tipi"
              options={[
                { value: 'student', label: 'Öğrenci' },
                { value: 'faculty', label: 'Öğretim Üyesi' },
              ]}
            />
            {userType === 'student' && (
              <TextInput
                control={control}
                name="studentNumber"
                label="Öğrenci Numarası"
              />
            )}
            <SelectInput
              control={control}
              name="departmentId"
              label="Bölüm"
              options={departments}
            />
            <TextInput
              control={control}
              name="password"
              label="Şifre"
              type="password"
              autoComplete="new-password"
            />
            <TextInput
              control={control}
              name="confirmPassword"
              label="Şifre Tekrar"
              type="password"
              autoComplete="new-password"
            />
            <Controller
              name="terms"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value} color="primary" />}
                  label="Kullanım şartlarını kabul ediyorum"
                />
              )}
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
              {isSubmitting ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
            </Button>
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Zaten hesabınız var mı?{' '}
                <MuiLink
                  component={Link}
                  to="/login"
                  sx={{
                    color: '#ff6b35',
                    fontWeight: 600,
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                      color: '#004e89',
                    },
                  }}
                >
                  Giriş Yap
                </MuiLink>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
    </Box>
  );
};

export default Register;

