"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from "../../lib/api";

interface Book {
  _id: string;
  title: string;
  author: string;
  coverColor: string;
}

export default function LibraryPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await api.get("/books");
        setBooks(res.data); // Fetch ALL books
      } catch (err) {
        console.error("Failed to fetch books", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-black text-white mb-4">The Complete Library</h1>
      <p className="text-slate-400 mb-10 text-lg">Browse our entire collection of masterpieces.</p>

      {loading ? (
        <p className="text-slate-400 animate-pulse">Loading library...</p>
      ) : books.length === 0 ? (
        <p className="text-slate-500">The library is completely empty.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {books.map((book) => (
            <Link href={`/book/${book._id}`} key={book._id} className="group">
              <div className="flex flex-col h-full transition-all duration-500 group-hover:-translate-y-2">
                <div className={`relative w-full aspect-[2/3] rounded-xl mb-4 bg-gradient-to-br ${book.coverColor || 'from-slate-700 to-slate-800'} flex items-center justify-center p-4 border border-white/10 shadow-lg group-hover:shadow-2xl transition-all`}>
                  <span className="font-serif font-bold text-white text-center drop-shadow-lg text-sm">{book.title}</span>
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