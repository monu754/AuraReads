import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Import our routes
import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';       // <-- NEW
import reviewRoutes from './routes/reviewRoutes.js';   // <-- NEW

dotenv.config();

const app = express();

app.use(cors()); 
app.use(express.json()); 

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the AuraReads API!' });
});

// Use the Routes!
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);       // <-- NEW
app.use('/api/reviews', reviewRoutes);   // <-- NEW

// Server Setup
const PORT = process.env.PORT || 5000;
// Connect to MongoDB Database
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('🟢 Successfully connected to MongoDB Database!');
    // Only start the server if the database connects successfully
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log('🔴 Database connection failed:');
    console.error(error);
  });