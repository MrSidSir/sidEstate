// api/index.js
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import listingRouter from './routes/listing.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';


import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';

// __dirname setup for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000; // ✅ Manually set port

// ✅ Manually provide MongoDB URI and JWT secret
const MONGO_URI = 'mongodb+srv://irshad1554:jFPbK2Qu1Ycvw97l@sidestate.flbqdyq.mongodb.net/?retryWrites=true&w=majority&appName=sidEstate';
const JWT_SECRET = 'irshad_secret_key_123'; // pass this to other files if needed

// ✅ Middleware
app.use(cookieParser());
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// ✅ Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ API Routes
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
