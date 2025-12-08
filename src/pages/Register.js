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
  fullName: yup.string().required('Ad Soyad zorunludur'),
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
    is: 'Student',
    then: (schema) => schema.required('Öğrenci numarası zorunludur'),
  }),
  employeeNumber: yup.string().when('userType', {
    is: 'Faculty',
    then: (schema) => schema.required('Personel numarası zorunludur'),
  }),
  title: yup.string().when('userType', {
    is: 'Faculty',
    then: (schema) => schema.required('Ünvan zorunludur'),
  }),
  officeLocation: yup.string().when('userType', {
    is: 'Faculty',
    then: (schema) => schema.required('Ofis konumu zorunludur'),
  }),
  departmentId: yup
    .mixed()
    .required('Bölüm seçiniz')
    .test('is-valid-department', 'Bölüm seçiniz', (value) => {
      return value !== '' && value != null && !isNaN(Number(value));
    })
    .transform((value) => {
      if (value === '' || value == null) return undefined;
      return Number(value);
    }),
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
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      userType: '',
      studentNumber: '',
      employeeNumber: '',
      title: '',
      officeLocation: '',
      departmentId: '',
    },
  });

  const userType = watch('userType');

  // Mock departments - backend'den gelecek
  const departments = [
    { value: 1, label: 'Bilgisayar Mühendisliği' },
    { value: 2, label: 'Elektrik-Elektronik Mühendisliği' },
    { value: 3, label: 'Endüstri Mühendisliği' },
    { value: 4, label: 'Makine Mühendisliği' },
    { value: 5, label: 'İnşaat Mühendisliği' },
  ];

  const onSubmit = async (data) => {
    try {
      // Validation: departmentId kontrolü
      if (!data.departmentId || data.departmentId === '' || isNaN(Number(data.departmentId))) {
        showToast('Lütfen bir bölüm seçiniz', 'error');
        return;
      }

      // Backend'e gönderilecek format
      const registerData = {
        userType: data.userType, // 'Student' veya 'Faculty'
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        departmentId: Number(data.departmentId),
        ...(data.userType === 'Student' && { studentNumber: data.studentNumber }),
        ...(data.userType === 'Faculty' && {
          employeeNumber: data.employeeNumber,
          title: data.title,
          officeLocation: data.officeLocation,
        }),
      };

      const response = await authService.register(registerData);
      
      // Backend response format: { data, isSuccessful, errors } (camelCase)
      if (response?.isSuccessful || response?.IsSuccessful) {
        showToast(
          'Kayıt başarılı! Email doğrulama linki gönderildi.',
          'success'
        );
        // Stay on register page after successful registration
      } else {
        const errorMessage = response?.errors?.[0] || response?.Errors?.[0] || 'Kayıt başarısız!';
        throw new Error(errorMessage);
      }
    } catch (error) {
      const message =
        error.userMessage || 
        error.response?.data?.errors?.[0] ||
        error.response?.data?.Errors?.[0] || 
        error.response?.data?.message ||
        error.response?.data?.Message ||
        error.message || 
        'Kayıt başarısız!';
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
            <TextInput control={control} name="fullName" label="Ad Soyad" />
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
                { value: 'Student', label: 'Öğrenci' },
                { value: 'Faculty', label: 'Öğretim Üyesi' },
              ]}
            />
            {userType === 'Student' && (
              <TextInput
                control={control}
                name="studentNumber"
                label="Öğrenci Numarası"
              />
            )}
            {userType === 'Faculty' && (
              <>
                <TextInput
                  control={control}
                  name="employeeNumber"
                  label="Personel Numarası"
                />
                <TextInput
                  control={control}
                  name="title"
                  label="Ünvan"
                  placeholder="Örn: Prof. Dr., Doç. Dr., Dr. Öğr. Üyesi"
                />
                <TextInput
                  control={control}
                  name="officeLocation"
                  label="Ofis Konumu"
                  placeholder="Örn: B-Block 301"
                />
              </>
            )}
            <SelectInput
              control={control}
              name="departmentId"
              label="Bölüm"
              options={departments}
              displayEmpty
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
              <MuiLink
                component={Link}
                to="/forgot-password"
                variant="body2"
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
                Şifremi Unuttum
              </MuiLink>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
    </Box>
  );
};

export default Register;

