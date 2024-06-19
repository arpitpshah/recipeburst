import { Request, Response } from 'express';
import AWS from 'aws-sdk';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { getAllUsersFromDynamoDB } from '../services/userService';
import { getUserFromDynamoDB } from './authController';
import { logToCloudWatch } from '../utils/cloudwatchLogger';

dotenv.config();

export const dynamoDBClient = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });


// Function to retrieve all users from the database
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    // Fetch all users using the service function
    const users = await getAllUsersFromDynamoDB();

    // Respond with the list of users
    res.status(200).json(users);
  } catch (error) {
    // Log the error and respond with a 500 Internal Server Error status if an error occurs
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to retrieve a user's email address from DynamoDB using their user ID
export const getUserEmail = async (userId: string): Promise<string | null> => {
  try {
    const user = await getUserFromDynamoDB('', userId);

    // Return the email if the user is found, otherwise return null
    return user?.emailId ?? null;
  } catch (error) {
    console.error('Error fetching user email:', error);
    throw error;  // Rethrow the error for the caller to handle
  }
};

// Function to edit an existing user's details
export const editUser = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const { emailId, firstName, lastName, password, role } = req.body;

  try {
    // Retrieve the existing user information from DynamoDB
    const existingUser = await getUserFromDynamoDB('', userId);

    // Check if the user exists in the database
    if (!existingUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Prepare updated user data, hashing the password if it's being changed
    const updatedUser = {
      ...existingUser,
      emailId: emailId ?? existingUser.emailId,
      firstName: firstName ?? existingUser.firstName,
      lastName: lastName ?? existingUser.lastName,
      password: password ? bcrypt.hashSync(password, 10) : existingUser.password,
      role: role ?? existingUser.role,
    };

    // Define parameters for DynamoDB update operation
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME ?? 'userInfo',
      Key: { userId: userId },
      UpdateExpression: 'SET emailId = :emailId, firstName = :firstName, lastName = :lastName, password = :password, #userRole = :role',
      ExpressionAttributeValues: {
        ':emailId': updatedUser.emailId,
        ':firstName': updatedUser.firstName,
        ':lastName': updatedUser.lastName,
        ':password': updatedUser.password,
        ':role': updatedUser.role,
      },
      ExpressionAttributeNames: {
        "#userRole": "role"
      }
    };

    // Perform the update operation in DynamoDB
    await dynamoDBClient.update(params).promise();

    // Respond with success message and updated user details
    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    logToCloudWatch('User updated', { userId });
  } catch (error) {
    // Log the error and respond with a 500 Internal Server Error status
    console.error('Error updating user:', error);
    logToCloudWatch('Error updating user', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to delete a user by their ID
export const deleteUser = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    const existingUser = await getUserFromDynamoDB('', userId);

    // Return 404 if the user does not exist
    if (!existingUser) {
      res.status(404).json({ message: 'User not found' });
      return
    }

    // Perform the deletion in DynamoDB
    await dynamoDBClient.delete({
      TableName: process.env.DYNAMODB_TABLE_NAME ?? 'userInfo',
      Key: { userId: userId },
    }).promise();

    // Confirm successful deletion
    res.status(204).json({ message: 'User deleted successfully' });
    logToCloudWatch('User deleted', { userId });
  } catch (error) {
    console.error('Error deleting user:', error);
    logToCloudWatch('Error deleting user', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
