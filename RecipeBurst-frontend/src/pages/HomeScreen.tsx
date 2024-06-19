import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Typography, Grid } from '@mui/material';
import RecipeCard from './RecipeCard';
import MyCarousel from './Carousel';
import { Recipe } from './RecipeForm';
import { useNavigate } from 'react-router-dom';
import { fetchRecipes } from '../services/recipeApi';

const HomeScreen: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getRecipes = async () => {
      try {
        const recipesData = await fetchRecipes();
        setRecipes(recipesData);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    getRecipes();
  }, []);

  const handleCardClick = (recipeId: string) => {
    navigate(`/recipes/${recipeId}`);
  };

  return (
    <Container style={{maxWidth:'100%'}} className='p-0'>
      <MyCarousel/>
      <section>
        <Typography variant="h2" gutterBottom textAlign={'center'}>
          Featured Recipes
        </Typography>
        <Grid container spacing={2}>
          {recipes.map(recipe => (
            <Grid item xs={12} sm={6} key={recipe.recipeId}>
              <RecipeCard recipe={recipe} onClick={() => handleCardClick(recipe.recipeId)} />
            </Grid>
          ))}
        </Grid>
      </section>
    </Container>
  );
};

export default HomeScreen;
