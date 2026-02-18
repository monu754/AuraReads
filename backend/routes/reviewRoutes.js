import express from 'express';
import { createReview, getBookReviews, getPendingReviews, updateReviewStatus } from '../controllers/reviewController.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Route
router.get('/book/:bookId', getBookReviews); // View approved reviews for a book

// Protected User Route
router.post('/', verifyToken, createReview); // Submit a new review

// Protected Admin Routes
router.get('/pending', verifyToken, isAdmin, getPendingReviews); // View moderation queue
router.patch('/:id/status', verifyToken, isAdmin, updateReviewStatus); // Approve/Reject

export default router;