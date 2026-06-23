'use client';
// src/app/penyelenggara/dashboard/page.jsx — ringkasan

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { lombaAPI } from '@/lib/api';
import Link from 'next/link';
import { Plus, Loader2, Trophy, CheckCircle, Clock, ArrowRight, FolderKanban } from 'lucide-react';

export default function PenyelenggaraDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [myLomba, setMyLomba] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'penyelenggara')) router.push('/auth/login');
  }, [user, authLoading]);

  useEffect(() => {
    if (user?.role === 'penyelenggara') {
      lombaAPI.getMyLomba()
        .then(r => setMyLomba(r.data.data || []))
        .catch(() => setMyLomba([]))
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (authLoading || !user) return null;

  const total    = myLomba.length;
  const verified = myLomba.filter(l => l.status === 'verified').length;
  const pending  = myLomba.filter(l => l.status === 'pending').length;

  return (
    <DashboardLayout title="Dashboard Penyelenggara">
      {/* Hero sapaan */}
      <div className="relative rounded-3xl overflow-hidden mb-6 p-8"
        style={{ background: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)' }}>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Halo, {user.nama || 'Penyelenggara'}!</h1>
        <p className="text-gray-700 text-sm max-w-md">
          Kelola lomba yang kamu selenggarakan dan pantau peserta serta tim yang terbentuk di sini.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-brand-400" /></div>
      ) : (
        <>
          {/* Ringkasan statistik */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="card p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-brand-100 flex items-center justify-center">
                <Trophy className="h-5 w-5 text-brand-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{total}</p>
                <p className="text-xs text-slate-500">Total Lomba</p>
              </div>
            </div>
            <div className="card p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-600">{verified}</p>
                <p className="text-xs text-slate-500">Sudah Tayang</p>
              </div>
            </div>
            <div className="card p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600">{pending}</p>
                <p className="text-xs text-slate-500">Menunggu Verifikasi</p>
              </div>
            </div>
          </div>

          {/* Akses cepat */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/penyelenggara/lomba/create" className="card p-5 hover:shadow-md transition group">
              <Plus className="h-6 w-6 text-brand-600 mb-2" />
              <p className="font-semibold text-slate-800 group-hover:text-brand-700">Upload Lomba Baru</p>
              <p className="text-xs text-slate-500 mt-0.5">Tambah kompetisi baru ke platform</p>
            </Link>
            <Link href="/penyelenggara/lomba" className="card p-5 hover:shadow-md transition group">
              <Trophy className="h-6 w-6 text-brand-600 mb-2" />
              <p className="font-semibold text-slate-800 group-hover:text-brand-700">Lomba Saya</p>
              <p className="text-xs text-slate-500 mt-0.5">Kelola & edit lomba yang sudah dibuat</p>
            </Link>
            <Link href="/penyelenggara/grup" className="card p-5 hover:shadow-md transition group">
              <FolderKanban className="h-6 w-6 text-brand-600 mb-2" />
              <p className="font-semibold text-slate-800 group-hover:text-brand-700">Grup Tim Peserta</p>
              <p className="text-xs text-slate-500 mt-0.5">Lihat tim yang dibentuk peserta</p>
            </Link>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
