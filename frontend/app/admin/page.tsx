"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "../../lib/api";

interface Review {
  _id: string;
  rating: number;
  comment: string;
  status: string;
  book?: { title: string };
  user?: { name: string };
}

interface Book {
  _id: string;
  title: string;
  author: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'reviews' | 'books'>('reviews');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'reviews') {
        const res = await api.get("/reviews/pending");
        setReviews(res.data);
      } else {
        const res = await api.get("/books");
        setBooks(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // Update Review Status
  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/reviews/${id}/status`, { status: newStatus });
      setReviews(reviews.filter((review) => review._id !== id));
    } catch (err) {
      alert("Failed to update review status.");
    }
  };

  // Delete Book
  const handleDeleteBook = async (id: string) => {
    if (!confirm("Are you sure you want to delete this book? This cannot be undone.")) return;
    try {
      await api.delete(`/books/${id}`);
      setBooks(books.filter((book) => book._id !== id));
      alert("Book deleted successfully.");
    } catch (err) {
      alert("Failed to delete book.");
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Admin Console</h1>
          <p className="text-slate-400 mt-2 text-lg">Manage platform content and moderation.</p>
        </div>
        <Link href="/admin/add-book" className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-amber-500/10">
          + Add New Book
        </Link>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-4 mb-8 border-b border-white/10 pb-4">
        <button 
          onClick={() => setActiveTab('reviews')} 
          className={`font-bold px-4 py-2 rounded-lg transition-colors ${activeTab === 'reviews' ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Pending Reviews ({activeTab === 'reviews' ? reviews.length : '...'})
        </button>
        <button 
          onClick={() => setActiveTab('books')} 
          className={`font-bold px-4 py-2 rounded-lg transition-colors ${activeTab === 'books' ? 'bg-amber-500/20 text-amber-400' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Manage Books
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400 animate-pulse">Loading data...</div>
      ) : activeTab === 'reviews' ? (
        
        /* ---------------- REVIEWS TABLE ---------------- */
        <div className="bg-slate-900/60 rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
          {reviews.length === 0 ? (
            <p className="p-10 text-center text-emerald-400 font-bold">Queue is empty! All caught up.</p>
          ) : (
            <table className="min-w-full divide-y divide-slate-800">
              <thead className="bg-slate-950/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase">Book & User</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase">Comment</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {reviews.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-white mb-1">{r.book?.title}</p>
                      <p className="text-sm text-slate-500">by {r.user?.name}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-300 text-sm">
                      <span className="text-amber-400 mr-1">★ {r.rating}</span> 
                      <span className="italic">"{r.comment}"</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleStatusUpdate(r._id, 'Approved')} className="text-emerald-400 font-bold mr-4 hover:underline">Approve</button>
                      <button onClick={() => handleStatusUpdate(r._id, 'Rejected')} className="text-rose-400 font-bold hover:underline">Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        
        /* ---------------- BOOKS TABLE ---------------- */
        <div className="bg-slate-900/60 rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
          <table className="min-w-full divide-y divide-slate-800">
            <thead className="bg-slate-950/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase">Book Title</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase">Author</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {books.map((b) => (
                <tr key={b._id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-white">{b.title}</td>
                  <td className="px-6 py-4 text-slate-400">{b.author}</td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/edit-book/${b._id}`} className="text-indigo-400 font-bold mr-4 hover:underline">Edit</Link>
                    <button onClick={() => handleDeleteBook(b._id)} className="text-rose-400 font-bold hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}