import express from 'express';
import { deleteUser, editUser, getAllUsers } from '../controllers/userController';
import { getRecipeByUserId } from '../controllers/recipeController';
import { asyncHandler } from '../middlewares/asyncHandler';

const router = express.Router();

router.get('/admin', asyncHandler(getAllUsers));
router.get('/recipes/:userId', asyncHandler(getRecipeByUserId));
router.put('/admin/:userId', asyncHandler(editUser));
router.delete('/admin/:userId', asyncHandler(deleteUser));

export default router;
