import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { MongoMemoryServer } from 'mongodb-memory-server';

// Routes
import userRoutes from './routes/userRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import callRecordRoutes from './routes/callRecordRoutes.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Setup MongoDB Memory Server and connect
let mongoServer;
const connectDB = async () => {
  try {
    console.log('Starting MongoDB Memory Server...');
    // Create an in-memory MongoDB instance
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    console.log('MongoDB Memory Server URI:', mongoUri);
    
    // Connect to the in-memory database
    await mongoose.connect(mongoUri);
    console.log('MongoDB Memory Server connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    console.error(err.stack);
    process.exit(1);
  }
};

// Connect to MongoDB
connectDB();

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/call-records', callRecordRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message || 'Something went wrong on the server',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

// Start server
const PORT = process.env.PORT || 5001; // Changed to 5001 to avoid port conflict
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});