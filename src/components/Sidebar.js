import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/constants';

const drawerWidth = 240;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
      roles: [ROLES.STUDENT, ROLES.FACULTY, ROLES.ADMIN],
    },
    {
      text: 'Profilim',
      icon: <PersonIcon />,
      path: '/profile',
      roles: [ROLES.STUDENT, ROLES.FACULTY, ROLES.ADMIN],
    },
  ];

  // Filter menu items based on user role
  // If user role is not available, show all items for development
  const filteredMenuItems = user?.role 
    ? menuItems.filter((item) => item.roles.includes(user.role))
    : menuItems;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          mt: 8,
          background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
          borderRight: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '2px 0 10px rgba(0, 0, 0, 0.05)',
        },
      }}
    >
      <Box sx={{ overflow: 'auto', pt: 2 }}>
        <List>
          {filteredMenuItems.map((item) => {
            const isSelected = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ px: 2, mb: 1 }}>
                <ListItemButton
                  selected={isSelected}
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: 2,
                    py: 1.5,
                    background: isSelected
                      ? 'linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #004e89 100%)'
                      : 'transparent',
                    color: isSelected ? 'white' : 'inherit',
                    '&:hover': {
                      background: isSelected
                        ? 'linear-gradient(135deg, #e55a2b 0%, #e0841a 50%, #003d6b 100%)'
                        : 'linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(0, 78, 137, 0.1) 100%)',
                      transform: 'translateX(4px)',
                    },
                    transition: 'all 0.3s ease',
                    '& .MuiListItemIcon-root': {
                      color: isSelected ? 'white' : '#ff6b35',
                      minWidth: 40,
                    },
                    '& .MuiListItemText-primary': {
                      fontWeight: isSelected ? 600 : 500,
                    },
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;

