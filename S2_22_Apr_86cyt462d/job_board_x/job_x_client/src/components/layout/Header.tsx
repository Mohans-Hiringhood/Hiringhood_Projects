import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton, 
  Menu, 
  MenuItem,
  Container,
  Divider,
  Avatar,
  Tooltip,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Menu as MenuIcon, Briefcase as BriefcaseBusiness } from 'lucide-react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { APP_NAME } from '../../config';
import styled from '@emotion/styled';

const StyledAppBar = styled(AppBar)`
  background-color: #ffffff;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
`;

const NavLink = styled(Button)`
  color: #4b5563;
  font-weight: 500;
  margin: 0 0.5rem;
  
  &:hover {
    background-color: rgba(59, 130, 246, 0.04);
    color: #3b82f6;
  }
`;

const Logo = styled(Typography)`
  display: flex;
  align-items: center;
  font-weight: 700;
  color: #3b82f6;
  text-decoration: none;
  margin-right: 1rem;
`;

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
    navigate('/');
  };

  // Navigation options based on user role
  const getNavOptions = () => {
    if (!user) return [];
    
    if (user.role === 'employer') {
      return [
        { label: 'Dashboard', path: '/employer/dashboard' },
        { label: 'Post Job', path: '/employer/post-job' },
        { label: 'My Jobs', path: '/employer/jobs' },
      ];
    }
    
    return [
      { label: 'Jobs', path: '/jobs' },
      { label: 'My Applications', path: '/applications' },
    ];
  };

  const navOptions = getNavOptions();

  // User menu options
  const userMenuOptions = user ? [
    { label: 'Profile', path: '/profile', action: handleCloseUserMenu },
    { label: 'Settings', path: '/settings', action: handleCloseUserMenu },
    { label: 'Logout', path: '#', action: handleLogout },
  ] : [];

  return (
    <StyledAppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Desktop Logo */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 2 }}>
            <Logo variant="h5" component={RouterLink} to="/">
              <BriefcaseBusiness size={28} style={{ marginRight: '0.5rem' }} />
              {APP_NAME}
            </Logo>
          </Box>

          {/* Mobile menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            {user && (
              <>
                <IconButton
                  size="large"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="primary"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: 'block', md: 'none' },
                  }}
                >
                  {navOptions.map((option) => (
                    <MenuItem 
                      key={option.label} 
                      onClick={handleCloseNavMenu}
                      component={RouterLink}
                      to={option.path}
                    >
                      <Typography textAlign="center">{option.label}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            )}
          </Box>

          {/* Mobile Logo */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <Logo variant="h6" component={RouterLink} to="/">
              <BriefcaseBusiness size={24} style={{ marginRight: '0.5rem' }} />
              {APP_NAME}
            </Logo>
          </Box>

          {/* Desktop navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {user && navOptions.map((option) => (
              <NavLink
                key={option.label}
                component={RouterLink}
                to={option.path}
                onClick={handleCloseNavMenu}
              >
                {option.label}
              </NavLink>
            ))}
          </Box>

          {/* Auth buttons or user menu */}
          <Box sx={{ flexGrow: 0 }}>
            {user ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar 
                      alt={user.name} 
                      src="/avatar-placeholder.png"
                      sx={{ bgcolor: 'primary.main' }}
                    >
                      {user.name.charAt(0)}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <Box sx={{ py: 1, px: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold">{user.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                    <Typography variant="body2" color="primary" sx={{ textTransform: 'capitalize' }}>
                      {user.role === 'jobSeeker' ? 'Job Seeker' : 'Employer'}
                    </Typography>
                  </Box>
                  <Divider />
                  {userMenuOptions.map((option) => (
                    <MenuItem 
                      key={option.label} 
                      onClick={option.action}
                      component={option.path !== '#' ? RouterLink : undefined}
                      to={option.path !== '#' ? option.path : undefined}
                    >
                      <Typography textAlign="center">{option.label}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  color="primary" 
                  variant="outlined"
                  component={RouterLink} 
                  to="/login"
                >
                  Login
                </Button>
                <Button 
                  color="primary" 
                  variant="contained"
                  component={RouterLink} 
                  to="/register"
                >
                  Register
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
};

export default Header;