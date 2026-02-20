"use client";

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

interface User {
  name: string;
  email?: string;
  role: string;
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const checkUser = () => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    checkUser();
    setIsDropdownOpen(false); 
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsDropdownOpen(false);
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/60 backdrop-blur-xl border-b border-white/5 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Adjusted height for mobile (h-16) vs desktop (h-20) */}
        <div className="flex justify-between items-center h-16 sm:h-20">
          
          {/* LOGO SECTION - Added shrink-0 to prevent squishing */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-lg">
              <span className="text-slate-950 font-black text-lg sm:text-xl">A</span>
            </div>
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
              Aura<span className="text-amber-400">Reads</span>
            </span>
          </Link>

          {/* LINKS SECTION - Adjusted gaps for mobile */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/library" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">
              Library
            </Link>
            
            {user ? (
              <div className="flex items-center gap-4 sm:gap-6">
                {user.role === 'Admin' && (
                  <Link href="/admin" className="text-sm font-bold text-amber-500 hover:text-amber-400 transition-colors">
                    {/* Shows "Admin" on phones, "Admin Console" on laptops */}
                    <span className="hidden sm:inline">Admin Console</span>
                    <span className="sm:hidden">Admin</span>
                  </Link>
                )}
                
                {/* ---------- SLEEK USER AVATAR DROPDOWN ---------- */}
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    title={`Hi, ${user.name}`}
                    className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-800 border border-slate-700 text-amber-400 font-bold text-base sm:text-lg shadow-inner hover:border-amber-500/50 hover:shadow-[0_0_15px_rgba(251,191,36,0.2)] transition-all focus:outline-none shrink-0"
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </button>

                  {/* Dropdown Menu Box */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-48 sm:w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-slate-800 bg-slate-950/50">
                        <p className="text-sm font-bold text-white">{user.name}</p>
                        <p className="text-xs text-slate-400 truncate">{user.email || 'User Account'}</p>
                      </div>
                      <div className="p-2">
                        <Link 
                          href="/profile" 
                          className="block px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
                        >
                          My Profile
                        </Link>
                        <button 
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2.5 text-sm font-bold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-lg transition-colors mt-1"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link href="/login" className="bg-amber-500 text-slate-950 px-4 py-1.5 sm:px-5 sm:py-2 rounded-lg text-sm sm:text-base font-bold hover:bg-amber-400 transition-all shrink-0">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}