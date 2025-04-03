import { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { toggleFavorite } from '../store/contactsSlice'
import { Contact } from '../types/contact';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  IconButton, 
  useTheme,
  TextField,
  InputAdornment,
  ToggleButton,
  Stack,
  ButtonGroup,
  Button
} from '@mui/material';
import { MoreHoriz, Search, Favorite, FavoriteBorder, Sort } from '@mui/icons-material';
import { Link } from 'react-router-dom';

// Add sorting options
enum SortOption {
  A_TO_Z = 'a-z',
  Z_TO_A = 'z-a',
  NONE = 'none'
}

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>(SortOption.A_TO_Z);
  const { contacts } = useSelector((state: RootState) => state.contacts);
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>()

  // Memoize filtered and sorted contacts for better performance
  const filteredContacts = useMemo(() => {
    let result = contacts.filter((contact: Contact) => 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm));

    if (showFavoritesOnly) {
      result = result.filter((contact: Contact) => contact.isFavorite);
    }

    // Apply sorting
    switch (sortOption) {
      case SortOption.A_TO_Z:
        return [...result].sort((a, b) => a.name.localeCompare(b.name));
      case SortOption.Z_TO_A:
        return [...result].sort((a, b) => b.name.localeCompare(a.name));
      default:
        return result;
    }
  }, [contacts, searchTerm, showFavoritesOnly, sortOption]);

  const handleFavoriteFilterToggle = () => {
    setShowFavoritesOnly(!showFavoritesOnly);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2
      }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Contacts List
        </Typography>
        
        <Stack direction="row" spacing={2} sx={{ width: { xs: '100%', sm: 'auto' }, alignItems: "center" }}>
          <ToggleButton
            value="favorites"
            selected={showFavoritesOnly}
            onChange={handleFavoriteFilterToggle}
            sx={{
              borderRadius: theme.shape.borderRadius,
              px: 1.5,
            }}
          >
            {showFavoritesOnly ? (
              <Favorite color='primary'/>
            ) : (
              <FavoriteBorder />
            )}
          </ToggleButton>

          <ButtonGroup variant="outlined" size="small">
            <Button 
              onClick={() => setSortOption(SortOption.A_TO_Z)}
              variant={sortOption === SortOption.A_TO_Z ? 'contained' : 'outlined'}
              startIcon={<Sort />}
            >
              A-Z
            </Button>
            <Button 
              onClick={() => setSortOption(SortOption.Z_TO_A)}
              variant={sortOption === SortOption.Z_TO_A ? 'contained' : 'outlined'}
              startIcon={<Sort sx={{ transform: 'rotate(180deg)' }} />}
            >
              Z-A
            </Button>
          </ButtonGroup>
          
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ 
              width: { xs: '100%', sm: 200 },
              backgroundColor: theme.palette.background.paper,
              borderRadius: theme.shape.borderRadius,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      </Box>
      
      {filteredContacts.length === 0 ? (
        <Typography variant="body1" sx={{ 
          textAlign: 'center', 
          p: 4,
          color: theme.palette.text.secondary
        }}>
          {contacts.length === 0 
            ? 'No contacts found. Add your first contact!' 
            : showFavoritesOnly
              ? 'No favorite contacts found.'
              : 'No matching contacts found.'}
        </Typography>
      ) : (
        <List sx={{ 
          width: "100%",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: theme.shadows[1],
          padding: 0,
        }}>
          {filteredContacts.map((contact: Contact) => (
            <ListItem
              key={contact.id}
              sx={{
                borderBottom: `1px solid ${theme.palette.divider}`,
                "&:last-child": { borderBottom: "none" },
                transition: "background-color 0.2s",
                "&:hover": { backgroundColor: theme.palette.action.hover },
                padding: "12px 16px",
              }}
              component={Link}
              to={`/contacts/${contact.id}`}
              secondaryAction={
                <>
<IconButton 
                  onClick={(e) => {
                    e.stopPropagation(); 
                    e.preventDefault(); 
                    dispatch(toggleFavorite(contact.id));
                  }}
                  color={contact.isFavorite ? 'error' : 'default'}
                >
                  {contact.isFavorite ? <Favorite /> : <FavoriteBorder />}
                </IconButton>
                </>
              }
            >
              <ListItemAvatar>
                <Avatar
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    width: 40,
                    height: 40,
                    fontSize: "1rem",
                  }}
                >
                  {contact.name.charAt(0).toUpperCase()}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, color: theme.palette.text.primary }}
                  >
                    {contact.name}
                  </Typography>
                }
                secondary={
                  <>
                    <Box component="span" display="block" sx={{ color: theme.palette.text.secondary }}>
                      {contact.phone}
                    </Box>
                    <Box component="span" display="block" sx={{ color: theme.palette.text.secondary }}>
                      {contact.email}
                    </Box>
                  </>
                }
                sx={{ marginLeft: 1 }}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default HomePage;