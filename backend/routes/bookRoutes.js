import express from 'express';
import { getBooks, getTrendingBooks, getBookById, createBook, updateBook, deleteBook } from '../controllers/bookController.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Routes
router.get('/', getBooks);
router.get('/trending', getTrendingBooks); // <-- MUST be above /:id
router.get('/:id', getBookById);

// Protected Admin Routes
router.post('/', verifyToken, isAdmin, createBook);
router.put('/:id', verifyToken, isAdmin, updateBook);
router.delete('/:id', verifyToken, isAdmin, deleteBook);

export default router;