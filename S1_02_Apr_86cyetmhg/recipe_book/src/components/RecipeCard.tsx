import { Card, CardContent, CardMedia, Typography, Chip, Box } from '@mui/material';
import { Recipe } from '../types/recipe';
import { Link } from 'react-router-dom';

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  // Debugging: Log the recipe data to console
  console.log('Recipe data:', recipe);
  
  // Ensure category has a default value if undefined
  const category = recipe.category || 'non-veg'; // Default to non-veg if undefined
  
  return (
    <Card sx={{ 
      width: 320,
      height: 380,
      display: 'flex',
      flexDirection: 'column',
      textDecoration: 'none',
      borderRadius: 2,
      overflow: 'hidden',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
      }
    }}
    component={Link}
    to={`/recipe/${recipe.id}`}>
      {/* Image with overlay effect */}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={recipe.imageUrl || '/placeholder-recipe.jpg'}
          alt={recipe.title}
          sx={{ 
            objectFit: 'cover',
            width: '100%',
            transition: 'transform 0.5s ease',
            '&:hover': {
              transform: 'scale(1.05)'
            }
          }}
        />
        {/* Cooking Time Chip - bottom right */}
        <Chip
          label={`${recipe.cookingTime} mins`}
          size="small"
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            fontWeight: 'bold',
            backdropFilter: 'blur(4px)'
          }}
        />
        {/* Category Chip - top left */}
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
      </Box>

      <CardContent sx={{ 
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        p: 2.5,
        backgroundColor: 'background.paper'
      }}>
        <Typography 
          variant="h6" 
          component="div"
          sx={{
            fontWeight: 700,
            mb: 1,
            lineHeight: 1.3,
            backgroundImage: 'linear-gradient(to right, #333, #555)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {recipe.title}
        </Typography>
        
        <Typography 
          variant="body2" 
          sx={{
            flexGrow: 1,
            color: 'text.secondary',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            px: 0.5,
          }}
        >
          {recipe.description}
        </Typography>
        
        <Box sx={{ 
          display: 'flex',
          alignItems: 'center',
          pt: 1,
          borderTop: '1px solid',
          borderColor: 'divider'
        }}>
          <Typography 
            variant="caption"
            sx={{ 
              color: 'text.secondary',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}
          >
            <Box component="span" sx={{ 
              width: 24,
              height: 24,
              borderRadius: '50%',
              backgroundColor: 'primary.light',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'primary.contrastText',
              fontSize: '0.7rem'
            }}>
              {recipe.ingredients.length}
            </Box>
            ingredients • {recipe.instructions.length} steps
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}