'use client';
// src/app/penyelenggara/grup/page.jsx — list grup tim yang dibuat peserta

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { teammateAPI } from '@/lib/api';
import { Loader2, Users, FolderKanban } from 'lucide-react';

export default function GrupPesertaPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [grup, setGrup] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'penyelenggara')) router.push('/auth/login');
  }, [user, authLoading]);

  useEffect(() => {
    if (user?.role === 'penyelenggara') {
      teammateAPI.getGrupPenyelenggara()
        .then(r => setGrup(r.data.data || []))
        .catch(() => setGrup([]))
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (authLoading || !user) return null;

  // kelompokkan per lomba biar rapi
  const perLomba = grup.reduce((acc, g) => {
    (acc[g.judul_lomba] = acc[g.judul_lomba] || []).push(g);
    return acc;
  }, {});

  return (
    <DashboardLayout title="Grup Tim Peserta">
      <p className="text-sm text-slate-500 mb-5">Tim yang dibentuk peserta di lomba yang kamu selenggarakan.</p>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-brand-400" /></div>
      ) : grup.length === 0 ? (
        <div className="card p-12 text-center">
          <FolderKanban className="h-12 w-12 text-slate-200 mx-auto mb-3" />
          <p className="font-semibold text-slate-500 mb-1">Belum ada tim terbentuk</p>
          <p className="text-sm text-slate-400">Tim akan muncul saat peserta membuat lowongan di lombamu.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(perLomba).map(([namaLomba, list]) => (
            <div key={namaLomba}>
              <h3 className="font-semibold text-slate-700 text-sm mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500" /> {namaLomba}
                <span className="text-xs text-slate-400 font-normal">({list.length} tim)</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {list.map(g => (
                  <div key={g.id} className="card p-5">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h4 className="font-semibold text-slate-800 text-sm">{g.judul}</h4>
                      <span className={g.status === 'open' ? 'badge-green' : 'badge-gray'}>
                        {g.status === 'open' ? 'Terbuka' : 'Ditutup'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mb-3 line-clamp-2">{g.deskripsi}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>Ketua: <span className="font-medium text-slate-700">{g.nama_pembuat}</span></span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {g.jumlah_anggota}/{g.jumlah_anggota_max} anggota
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
