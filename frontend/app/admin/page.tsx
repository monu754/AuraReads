"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [bookSearchQuery, setBookSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'reviews' | 'books'>('reviews');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🛑 FRONTEND BOUNCER: Kick out anyone who isn't an Admin
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      router.push("/login");
      return;
    }
    const currentUser = JSON.parse(userStr);
    if (currentUser.role !== "Admin") {
      router.push("/"); // Send normal users back to the home page
      return;
    }

    // If they are an Admin, fetch the data
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

    fetchData();
  }, [activeTab, router]);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/reviews/${id}/status`, { status: newStatus });
      setReviews(reviews.filter((review) => review._id !== id));
    } catch (err) {
      alert("Failed to update review status.");
    }
  };

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

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(bookSearchQuery.toLowerCase()) || 
    book.author.toLowerCase().includes(bookSearchQuery.toLowerCase())
  );

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Admin Console</h1>
          <p className="text-slate-400 mt-2 text-lg">Manage platform content and moderation.</p>
        </div>
        
        <div className="flex flex-wrap w-full md:w-auto gap-3">
          <Link href="/admin/users" className="flex-1 md:flex-none text-center bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 font-bold px-6 py-3 rounded-xl transition-all shadow-lg">
            Manage Users
          </Link>
          <Link href="/admin/add-book" className="flex-1 md:flex-none text-center bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-amber-500/10">
            + Add New Book
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-4 mb-8 border-b border-white/10 pb-4">
        <button 
          onClick={() => setActiveTab('reviews')} 
          className={`font-bold px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${activeTab === 'reviews' ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Pending Reviews ({activeTab === 'reviews' ? reviews.length : '...'})
        </button>
        <button 
          onClick={() => setActiveTab('books')} 
          className={`font-bold px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${activeTab === 'books' ? 'bg-amber-500/20 text-amber-400' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Manage Books
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400 animate-pulse">Loading data...</div>
      ) : activeTab === 'reviews' ? (
        <div className="bg-slate-900/60 rounded-2xl border border-white/5 shadow-2xl overflow-x-auto">
          {reviews.length === 0 ? (
            <p className="p-10 text-center text-emerald-400 font-bold whitespace-nowrap">Queue is empty! All caught up.</p>
          ) : (
            <table className="min-w-full divide-y divide-slate-800">
              <thead className="bg-slate-950/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase whitespace-nowrap">Book & User</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase whitespace-nowrap">Comment</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {reviews.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-bold text-white mb-1">{r.book?.title}</p>
                      {/* Name Text: Italicizes and grays out if user is deleted */}
                      <p className={`text-sm ${!r.user ? 'text-rose-400/70 italic font-medium' : 'text-slate-500'}`}>
                        by {r.user?.name || "[Deleted Account]"}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-slate-300 text-sm min-w-[200px]">
                      <span className="text-amber-400 mr-1">★ {r.rating}</span> 
                      <span className="italic">"{r.comment}"</span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
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
        <div className="space-y-6">
          <div className="relative w-full max-w-md">
            <input 
              type="text" 
              placeholder="Search books by title or author..." 
              value={bookSearchQuery}
              onChange={(e) => setBookSearchQuery(e.target.value)}
              className="w-full bg-slate-900/60 border border-slate-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder-slate-500 shadow-lg"
            />
          </div>

          <div className="bg-slate-900/60 rounded-2xl border border-white/5 shadow-2xl overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-800">
              <thead className="bg-slate-950/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase whitespace-nowrap">Book Title</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase whitespace-nowrap">Author</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredBooks.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-slate-400 whitespace-nowrap">
                      No books found matching "{bookSearchQuery}"
                    </td>
                  </tr>
                ) : (
                  filteredBooks.map((b) => (
                    <tr key={b._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 font-bold text-white whitespace-nowrap">{b.title}</td>
                      <td className="px-6 py-4 text-slate-400 whitespace-nowrap">{b.author}</td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <Link href={`/admin/edit-book/${b._id}`} className="text-indigo-400 font-bold mr-4 hover:underline">Edit</Link>
                        <button onClick={() => handleDeleteBook(b._id)} className="text-rose-400 font-bold hover:underline">Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}