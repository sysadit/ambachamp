'use client';
// src/app/admin/dashboard/page.jsx

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { adminAPI } from '@/lib/api';
import Link from 'next/link';
import { Trophy, Users, Clock, CheckCircle, Bookmark, UsersRound, ArrowRight, Loader2 } from 'lucide-react';

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) router.push('/auth/login');
  }, [user, authLoading]);

  useEffect(() => {
    if (user?.role === 'admin') {
      adminAPI.getDashboard()
        .then(r => setStats(r.data.data))
        .catch(() => setStats(null))
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (authLoading || !user) return null;

  const STAT_CARDS = stats ? [
    { label: 'Total Pengguna',     value: stats.total_users,    icon: Users,       color: 'text-blue-600',   bg: 'bg-blue-50' },
    { label: 'Total Lomba',        value: stats.total_lomba,    icon: Trophy,      color: 'text-green-600',  bg: 'bg-green-50' },
    { label: 'Menunggu Verifikasi',value: stats.pending_lomba,  icon: Clock,       color: 'text-amber-600',  bg: 'bg-amber-50' },
    { label: 'Lomba Diverifikasi', value: stats.verified_lomba, icon: CheckCircle, color: 'text-brand-600',bg: 'bg-brand-50' },
    { label: 'Total Wishlist',     value: stats.total_wishlist, icon: Bookmark,    color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Post Teammate',      value: stats.total_teammate, icon: UsersRound,  color: 'text-rose-600',   bg: 'bg-rose-50' },
  ] : [];

  return (
    <DashboardLayout title="Admin Dashboard">
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-7 w-7 animate-spin text-brand-400" /></div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {STAT_CARDS.map(c => (
              <div key={c.label} className="card p-5 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center flex-shrink-0`}>
                  <c.icon className={`h-6 w-6 ${c.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{c.value}</p>
                  <p className="text-xs text-slate-500">{c.label}</p>
                </div>
              </div>
            ))}
          </div>

          {stats?.pending_lomba > 0 && (
            <div className="card p-5 bg-amber-50 border-amber-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-amber-600" />
                <div>
                  <p className="font-semibold text-amber-800">Ada {stats.pending_lomba} Lomba Menunggu Verifikasi</p>
                  <p className="text-sm text-amber-600">Segera verifikasi agar mahasiswa bisa melihat lomba tersebut.</p>
                </div>
              </div>
              <Link href="/admin/lomba" className="btn-accent flex-shrink-0">
                Verifikasi Sekarang <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
}
