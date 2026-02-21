"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "../../../lib/api";

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export default function UserManagementPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  // NEW: Search State
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
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

    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/auth/users", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data);
      } catch (error) {
        console.error("Failed to load users", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [router]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const token = localStorage.getItem("token");
      await api.put(`/auth/users/${userId}/role`, 
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } catch (error) {
      alert("Failed to update role. Please try again.");
    }
  };

  // NEW: Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="text-center py-32 text-amber-400 text-2xl animate-pulse">Loading secure data...</div>;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
          <Link href="/admin" className="text-slate-400 hover:text-amber-400 text-sm font-bold mb-2 inline-block transition-colors">
            ← Back to Admin Console
          </Link>
          <h1 className="text-4xl font-black text-white tracking-tight">User Management</h1>
        </div>

        {/* NEW: Search Input */}
        <div className="w-full md:w-72">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-500"
            />
            <svg className="absolute right-3 top-3 h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/50 text-slate-400 text-sm uppercase tracking-wider">
                <th className="p-6 font-bold">Name</th>
                <th className="p-6 font-bold">Email</th>
                <th className="p-6 font-bold">Current Role</th>
                <th className="p-6 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400">No users found matching "{searchQuery}"</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-6"><p className="font-bold text-white text-lg">{user.name}</p></td>
                    <td className="p-6 text-slate-300">{user.email}</td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${user.role === 'Admin' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_10px_rgba(251,191,36,0.1)]' : 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      {user.role === 'User' ? (
                        <button onClick={() => handleRoleChange(user._id, 'Admin')} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-indigo-500/20">Promote to Admin</button>
                      ) : (
                        <button onClick={() => handleRoleChange(user._id, 'User')} className="bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 border border-slate-700 hover:border-rose-500/30 px-4 py-2 rounded-lg text-sm font-bold transition-all">Revoke Admin</button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}