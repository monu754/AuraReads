import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Import our routes
import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';       
import reviewRoutes from './routes/reviewRoutes.js';   

dotenv.config();

const app = express();

app.use(cors({
  origin: [
    'http://localhost:3000', 
    'https://aurareads.vercel.app' // Your live Vercel URL
  ],
  credentials: true 
})); 
app.use(express.json()); 

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the AuraReads API!' });
});

// --- NEW TINY ROUTE FOR CRON-JOB.ORG ---
app.get('/ping', (req, res) => {
  res.status(200).send('OK'); // Sends a microscopic 2-byte response
});

// Use the Routes!
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