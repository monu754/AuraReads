"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";

export default function ProfilePage() {
  const router = useRouter();
  
  // --- STATE: Profile Info ---
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileMessage, setProfileMessage] = useState({ type: "", text: "" });

  // --- STATE: Password Change ---
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" });

  // Load existing data on mount
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      router.push("/login");
      return;
    }
    const user = JSON.parse(userStr);
    setName(user.name || "");
    setEmail(user.email || "");
  }, [router]);

  // 1. UPDATE PROFILE LOGIC
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage({ type: "", text: "" });
    try {
      await api.put("/auth/profile", { name, email });
      
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        user.name = name;
        user.email = email;
        localStorage.setItem("user", JSON.stringify(user));
      }
      
      setProfileMessage({ type: "success", text: "Profile updated successfully!" });
      window.dispatchEvent(new Event("storage")); 
      router.refresh();
    } catch (err: any) {
      setProfileMessage({ type: "error", text: err.response?.data?.message || "Failed to update profile." });
    }
  };

  // 2. CHANGE PASSWORD LOGIC
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage({ type: "", text: "" });

    if (newPassword !== confirmPassword) {
      return setPasswordMessage({ type: "error", text: "New passwords do not match." });
    }

    try {
      await api.put("/auth/password", { currentPassword, newPassword });
      setPasswordMessage({ type: "success", text: "Password changed successfully!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPasswordMessage({ type: "error", text: err.response?.data?.message || "Failed to change password." });
    }
  };

  // 3. DELETE ACCOUNT LOGIC
  const handleDeleteAccount = async () => {
    const isConfirmed = confirm("⚠️ DANGER ZONE: Are you absolutely sure? This cannot be undone and will permanently delete your account.");
    if (!isConfirmed) return;

    try {
      await api.delete("/auth/profile");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      alert("Your account has been permanently deleted.");
      router.push("/");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete account.");
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      
      {/* PAGE HEADER */}
      <div className="mb-12 border-b border-white/10 pb-8">
        <h1 className="text-4xl font-black text-white tracking-tight mb-2">Account Settings</h1>
        <p className="text-slate-400 text-lg">Manage your personal information, security, and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* --- LEFT COLUMN: PROFILE INFO (Spans 5 cols) --- */}
        <div className="lg:col-span-5">
          <section className="bg-slate-900/60 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none"></div>

            {/* Avatar Display */}
            <div className="flex flex-col items-center mb-10 relative z-10">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 p-1 shadow-lg mb-4">
                <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center border-2 border-slate-900">
                  <span className="text-4xl font-black text-amber-400">
                    {name ? name.charAt(0).toUpperCase() : "U"}
                  </span>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white">{name || "User"}</h2>
              <span className="px-3 py-1 mt-2 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                AuraReads Member
              </span>
            </div>

            {profileMessage.text && (
              <div className={`p-4 rounded-xl mb-6 text-sm font-bold border flex items-center gap-2 ${profileMessage.type === 'error' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                {profileMessage.type === 'success' ? '✓' : '⚠️'} {profileMessage.text}
              </div>
            )}

            <form onSubmit={handleProfileUpdate} className="space-y-6 relative z-10">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Display Name</label>
                <input 
                  required 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="w-full px-5 py-4 rounded-xl bg-slate-950 text-white border border-slate-800 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all shadow-inner" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Email Address</label>
                <input 
                  type="email"
                  required 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full px-5 py-4 rounded-xl bg-slate-950 text-white border border-slate-800 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all shadow-inner" 
                />
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25 mt-2">
                Save Profile Changes
              </button>
            </form>
          </section>
        </div>

        {/* --- RIGHT COLUMN: SECURITY & DANGER ZONE (Spans 7 cols) --- */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* PASSWORD CHANGE */}
          <section className="bg-slate-900/60 backdrop-blur-xl p-8 sm:p-10 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              Security Settings
            </h2>

            {passwordMessage.text && (
              <div className={`p-4 rounded-xl mb-8 text-sm font-bold border flex items-center gap-2 ${passwordMessage.type === 'error' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                {passwordMessage.type === 'success' ? '✓' : '⚠️'} {passwordMessage.text}
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Current Password</label>
                <input 
                  type="password"
                  required 
                  placeholder="Enter current password"
                  value={currentPassword} 
                  onChange={(e) => setCurrentPassword(e.target.value)} 
                  className="w-full px-5 py-4 rounded-xl bg-slate-950 text-white border border-slate-800 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all shadow-inner" 
                />
              </div>
              
              <div className="w-full h-px bg-slate-800/50 my-6"></div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">New Password</label>
                  <input 
                    type="password"
                    required 
                    minLength={6}
                    placeholder="Minimum 6 characters"
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    className="w-full px-5 py-4 rounded-xl bg-slate-950 text-white border border-slate-800 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all shadow-inner" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Confirm New Password</label>
                  <input 
                    type="password"
                    required 
                    placeholder="Must match new password"
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    className="w-full px-5 py-4 rounded-xl bg-slate-950 text-white border border-slate-800 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all shadow-inner" 
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <button type="submit" className="w-full sm:w-auto px-10 bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-black py-4 rounded-xl shadow-lg hover:shadow-amber-500/25 transition-all tracking-wide">
                  Update Password
                </button>
              </div>
            </form>
          </section>

          {/* DANGER ZONE */}
          <section className="bg-rose-950/20 p-8 sm:p-10 rounded-3xl border border-rose-500/20 shadow-lg">
            <h2 className="text-xl font-bold text-rose-400 mb-3 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              Danger Zone
            </h2>
            <p className="text-slate-400 text-base mb-6 max-w-2xl leading-relaxed">
              Once you delete your account, there is no going back. All of your reviews, profile data, and settings will be permanently wiped from the servers. Please be certain.
            </p>
            <button 
              onClick={handleDeleteAccount}
              className="w-full sm:w-auto px-8 bg-transparent hover:bg-rose-500/10 text-rose-400 font-bold py-3.5 rounded-xl border border-rose-500/30 transition-all tracking-wide"
            >
              Delete My Account Permanently
            </button>
          </section>

        </div>
      </div>
    </main>
  );
}