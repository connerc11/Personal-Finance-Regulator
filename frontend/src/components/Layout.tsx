import React, { useState } from 'react';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Container,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Divider,
} from '@mui/material';
import { 
  Dashboard, 
  AccountBalance, 
  TrendingUp, 
  Schedule, 
  Person, 
  Settings, 
  ExitToApp, 
  Psychology,
  Flag,
  Assessment,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

// Workaround imports for React Router
const ReactRouter = (window as any).ReactRouterDOM || require('react-router-dom');
const Link = ReactRouter.Link || ((props: any) => React.createElement('a', props));
const useLocation = ReactRouter.useLocation || (() => ({ pathname: '/' }));
const useNavigate = ReactRouter.useNavigate || (() => () => {});

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { text: 'Transactions', icon: <AccountBalance />, path: '/transactions' },
  { text: 'Budgets', icon: <TrendingUp />, path: '/budgets' },
  { text: 'Analytics', icon: <TrendingUp />, path: '/analytics' },
  { text: 'Reports', icon: <Assessment />, path: '/reports' },
  { text: 'Scheduled', icon: <Schedule />, path: '/scheduled' },
  { text: 'Cash Coach', icon: <Psychology />, path: '/cash-coach' },
  { text: 'Goals', icon: <Flag />, path: '/goals' },
  { text: 'Profile', icon: <Person />, path: '/profile' },
  { text: 'Settings', icon: <Settings />, path: '/settings' },
];

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleMenuClose();
  };

  const handleProfile = () => {
    navigate('/profile');
    handleMenuClose();
  };

  const getUserInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase() || 'U';
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: '#1a1a1a',
          border: '2px solid #00ff88',
          borderRadius: 0,
          boxShadow: `
            0 0 20px rgba(0, 255, 136, 0.3),
            0 0 40px rgba(0, 255, 136, 0.1)
          `,
        }}
      >
        <Toolbar>
          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ 
              flexGrow: 1,
              color: '#00ff88',
              fontWeight: 'bold',
              textShadow: '0 0 10px rgba(0, 255, 136, 0.5)',
            }}
          >
            Personal Finance Regulator
          </Typography>
          
          {/* User Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                display: { xs: 'none', md: 'block' },
                color: '#fff',
              }}
            >
              {user?.firstName} {user?.lastName}
            </Typography>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls="user-menu"
              aria-haspopup="true"
              onClick={handleMenuOpen}
              sx={{
                color: '#00ff88',
                '&:hover': {
                  backgroundColor: 'rgba(0, 255, 136, 0.1)',
                  boxShadow: '0 0 10px rgba(0, 255, 136, 0.3)',
                },
              }}
            >
              <Avatar sx={{ 
                width: 32, 
                height: 32, 
                bgcolor: '#00ff88',
                color: '#000',
                border: '2px solid #00ff88',
                boxShadow: '0 0 10px rgba(0, 255, 136, 0.5)',
              }}>
                {getUserInitials(user?.firstName, user?.lastName)}
              </Avatar>
            </IconButton>
          </Box>
          
          <Menu
            id="user-menu"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            sx={{
              '& .MuiPaper-root': {
                backgroundColor: '#1a1a1a',
                border: '2px solid #00ff88',
                borderRadius: 2,
                boxShadow: `
                  0 0 20px rgba(0, 255, 136, 0.3),
                  0 0 40px rgba(0, 255, 136, 0.2)
                `,
                color: '#fff',
              },
            }}
          >
            <MenuItem 
              onClick={handleProfile}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(0, 255, 136, 0.1)',
                },
              }}
            >
              <ListItemIcon>
                <Person fontSize="small" sx={{ color: '#00ff88' }} />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem 
              onClick={() => { navigate('/settings'); handleMenuClose(); }}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(0, 255, 136, 0.1)',
                },
              }}
            >
              <ListItemIcon>
                <Settings fontSize="small" sx={{ color: '#00ff88' }} />
              </ListItemIcon>
              Settings
            </MenuItem>
            <Divider sx={{ borderColor: '#00ff88', opacity: 0.5 }} />
            <MenuItem 
              onClick={handleLogout}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(0, 255, 136, 0.1)',
                },
              }}
            >
              <ListItemIcon>
                <ExitToApp fontSize="small" sx={{ color: '#00ff88' }} />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { 
            width: drawerWidth, 
            boxSizing: 'border-box',
            backgroundColor: '#1a1a1a',
            border: '2px solid #00ff88',
            borderLeft: 'none',
            borderBottom: 'none',
            boxShadow: `
              0 0 20px rgba(0, 255, 136, 0.2),
              0 0 40px rgba(0, 255, 136, 0.1)
            `,
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item) => (
              <ListItem
                key={item.text}
                component={Link}
                to={item.path}
                sx={{
                  color: location.pathname === item.path ? '#00ff88' : '#fff',
                  textDecoration: 'none',
                  backgroundColor: location.pathname === item.path ? 'rgba(0, 255, 136, 0.1)' : 'transparent',
                  margin: '4px 8px',
                  borderRadius: 2,
                  border: location.pathname === item.path ? '1px solid #00ff88' : '1px solid transparent',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 255, 136, 0.1)',
                    border: '1px solid #00ff88',
                    boxShadow: '0 0 10px rgba(0, 255, 136, 0.3)',
                  },
                }}
              >
                <ListItemIcon sx={{ 
                  color: location.pathname === item.path ? '#00ff88' : '#888',
                  '&:hover': {
                    color: '#00ff88',
                  },
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3,
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%)',
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        <Container maxWidth="xl">
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;