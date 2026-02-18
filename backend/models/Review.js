import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Links to the User who wrote it
    required: true 
  },
  book: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Book', // Links to the Book being reviewed
    required: true 
  },
  rating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
  comment: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], // Enforces the moderation requirement!
    default: 'Pending' 
  }
}, { timestamps: true });

export default mongoose.model('Review', reviewSchema);