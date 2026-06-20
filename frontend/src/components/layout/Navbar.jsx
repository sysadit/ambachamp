'use client';
// src/components/layout/Navbar.jsx — Platform navbar (logged-in state)

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Trophy, Search, Users, ShieldCheck, Bell, ChevronDown,
  LogOut, User, LayoutDashboard, Bookmark, Menu, X
} from 'lucide-react';

export default function Navbar() {
  const { user, logout }          = useAuth();
  const pathname                  = usePathname();
  const [profileOpen, setProfile] = useState(false);
  const [mobileOpen,  setMobile]  = useState(false);

  const isActive = (href) => pathname === href || pathname.startsWith(href + '/');

  const dashHref =
    user?.role === 'admin'           ? '/admin/dashboard'
    : user?.role === 'penyelenggara' ? '/penyelenggara/dashboard'
    : '/dashboard';

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="container-main flex h-16 items-center gap-4">

        {/* Logo */}
        <Link href={user ? dashHref : '/'} className="flex items-center gap-2 mr-4">
          <Trophy className="h-6 w-6 text-brand-600" />
          <span className="font-bold text-brand-700 text-lg tracking-tight">AmbaChamp</span>
        </Link>

        {/* Nav links — desktop */}
        <div className="hidden md:flex items-center gap-1 flex-1">
          {(!user || user.role === 'mahasiswa') && (
            <>
              <Link href="/lomba"
                className={isActive('/lomba') ? 'nav-link-active' : 'nav-link'}>
                <Search className="h-4 w-4" />
                Cari Lomba
              </Link>

              <Link href="/teammate"
                className={isActive('/teammate') ? 'nav-link-active' : 'nav-link'}>
                <Users className="h-4 w-4" />
                Pusat Kolaborasi
              </Link>
            </>
          )}

          {user?.role === 'admin' && (
            <>
              <Link href="/admin/dashboard"
                className={isActive('/admin/dashboard') ? 'nav-link-active' : 'nav-link'}>
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link href="/admin/lomba"
                className={isActive('/admin/lomba') ? 'nav-link-active' : 'nav-link'}>
                <ShieldCheck className="h-4 w-4" />
                Admin Verifikasi
              </Link>
            </>
          )}
          {user?.role === 'penyelenggara' && (
            <Link href="/penyelenggara/dashboard"
              className={isActive('/penyelenggara') ? 'nav-link-active' : 'nav-link'}>
              <LayoutDashboard className="h-4 w-4" />
              Dashboard Saya
            </Link>
          )}
        </div>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2">
          {user ? (
            <>
              {/* Bell */}
              <Link href="/notifikasi"
                className="relative p-2 rounded-xl text-gray-500 hover:text-brand-600 hover:bg-brand-50 transition">
                <Bell className="h-5 w-5" />
              </Link>

              {/* Profile dropdown */}
              <div className="relative">
                <button onClick={() => setProfile(!profileOpen)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 border border-gray-200 hover:border-brand-300 hover:bg-brand-50 transition text-sm font-medium text-gray-700">
                  <div className="w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {user.nama?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block">Profil Saya</span>
                  <ChevronDown className={`h-3.5 w-3.5 text-gray-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl border border-gray-100 shadow-lg py-1 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-semibold text-gray-800 text-sm">{user.nama}</p>
                      <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                    </div>
                    <Link href={dashHref} onClick={() => setProfile(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-700 transition">
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </Link>
                    {(user.role === 'mahasiswa' || user.role === 'penyelenggara') && (
                      <Link href="/profil" onClick={() => setProfile(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-700 transition">
                        <User className="h-4 w-4" /> Profil Saya
                      </Link>
                    )}
                    {user.role === 'mahasiswa' && (
                      <Link href="/wishlist" onClick={() => setProfile(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-700 transition">
                        <Bookmark className="h-4 w-4" /> Wishlist
                      </Link>
                    )}
                    <button onClick={() => { setProfile(false); logout(); }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition border-t border-gray-100 mt-1">
                      <LogOut className="h-4 w-4" /> Keluar
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/auth/login"    className="btn-ghost text-sm">Masuk</Link>
              <Link href="/auth/register" className="btn-primary text-sm">Daftar Gratis</Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-600"
            onClick={() => setMobile(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          {(!user || user.role === 'mahasiswa') && (
            <>
              <Link href="/lomba" onClick={() => setMobile(false)} className={isActive('/lomba') ? 'nav-link-active' : 'nav-link'}>
                <Search className="h-4 w-4" /> Cari Lomba
              </Link>
              <Link href="/teammate" onClick={() => setMobile(false)} className={isActive('/teammate') ? 'nav-link-active' : 'nav-link'}>
                <Users className="h-4 w-4" /> Pusat Kolaborasi
              </Link>
            </>
          )}
          {user?.role === 'admin' && (
            <>
              <Link href="/admin/dashboard" onClick={() => setMobile(false)} className="nav-link">
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </Link>
              <Link href="/admin/lomba" onClick={() => setMobile(false)} className="nav-link">
                <ShieldCheck className="h-4 w-4" /> Admin Verifikasi
              </Link>
            </>
          )}
          {user?.role === 'penyelenggara' && (
            <Link href="/penyelenggara/dashboard" onClick={() => setMobile(false)} className="nav-link">
              <LayoutDashboard className="h-4 w-4" /> Dashboard Saya
            </Link>
          )}
          {!user && (
            <div className="flex gap-2 pt-3 border-t border-gray-100">
              <Link href="/auth/login" className="btn-secondary flex-1 text-sm">Masuk</Link>
              <Link href="/auth/register" className="btn-primary flex-1 text-sm">Daftar</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
