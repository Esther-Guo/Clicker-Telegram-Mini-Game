import express from 'express';
import { validateTelegramWebAppData } from './auth';
import mongoose from 'mongoose';
import apiRoutes from './routes/api';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Add body parser middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || '');

// Use the API routes
app.use('/api', validateTelegramWebAppData, apiRoutes);

export default app;