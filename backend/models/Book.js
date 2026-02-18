import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  author: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  genre: { 
    type: String,
    default: 'Fiction'
  },
  coverColor: { 
    type: String, 
    default: 'from-indigo-500 to-purple-600' // Default gradient for the UI
  }
}, { timestamps: true });

export default mongoose.model('Book', bookSchema);