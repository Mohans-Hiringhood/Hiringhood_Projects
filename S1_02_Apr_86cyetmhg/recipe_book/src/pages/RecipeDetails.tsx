import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { deleteRecipe } from '../store/recipesSlice';
import { 
  Button, 
  Typography, 
  Box, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  Chip, 
  Stack,
  Avatar,
  IconButton
} from '@mui/material';
import { 
  ArrowBack,
  Edit,
  Delete,
  LocalDining,
  List as ListIcon,
  DescriptionOutlined,
  AccessTime
} from '@mui/icons-material';

export default function RecipeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { recipes } = useSelector((state: RootState) => state.recipes);  
  const recipe = recipes.find(r => r.id === id);
  const category = recipe.category || 'non-veg';


  if (!recipe) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh'
      }}>
        <Typography variant="h5" color="text.secondary">
          Recipe not found
        </Typography>
      </Box>
    );
  }

  const handleDelete = () => {
    dispatch(deleteRecipe(recipe.id));
    navigate('/');
  };

  return (
    <Box sx={{ maxWidth: 'md', mx: 'auto', p: { xs: 2, md: 4 } }}>
      {/* Header Section */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <IconButton 
          onClick={() => navigate(-1)}
          sx={{ 
            color: 'text.primary',
            p: 1,
            '&:hover': { backgroundColor: 'action.hover' }
          }}
        >
          <ArrowBack />
        </IconButton>
        
        <Stack direction="row" spacing={1}>
          <Button
            variant="text"
            color="inherit"
            startIcon={<Edit />}
            onClick={() => navigate(`/edit/${recipe.id}`)}
            sx={{ 
              textTransform: 'none',
              color: 'text.secondary',
              '&:hover': { color: 'primary.main' }
            }}
          >
            Edit
          </Button>
          <Button
            variant="text"
            color="inherit"
            startIcon={<Delete />}
            onClick={handleDelete}
            sx={{ 
              textTransform: 'none',
              color: 'text.secondary',
              '&:hover': { color: 'error.main' }
            }}
          >
            Delete
          </Button>
        </Stack>
      </Stack>

      {/* Recipe Title */}
      <Typography 
        variant="h4" 
        sx={{ 
          fontWeight: 600,
          mb: 3,
          color: 'text.primary',
          textAlign: 'center'
        }}
      >
        {recipe.title}
      </Typography>

      {/* Hero Image */}
      <Box sx={{ 
        borderRadius: 2,
        overflow: 'hidden',
        mb: 4,
        boxShadow: 1,
        position: 'relative',
        height: { xs: 250, sm: 350, md: 400 }
      }}>
        <img 
          src={recipe.imageUrl || '/placeholder-recipe.jpg'} 
          alt={recipe.title}
          style={{ 
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center'
          }}
        />
        <Chip
          label={category === 'veg' ? 'VEG' : 'NON-VEG'}
          size="small"
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            backgroundColor: category === 'veg' ? '#4caf50' : '#f44336',
            color: 'white',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}
        />
        <Chip 
          label={`${recipe.cookingTime} mins`}
          icon={<AccessTime fontSize="small" />}
          sx={{ 
            position: 'absolute',
            bottom: 16,
            right: 16,
            backgroundColor: 'rgba(255,255,255,0.9)',
            fontWeight: 500
          }}
        />
      </Box>

      {/* Description */}
      <Paper elevation={0} sx={{ 
        p: 3, 
        mb: 4,
        borderRadius: 2,
        backgroundColor: 'background.paper',
        borderLeft: '4px solid',
        borderColor: 'primary.main'
      }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <DescriptionOutlined color="primary" />
          <Typography variant="h6" color="text.primary">
            About This Recipe
          </Typography>
        </Stack>
        <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
          {recipe.description}
        </Typography>
      </Paper>

      {/* Ingredients & Instructions */}
      <Box sx={{ 
        display: 'grid',
        gap: 4,
        gridTemplateColumns: { md: '1fr 1fr' }
      }}>
        {/* Ingredients */}
        <Paper elevation={0} sx={{ 
          p: 3,
          borderRadius: 2,
          backgroundColor: 'background.paper'
        }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
            <LocalDining color="primary" />
            <Typography variant="h6" color="text.primary">
              Ingredients
            </Typography>
          </Stack>
          <List disablePadding>
            {recipe.ingredients.map((ingredient, index) => (
              <ListItem 
                key={ingredient.id} 
                disableGutters
                sx={{ 
                  py: 1.5,
                  borderBottom: index < recipe.ingredients.length - 1 ? 
                    '1px solid' : 'none',
                  borderColor: 'divider'
                }}
              >
                <ListItemText 
                  primary={
                    <Typography variant="body1" fontWeight={500}>
                      {ingredient.name}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      {ingredient.amount}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Instructions */}
        <Paper elevation={0} sx={{ 
          p: 3,
          borderRadius: 2,
          backgroundColor: 'background.paper'
        }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
            <ListIcon color="primary" />
            <Typography variant="h6" color="text.primary">
              Instructions
            </Typography>
          </Stack>
          <List disablePadding>
            {recipe.instructions.map((instruction, index) => (
              <ListItem 
                key={index} 
                disableGutters
                sx={{ 
                  py: 1.5,
                  alignItems: 'flex-start',
                  borderBottom: index < recipe.instructions.length - 1 ? 
                    '1px solid' : 'none',
                  borderColor: 'divider'
                }}
              >
                <Avatar sx={{ 
                  width: 24, 
                  height: 24, 
                  mr: 2, 
                  mt: 0.5,
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  fontSize: '0.75rem'
                }}>
                  {index + 1}
                </Avatar>
                <ListItemText 
                  primary={
                    <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                      {instruction}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    </Box>
  );
}