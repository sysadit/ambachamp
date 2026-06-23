'use client';
// src/app/dashboard/page.jsx — ringkasan mahasiswa

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { lombaAPI, wishlistAPI, teammateAPI } from '@/lib/api';
import Link from 'next/link';
import { Search, Bookmark, Users, Loader2, ArrowRight, Bell } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stat, setStat] = useState({ lomba: 0, wishlist: 0, team: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/login');
    if (!authLoading && user && user.role !== 'mahasiswa') router.push('/');
  }, [user, authLoading]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      lombaAPI.getAll().catch(() => ({ data: { data: [] } })),
      wishlistAPI.getAll().catch(() => ({ data: { data: [] } })),
      teammateAPI.getMyPosts().catch(() => ({ data: { data: [] } })),
    ]).then(([lombaRes, wishRes, postRes]) => {
      setStat({
        lomba:    (lombaRes.data.data || []).length,
        wishlist: (wishRes.data.data || []).length,
        team:     (postRes.data.data || []).length,
      });
    }).finally(() => setLoading(false));
  }, [user]);

  if (authLoading || !user) return null;

  const cards = [
    { label: 'Total Lomba Tersedia', value: stat.lomba,    icon: Search,   color: 'bg-blue-100 text-blue-600',   href: '/lomba' },
    { label: 'Lomba di Wishlist',    value: stat.wishlist, icon: Bookmark, color: 'bg-amber-100 text-amber-600', href: '/wishlist' },
    { label: 'Tim yang Dibuat',      value: stat.team,     icon: Users,    color: 'bg-brand-100 text-brand-600', href: '/explore' },
  ];

  return (
    <DashboardLayout title="Dashboard">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Halo, {user.nama || 'Mahasiswa'}!</h1>
        <p className="text-sm text-slate-500">Ringkasan aktivitasmu di AmbaChamp.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-brand-400" /></div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {cards.map((c) => {
              const Icon = c.icon;
              return (
                <Link key={c.label} href={c.href} className="card p-5 hover:shadow-md transition group">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${c.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-3xl font-bold text-slate-800">{c.value}</p>
                  <p className="text-sm text-slate-500 group-hover:text-brand-600 transition">{c.label}</p>
                </Link>
              );
            })}
          </div>

          {/* Akses cepat */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/lomba" className="card p-5 hover:shadow-md transition group flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800 group-hover:text-brand-700">Cari Lomba</p>
                <p className="text-xs text-slate-500 mt-0.5">Jelajahi kompetisi yang tersedia</p>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-brand-600" />
            </Link>
            <Link href="/notifikasi" className="card p-5 hover:shadow-md transition group flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800 group-hover:text-brand-700">Notifikasi</p>
                <p className="text-xs text-slate-500 mt-0.5">Lihat pemberitahuan terbaru</p>
              </div>
              <Bell className="h-5 w-5 text-slate-300 group-hover:text-brand-600" />
            </Link>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
