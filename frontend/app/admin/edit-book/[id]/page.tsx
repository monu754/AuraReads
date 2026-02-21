"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import api from "../../../../lib/api";

export default function EditBookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({ 
    title: "", 
    author: "", 
    description: "", 
    genre: "", 
    coverImage: "", 
    coverColor: "" 
  });

  useEffect(() => {
    // 🛑 FRONTEND BOUNCER: Kick out non-admins
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      router.push("/login");
      return;
    }
    const currentUser = JSON.parse(userStr);
    if (currentUser.role !== "Admin") {
      router.push("/");
      return;
    }

    const fetchBook = async () => {
      try {
        const res = await api.get(`/books/${id}`);
        setFormData(res.data);
        setLoading(false);
      } catch (err) {
        alert("Failed to fetch book data.");
        router.push("/admin");
      }
    };
    fetchBook();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/books/${id}`, formData);
      alert("Book updated successfully!");
      router.push("/admin");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update book.");
    }
  };

  if (loading) return <div className="text-center py-20 text-white font-bold animate-pulse tracking-widest text-xl">LOADING BOOK DATA...</div>;

  return (
    <main className="max-w-3xl mx-auto py-10 sm:py-16 px-4">
      <h1 className="text-3xl sm:text-4xl font-black text-white mb-8 tracking-tight text-center">Edit Masterpiece</h1>
      
      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 bg-slate-900/40 backdrop-blur-md p-6 sm:p-10 rounded-2xl sm:rounded-3xl border border-white/5 shadow-2xl">
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Book Title</label>
          <input 
            required 
            value={formData.title || ""} 
            onChange={(e) => setFormData({...formData, title: e.target.value})} 
            className="w-full p-3.5 sm:p-4 rounded-xl bg-slate-950/50 text-white border border-white/10 outline-none focus:border-amber-500 transition-colors" 
          />
        </div>
        
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Author</label>
          <input 
            required 
            value={formData.author || ""} 
            onChange={(e) => setFormData({...formData, author: e.target.value})} 
            className="w-full p-3.5 sm:p-4 rounded-xl bg-slate-950/50 text-white border border-white/10 outline-none focus:border-amber-500 transition-colors" 
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Cover Image URL</label>
          <input 
            placeholder="Paste new image link here (https://...)"
            value={formData.coverImage || ""} 
            onChange={(e) => setFormData({...formData, coverImage: e.target.value})} 
            className="w-full p-3.5 sm:p-4 rounded-xl bg-slate-950/50 text-white border border-white/10 outline-none focus:border-amber-500 transition-colors" 
          />
          <p className="text-[10px] sm:text-xs text-slate-500 mt-2 italic">Tip: Right-click a book cover online and select "Copy Image Address".</p>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Synopsis</label>
          <textarea 
            required 
            rows={5} 
            value={formData.description || ""} 
            onChange={(e) => setFormData({...formData, description: e.target.value})} 
            className="w-full p-3.5 sm:p-4 rounded-xl bg-slate-950/50 text-white border border-white/10 outline-none resize-none focus:border-amber-500 transition-colors" 
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
          <button type="button" onClick={() => router.push('/admin')} className="order-2 sm:order-1 flex-1 border border-white/10 text-white font-bold py-3.5 sm:py-4 rounded-xl hover:bg-white/5 transition-colors text-sm sm:text-base">
            Cancel
          </button>
          <button type="submit" className="order-1 sm:order-2 flex-1 bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-black py-3.5 sm:py-4 rounded-xl shadow-lg hover:shadow-amber-500/20 transition-all uppercase tracking-widest text-sm sm:text-base">
            Save Changes
          </button>
        </div>
      </form>
    </main>
  );
}