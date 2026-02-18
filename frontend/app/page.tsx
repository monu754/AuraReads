"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from "../lib/api";

interface Book {
  _id: string;
  title: string;
  author: string;
  coverColor: string;
  avgRating?: number; // The new property from our backend!
}

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingBooks = async () => {
      try {
        // Fetch from the new Trending route!
        const res = await api.get("/books/trending");
        setBooks(res.data);
      } catch (err) {
        console.error("Failed to fetch trending books", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrendingBooks();
  }, []);

  return (
    <main className="pb-24">
      <div className="px-4 py-24 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-sm font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(245,158,11,0.2)]">
          <span className="w-2 h-2 rounded-full bg-amber-400 inline-block mr-2 animate-pulse"></span>
          Beta Access Live
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
          Discover your next <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 filter drop-shadow-[0_0_20px_rgba(245,158,11,0.3)]">
            literary obsession.
          </span>
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-slate-400 font-light leading-relaxed">
          Immerse yourself in honest reviews, share your thoughts, and build a library of masterpieces in an ad-free, premium space.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-white">Trending This Week</h2>
            <p className="text-slate-400 text-sm mt-1">Top rated by the community</p>
          </div>
          <Link href="/library" className="text-amber-400 font-bold hover:underline text-sm">
            View Full Library →
          </Link>
        </div>
        
        {loading ? (
          <p className="text-slate-400 animate-pulse">Loading library...</p>
        ) : books.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/20 rounded-3xl border border-dashed border-white/10">
            <p className="text-slate-500">The library is currently empty. Admins can add books via the Admin Console.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {books.map((book) => (
              <Link href={`/book/${book._id}`} key={book._id} className="group">
                <div className="flex flex-col h-full transition-all duration-500 group-hover:-translate-y-3">
                  <div className={`relative w-full aspect-[2/3] rounded-xl mb-5 bg-gradient-to-br ${book.coverColor || 'from-slate-700 to-slate-800'} flex items-center justify-center p-4 border border-white/10 shadow-xl group-hover:shadow-2xl transition-all`}>
                    
                    {/* The new Star Rating Badge! */}
                    <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-1.5 shadow-lg">
                      <span className="text-amber-400 text-xs drop-shadow-[0_0_5px_rgba(251,191,36,0.8)]">★</span>
                      <span className="text-white text-xs font-black">
                        {book.avgRating && book.avgRating > 0 ? book.avgRating.toFixed(1) : 'New'}
                      </span>
                    </div>

                    <span className="font-serif font-bold text-white text-center drop-shadow-lg">{book.title}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-200 group-hover:text-amber-400 transition-colors truncate">{book.title}</h3>
                  <p className="text-sm text-slate-500 truncate">{book.author}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}