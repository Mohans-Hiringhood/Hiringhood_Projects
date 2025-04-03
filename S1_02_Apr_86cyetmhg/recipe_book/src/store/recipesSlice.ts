import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Recipe } from '../types/recipe';

export interface RecipesState {
  recipes: Recipe[];
}

export const initialRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Spaghetti Carbonara',
    description: 'Classic Italian pasta dish',
    imageUrl: 'https://t4.ftcdn.net/jpg/01/41/12/25/240_F_141122511_X1eEXS9nH13p6TziRMEmAvPmQVCYbyWy.jpg',
    ingredients: [
      { id: '1', name: 'Spaghetti', amount: '400g' },
      { id: '2', name: 'Eggs', amount: '3' },
      { id: '3', name: 'Pancetta', amount: '150g' },
    ],
    instructions: [
      'Cook pasta according to package instructions',
      'Fry pancetta until crispy',
      'Mix eggs with grated cheese',
      'Combine everything and serve hot'
    ],
    cookingTime: 20,
    category: 'veg',
  },
  {
    id: '2',
    title: 'Chicken Tikka Masala',
    description: 'Creamy Indian curry with grilled chicken',
    imageUrl: 'https://imgs.search.brave.com/8S89T6G6zlKV1O1Kwxv7E3-AKi0Ias19TrwqLCJgll8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jYWZl/ZGVsaXRlcy5jb20v/d3AtY29udGVudC91/cGxvYWRzLzIwMTgv/MDQvSGVyby1TaG9v/dC00LmpwZw',
    ingredients: [
      { id: '1', name: 'Chicken breast', amount: '500g' },
      { id: '2', name: 'Yogurt', amount: '1 cup' },
      { id: '3', name: 'Tomato paste', amount: '2 tbsp' },
      { id: '4', name: 'Heavy cream', amount: '1/2 cup' },
      { id: '5', name: 'Garam masala', amount: '1 tbsp' }
    ],
    instructions: [
      'Marinate chicken in yogurt and spices for 2 hours',
      'Grill or bake the chicken until cooked through',
      'Prepare the creamy tomato sauce in a pan',
      'Add cooked chicken to the sauce and simmer for 10 minutes',
      'Garnish with fresh cilantro and serve with naan'
    ],
    cookingTime: 40,
    category: 'non-veg',
  },
  {
    id: '3',
    title: 'Margherita Pizza',
    description: 'Classic Italian pizza with fresh tomatoes, mozzarella, and basil.',
    imageUrl: 'https://imgs.search.brave.com/DFdp4e9xp7Z8ZolqXpe0xHfzZnqdbQtOr22-1H8tLW4/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTQ1/OTcxNTc5OS9waG90/by9waXp6YS13aXRo/LWhhbS1hbmQtY2hl/ZXNlLmpwZz9zPTYx/Mng2MTImdz0wJms9/MjAmYz1ncFJNVmZx/eTQ0YWc0VGtyb1Q4/V0VlclJvdGxmS2hl/WlF1NmtRa2RobnhR/PQ',
    ingredients: [
      { id: '1', name: 'Pizza dough', amount: '1 ball' },
      { id: '2', name: 'Tomato sauce', amount: '1/2 cup' },
      { id: '3', name: 'Mozzarella cheese', amount: '200g' },
      { id: '4', name: 'Fresh basil', amount: 'Handful' },
      { id: '5', name: 'Olive oil', amount: '2 tbsp' }
    ],
    instructions: [
      'Preheat oven to 250°C (480°F).',
      'Roll out pizza dough and place on a baking sheet.',
      'Spread tomato sauce evenly over the dough.',
      'Top with sliced mozzarella cheese and fresh basil leaves.',
      'Drizzle with olive oil and bake for 10-12 minutes until golden brown.',
      'Serve hot with a sprinkle of extra basil.'
    ],
    cookingTime: 15,
    category: 'veg',
  }
];

const initialState: RecipesState = {
  recipes: initialRecipes
};

const recipesSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    addRecipe: (state, action: PayloadAction<Recipe>) => {
      state.recipes.push(action.payload);
    },
    updateRecipe: (state, action: PayloadAction<Recipe>) => {
      const index = state.recipes.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.recipes[index] = action.payload;
      }
    },
    deleteRecipe: (state, action: PayloadAction<string>) => {
      state.recipes = state.recipes.filter(recipe => recipe.id !== action.payload);
    },
  },
});

export const { addRecipe, updateRecipe, deleteRecipe } = recipesSlice.actions;
export default recipesSlice.reducer;