"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../lib/api";

export default function AddBookPage() {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    coverImage: "", 
    coverColor: "from-slate-700 to-slate-800"
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/books", formData);
      alert("Success! Your masterpiece has been published.");
      router.push("/admin");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to add book.");
    }
  };

  return (
    <main className="max-w-3xl mx-auto py-10 sm:py-16 px-4">
      <h1 className="text-3xl sm:text-4xl font-black text-white mb-8 tracking-tight text-center">Add New Masterpiece</h1>
      
      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 bg-slate-900/40 backdrop-blur-md p-6 sm:p-10 rounded-2xl sm:rounded-3xl border border-white/5 shadow-2xl">
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Book Title</label>
          <input 
            required 
            placeholder="e.g. The Great Gatsby"
            value={formData.title || ""} 
            onChange={(e) => setFormData({...formData, title: e.target.value})} 
            className="w-full p-3 sm:p-4 rounded-xl bg-slate-950/50 text-white border border-white/10 outline-none focus:border-amber-500 transition-colors" 
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Author</label>
          <input 
            required 
            placeholder="F. Scott Fitzgerald"
            value={formData.author || ""} 
            onChange={(e) => setFormData({...formData, author: e.target.value})} 
            className="w-full p-3 sm:p-4 rounded-xl bg-slate-950/50 text-white border border-white/10 outline-none focus:border-amber-500 transition-colors" 
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Cover Image URL</label>
          <input 
            placeholder="Paste image link here (https://...)"
            value={formData.coverImage || ""} 
            onChange={(e) => setFormData({...formData, coverImage: e.target.value})} 
            className="w-full p-3 sm:p-4 rounded-xl bg-slate-950/50 text-white border border-white/10 outline-none focus:border-amber-500 transition-colors" 
          />
          <p className="text-[10px] sm:text-xs text-slate-500 mt-2 italic">Tip: Right-click a book cover online and select "Copy Image Address".</p>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Synopsis</label>
          <textarea 
            required 
            rows={5} 
            placeholder="A brief summary of the book..."
            value={formData.description || ""} 
            onChange={(e) => setFormData({...formData, description: e.target.value})} 
            className="w-full p-3 sm:p-4 rounded-xl bg-slate-950/50 text-white border border-white/10 outline-none resize-none focus:border-amber-500 transition-colors" 
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-gradient-to-r from-orange-600 to-amber-500 text-slate-950 font-black py-4 rounded-xl shadow-lg hover:shadow-orange-500/20 transition-all uppercase tracking-widest mt-2 sm:mt-4 text-sm sm:text-base"
        >
          Publish to Library
        </button>
      </form>
    </main>
  );
}