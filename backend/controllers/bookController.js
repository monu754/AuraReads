import Book from '../models/Book.js';
import Review from '../models/Review.js'; 

// 1. Get all books (Public - For Library Page)
export const getBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books', error: error.message });
  }
};

// 2. Get Trending Books (Public - For Home Page)
export const getTrendingBooks = async (req, res) => {
  try {
    const books = await Book.find().lean();
    const reviews = await Review.find({ status: 'Approved' }).lean();

    const booksWithRatings = books.map(book => {
      const bookReviews = reviews.filter(r => r.book.toString() === book._id.toString());
      
      const avgRating = bookReviews.length > 0 
        ? bookReviews.reduce((sum, r) => sum + r.rating, 0) / bookReviews.length 
        : 0; 

      return { ...book, avgRating };
    });

    booksWithRatings.sort((a, b) => {
      if (b.avgRating !== a.avgRating) {
        return b.avgRating - a.avgRating; 
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    res.status(200).json(booksWithRatings.slice(0, 5));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trending books', error: error.message });
  }
};

// 3. Get a single book by ID (Public)
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching book', error: error.message });
  }
};

// 4. Create a new book (Admin Only)
export const createBook = async (req, res) => {
  try {
    // ADDED coverImage to the destructuring here
    const { title, author, description, genre, coverImage, coverColor } = req.body;
    
    // ADDED coverImage to the new Book instance
    const newBook = new Book({ title, author, description, genre, coverImage, coverColor });
    await newBook.save();
    
    res.status(201).json({ message: 'Book created successfully!', book: newBook });
  } catch (error) {
    res.status(500).json({ message: 'Error creating book', error: error.message });
  }
};

// 5. Update a book (Admin Only)
export const updateBook = async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBook) return res.status(404).json({ message: 'Book not found' });
    res.status(200).json({ message: 'Book updated successfully!', book: updatedBook });
  } catch (error) {
    res.status(500).json({ message: 'Error updating book', error: error.message });
  }
};

// 6. Delete a book (Admin Only)
export const deleteBook = async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) return res.status(404).json({ message: 'Book not found' });
    res.status(200).json({ message: 'Book deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting book', error: error.message });
  }
};