'use client';
// src/components/layout/DashboardLayout.jsx
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from './Navbar';
import {
  LayoutDashboard, Search, Bookmark, Users, Bell,
  Plus, ListChecks, ShieldCheck, UserCog, LogOut
} from 'lucide-react';

// Sidebar links per role
const SIDEBAR = {
  mahasiswa: [
    { href: '/dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/lomba',      icon: Search,          label: 'Cari Lomba' },
    { href: '/wishlist',   icon: Bookmark,        label: 'Wishlist' },
    { href: '/teammate',   icon: Users,           label: 'Cari Tim' },
    { href: '/notifikasi', icon: Bell,            label: 'Notifikasi' },
  ],
  penyelenggara: [
    { href: '/penyelenggara/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/penyelenggara/lomba/create', icon: Plus,            label: 'Upload Lomba Baru' },
    { href: '/notifikasi',                 icon: Bell,            label: 'Notifikasi' },
  ],
  admin: [
    { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/lomba',     icon: ShieldCheck,     label: 'Verifikasi Lomba' },
    { href: '/admin/users',     icon: UserCog,         label: 'Kelola Pengguna' },
    { href: '/notifikasi',      icon: Bell,            label: 'Notifikasi' },
  ],
};

export default function DashboardLayout({ children, title }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const links = SIDEBAR[user.role] || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-60 bg-white border-r border-slate-200 min-h-[calc(100vh-64px)] sticky top-16">
          <div className="flex-1 py-4 px-3 space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase px-3 mb-2">Menu</p>
            {links.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  pathname === href || pathname.startsWith(href + '/')
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {label}
              </Link>
            ))}
          </div>
          <div className="p-3 border-t border-slate-100">
            <button onClick={logout}
              className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition">
              <LogOut className="h-4 w-4" /> Keluar
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 bg-slate-50 min-w-0">
          {title && (
            <h1 className="text-2xl font-bold text-slate-800 mb-6">{title}</h1>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
