"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api"; 

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "User" });
  const [error, setError] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) router.push("/");
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (isLogin) {
        const res = await api.post("/auth/login", {
          email: formData.email,
          password: formData.password,
        });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        router.push("/");
        router.refresh(); 
      } else {
        await api.post("/auth/register", formData);
        alert("Account created! Now please log in.");
        setIsLogin(true);
      }
    } catch (err: any) {
      // FIX: Use optional chaining to safely access deep properties
      const errMsg = err?.response?.data?.message || "Connection failed. Is the backend running?";
      setError(errMsg);
    }
  };

  return (
    <main className="min-h-[85vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-2xl border border-white/10 p-10 rounded-3xl shadow-2xl">
        <h2 className="text-4xl font-black text-white text-center mb-10">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-xl mb-8 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <input
              type="text"
              required
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-white/5 rounded-xl p-4 bg-slate-950/50 text-white focus:border-amber-500 outline-none"
            />
          )}
          <input
            type="email"
            required
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full border border-white/5 rounded-xl p-4 bg-slate-950/50 text-white focus:border-amber-500 outline-none"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full border border-white/5 rounded-xl p-4 bg-slate-950/50 text-white focus:border-amber-500 outline-none"
          />

          {!isLogin && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
              <input 
                type="checkbox" 
                id="adminCheck"
                onChange={(e) => setFormData({ ...formData, role: e.target.checked ? "Admin" : "User" })}
              />
              <label htmlFor="adminCheck" className="text-xs text-amber-400 font-bold cursor-pointer">
                REQUEST ADMIN PRIVILEGES
              </label>
            </div>
          )}

          <button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-black py-4 rounded-xl shadow-lg">
            {isLogin ? "SIGN IN" : "GET STARTED"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button onClick={() => setIsLogin(!isLogin)} className="text-slate-400 text-sm hover:text-amber-400 transition-colors">
            {isLogin ? "New here? Create an account" : "Already have an account? Log in"}
          </button>
        </div>
      </div>
    </main>
  );
}