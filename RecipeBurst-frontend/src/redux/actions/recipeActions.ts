import { ADD_RECIPE, DELETE_RECIPE, EDIT_RECIPE } from '../constants/recipeConstants';



interface Recipe {
  recipeId: string;
  userId: string;
  recipeName: string;
  imageUrl: string;
  ingredients: string[];
  instructions: string;
  rating: number;
  timestamp: string;
}

export const addRecipe = (recipe: Recipe) => ({
  type: ADD_RECIPE as typeof ADD_RECIPE,
  payload: recipe,
});

export const editRecipe = (recipe: Recipe) => ({
  type: EDIT_RECIPE as typeof EDIT_RECIPE,
  payload: recipe,
});

export const deleteRecipe = (recipeId: string) => ({
  type: DELETE_RECIPE as typeof DELETE_RECIPE,
  payload: recipeId,
});
