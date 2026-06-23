'use client';
// src/app/admin/all-lomba/page.jsx — admin lihat semua lomba (running & expired)

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { adminAPI } from '@/lib/api';
import { Loader2, Calendar, ListChecks, ExternalLink } from 'lucide-react';

export default function AdminAllLombaPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [lomba, setLomba] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('running'); // running | expired

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) router.push('/auth/login');
  }, [user, authLoading]);

  useEffect(() => {
    if (user?.role === 'admin') {
      adminAPI.getAllLombaAdmin({ status: 'verified' })
        .then(r => setLomba(r.data.data || []))
        .catch(() => setLomba([]))
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (authLoading || !user) return null;

  const now = new Date();
  const isExpired = (l) => l.deadline_pendaftaran && new Date(l.deadline_pendaftaran) < now;
  const running = lomba.filter(l => !isExpired(l));
  const expired = lomba.filter(l => isExpired(l));
  const shown = tab === 'running' ? running : expired;

  return (
    <DashboardLayout title="Semua Lomba">
      <p className="text-sm text-slate-500 mb-5">Daftar lomba terverifikasi yang sedang berjalan maupun yang sudah kedaluwarsa.</p>

      <div className="flex gap-2 mb-5">
        <button onClick={() => setTab('running')}
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
            tab === 'running' ? 'bg-brand-600 text-white border-brand-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}>
          Sedang Berjalan ({running.length})
        </button>
        <button onClick={() => setTab('expired')}
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
            tab === 'expired' ? 'bg-brand-600 text-white border-brand-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}>
          Kedaluwarsa ({expired.length})
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-brand-400" /></div>
      ) : shown.length === 0 ? (
        <div className="card p-12 text-center">
          <ListChecks className="h-12 w-12 text-slate-200 mx-auto mb-3" />
          <p className="font-semibold text-slate-500">
            {tab === 'running' ? 'Tidak ada lomba yang sedang berjalan' : 'Tidak ada lomba kedaluwarsa'}
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['Judul Lomba', 'Penyelenggara', 'Tingkat', 'Deadline', 'Status', ''].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {shown.map(l => (
                <tr key={l.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3 font-medium text-slate-800">{l.judul}</td>
                  <td className="px-4 py-3 text-slate-600">{l.nama_penyelenggara}</td>
                  <td className="px-4 py-3 text-slate-600 capitalize">{l.tingkat}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {new Date(l.deadline_pendaftaran).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-4 py-3">
                    <span className={isExpired(l) ? 'badge-red' : 'badge-green'}>
                      {isExpired(l) ? 'Kedaluwarsa' : 'Berjalan'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {l.link_pendaftaran && (
                      <a href={l.link_pendaftaran} target="_blank" rel="noopener noreferrer"
                        className="text-brand-600 hover:text-brand-700 inline-flex items-center gap-1 text-xs">
                        Link <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}
