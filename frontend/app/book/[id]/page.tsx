"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import ReviewForm from "../../../components/ReviewForm";
import api from "../../../lib/api";

// TypeScript Definitions
interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  genre: string;
  coverColor: string;
}

interface Review {
  _id: string;
  user: { name: string };
  rating: number;
  comment: string;
  createdAt: string;
}

export default function BookDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); // Unwrap the ID from the URL
  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        // Fetch both the Book details AND the Approved Reviews simultaneously
        const [bookRes, reviewsRes] = await Promise.all([
          api.get(`/books/${id}`),
          api.get(`/reviews/book/${id}`)
        ]);
        
        setBook(bookRes.data);
        setReviews(reviewsRes.data);
      } catch (err) {
        console.error("Failed to load book data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookData();
  }, [id]);

  if (loading) return <div className="text-center py-32 text-slate-400 text-2xl font-black tracking-widest animate-pulse">LOADING ARCHIVES...</div>;
  if (!book) return <div className="text-center py-32 text-white text-2xl">Book not found.</div>;

  // Calculate Average Rating dynamically
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1) 
    : "0.0";

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/" className="inline-flex items-center text-sm font-semibold text-slate-400 hover:text-amber-400 mb-10 transition-colors group">
        <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span> Back to Library
      </Link>

      <div className="flex flex-col lg:flex-row gap-16">
        {/* Left Column: Book Cover */}
        <div className="w-full lg:w-1/3">
          <div className="sticky top-28">
            <div className="relative w-full aspect-[2/3] rounded-2xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] mb-8">
              <div className={`absolute inset-0 bg-gradient-to-br ${book.coverColor} rounded-2xl flex items-center justify-center border border-white/10 z-10`}>
                <span className="font-serif font-black text-white text-4xl tracking-widest text-center px-6 drop-shadow-2xl">
                  {book.title}
                </span>
              </div>
              <div className="absolute top-2 bottom-2 -right-3 w-6 bg-slate-300 rounded-r-xl -z-10 shadow-inner"></div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/50 backdrop-blur-sm p-5 rounded-xl border border-white/5 text-center">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Rating</p>
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-amber-400 text-2xl">★</span>
                  <span className="text-3xl font-black text-white">{avgRating}</span>
                </div>
              </div>
              <div className="bg-slate-900/50 backdrop-blur-sm p-5 rounded-xl border border-white/5 text-center">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Reviews</p>
                <p className="text-3xl font-black text-white">{reviews.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Details & Reviews */}
        <div className="w-full lg:w-2/3">
          <div className="mb-16">
            <div className="flex gap-3 mb-6">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">{book.genre}</span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-black text-white mb-4 tracking-tight">{book.title}</h1>
            <p className="text-2xl text-slate-400 mb-8 font-light">By <span className="text-amber-400 font-medium">{book.author}</span></p>
            
            <h3 className="text-xl font-bold text-white mb-4">Synopsis</h3>
            <p className="text-slate-300 leading-relaxed text-lg font-light whitespace-pre-wrap">
              {book.description}
            </p>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-16"></div>

          {/* Reviews Section */}
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
              <h2 className="text-3xl font-bold text-white tracking-tight">Community Voices</h2>
              
              {/* Pass the real book ID to our review form */}
              <ReviewForm bookId={book._id} />
            </div>

            <div className="space-y-6">
              {reviews.length === 0 ? (
                <p className="text-slate-500 text-lg italic">No approved reviews yet. Be the first to share your thoughts!</p>
              ) : (
                reviews.map((review) => (
                  <div key={review._id} className="bg-slate-900/40 backdrop-blur-md p-8 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 flex items-center justify-center text-white font-black text-lg shadow-inner">
                          {review.user?.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-white text-lg leading-none mb-1.5">{review.user?.name}</p>
                          <p className="text-sm text-slate-500 font-medium">{new Date(review.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20 shadow-[0_0_15px_rgba(251,191,36,0.1)]">
                        <span className="text-amber-400 text-sm mr-1.5 drop-shadow-[0_0_5px_rgba(251,191,36,0.8)]">★</span>
                        <span className="font-black text-amber-400">{review.rating}.0</span>
                      </div>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-lg font-light">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}