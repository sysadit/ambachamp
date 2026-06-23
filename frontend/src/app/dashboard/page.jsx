'use client';
// src/app/dashboard/page.jsx — ringkasan mahasiswa

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { lombaAPI, wishlistAPI, teammateAPI } from '@/lib/api';
import Link from 'next/link';
import { Search, Bookmark, Users, Loader2, ArrowRight, Bell, MessageCircle } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stat, setStat] = useState({ lomba: 0, wishlist: 0, team: 0 });
  const [acceptedTeams, setAcceptedTeams] = useState([]);
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
      teammateAPI.getMyApplications().catch(() => ({ data: { data: [] } })),
    ]).then(([lombaRes, wishRes, postRes, appRes]) => {
      setStat({
        lomba:    (lombaRes.data.data || []).length,
        wishlist: (wishRes.data.data || []).length,
        team:     (postRes.data.data || []).length,
      });
      const apps = appRes.data.data || [];
      const accepted = apps.filter(a => a.status === 'diterima');
      setAcceptedTeams(accepted);
    }).finally(() => setLoading(false));
  }, [user]);

  if (authLoading || !user) return null;

  const cards = [
    { label: 'Total Lomba Tersedia', value: stat.lomba,    icon: Search,   color: 'bg-blue-100 text-blue-600',   href: '/lomba' },
    { label: 'Lomba di Wishlist',    value: stat.wishlist, icon: Bookmark, color: 'bg-amber-100 text-amber-600', href: '/wishlist' },
    { label: 'Tim yang Dibuat',      value: stat.team,     icon: Users,    color: 'bg-brand-100 text-brand-600', href: '/teammate/list' },
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

          {/* Tim List yang Dilamar (Diterima) */}
          <div className="mt-8">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              Tim List yang Dilamar (Diterima)
            </h2>
            {acceptedTeams.length === 0 ? (
              <div className="card p-6 text-center text-sm text-slate-400 bg-white border border-slate-100">
                Kamu belum bergabung dengan tim mana pun. Cari tim atau lamar lowongan lomba.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {acceptedTeams.map(t => (
                  <div key={t.id} className="card p-5 border border-emerald-100 bg-white shadow-sm hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-slate-800 text-sm truncate">{t.judul_post}</h3>
                        <p className="text-xs text-slate-400 mt-0.5 truncate">Lomba: <span className="font-medium text-slate-600">{t.judul_lomba}</span></p>
                      </div>
                      <span className="badge-green text-xs font-semibold px-2.5 py-1 rounded-lg shrink-0">Diterima</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-50">
                      <span className="text-xs text-slate-500">
                        Posisi: <span className="font-semibold text-slate-700">{t.posisi}</span> · Oleh: {t.nama_pembuat}
                      </span>
                      {t.link_telegram && (
                        <a href={t.link_telegram} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl shadow-sm transition shrink-0">
                          <MessageCircle className="h-3.5 w-3.5" /> Join Telegram
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
