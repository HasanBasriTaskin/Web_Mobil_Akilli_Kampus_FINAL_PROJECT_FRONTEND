import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';
import {
  School,
  Assignment,
  Event,
  TrendingUp,
  People,
  Notifications,
} from '@mui/icons-material';
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

  const statCards = [
    {
      title: 'Aktif Dersler',
      value: '12',
      icon: <School />,
      color: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
    },
    {
      title: 'Ödevler',
      value: '5',
      icon: <Assignment />,
      color: 'linear-gradient(135deg, #004e89 0%, #1a6ba3 100%)',
    },
    {
      title: 'Etkinlikler',
      value: '8',
      icon: <Event />,
      color: 'linear-gradient(135deg, #ff6b35 0%, #004e89 100%)',
    },
    {
      title: 'Başarı Oranı',
      value: '87%',
      icon: <TrendingUp />,
      color: 'linear-gradient(135deg, #06a77d 0%, #2dd4bf 100%)',
    },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      }}
    >
      <Navbar />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          mt: 8,
          ml: '240px',
        }}
      >
        <Container maxWidth="lg">
          {/* Welcome Section */}
          <Box
            sx={{
              mb: 4,
              background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 30%, #004e89 70%, #1a6ba3 100%)',
              borderRadius: 4,
              p: 4,
              color: 'white',
              boxShadow: '0 10px 30px rgba(255, 107, 53, 0.3)',
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 1,
                color: 'white',
              }}
            >
              Hoş Geldiniz, {user?.name || user?.email}! 👋
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              {getRoleText(user?.role)} Paneli
            </Typography>
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {statCards.map((card, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    background: card.color,
                    color: 'white',
                    borderRadius: 3,
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
                    },
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 2,
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: 'rgba(255, 255, 255, 0.2)',
                          width: 56,
                          height: 56,
                        }}
                      >
                        {card.icon}
                      </Avatar>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {card.value}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {card.title}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Quick Actions */}
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 4,
                  borderRadius: 3,
                  background: 'white',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                  Hızlı Erişim
                </Typography>
                <Grid container spacing={2}>
                  {[
                    { icon: <People />, text: 'Öğrenciler', color: '#ff6b35' },
                    { icon: <Assignment />, text: 'Ödevler', color: '#004e89' },
                    { icon: <Event />, text: 'Etkinlikler', color: '#f7931e' },
                    { icon: <Notifications />, text: 'Bildirimler', color: '#06a77d' },
                  ].map((item, index) => (
                    <Grid item xs={6} sm={3} key={index}>
                      <Box
                        sx={{
                          p: 2,
                          textAlign: 'center',
                          borderRadius: 2,
                          border: `2px solid ${item.color}`,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: item.color,
                            color: 'white',
                            transform: 'scale(1.05)',
                          },
                        }}
                      >
                        <Box sx={{ color: item.color, mb: 1, '&:hover': { color: 'white' } }}>
                          {item.icon}
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {item.text}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;

