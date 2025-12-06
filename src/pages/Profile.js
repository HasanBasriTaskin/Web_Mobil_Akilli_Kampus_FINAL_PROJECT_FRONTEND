import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Avatar,
  Grid,
  Divider,
  IconButton,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { userService } from '../services/userService';
import TextInput from '../components/TextInput';
import LoadingSpinner from '../components/LoadingSpinner';

const profileSchema = yup.object({
  name: yup.string().required('Ad Soyad zorunludur'),
  phone: yup.string(),
});

const passwordSchema = yup.object({
  currentPassword: yup.string().required('Mevcut şifre zorunludur'),
  newPassword: yup
    .string()
    .min(8, 'Şifre en az 8 karakter olmalıdır')
    .matches(/[A-Z]/, 'Şifre en az bir büyük harf içermelidir')
    .matches(/[0-9]/, 'Şifre en az bir rakam içermelidir')
    .required('Yeni şifre zorunludur'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), null], 'Şifreler eşleşmiyor')
    .required('Şifre tekrarı zorunludur'),
});

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const profileForm = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
    },
  });

  const passwordForm = useForm({
    resolver: yupResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const handleProfileSubmit = async (data) => {
    try {
      const response = await userService.updateProfile(data);
      updateUser(response.data.user);
      showToast('Profil başarıyla güncellendi', 'success');
    } catch (error) {
      const message =
        error.response?.data?.error?.message || 'Profil güncellenemedi!';
      showToast(message, 'error');
    }
  };

  const handlePasswordSubmit = async (data) => {
    try {
      await userService.changePassword(data.currentPassword, data.newPassword);
      showToast('Şifre başarıyla değiştirildi', 'success');
      passwordForm.reset();
    } catch (error) {
      const message =
        error.response?.data?.error?.message || 'Şifre değiştirilemedi!';
      showToast(message, 'error');
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('Dosya boyutu 5MB\'dan büyük olamaz', 'error');
      return;
    }

    if (!file.type.startsWith('image/')) {
      showToast('Sadece resim dosyaları yüklenebilir', 'error');
      return;
    }

    setIsUploading(true);
    try {
      const response = await userService.uploadProfilePicture(file);
      updateUser({ profilePictureUrl: response.data.profilePictureUrl });
      showToast('Profil fotoğrafı başarıyla yüklendi', 'success');
    } catch (error) {
      const message =
        error.response?.data?.error?.message || 'Fotoğraf yüklenemedi!';
      showToast(message, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Navbar />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          ml: '240px',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" gutterBottom>
            Profilim
          </Typography>

          <Grid container spacing={3} sx={{ mt: 2 }}>
            {/* Profile Picture */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Avatar
                    src={user.profilePictureUrl}
                    sx={{ width: 120, height: 120, mb: 2 }}
                  >
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </Avatar>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="profile-picture-upload"
                    type="file"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                  />
                  <label htmlFor="profile-picture-upload">
                    <IconButton
                      color="primary"
                      component="span"
                      disabled={isUploading}
                    >
                      <PhotoCamera />
                    </IconButton>
                  </label>
                  <Typography variant="body2" color="text.secondary">
                    {isUploading ? 'Yükleniyor...' : 'Profil fotoğrafı değiştir'}
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            {/* Profile Info */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Kişisel Bilgiler
                </Typography>
                <Box
                  component="form"
                  onSubmit={profileForm.handleSubmit(handleProfileSubmit)}
                >
                  <TextInput
                    control={profileForm.control}
                    name="name"
                    label="Ad Soyad"
                  />
                  <TextInput
                    control={profileForm.control}
                    name="phone"
                    label="Telefon"
                    type="tel"
                  />
                  <Box sx={{ mt: 2, mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1">{user.email}</Typography>
                  </Box>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 2 }}
                    disabled={profileForm.formState.isSubmitting}
                  >
                    {profileForm.formState.isSubmitting
                      ? 'Kaydediliyor...'
                      : 'Kaydet'}
                  </Button>
                </Box>
              </Paper>
            </Grid>

            {/* Change Password */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Şifre Değiştir
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Box
                  component="form"
                  onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
                >
                  <TextInput
                    control={passwordForm.control}
                    name="currentPassword"
                    label="Mevcut Şifre"
                    type="password"
                  />
                  <TextInput
                    control={passwordForm.control}
                    name="newPassword"
                    label="Yeni Şifre"
                    type="password"
                  />
                  <TextInput
                    control={passwordForm.control}
                    name="confirmPassword"
                    label="Yeni Şifre Tekrar"
                    type="password"
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 2 }}
                    disabled={passwordForm.formState.isSubmitting}
                  >
                    {passwordForm.formState.isSubmitting
                      ? 'Değiştiriliyor...'
                      : 'Şifreyi Değiştir'}
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Profile;

