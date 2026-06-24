'use client'; // Wajib di Next.js untuk file dengan hooks

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; 
import { useAuth } from "@/context/AuthContext";
import { notifAPI } from "@/lib/api";
import { Search, Users, UserCircle, ShieldCheck, Bell, Clock, CheckCircle2, UserPlus, Check, ChevronDown, LogOut, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notifRef = useRef(null); 
  const profileRef = useRef(null);
  const pathname = usePathname(); 
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

  const [notifs, setNotifs] = useState([]);
  const unreadCount = notifs.filter(n => !n.is_read).length;

  // ambil notifikasi dari server saat user login
  useEffect(() => {
    if (!user) { setNotifs([]); return; }
    notifAPI.getAll()
      .then(r => setNotifs(r.data.data || []))
      .catch(() => setNotifs([]));
  }, [user]);

  const tandaiSemuaDibaca = async () => {
    try {
      await notifAPI.markAllRead();
      setNotifs(notifs.map(n => ({ ...n, is_read: 1 })));
    } catch {
      // diemin
    }
  };

  const waktuRelatif = (ts) => {
    if (!ts) return '';
    const diff = Date.now() - new Date(ts).getTime();
    const menit = Math.floor(diff / 60000);
    if (menit < 1) return 'Baru saja';
    if (menit < 60) return `${menit} menit yang lalu`;
    const jam = Math.floor(menit / 60);
    if (jam < 24) return `${jam} jam yang lalu`;
    const hari = Math.floor(jam / 24);
    return `${hari} hari yang lalu`;
  };

  return (
    <header className="sticky top-0 left-0 w-full z-50 bg-surface/85 backdrop-blur-md border-b border-outline-variant px-lg h-20 transition-all">
      <div className="max-w-container-max mx-auto h-full flex items-center justify-between">
        
        <div className="flex items-center gap-xl">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img alt="AMBAChamp Logo" className="h-10 w-auto object-contain" src="/images/logo-ambachamp.png" />
            <span className="font-display text-headline-md font-bold text-primary">AMBAChamp</span>
          </Link>
          
          {/* Navigasi Utama */}
          <nav className="hidden md:flex items-center gap-lg">
            <Link
              href="/explore"
              className={`font-label-lg py-1 transition-colors ${pathname === '/explore' ? 'text-secondary border-b-2 border-secondary' : 'text-on-surface-variant hover:text-primary'}`}
            >
              Find Competitions
            </Link>
            {user?.role === 'mahasiswa' && (
              <Link
                href="/teammate/list"
                className={`font-label-lg py-1 transition-colors ${pathname.startsWith('/teammate') ? 'text-secondary border-b-2 border-secondary' : 'text-on-surface-variant hover:text-primary'}`}
              >
                Teammate Finder
              </Link>
            )}
            <Link
              href="/#tentang-kami"
              className="font-label-lg text-on-surface-variant hover:text-primary transition-colors py-1"
            >
              About
            </Link>
          </nav>
        </div>

        {/* Area Kanan */}
        <div className="flex items-center gap-md">
          {!loading && !user && (
            <>
              <Link 
                href="/auth/login" 
                className="hidden sm:inline-flex font-label-lg text-primary hover:text-secondary transition-colors"
              >
                Masuk
              </Link>
              <Link 
                href="/auth/register" 
                className="hidden sm:inline-flex bg-primary text-on-primary px-lg py-2.5 rounded-lg font-label-lg hover:opacity-90 active:scale-95 transition-all shadow-sm"
              >
                Daftar
              </Link>
            </>
          )}

          {!loading && user && (
            <>
              {/* Notifikasi Dropdown */}
              <div className="relative" ref={notifRef}>
                <button 
                  onClick={() => setShowNotif(!showNotif)}
                  className={`relative p-2 transition-all rounded-full flex items-center justify-center ${showNotif ? 'text-secondary bg-surface-container' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'}`}
                  aria-label="Buka notifikasi"
                >
                  <span className="material-symbols-outlined text-2xl">notifications</span>
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-error rounded-full border-2 border-surface"></span>
                  )}
                </button>

                {showNotif && (
                  <div className="absolute right-0 top-full mt-3 w-[320px] sm:w-[380px] bg-surface-container-lowest rounded-3xl shadow-xl border border-outline-variant z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
                    <div className="p-4 border-b border-outline-variant flex items-center justify-between bg-surface-container-low">
                      <h3 className="font-display font-bold text-primary text-base">Notifikasi</h3>
                      {unreadCount > 0 && (
                        <button onClick={tandaiSemuaDibaca} className="text-xs font-bold text-secondary hover:text-secondary-container flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">done_all</span> Tandai dibaca
                        </button>
                      )}
                    </div>
                    <div className="max-h-[400px] overflow-y-auto divide-y divide-outline-variant">
                      {notifs.length === 0 ? (
                        <div className="p-8 text-center text-body-sm text-on-surface-variant">Belum ada notifikasi.</div>
                      ) : notifs.map((notif) => (
                        <div key={notif.id} className={`p-4 flex gap-4 hover:bg-surface-container-low transition-colors cursor-pointer ${!notif.is_read ? 'bg-surface-container-high/30' : ''}`}>
                          <div className="h-10 w-10 rounded-full flex items-center justify-center shrink-0 bg-surface-container-high text-primary">
                            <span className="material-symbols-outlined text-lg">notifications</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                              <h4 className={`text-body-sm truncate ${!notif.is_read ? 'font-bold text-primary' : 'font-semibold text-on-surface'}`}>
                                {notif.judul}
                              </h4>
                              {!notif.is_read && (
                                <span className="h-2 w-2 rounded-full bg-secondary shrink-0 mt-1.5"></span>
                              )}
                            </div>
                            <p className="text-body-sm text-on-surface-variant leading-relaxed mb-1 line-clamp-2">
                              {notif.pesan}
                            </p>
                            <span className="text-label-sm text-on-surface-variant font-medium">
                              {waktuRelatif(notif.created_at)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-outline-variant bg-surface-container-low text-center">
                      <Link 
                        href="/notifikasi" 
                        onClick={() => setShowNotif(false)}
                        className="text-body-sm font-bold text-secondary hover:text-secondary-container block w-full"
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
                  className={`flex items-center gap-2 font-display text-label-lg transition-colors rounded-full py-1.5 pl-1.5 pr-3 ${pathname === '/profil' ? 'text-secondary bg-surface-container-high' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'}`}
                  aria-expanded={showProfile}
                  aria-label="Buka menu profil"
                >
                  <span className="material-symbols-outlined text-2xl">account_circle</span>
                  <span className="hidden sm:inline max-w-32 truncate">{displayName}</span>
                  <span className="material-symbols-outlined text-base transition-transform duration-200">keyboard_arrow_down</span>
                </button>

                {showProfile && (
                  <div className="absolute right-0 top-full mt-3 w-56 bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
                    <div className="px-4 py-3 border-b border-outline-variant bg-surface-container-low">
                      <p className="text-label-lg font-bold text-primary truncate">{displayName}</p>
                      <p className="text-label-sm text-on-surface-variant truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/profil"
                      onClick={() => setShowProfile(false)}
                      className="flex items-center gap-2 px-4 py-3 text-body-sm font-semibold text-on-surface hover:bg-surface-container-low hover:text-secondary"
                    >
                      <span className="material-symbols-outlined text-lg">account_circle</span>
                      Profil Saya
                    </Link>
                    {user.role === 'mahasiswa' && (
                      <Link href="/dashboard" onClick={() => setShowProfile(false)}
                        className="flex items-center gap-2 px-4 py-3 text-body-sm font-semibold text-on-surface hover:bg-surface-container-low hover:text-secondary">
                        <span className="material-symbols-outlined text-lg">dashboard</span>
                        Dashboard
                      </Link>
                    )}
                    {user.role === 'penyelenggara' && (
                      <Link href="/penyelenggara/dashboard" onClick={() => setShowProfile(false)}
                        className="flex items-center gap-2 px-4 py-3 text-body-sm font-semibold text-on-surface hover:bg-surface-container-low hover:text-secondary">
                        <span className="material-symbols-outlined text-lg">dashboard</span>
                        Dashboard Penyelenggara
                      </Link>
                    )}
                    {user.role === 'admin' && (
                      <Link href="/admin/dashboard" onClick={() => setShowProfile(false)}
                        className="flex items-center gap-2 px-4 py-3 text-body-sm font-semibold text-on-surface hover:bg-surface-container-low hover:text-secondary">
                        <span className="material-symbols-outlined text-lg">dashboard</span>
                        Dashboard Admin
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setShowProfile(false);
                        logout();
                      }}
                      className="flex w-full items-center gap-2 px-4 py-3 text-left text-body-sm font-semibold text-error hover:bg-error-container/20"
                    >
                      <span className="material-symbols-outlined text-lg">logout</span>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
