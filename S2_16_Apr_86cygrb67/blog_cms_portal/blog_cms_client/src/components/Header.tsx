import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Box, 
  Avatar, 
  Menu, 
  MenuItem,
  Button,
  useMediaQuery,
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import {
  Dashboard as DashboardIcon,
  PostAdd as PostAddIcon,
  ListAlt as ListAltIcon,
  Category as CategoryIcon,
  People as PeopleIcon,
} from '@mui/icons-material';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchor(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    handleMenuClose();
  };

  const navItems = [
    { 
      label: 'Dashboard', 
      path: '/', 
      icon: <DashboardIcon fontSize="small" />,
      roles: ['admin', 'editor']
    },
    { 
      label: 'Posts', 
      path: '/posts', 
      icon: <ListAltIcon fontSize="small" />,
      roles: ['admin', 'editor']
    },
    { 
      label: 'Categories', 
      path: '/categories', 
      icon: <CategoryIcon fontSize="small" />,
      roles: ['admin', 'editor']
    },
    { 
      label: 'Users', 
      path: '/users', 
      icon: <PeopleIcon fontSize="small" />,
      roles: ['admin']
    },
    { 
      label: 'New Post', 
      path: '/posts/new', 
      icon: <PostAddIcon fontSize="small" />,
      roles: ['admin', 'editor']
    },
  ];

  const filteredNavItems = navItems.filter(item => 
    user?.role && item.roles.includes(user.role)
  );

  return (
    <AppBar position="static" elevation={0} sx={{ zIndex: theme.zIndex.drawer + 1 }}>
      <Toolbar>
        {/* Mobile menu button */}
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMobileMenuOpen}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Logo/Title */}
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            cursor: 'pointer',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center'
          }}
          onClick={() => navigate('/')}
        >
          Blog CMS Admin
        </Typography>

        {/* Desktop Navigation */}
        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            {filteredNavItems.map((item) => (
              <Button
                key={item.path}
                color="inherit"
                startIcon={item.icon}
                onClick={() => navigate(item.path)}
                sx={{
                  '&.active': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        )}

        {/* User Profile */}
        {user && (
          <Box sx={{ ml: 2 }}>
            <IconButton onClick={handleProfileMenuOpen} color="inherit">
              <Avatar 
                alt={user.name} 
                src={user.avatar} 
                sx={{ width: 32, height: 32 }} 
              />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => {
                navigate('/profile');
                handleMenuClose();
              }}>
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>

      {/* Mobile Menu */}
      <Menu
        anchorEl={mobileMenuAnchor}
        open={Boolean(mobileMenuAnchor)}
        onClose={handleMenuClose}
      >
        {filteredNavItems.map((item) => (
          <MenuItem
            key={item.path}
            onClick={() => {
              navigate(item.path);
              handleMenuClose();
            }}
            sx={{
              '&.active': {
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {item.icon}
              {item.label}
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </AppBar>
  );
};

export default Header;