"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  name: string;
  email: string;
  role: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Grab the logged-in user's details from LocalStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      // If they aren't logged in, kick them back to the login page
      router.push("/login");
    }
  }, [router]);

  if (!user) return <div className="text-center py-20 text-slate-400 animate-pulse font-bold tracking-widest">LOADING PROFILE...</div>;

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-black text-white mb-8 tracking-tight">My Profile</h1>
      
      <div className="bg-slate-900/60 backdrop-blur-md p-10 rounded-3xl border border-white/5 shadow-2xl">
        
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center gap-8 mb-10 pb-10 border-b border-white/10">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.3)]">
            <span className="text-6xl font-black text-slate-950">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-3xl font-bold text-white mb-3">{user.name}</h2>
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-widest shadow-inner">
              {user.role} Member
            </span>
          </div>
        </div>

        {/* Profile Details */}
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Full Name</label>
            <div className="w-full p-4 rounded-xl bg-slate-950/50 text-white border border-white/5">
              {user.name}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Email Address</label>
            <div className="w-full p-4 rounded-xl bg-slate-950/50 text-slate-300 border border-white/5 font-light">
              {user.email}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Account Permissions</label>
            <div className="w-full p-4 rounded-xl bg-slate-950/50 text-slate-300 border border-white/5 font-light">
              {user.role === 'Admin' ? 'Administrator (Full Moderation Access)' : 'Standard Reader'}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}