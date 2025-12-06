import api from './api';

export const userService = {
  // Update Profile
  updateProfile: async (data) => {
    const response = await api.put('/users/me', data);
    return response.data;
  },

  // Upload Profile Picture
  uploadProfilePicture: async (file) => {
    const formData = new FormData();
    formData.append('profilePicture', file);
    
    const response = await api.post('/users/me/profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Change Password
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/users/me/password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};

