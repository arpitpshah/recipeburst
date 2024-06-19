import { Request, Response  } from 'express';
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { dynamoDBClient } from '../app';
import { AuthenticatedRequest  } from '../middlewares/authmiddleware';
import { logToCloudWatch } from '../utils/cloudwatchLogger';


async function validateCaptcha(token: string): Promise<boolean> {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;;
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8', // You can specify the Content-Type header here
        },
      })
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('CAPTCHA validation error:', error);
      return false;
    }
}

// Function to handle user signup
export const signup = async (req: Request, res: Response) => {
  const { emailId, password, role = 'user', firstName, lastName, recaptchaToken  } = req.body;

  try {
      // Check if user already exists to avoid duplicates

      if (!await validateCaptcha(recaptchaToken)) {
        res.status(400).json({ message: 'CAPTCHA validation failed' });
      }

      if (await userExists(emailId)) {
          res.status(400).json({ message: 'Username already taken' });
      }

      // Securely hash the password before storing it
      const hashedPassword = bcrypt.hashSync(password, 10);

      const params = {
          TableName: process.env.DYNAMODB_TABLE_NAME ?? 'userInfo',
          Item: {
              userId: generateUniqueId(), // Unique ID for the new user
              emailId,
              firstName,
              lastName,
              password: hashedPassword,
              role,
          },
      };

      await dynamoDBClient.put(params).promise();

      res.json({
          message: 'User registered successfully',
          user: { firstName, lastName }
      });
      logToCloudWatch('User registered successfully', { userId: params.Item.userId, emailId });
  } catch (error) {
      console.error('Error adding user to DynamoDB', error);
      logToCloudWatch('Error during signup', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Function to handle user login
export const login = async (req: Request, res: Response) => {
  const { emailId, password, recaptchaToken  } = req.body;

  try {

    if (!await validateCaptcha(recaptchaToken)) {
        res.status(400).json({ message: 'CAPTCHA validation failed' });
    }
      const user = await getUserFromDynamoDB(emailId);

      if (user && bcrypt.compareSync(password, user.password)) {
          // Generate and send JWT token if credentials are valid
          const token = jwt.sign(
              { userId: user.userId, emailId: user.emailId, role: user.role },
              process.env.JWT_SECRET ?? "arpitshah",
              { expiresIn: '1h' }
          );

          res.json({ token, user });
          logToCloudWatch('user logged in', { user });
      } else {
          // Respond with error if credentials are invalid
          res.status(401).json({ message: 'Invalid credentials' });
          logToCloudWatch('Invalid login attempt', { emailId });
      }
  } catch (error) {
      console.error('Error during user login:', error);
      logToCloudWatch('Error during login', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Function to check if a user already exists in the database based on email ID
async function userExists(emailid: string) {
  // Setup query parameters for DynamoDB
  const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME ?? 'userInfo',
      FilterExpression: 'emailId = :emailid',
      ExpressionAttributeValues: {
          ':emailid': emailid,
      },
  };

  try {
      // Perform the scan operation on DynamoDB
      const result = await dynamoDBClient.scan(params).promise();

      // Return true if user exists, false otherwise
      return result.Items && result.Items.length > 0;
  } catch (error) {
      // Log the error and rethrow to handle it in the calling function
      console.error('Error scanning DynamoDB:', error);
      throw error;
  }
}

// Function to retrieve a user from DynamoDB using either email ID or user ID
export async function getUserFromDynamoDB(emailid: string, userid?: string) {
  // Dynamically set the filter expression based on whether user ID is provided
  const FilterExpressionValue = userid ? 'userId = :userid' : 'emailId = :emailid';
  const ExpressionAttributeData = userid ? { ':userid': userid } : { ':emailid': emailid };

  const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME ?? 'userInfo',
      FilterExpression: FilterExpressionValue,
      ExpressionAttributeValues: ExpressionAttributeData,
  };

  try {
      // Execute the query against DynamoDB
      const result = await dynamoDBClient.scan(params).promise();

      if (result.Items && result.Items.length > 0) {
          // Return the first matching item if found
          return result.Items[0];
      } else {
          // If no user is found, log and return null
          console.error('User not found:', emailid ?? userid);
          return null;
      }
  } catch (error) {
      // Log any error during the DynamoDB operation and rethrow
      console.error('Error scanning DynamoDB:', error);
      throw error;
  }
}

// Function to retrieve and send back the user data based on the authenticated request
export const getUserData = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Extract user information from the authenticated request
    const { emailId } = req.user ?? {};

    // Retrieve user data from DynamoDB using the email ID
    const userData = await getUserFromDynamoDB(emailId);

    // Respond with the retrieved user data
    res.json({ ...userData });
  } catch (error) {
    // Log the error and respond with a 500 Internal Server Error status
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to generate a unique user ID
function generateUniqueId() {
   // Generates a random string based on current time and random number
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}


