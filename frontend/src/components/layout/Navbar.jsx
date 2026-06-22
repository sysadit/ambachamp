'use client'; // Wajib di Next.js untuk file dengan hooks

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Pengganti fitur isActive
import { useAuth } from "@/context/AuthContext";
import { Trophy, Search, Users, UserCircle, ShieldCheck, Bell, Clock, CheckCircle2, UserPlus, Check, ChevronDown, LogOut } from "lucide-react";

export default function Navbar() {
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notifRef = useRef(null); // Menghapus <HTMLDivElement>
  const profileRef = useRef(null);
  const pathname = usePathname(); // Untuk mengecek halaman aktif
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotif(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayName = user?.nama || user?.email || "Profil Saya";

  const mockNotifs = [
    { id: 1, title: "Batas Waktu Pendaftaran", desc: "Pendaftaran Nasional Hackathon 2026 sisa 2 hari lagi!", time: "2 jam yang lalu", read: false, icon: Clock, color: "text-rose-600", bg: "bg-rose-100" },
    { id: 2, title: "Lamaran Tim Diterima", desc: "Lamaranmu untuk posisi Frontend di tim 'Syntax Error' telah diterima.", time: "5 jam yang lalu", read: false, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-100" },
    { id: 3, title: "Ada Lamaran Baru", desc: "Budi Santoso melamar sebagai UX Researcher di tim UI/UX kamu.", time: "1 hari yang lalu", read: true, icon: UserPlus, color: "text-purple-600", bg: "bg-purple-100" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-indigo-600">
            <Trophy className="h-8 w-8" />
            <span className="font-extrabold text-2xl tracking-tight">AmbaChamp</span>
          </Link>
          
          {/* Navigasi Utama */}
          <nav className="hidden md:flex gap-8">
            <Link 
              href="/explore" 
              className={`flex items-center gap-2 font-medium transition-colors ${pathname === '/explore' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}
            >
              <Search className="h-4 w-4" /> Cari Lomba
            </Link>
            <Link 
              href="/teammate" 
              className={`flex items-center gap-2 font-medium transition-colors ${pathname === '/teammates' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}
            >
              <Users className="h-4 w-4" /> Teammate Finder
            </Link>
            <Link 
              href="/admin" 
              className={`flex items-center gap-2 font-medium transition-colors ${pathname === '/admin' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}
            >
              <ShieldCheck className="h-4 w-4" /> Admin Verifikasi
            </Link>
          </nav>

          {/* Area Kanan */}
          <div className="flex items-center gap-4">
            {!loading && !user && (
              <>
                <Link 
                  href="/auth/login" 
                  className="hidden sm:inline-flex font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  Masuk
                </Link>
                <Link 
                  href="/auth/register" 
                  className="hidden sm:inline-flex bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  Daftar
                </Link>
              </>
            )}

            {!loading && user && (
              <>
                <div className="h-6 w-px bg-slate-200 hidden sm:block mx-2"></div>

                {/* Notifikasi Dropdown */}
                <div className="relative" ref={notifRef}>
                  <button 
                    onClick={() => setShowNotif(!showNotif)}
                    className={`relative p-2 transition-colors rounded-full ${showNotif ? 'text-indigo-600 bg-slate-100' : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-100'}`}
                    aria-label="Buka notifikasi"
                  >
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
                  </button>

                  {showNotif && (
                    <div className="absolute right-0 top-full mt-3 w-[320px] sm:w-[380px] bg-white rounded-3xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
                      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <h3 className="font-extrabold text-slate-900 text-lg">Notifikasi</h3>
                        <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                          <Check className="h-3.5 w-3.5" /> Tandai dibaca
                        </button>
                      </div>
                      <div className="max-h-[400px] overflow-y-auto divide-y divide-slate-100">
                        {mockNotifs.map((notif) => (
                          <div key={notif.id} className={`p-4 flex gap-4 hover:bg-slate-50 transition-colors cursor-pointer ${!notif.read ? 'bg-indigo-50/30' : ''}`}>
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${notif.bg} ${notif.color}`}>
                              <notif.icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-1">
                                <h4 className={`text-sm ${!notif.read ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                                  {notif.title}
                                </h4>
                                {!notif.read && (
                                  <span className="h-2 w-2 rounded-full bg-indigo-600 shrink-0 mt-1.5"></span>
                                )}
                              </div>
                              <p className="text-sm text-slate-600 leading-relaxed mb-1 line-clamp-2">
                                {notif.desc}
                              </p>
                              <span className="text-xs font-medium text-slate-400">
                                {notif.time}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 border-t border-slate-100 bg-slate-50/50 text-center">
                        <Link 
                          href="/notifikasi" 
                          onClick={() => setShowNotif(false)}
                          className="text-sm font-bold text-indigo-600 hover:text-indigo-700 block w-full"
                        >
                          Lihat semua notifikasi
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profil */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setShowProfile(!showProfile)}
                    className={`flex items-center gap-2 font-medium transition-colors rounded-full py-1.5 pl-1.5 pr-3 ${pathname === '/profil' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100'}`}
                    aria-expanded={showProfile}
                    aria-label="Buka menu profil"
                  >
                    <UserCircle className="h-7 w-7" />
                    <span className="hidden sm:inline max-w-32 truncate">{displayName}</span>
                    <ChevronDown className={`hidden sm:block h-4 w-4 transition-transform ${showProfile ? 'rotate-180' : ''}`} />
                  </button>

                  {showProfile && (
                    <div className="absolute right-0 top-full mt-3 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-sm font-bold text-slate-900 truncate">{displayName}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/profil"
                        onClick={() => setShowProfile(false)}
                        className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                      >
                        <UserCircle className="h-4 w-4" />
                        Profil Saya
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setShowProfile(false);
                          logout();
                        }}
                        className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
