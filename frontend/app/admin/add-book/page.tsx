"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../lib/api";

export default function AddBookPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    genre: "Fiction",
    coverColor: "from-indigo-500 to-purple-600"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/books", formData);
      alert("Book published successfully!");
      router.push("/"); // Go to home to see the new book
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to add book. Ensure you are logged in as Admin.");
    }
  };

  return (
    <main className="max-w-2xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-black text-white mb-8 tracking-tight">Add New Masterpiece</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900/40 backdrop-blur-md p-10 rounded-3xl border border-white/5 shadow-2xl">
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Book Title</label>
          <input 
            required
            placeholder="e.g. The Great Gatsby" 
            className="w-full p-4 rounded-xl bg-slate-950/50 text-white border border-white/10 focus:border-amber-500 outline-none transition-all"
            onChange={(e) => setFormData({...formData, title: e.target.value})} 
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Author</label>
          <input 
            required
            placeholder="F. Scott Fitzgerald" 
            className="w-full p-4 rounded-xl bg-slate-950/50 text-white border border-white/10 focus:border-amber-500 outline-none transition-all"
            onChange={(e) => setFormData({...formData, author: e.target.value})} 
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Synopsis</label>
          <textarea 
            required
            placeholder="A brief summary of the book..." 
            rows={5}
            className="w-full p-4 rounded-xl bg-slate-950/50 text-white border border-white/10 focus:border-amber-500 outline-none transition-all resize-none"
            onChange={(e) => setFormData({...formData, description: e.target.value})} 
          />
        </div>
        <button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-black py-4 rounded-xl shadow-lg hover:shadow-amber-500/20 transition-all">
          PUBLISH TO LIBRARY
        </button>
      </form>
    </main>
  );
}