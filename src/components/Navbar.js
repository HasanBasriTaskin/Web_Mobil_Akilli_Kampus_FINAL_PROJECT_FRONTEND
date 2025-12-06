import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
} from '@mui/material';
import {
  AccountCircle,
  Logout,
  Person,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
    navigate('/login');
  };

  const handleProfile = () => {
    handleMenuClose();
    navigate('/profile');
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 30%, #004e89 70%, #1a6ba3 100%)',
        boxShadow: '0 4px 20px rgba(255, 107, 53, 0.3)',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: 700,
            fontSize: '1.5rem',
          }}
        >
          <Link
            to="/dashboard"
            style={{
              color: 'inherit',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            🎓 Akıllı Kampüs
          </Link>
        </Typography>
        
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                background: 'rgba(255, 255, 255, 0.2)',
                px: 2,
                py: 0.5,
                borderRadius: 2,
                backdropFilter: 'blur(10px)',
              }}
            >
              {user.name || user.email}
            </Typography>
            <IconButton
              size="large"
              onClick={handleMenuOpen}
              sx={{
                color: 'white',
                background: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.2)',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {user.profilePictureUrl ? (
                <Avatar
                  src={user.profilePictureUrl}
                  sx={{
                    width: 36,
                    height: 36,
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                  }}
                />
              ) : (
                <AccountCircle sx={{ fontSize: 32 }} />
              )}
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  borderRadius: 2,
                  mt: 1,
                  minWidth: 200,
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                },
              }}
            >
              <MenuItem
                onClick={handleProfile}
                sx={{
                  '&:hover': {
                    background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                    color: 'white',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <Person sx={{ mr: 1 }} /> Profilim
              </MenuItem>
              <MenuItem
                onClick={handleLogout}
                sx={{
                  '&:hover': {
                    background: 'linear-gradient(135deg, #004e89 0%, #1a6ba3 100%)',
                    color: 'white',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <Logout sx={{ mr: 1 }} /> Çıkış Yap
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

