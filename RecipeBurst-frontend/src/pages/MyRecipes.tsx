import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RecipeCard from './RecipeCard';
import RecipeForm from './RecipeForm';
import { useNavigate } from 'react-router-dom';
import { fetchRecipeByUserId } from '../services/recipeApi';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { addRecipe } from '../redux/actions/recipeActions';

interface Recipe {
    recipeId: string;
    recipeName: string;
    imageUrl?: string;
    description?: string;
    ingredients?:string
}

const RecipePage: React.FC = () => {
  const [isAddRecipeDialogOpen, setAddRecipeDialogOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const recipes = useSelector((state: RootState) => state.recipes.recipes);

  useEffect(() => {
    const fetchAndSetRecipes = async () => {
      try {
        if (user?.userId && recipes.length === 0) {
          const recipesData = await fetchRecipeByUserId(user.userId);
          recipesData.forEach((recipe: any) => dispatch(addRecipe(recipe)));
        }
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchAndSetRecipes();
  }, [dispatch, user?.userId]);

  const handleAddRecipeClick = () => {
    setAddRecipeDialogOpen(true);
  };

  const handleAddRecipeClose = () => {
    setAddRecipeDialogOpen(false);
  };
  const handleCardClick = (recipeId: string) => {
    navigate(`/recipes/${recipeId}`);
  };


  return (
    <Container
      sx={{
        paddingY: 4,
        minHeight: '100vh',
      }}
      style={{maxWidth:'100%'}}
    >
      <section>
        <Typography variant="h2" gutterBottom textAlign="center" sx={{ color: '#333' }}>
          My Recipes
        </Typography>
        <Grid container spacing={2}>
          {recipes.map(recipe => (
            <Grid item xs={12} sm={6} key={recipe.recipeId}>
              <RecipeCard key={recipe.recipeId} recipe={recipe} onClick={() => handleCardClick(recipe.recipeId)}/>
            </Grid>
          ))}
        </Grid>
      </section>
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.3s',
          '&:hover': {
            transform: 'scale(1.1)',
          },
        }}
        onClick={handleAddRecipeClick}
      >
        <AddIcon />
      </Fab>
      <Dialog
        open={isAddRecipeDialogOpen}
        onClose={handleAddRecipeClose}
        maxWidth="md"
        TransitionProps={{ appear: true, timeout: 500 }}
      >
        <DialogTitle sx={{ backgroundColor: '#3f51b5', color: 'white' }}>Add Recipe</DialogTitle>
        <DialogContent
          sx={{
            padding: 3
          }}
        >
          <RecipeForm />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddRecipeClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RecipePage;
