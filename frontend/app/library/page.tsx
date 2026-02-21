"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from "../../lib/api";

interface Book {
  _id: string;
  title: string;
  author: string;
  coverColor: string;
  coverImage?: string;
}

export default function LibraryPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await api.get("/books");
        setBooks(res.data);
      } catch (err) {
        console.error("Failed to fetch books", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  // Filter books based on search query
  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-white mb-4">The Complete Library</h1>
          <p className="text-slate-400 text-lg">Browse our entire collection of masterpieces.</p>
        </div>

        {/* SEARCH BAR */}
        <div className="w-full md:w-80 relative">
          <input 
            type="text" 
            placeholder="Search by title or author..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700 text-white px-5 py-3 rounded-2xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder-slate-500 shadow-lg"
          />
          <svg className="absolute right-4 top-3.5 h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {loading ? (
        <p className="text-slate-400 animate-pulse">Loading library...</p>
      ) : books.length === 0 ? (
        <p className="text-slate-500">The library is completely empty.</p>
      ) : filteredBooks.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-white/5">
          <p className="text-slate-400 text-lg">No books found matching <span className="text-amber-400">"{searchQuery}"</span></p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {filteredBooks.map((book) => (
            <Link href={`/book/${book._id}`} key={book._id} className="group">
              <div className="flex flex-col h-full transition-all duration-500 group-hover:-translate-y-2">
                <div className={`relative w-full aspect-[2/3] rounded-xl mb-4 bg-gradient-to-br ${book.coverColor || 'from-slate-700 to-slate-800'} overflow-hidden border border-white/10 shadow-lg group-hover:shadow-2xl transition-all`}>
                  
                  {book.coverImage ? (
                    <img 
                      src={book.coverImage} 
                      alt={book.title} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full p-4">
                      <span className="font-serif font-bold text-white text-center drop-shadow-lg text-sm">{book.title}</span>
                    </div>
                  )}

                </div>
                <h3 className="text-sm font-bold text-slate-200 group-hover:text-amber-400 transition-colors truncate">{book.title}</h3>
                <p className="text-xs text-slate-500 truncate">{book.author}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}