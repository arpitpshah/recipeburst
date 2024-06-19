import React, { useState, ChangeEvent } from 'react';
import { Button, TextField, TextareaAutosize, Card, CardContent, Grid, Typography, Stack, IconButton } from '@mui/material';
import { createRecipe } from '../services/recipeApi';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { addRecipe } from '../redux/actions/recipeActions';

export interface Recipe {
  recipeId:string;
  recipeName: string;
  ingredients: string;
  instructions: string;
  rating: number;
  image: File | null;
  imageUrl?: string;
  userId?: string;
  timestamp?: string;
}

const RecipeForm: React.FC = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const [recipe, setRecipe] = useState<Recipe>({
    recipeId: '',
    recipeName: '',
    ingredients: '',
    instructions: '',
    rating: 0,
    image: null,
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRecipe({ ...recipe, [name]: value });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setRecipe({ ...recipe, image: e.target.files[0] });
    }
  };

  const handleSubmit = async () => {
    try {
      if (!recipe.recipeName || !recipe.ingredients || !recipe.instructions || !recipe.image) {
        alert('Please fill in all fields');
        return;
      }
      if (!auth.user?.userId) {
        console.error('User or userId not found');
        return;
      }
      const userId = auth.user.userId;
      const newRecipe =await createRecipe(recipe, userId);
      if (newRecipe.imageUrl) {
        dispatch(addRecipe(newRecipe));
      } else {
        console.error('Image URL not returned');
      }
      alert('Recipe added successfully!');
      setRecipe({
        recipeId: '',
        recipeName: '',
        ingredients: '',
        instructions: '',
        rating: 0,
        image: null,
      })
    } catch (error) {
      console.error('Error adding recipe:', error);
      alert('Error adding recipe. Please try again.');
    }
  };

  return (
    <Card elevation={3} sx={{ maxWidth: 600, margin: 'auto', mt: 3, borderRadius: 12, overflow:'auto' }}>
      <CardContent>
        <Typography variant="h4" color="primary" gutterBottom align="center">
          Add Recipe
        </Typography>

        <form>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Recipe Name"
                name="recipeName"
                value={recipe.recipeName}
                onChange={handleInputChange}
                required
                variant="outlined"
                color="primary"
              />
            </Grid>

            <Grid item xs={12}>
              <TextareaAutosize
                minRows={4}
                placeholder="Ingredients"
                name="ingredients"
                value={recipe.ingredients}
                onChange={handleInputChange}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ced4da' }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextareaAutosize
                minRows={4}
                placeholder="Instructions"
                name="instructions"
                value={recipe.instructions}
                onChange={handleInputChange}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ced4da' }}
              />
            </Grid>

            <Grid item xs={12}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
                id="image-input"
                required
              />
              <label htmlFor="image-input">
                <Stack direction="row" alignItems="center" spacing={1}>
                  <IconButton color="primary" component="span">
                    <AddPhotoAlternateIcon />
                  </IconButton>
                  <Typography variant="body1" color="primary">
                    Choose Image
                  </Typography>
                </Stack>
              </label>
              {recipe.image && (
                <Typography variant="body2" sx={{ mt: 1, color: '#6B7280' }}>
                  {recipe.image.name}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12}>
              <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
                Save Recipe
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default RecipeForm;
