import Book from '../models/Book.js';
import Review from '../models/Review.js'; // <-- We need this to calculate ratings!

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
    // Fetch all books and all APPROVED reviews
    const books = await Book.find().lean();
    const reviews = await Review.find({ status: 'Approved' }).lean();

    // Calculate average rating for each book
    const booksWithRatings = books.map(book => {
      // Find reviews that belong to this specific book
      const bookReviews = reviews.filter(r => r.book.toString() === book._id.toString());
      
      // Calculate the math (sum of ratings / number of reviews)
      const avgRating = bookReviews.length > 0 
        ? bookReviews.reduce((sum, r) => sum + r.rating, 0) / bookReviews.length 
        : 0; // If no reviews, rating is 0

      return { ...book, avgRating };
    });

    // Sort the array!
    booksWithRatings.sort((a, b) => {
      if (b.avgRating !== a.avgRating) {
        return b.avgRating - a.avgRating; // Primary Sort: Highest Rating First
      }
      // Secondary Sort (Tie-breaker): Newest First
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    // Send only the Top 5
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
    const { title, author, description, genre, coverColor } = req.body;
    const newBook = new Book({ title, author, description, genre, coverColor });
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