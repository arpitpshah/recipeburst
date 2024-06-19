// controllers/recipeController.ts
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  createRecipeService,
  getAllRecipesService,
  getRecipeByIdService,
  updateRecipeService,
  deleteRecipeService,
  getRecipeByUserIdService
} from '../services/recipeService';
import { logToCloudWatch } from '../utils/cloudwatchLogger';

interface MulterFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
}

// Function to create a new recipe
export const createRecipe = async (req: Request, res: Response) => {
  const recipeId = uuidv4(); // Generate a unique ID for the recipe
  const timestamp = new Date().toISOString(); // Timestamp for recipe creation

  try {
      const files = req.files as MulterFile[];
      if (!files || files.length === 0) {
          // Validate presence of image file in the request
          res.status(400).json({ error: 'Image is required' });
          return;
      }

      const image = files[0]; // Extract the first image file from the request
      const imageName = `${recipeId}_${image.originalname}`; // Create a unique image name
      const imageBuffer = image.buffer; // Extract the image buffer for storage

      const recipeData = {
          ...req.body,
          recipeId,
          timestamp,
      };

      // Save the recipe data along with the image
      const response = await createRecipeService(recipeData, imageBuffer, imageName);
      res.status(201).json({ ...recipeData, imageUrl: response.imageUrl }); // Return the created recipe data
      logToCloudWatch('Recipe created', { ...recipeData, imageUrl: response.imageUrl });
  } catch (error) {
      console.error('Error creating recipe:', error);
      logToCloudWatch('Error creating recipe', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to retrieve all recipes
export const getAllRecipes = async (_req: Request, res: Response) => {
  try {
    // Retrieve all recipes using the service
    const recipes = await getAllRecipesService();

    // Send the retrieved recipes as a response
    res.status(200).json(recipes);
    logToCloudWatch('All recipes', recipes);
  } catch (error) {
    // Log the error and respond with a 500 Internal Server Error status
    console.error('Error getting recipes:', error);
    logToCloudWatch('Error getting all recipes', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to retrieve a specific recipe by its ID
export const getRecipeById = async (req: Request, res: Response) => {
  const { recipeId } = req.params;

  try {
    // Fetch the recipe using its ID
    const recipe = await getRecipeByIdService(recipeId);

    // Check if the recipe was found and respond accordingly
    if (recipe) {
      res.status(200).json(recipe); // Send the found recipe
    } else {
      res.status(404).json({ error: 'Recipe not found' }); // Recipe not found response
    }
  } catch (error) {
    // Log the error and respond with a 500 Internal Server Error status
    console.error('Error getting recipe by ID:', error);
    logToCloudWatch('Error getting recipe by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to retrieve recipes created by a specific user
export const getRecipeByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    // Fetch recipes associated with the given user ID
    const recipe = await getRecipeByUserIdService(userId);

    // Respond with the recipes if found, otherwise report not found
    if (recipe) {
      res.status(200).json(recipe); // Return the found recipes
    } else {
      res.status(404).json({ error: 'Recipe not found' }); // Indicate if no recipes are found for the user
    }
  } catch (error) {
    // Log any errors and respond with a 500 Internal Server Error status
    console.error('Error getting recipe by user ID:', error);
    logToCloudWatch('Error getting recipe by user ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to update an existing recipe
export const updateRecipe = async (req: Request, res: Response) => {
  const { recipeId } = req.params; // Extracting the recipe ID from the request parameters
  const updatedData = req.body;   // Getting the updated data from the request body

  try {
    // Update the recipe with the provided ID and data
    const updatedRecipe = await updateRecipeService(recipeId, updatedData);

    // Respond with the updated recipe data
    res.status(200).json(updatedRecipe);
  } catch (error) {
    // Log any errors and respond with a 500 Internal Server Error status
    console.error('Error updating recipe:', error);
    logToCloudWatch('Error updating recipe:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to delete a specific recipe
export const deleteRecipe = async (req: Request, res: Response) => {
  const { recipeId } = req.params; // Extracting the recipe ID from the request parameters
  const data = req.body; // Extracting additional data from the request body, if any

  try {
    // Call the service to delete the recipe with the given ID
    await deleteRecipeService(recipeId, data.userId);

    // Respond with a success message after deletion
    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    // Log the error and respond with a 500 Internal Server Error status if deletion fails
    console.error('Error deleting recipe:', error);
    logToCloudWatch('Error deleting recipe:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
