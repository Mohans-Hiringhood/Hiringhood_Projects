import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { addRecipe, updateRecipe } from '../store/recipesSlice';
import RecipeForm from '../components/RecipeForm';
import { v4 as uuidv4 } from 'uuid';

export default function AddEditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { recipes } = useSelector((state: RootState) => state.recipes);

  const existingRecipe = id ? recipes.find(recipe => recipe.id === id) : undefined;

  const handleSubmit = (values: any) => {
    if (existingRecipe) {
      dispatch(updateRecipe({ ...values, id: existingRecipe.id }));
    } else {
      dispatch(addRecipe({ ...values, id: uuidv4() }));
    }
    navigate('/');
  };

  return (
    <RecipeForm 
      initialRecipe={existingRecipe} 
      onSubmit={handleSubmit} 
    />
  );
}