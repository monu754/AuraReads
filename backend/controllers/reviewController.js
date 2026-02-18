import Review from '../models/Review.js';

// 1. Submit a Review (Logged-in Users Only)
export const createReview = async (req, res) => {
  try {
    const { bookId, rating, comment } = req.body;
    
    // Create review with "Pending" status
    const newReview = new Review({
      user: req.user.id, // We get this from the verifyToken middleware!
      book: bookId,
      rating,
      comment,
      status: 'Pending' 
    });

    await newReview.save();
    res.status(201).json({ message: 'Review submitted and is waiting for Admin approval!' });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting review', error: error.message });
  }
};

// 2. Get Approved Reviews for a Specific Book (Public)
export const getBookReviews = async (req, res) => {
  try {
    // Only fetch reviews that an Admin has explicitly "Approved"
    const reviews = await Review.find({ book: req.params.bookId, status: 'Approved' })
                                .populate('user', 'name') // Gets the user's name instead of just their ID
                                .sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
};

// 3. Get All Pending Reviews (Admin Only)
export const getPendingReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ status: 'Pending' })
                                .populate('user', 'name')
                                .populate('book', 'title')
                                .sort({ createdAt: 1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending reviews', error: error.message });
  }
};

// 4. Update Review Status - Approve/Reject (Admin Only)
export const updateReviewStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'Approved' or 'Rejected'
    
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const review = await Review.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );

    if (!review) return res.status(404).json({ message: 'Review not found' });
    
    res.status(200).json({ message: `Review has been ${status.toLowerCase()}!`, review });
  } catch (error) {
    res.status(500).json({ message: 'Error updating review status', error: error.message });
  }
};