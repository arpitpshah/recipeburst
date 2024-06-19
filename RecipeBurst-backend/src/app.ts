import express, { ErrorRequestHandler } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import AWS from 'aws-sdk';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import { authenticate } from './middlewares/authmiddleware';
import { getUserData } from './controllers/authController';
import recipeRoutes from './routes/recipeRoutes';
import multer from 'multer';

AWS.config.update({ region: 'us-east-1' });

const app = express();
const storage = multer.memoryStorage(); // You can adjust storage options as needed
const upload = multer({ storage,
    limits: { fileSize: 10 * 1024 * 1024 }  });
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(upload.any()); 


export const dynamoDBClient = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

app.use('/auth', authRoutes);
app.use('/api/users', userRoutes);
app.get('/user-data', authenticate, getUserData);
app.use('/api/recipes', recipeRoutes);
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Error handling middleware
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
};

app.use(errorHandler);

export default app;
