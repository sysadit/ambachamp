'use client';
// src/app/penyelenggara/dashboard/page.jsx

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { lombaAPI } from '@/lib/api';
import Link from 'next/link';
import { Plus, Loader2, Calendar, ExternalLink, Clock, CheckCircle, XCircle, Edit } from 'lucide-react';

const STATUS_CONFIG = {
  pending:  { label: 'Menunggu Verifikasi', class: 'badge-amber', icon: Clock },
  verified: { label: 'Sudah Tayang',         class: 'badge-green', icon: CheckCircle },
  rejected: { label: 'Ditolak',              class: 'badge-red',   icon: XCircle },
};

export default function PenyelenggaraDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [myLomba, setMyLomba]  = useState([]);
  const [loading, setLoading]  = useState(true);

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
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-slate-800">{total}</p>
          <p className="text-xs text-slate-500">Total Lomba</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{verified}</p>
          <p className="text-xs text-slate-500">Sudah Tayang</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{pending}</p>
          <p className="text-xs text-slate-500">Menunggu Verifikasi</p>
        </div>
      </div>

      {/* Upload lomba baru */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-800">Lomba Saya</h3>
        <Link href="/penyelenggara/lomba/create" className="btn-primary text-sm">
          <Plus className="h-4 w-4" /> Upload Lomba Baru
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-brand-400" /></div>
      ) : myLomba.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-slate-500 mb-3">Belum ada lomba yang diunggah</p>
          <Link href="/penyelenggara/lomba/create" className="btn-primary">Upload Lomba Pertama</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {myLomba.map(lomba => {
            const sc = STATUS_CONFIG[lomba.status] || STATUS_CONFIG.pending;
            const Icon = sc.icon;
            return (
              <div key={lomba.id} className="card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={sc.class}><Icon className="h-3 w-3 inline mr-1" />{sc.label}</span>
                      <span className="badge-gray capitalize">{lomba.tingkat}</span>
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-1">{lomba.judul}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />
                        Deadline: {new Date(lomba.deadline_pendaftaran).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                    {lomba.alasan_penolakan && (
                      <p className="text-xs text-red-600 mt-2 bg-red-50 p-2 rounded-lg">
                        ❌ Alasan ditolak: {lomba.alasan_penolakan}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    {lomba.link_pendaftaran && (
                      <a href={lomba.link_pendaftaran} target="_blank" rel="noopener noreferrer"
                        className="btn-secondary text-xs py-2 px-3">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                    <Link href={`/penyelenggara/lomba/${lomba.id}/edit`}
                      className="btn-secondary text-xs py-2 px-3">
                      <Edit className="h-3.5 w-3.5" /> Edit
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
