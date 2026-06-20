'use client';
// src/app/dashboard/page.jsx — Sesuai desain gambar 3

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import LombaCard from '@/components/lomba/LombaCard';
import { lombaAPI, wishlistAPI, notifAPI } from '@/lib/api';
import Link from 'next/link';
import { Search, ShieldCheck, Users, Bell, ArrowRight, Trophy, Loader2 } from 'lucide-react';

const FEATURES = [
  {
    icon: Search,
    color: 'bg-blue-100 text-blue-600',
    title: 'Pencarian & Filter Lomba',
    desc:  'Cari lomba berdasarkan kategori, tingkat, dan biaya pendaftaran dengan mudah.',
    href:  '/lomba',
  },
  {
    icon: ShieldCheck,
    color: 'bg-emerald-100 text-emerald-600',
    title: 'Verifikasi Admin',
    desc:  'Semua lomba melalui proses verifikasi oleh admin untuk memastikan keabsahannya.',
    href:  '#',
  },
  {
    icon: Users,
    color: 'bg-brand-100 text-brand-600',
    title: 'Teammate Finder',
    desc:  'Buat lowongan tim atau lamar posisi yang kosong di tim lain yang sesuai keahlianmu.',
    href:  '/teammate',
  },
  {
    icon: Bell,
    color: 'bg-rose-100 text-rose-600',
    title: 'Sistem Notifikasi',
    desc:  'Dapatkan pengingat otomatis menjelang batas waktu pendaftaran lomba yang kamu simpan.',
    href:  '/notifikasi',
  },
];

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [lombaList, setLombaList]  = useState([]);
  const [loadingData, setLoading]  = useState(true);

  useEffect(() => {
    if (!authLoading && !user)                 router.push('/auth/login');
    if (!authLoading && user?.role !== 'mahasiswa') router.push('/');
  }, [user, authLoading]);

  useEffect(() => {
    if (!user) return;
    lombaAPI.getAll({ limit: 6 })
      .then(r => setLombaList(r.data.data || []))
      .catch(() => setLombaList([]))
      .finally(() => setLoading(false));
  }, [user]);

  if (authLoading || !user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="container-main py-8 flex-1">
        {/* ── Hero purple card ── */}
        <div className="relative rounded-3xl overflow-hidden mb-8 bg-brand-gradient p-8 md:p-10">
          {/* Subtle background decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-white" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-white" />
          </div>
          <div className="relative max-w-lg">
            <p className="text-amber-300 text-sm font-medium mb-2 flex items-center gap-1.5">
              <Trophy className="h-4 w-4 text-amber-300" />
              Temukan panggung juaramu
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
              Satu Platform Untuk<br />Segala Prestasimu.
            </h1>
            <p className="text-white/90 text-sm leading-relaxed mb-7 max-w-md">
              AmbaChamp mempermudah kamu mencari lomba valid, menemukan rekan tim yang tepat, dan mengelola portofolio prestasimu dalam satu tempat.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/lomba"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-brand-700 font-semibold text-sm px-6 py-3 hover:bg-brand-50 transition shadow-lg">
                Cari Lomba Sekarang
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/teammate"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 text-white font-semibold text-sm px-6 py-3 hover:bg-white/10 transition">
                Cari Tim
              </Link>
            </div>
          </div>
        </div>

        {/* ── Fitur Utama ── */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Fitur Utama AmbaChamp</h2>
          <p className="text-gray-500 text-sm mb-5">Semua yang kamu butuhkan untuk meraih kemenangan bersama tim impianmu.</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {FEATURES.map(f => (
              <Link key={f.title} href={f.href}
                className="card-hover p-5 group flex flex-col gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${f.color}`}>
                  <f.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-brand-700 transition">{f.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Lomba Terbaru ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Lomba Terbaru</h2>
            <Link href="/lomba" className="text-sm text-brand-600 font-semibold hover:text-brand-700 flex items-center gap-1">
              Lihat Semua <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {loadingData ? (
            <div className="flex justify-center py-12"><Loader2 className="h-7 w-7 animate-spin text-brand-300" /></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {lombaList.slice(0, 6).map(l => <LombaCard key={l.id} lomba={l} />)}
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-gray-100 py-4 text-center text-xs text-gray-400">
        © 2026 AmbaChamp. Platform Penyedia Informasi Lomba & Kolaborasi.
      </footer>
    </div>
  );
}
