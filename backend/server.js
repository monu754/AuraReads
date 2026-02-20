import 'dotenv/config'; // 1. THIS MUST BE LINE 1 (Loads your secret keys first)

// 2. Import NPM Packages
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import passport from 'passport';

// 3. Import Your Local Files (These now safely have access to the secret keys)
import './config/passport.js';
import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';       
import reviewRoutes from './routes/reviewRoutes.js';   

// --- 🛑 SANITY CHECK: Did the .env file load? ---
if (!process.env.MONGO_URI) {
  console.error("❌ CRITICAL ERROR: Your .env file is missing, misnamed, or in the wrong folder.");
  console.error("Please make sure you have a file named exactly '.env' inside the 'backend' folder!");
  process.exit(1); // Stop the server from crashing wildly
}

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'https://aurareads.vercel.app' // Your live Vercel URL
  ],
  credentials: true 
})); 
app.use(express.json()); 
app.use(passport.initialize());

// Basic Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the AuraReads API!' });
});

// Tiny route for cron-job.org to keep the server awake
app.get('/ping', (req, res) => {
  res.status(200).send('OK'); 
});

// Use API Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);       
app.use('/api/reviews', reviewRoutes);   

// Server Setup
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Database
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('🟢 Successfully connected to MongoDB Database!');
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log('🔴 Database connection failed:');
    console.error(error);
  });