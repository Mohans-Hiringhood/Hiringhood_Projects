import { TextField, Button, Stack, Grid, Typography, IconButton, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Formik, Form, FieldArray, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { Add, Delete } from '@mui/icons-material';
import { Recipe, Ingredient } from '../types/recipe';
import { useNavigate } from 'react-router-dom';
import { useFormNavigation } from '../hooks/useFormNavigation';

interface RecipeFormProps {
  initialRecipe?: Recipe;
  onSubmit: (values: Recipe) => void;
}

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  imageUrl: Yup.string().url('Must be a valid URL').required('Image URL is required'),
  cookingTime: Yup.number()
    .min(1, 'Must be at least 1 minute')
    .required('Cooking time is required'),
  ingredients: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required('Ingredient name is required'),
        amount: Yup.string().required('Amount is required'),
      })
    )
    .min(1, 'At least one ingredient is required'),
  instructions: Yup.array()
    .of(Yup.string().required('Instruction cannot be empty'))
    .min(1, 'At least one instruction is required'),
});

const AutoSubmitToken = () => {
  const { values, submitForm } = useFormikContext();
  const navigate = useNavigate();
  useFormNavigation(values, submitForm, navigate);
  return null;
};

export default function RecipeForm({ initialRecipe, onSubmit }: RecipeFormProps) {
  const defaultRecipe: Recipe = {
    id: '',
    title: '',
    description: '',
    imageUrl: '',
    ingredients: [{ id: Date.now().toString(), name: '', amount: '' }],
    instructions: [''],
    cookingTime: 0,
  };

  return (
    <Formik
      initialValues={initialRecipe || defaultRecipe}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ values, errors, touched, handleChange, handleBlur }) => (
        <Form>
          <AutoSubmitToken />
          <Grid container spacing={3} sx={{flexDirection: "column",width: "70%",margin: "0px auto",}}>
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>
                {initialRecipe ? 'Edit Recipe' : 'Add New Recipe'}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="title"
                name="title"
                label="Recipe Title"
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.title && Boolean(errors.title)}
                helperText={touched.title && errors.title}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="cookingTime"
                name="cookingTime"
                label="Cooking Time (minutes)"
                type="number"
                value={values.cookingTime}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.cookingTime && Boolean(errors.cookingTime)}
                helperText={touched.cookingTime && errors.cookingTime}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="description"
                name="description"
                label="Description"
                multiline
                rows={3}
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.description && Boolean(errors.description)}
                helperText={touched.description && errors.description}
              />
            </Grid>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={values.category}
                onChange={handleChange}
                label="Category"
              >
                <MenuItem value="veg">Vegetarian</MenuItem>
                <MenuItem value="non-veg">Non-Vegetarian</MenuItem>
              </Select>
            </FormControl>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="imageUrl"
                name="imageUrl"
                label="Image URL"
                value={values.imageUrl}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.imageUrl && Boolean(errors.imageUrl)}
                helperText={touched.imageUrl && errors.imageUrl}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Ingredients
              </Typography>
              <FieldArray name="ingredients">
                {({ push, remove }) => (
                  <Stack spacing={2}>
                    {values.ingredients.map((ingredient: Ingredient, index: number) => (
                      <Stack key={ingredient.id} direction="row" spacing={2}>
                        <TextField
                          fullWidth
                          id={`ingredients.${index}.name`}
                          name={`ingredients.${index}.name`}
                          label="Ingredient Name"
                          value={ingredient.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={
                            touched.ingredients &&
                            touched.ingredients[index]?.name &&
                            Boolean((errors.ingredients as any)?.[index]?.name)
                          }
                          helperText={
                            touched.ingredients &&
                            touched.ingredients[index]?.name &&
                            (errors.ingredients as any)?.[index]?.name
                          }
                        />
                        <TextField
                          fullWidth
                          id={`ingredients.${index}.amount`}
                          name={`ingredients.${index}.amount`}
                          label="Amount"
                          value={ingredient.amount}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={
                            touched.ingredients &&
                            touched.ingredients[index]?.amount &&
                            Boolean((errors.ingredients as any)?.[index]?.amount)
                          }
                          helperText={
                            touched.ingredients &&
                            touched.ingredients[index]?.amount &&
                            (errors.ingredients as any)?.[index]?.amount
                          }
                        />
                        <IconButton
                          onClick={() => remove(index)}
                          color="error"
                          disabled={values.ingredients.length <= 1}
                        >
                          <Delete />
                        </IconButton>
                      </Stack>
                    ))}
                    <Button
                      startIcon={<Add />}
                      onClick={() => push({ id: Date.now().toString(), name: '', amount: '' })}
                      variant="outlined"
                    >
                      Add Ingredient
                    </Button>
                  </Stack>
                )}
              </FieldArray>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Instructions
              </Typography>
              <FieldArray name="instructions">
                {({ push, remove }) => (
                  <Stack spacing={2}>
                    {values.instructions.map((instruction: string, index: number) => (
                      <Stack key={index} direction="row" spacing={2} alignItems="center">
                        <Typography variant="body1" sx={{ minWidth: 50 }}>
                          {index + 1}.
                        </Typography>
                        <TextField
                          fullWidth
                          id={`instructions.${index}`}
                          name={`instructions.${index}`}
                          value={instruction}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          multiline
                          error={
                            touched.instructions &&
                            Boolean((errors.instructions as any)?.[index])
                          }
                          helperText={
                            touched.instructions && (errors.instructions as any)?.[index]
                          }
                        />
                        <IconButton
                          onClick={() => remove(index)}
                          color="error"
                          disabled={values.instructions.length <= 1}
                        >
                          <Delete />
                        </IconButton>
                      </Stack>
                    ))}
                    <Button
                      startIcon={<Add />}
                      onClick={() => push('')}
                      variant="outlined"
                    >
                      Add Instruction
                    </Button>
                  </Stack>
                )}
              </FieldArray>
            </Grid>

            <Grid item xs={12}>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button type="submit" variant="contained" color="primary">
                  Save Recipe
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
}