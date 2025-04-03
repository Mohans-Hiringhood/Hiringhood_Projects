import { RecipesState } from './recipesSlice';

export const loadState = (): RecipesState | undefined => {
  try {
    const serializedState = localStorage.getItem('recipeBook');
    if (serializedState === null) {
      return undefined;
    }
    
    const parsedState = JSON.parse(serializedState);
    
    // Data migration - add category if missing
    if (Array.isArray(parsedState)) {
      return {
        recipes: parsedState.map(recipe => ({
          ...recipe,
          category: recipe.category || 'non-veg' // Default to non-veg if missing
        }))
      };
    }
    
    return parsedState;
  } catch (err) {
    console.error("Could not load state from localStorage", err);
    return undefined;
  }
};

export const saveState = (state: { recipes: RecipesState }) => {
  try {
    const serializedState = JSON.stringify(state.recipes.recipes);
    localStorage.setItem('recipeBook', serializedState);
  } catch (err) {
    console.error("Could not save state to localStorage", err);
  }
};

const localStorageMiddleware = (store: any) => (next: any) => (action: any) => {
  const result = next(action);
  
  if (action.type.startsWith('recipes/')) {
    saveState(store.getState());
  }
  
  return result;
};

export default localStorageMiddleware;