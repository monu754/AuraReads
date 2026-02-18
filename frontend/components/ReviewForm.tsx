"use client";

import { useState } from "react";
import api from "../lib/api";

export default function ReviewForm({ bookId }: { bookId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      // Send the real request to the backend!
      await api.post("/reviews", { bookId, rating, comment });
      
      alert("Review Submitted! It is now waiting for Admin approval.");
      setIsOpen(false);
      setComment(""); // Clear the form
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to submit review. Are you logged in?");
    }
  };

  return (
    <div className="w-full sm:w-auto relative z-20">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold px-8 py-3.5 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:scale-105 transition-all duration-300"
        >
          Write a Review
        </button>
      ) : (
        <div className="absolute top-0 right-0 w-full sm:w-[450px] bg-slate-900 border border-slate-700 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7)] p-8 rounded-2xl origin-top-right animate-in fade-in zoom-in-95 duration-200">
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-5 right-5 text-slate-500 hover:text-white transition-colors bg-slate-800 p-1.5 rounded-full"
          >
            ✕
          </button>
          <h3 className="text-2xl font-bold text-white mb-6">Share your thoughts</h3>
          
          {error && <p className="text-rose-400 text-sm font-bold mb-4">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">Rating</label>
              <select 
                value={rating} 
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full border border-slate-700 rounded-xl p-3.5 bg-slate-950 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all appearance-none"
              >
                {[5, 4, 3, 2, 1].map(num => (
                  <option key={num} value={num}>{num} ★ Stars</option>
                ))}
              </select>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">Your Review</label>
              <textarea 
                required
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you like or dislike?"
                className="w-full border border-slate-700 rounded-xl p-4 bg-slate-950 text-white placeholder-slate-600 focus:border-amber-500 outline-none transition-all resize-none font-light"
              ></textarea>
            </div>

            <div className="flex gap-4">
              <button 
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex-1 bg-transparent border border-slate-700 text-slate-300 font-bold px-4 py-3.5 rounded-xl hover:bg-slate-800 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold px-4 py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all"
              >
                Submit Review
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}