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
        error.response?.data?.error?.message || 'Kayıt başarısız!';
      showToast(message, 'error');
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 4,
          marginBottom: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Kayıt Ol
          </Typography>
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
              sx={{ mt: 3, mb: 2 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
            </Button>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2">
                Zaten hesabınız var mı?{' '}
                <MuiLink component={Link} to="/login">
                  Giriş Yap
                </MuiLink>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;

