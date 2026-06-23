'use client';
// src/app/penyelenggara/lomba/page.jsx — Lomba Saya

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { lombaAPI } from '@/lib/api';
import Link from 'next/link';
import { Plus, Loader2, Calendar, ExternalLink, Clock, CheckCircle, XCircle, Edit, Trash2, AlertTriangle } from 'lucide-react';

const STATUS_CONFIG = {
  pending:  { label: 'Menunggu Verifikasi', class: 'badge-amber', icon: Clock },
  verified: { label: 'Sudah Tayang',         class: 'badge-green', icon: CheckCircle },
  rejected: { label: 'Ditolak',              class: 'badge-red',   icon: XCircle },
};

export default function LombaSayaPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [myLomba, setMyLomba] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hapusId, setHapusId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'penyelenggara')) router.push('/auth/login');
  }, [user, authLoading]);

  const load = () => {
    setLoading(true);
    lombaAPI.getMyLomba()
      .then(r => setMyLomba(r.data.data || []))
      .catch(() => setMyLomba([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { if (user?.role === 'penyelenggara') load(); }, [user]);

  const isExpired = (l) => l.deadline_pendaftaran && new Date(l.deadline_pendaftaran) < new Date();

  const hapusLomba = async () => {
    if (!hapusId) return;
    setDeleting(true);
    try {
      await lombaAPI.delete(hapusId);
      setHapusId(null);
      load();
    } catch {
      // diemin, list ga berubah
    } finally {
      setDeleting(false);
    }
  };

  if (authLoading || !user) return null;

  return (
    <DashboardLayout title="Lomba Saya">
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-slate-500">Semua lomba yang kamu unggah ke platform.</p>
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
            const expired = isExpired(lomba);
            return (
              <div key={lomba.id} className="card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={sc.class}><Icon className="h-3 w-3 inline mr-1" />{sc.label}</span>
                      <span className="badge-gray capitalize">{lomba.tingkat}</span>
                      {expired && <span className="badge-red">Kedaluwarsa</span>}
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-1">{lomba.judul}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />
                        Deadline: {new Date(lomba.deadline_pendaftaran).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                    {lomba.alasan_penolakan && (
                      <p className="text-xs text-red-600 mt-2 bg-red-50 p-2 rounded-lg">
                        Alasan ditolak: {lomba.alasan_penolakan}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    {lomba.link_pendaftaran && (
                      <a href={lomba.link_pendaftaran} target="_blank" rel="noopener noreferrer"
                        className="btn-secondary text-xs py-2 px-3" title="Buka link pendaftaran">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                    <Link href={`/penyelenggara/lomba/${lomba.id}/edit`}
                      className="btn-secondary text-xs py-2 px-3">
                      <Edit className="h-3.5 w-3.5" /> Edit
                    </Link>
                    {/* Penyelenggara bisa hapus lomba miliknya kapan saja */}
                    <button onClick={() => setHapusId(lomba.id)}
                      className="text-xs py-2 px-3 rounded-xl bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 inline-flex items-center gap-1">
                      <Trash2 className="h-3.5 w-3.5" /> Hapus
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal konfirmasi hapus */}
      {hapusId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
            <h3 className="font-bold text-slate-800 text-center mb-1">Hapus Lomba Ini?</h3>
            <p className="text-sm text-slate-500 text-center mb-5">
              Lomba ini akan dihapus permanen beserta semua data terkaitnya. Tindakan ini tidak bisa dibatalkan.
            </p>
            <div className="flex gap-2">
              <button onClick={hapusLomba} disabled={deleting} className="btn-danger flex-1">
                {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Ya, Hapus'}
              </button>
              <button onClick={() => setHapusId(null)} className="btn-secondary flex-1">Batal</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
