import { useState } from 'react';
import { Grid, Box, Typography, Stack, Button, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import RecipeCard from '../components/RecipeCard';
import SearchBar from '../components/SearchBar';
import { SortByAlpha, ArrowDownward, ArrowUpward, LocalDining, SetMeal } from '@mui/icons-material';

type DietFilter = 'all' | 'veg' | 'non-veg';

export default function Home() {
  const { recipes } = useSelector((state: RootState) => state.recipes);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [dietFilter, setDietFilter] = useState<DietFilter>('all');

  const filteredRecipes = recipes.filter(recipe => {
    // First apply diet filter
    const matchesDiet = dietFilter === 'all' || recipe.category === dietFilter;
    
    // Then apply search filter if diet matches
    if (!matchesDiet) return false;
    
    return (
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.ingredients.some(ingredient =>
        ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  });

  // Sort recipes alphabetically
  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    const titleA = a.title.toLowerCase();
    const titleB = b.title.toLowerCase();
    return sortOrder === 'asc' 
      ? titleA.localeCompare(titleB)
      : titleB.localeCompare(titleA);
  });

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const handleDietFilterChange = (
    event: React.MouseEvent<HTMLElement>,
    newFilter: DietFilter
  ) => {
    if (newFilter !== null) {
      setDietFilter(newFilter);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        justifyContent="space-between" 
        alignItems="center"
        spacing={2}
        sx={{ mb: 4 }}
      >
        <Typography variant="h4" component="h1">
          My Recipe Collection
        </Typography>
        
        <Stack direction="row" alignItems="center" flexWrap="wrap" sx={{gap: "15px",}}>
          <ToggleButtonGroup
            value={dietFilter}
            exclusive
            onChange={handleDietFilterChange}
            aria-label="diet filter"
            size="small"
            sx={{ mr: 1 }}
          >
            <ToggleButton value="all" aria-label="all recipes">
              <LocalDining sx={{ mr: 1 }} />
              All
            </ToggleButton>
            <ToggleButton value="veg" aria-label="veg recipes">
              <SetMeal sx={{ mr: 1 }} color="success" />
              Veg
            </ToggleButton>
            <ToggleButton value="non-veg" aria-label="non-veg recipes">
              <SetMeal sx={{ mr: 1 }} color="error" />
              Non-Veg
            </ToggleButton>
          </ToggleButtonGroup>

          <Button
            variant="outlined"
            startIcon={<SortByAlpha />}
            endIcon={sortOrder === 'asc' ? <ArrowUpward /> : <ArrowDownward />}
            onClick={toggleSortOrder}
            sx={{ textTransform: 'none', mr: 1 }}
          >
            Sort {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
          </Button>
          
          <SearchBar 
            searchTerm={searchTerm} 
            onSearchChange={setSearchTerm} 
          />
        </Stack>
      </Stack>

      {sortedRecipes.length === 0 ? (
        <Typography variant="body1">
          {searchTerm ? 'No recipes match your search.' : 'No recipes found. Add your first recipe!'}
        </Typography>
      ) : (
        <Grid container spacing={4} sx={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          justifyContent: 'center'
        }}>
          {sortedRecipes.map((recipe) => (
            <Grid item key={recipe.id}>
              <RecipeCard recipe={recipe} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}