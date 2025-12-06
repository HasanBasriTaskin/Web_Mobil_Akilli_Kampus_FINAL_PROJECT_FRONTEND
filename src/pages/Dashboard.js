import React from 'react';
import { Box, Container, Typography, Paper, Grid } from '@mui/material';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/constants';

const Dashboard = () => {
  const { user } = useAuth();

  const getRoleText = (role) => {
    switch (role) {
      case ROLES.STUDENT:
        return 'Öğrenci';
      case ROLES.FACULTY:
        return 'Öğretim Üyesi';
      case ROLES.ADMIN:
        return 'Yönetici';
      default:
        return 'Kullanıcı';
    }
  };

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
          ml: '240px', // Sidebar width
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom>
            Hoş Geldiniz, {user?.name || user?.email}!
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            {getRoleText(user?.role)} Paneli
          </Typography>

          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Dashboard
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Bu sayfa yakında güncellenecektir. Part 2'de akademik yönetim
                  ve GPS yoklama özellikleri eklenecektir.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;

