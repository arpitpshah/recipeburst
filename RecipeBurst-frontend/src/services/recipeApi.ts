import { Recipe } from "../pages/RecipeForm";

const apiUrl = 'http://recipeburst-backend.us-east-1.elasticbeanstalk.com/';

export const createRecipe = async (recipe: Recipe,userId:string) => {
    const formData = new FormData();
    formData.append('recipeName', recipe.recipeName);
    formData.append('ingredients', recipe.ingredients);
    formData.append('instructions', recipe.instructions);
    formData.append('rating', String(recipe.rating));
    formData.append('image', recipe.image as File);
    formData.append('userId', userId);
  
    try {
      const response=await fetch(`${apiUrl}api/recipes`, {
        method: 'POST',
        body: formData,
      });
      return response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
};

export const fetchRecipes = async () => {
  const response = await fetch(`${apiUrl}api/recipes`);

  if (!response.ok) {
    throw new Error('Failed to fetch recipes');
  }

  return response.json();
};

export const fetchRecipeByRecipeId = async (recipeId: string,) => {
  const response = await fetch(`${apiUrl}api/recipes/${recipeId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch recipes');
  }

  return response.json();
};

export const fetchRecipeByUserId = async (userId: string,) => {
  const response = await fetch(`${apiUrl}api/users/recipes/${userId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch recipes');
  }

  return response.json();
};

export const editRecipe = async (recipeId: string, updatedData: any) => {
  const response = await fetch(`${apiUrl}api/recipes/${recipeId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) {
    throw new Error('Failed to edit recipe');
  }

  return response.json();
};

export const deleteRecipe = async (recipeId: string, userId: string) => {
  const response = await fetch(`${apiUrl}api/recipes/${recipeId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId: userId }),
  });

  if (!response.ok) {
    throw new Error('Failed to delete recipe');
  }

  return response.json();
};
