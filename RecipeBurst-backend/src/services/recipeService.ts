// services/recipeService.ts
import { DynamoDB, S3 } from 'aws-sdk';
import { logToCloudWatch } from '../utils/cloudwatchLogger';

const s3 = new S3({ region: 'us-east-1' });
const dynamoDB = new DynamoDB.DocumentClient({ region: 'us-east-1' });

// Service function to create a new recipe and save it to the database and S3
export const createRecipeService = async (recipeData: any, imageBuffer: Buffer, imageName: string) => {
  const timestamp = new Date().toISOString();

  // Define parameters to upload the image to Amazon S3
  const s3Params = {
      Bucket: 'recipeburst',
      Key: `recipe-images/${imageName}`,
      Body: imageBuffer,
      ContentType: 'image/jpeg',
  };

  try {
      // Upload the image to S3 and retrieve the image URL
      const s3Result = await s3.upload(s3Params).promise();
      const imageUrl = s3Result.Location;

      // Prepare the recipe data for insertion into DynamoDB
      const params = {
          TableName: 'recipes',
          Item: {
              ...recipeData,
              imageUrl,
              timestamp,
          },
      };

      // Save the recipe data to DynamoDB
      await dynamoDB.put(params).promise();

      // Return the saved recipe item
      return params.Item;
  } catch (error) {
      console.error('Error creating recipe:', error);
      logToCloudWatch('Error creating recipe:', error);
      throw error; // Rethrow the error for caller to handle
  }
};

// Service function to retrieve all recipes from the database
export const getAllRecipesService = async () => {
  const params = {
      TableName: 'recipes',
  };

  // Perform the scan operation on DynamoDB to retrieve all recipes
  const result = await dynamoDB.scan(params).promise();

  // Return the list of recipes
  return result.Items;
};

// Service function to retrieve a specific recipe by its ID from the database
export const getRecipeByIdService = async (recipeId: string) => {
  // Set up parameters for DynamoDB scan to find a recipe by its ID
  const params = {
      TableName: 'recipes',
      FilterExpression: 'recipeId = :recipeId',
      ExpressionAttributeValues: {
          ':recipeId': recipeId,
      },
  };

  // Execute the scan operation on DynamoDB
  const result = await dynamoDB.scan(params).promise();

  // Return the recipe(s) matching the specified ID
  return result.Items;
};

// Service function to retrieve all recipes created by a specific user
export const getRecipeByUserIdService = async (userId: string) => {
  // Configure parameters for DynamoDB scan to find recipes by a specific user ID
  const params = {
      TableName: 'recipes',
      FilterExpression: 'userId = :userId',
      ExpressionAttributeValues: {
          ':userId': userId,
      },
  };

  // Execute the scan operation on DynamoDB
  const result = await dynamoDB.scan(params).promise();

  // Return the recipes associated with the given user ID
  return result.Items;
};

export const updateRecipeService = async (recipeId: string, updatedData: any) => {
  // If the recipe includes an image update, it should be handled here
  // For example, uploading a new image to S3 and getting the URL

  try {
      // Set up parameters for the DynamoDB update operation
      const params = {
          TableName: 'recipes',
          Key: {
              recipeId,
              userId: updatedData.userId
          },
          UpdateExpression: 'SET #recipeName = :recipeName, #ingredients = :ingredients, #instructions = :instructions, #rating = :rating',
          ExpressionAttributeNames: {
              '#recipeName': 'recipeName',
              '#ingredients': 'ingredients',
              '#instructions': 'instructions',
              '#rating': 'rating',
          },
          ExpressionAttributeValues: {
              ':recipeName': updatedData.recipeName,
              ':ingredients': updatedData.ingredients,
              ':instructions': updatedData.instructions,
              ':rating': updatedData.rating,
          },
          ReturnValues: 'ALL_NEW',
      };

      // Execute the update operation in DynamoDB
      const result = await dynamoDB.update(params).promise();

      // Return the updated attributes of the recipe
      return result.Attributes;
  } catch (error) {
      console.error('Error updating recipe:', error);
      logToCloudWatch('Error updating recipe:', error);
      throw error; // Rethrow the error for caller to handle
  }
};

// Service function to delete a specific recipe from the database
export const deleteRecipeService = async (recipeId: string, userId: string) => {
  const params = {
    TableName: 'recipes',
    Key: {
      recipeId,
      userId
    },
  };
  
  // Execute the delete operation in DynamoDB
  await dynamoDB.delete(params).promise();
};
