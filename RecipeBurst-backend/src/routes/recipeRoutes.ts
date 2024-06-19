import express from 'express';
import { createRecipe, deleteRecipe, getAllRecipes, getRecipeById, updateRecipe } from '../controllers/recipeController';
import { asyncHandler } from '../middlewares/asyncHandler';

const router = express.Router();

router.post('/', asyncHandler(createRecipe));
router.get('/', asyncHandler(getAllRecipes));
router.get('/:recipeId', asyncHandler(getRecipeById));
router.put('/:recipeId', asyncHandler(updateRecipe));
router.delete('/:recipeId', asyncHandler(deleteRecipe));

export default router;
