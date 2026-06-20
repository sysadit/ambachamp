'use client';
// src/app/notifikasi/page.jsx

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { notifAPI } from '@/lib/api';
import { Bell, Check, CheckCheck, Trash2, Loader2 } from 'lucide-react';

const TIPE_ICON = {
  deadline:  '⏰',
  verifikasi:'✅',
  teammate:  '👥',
  sistem:    '🔔',
};

export default function NotifikasiPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [notifs,   setNotifs]   = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => { if (!authLoading && !user) router.push('/auth/login'); }, [user, authLoading]);

  const fetchNotifs = () => {
    notifAPI.getAll()
      .then(r => setNotifs(r.data.data || []))
      .catch(() => setNotifs([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { if (user) fetchNotifs(); }, [user]);

  const handleRead = async (id) => {
    await notifAPI.markRead(id);
    setNotifs(n => n.map(x => x.id === id ? { ...x, is_read: true } : x));
  };

  const handleReadAll = async () => {
    await notifAPI.markAllRead();
    setNotifs(n => n.map(x => ({ ...x, is_read: true })));
  };

  const handleDelete = async (id) => {
    await notifAPI.delete(id);
    setNotifs(n => n.filter(x => x.id !== id));
  };

  const unread = notifs.filter(n => !n.is_read).length;

  if (authLoading || !user) return null;

  return (
    <DashboardLayout title="Notifikasi">
      <div className="max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-slate-500">{unread} belum dibaca</p>
          {unread > 0 && (
            <button onClick={handleReadAll} className="flex items-center gap-1.5 text-xs text-brand-600 hover:underline">
              <CheckCheck className="h-4 w-4" /> Tandai semua dibaca
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-brand-400" /></div>
        ) : notifs.length === 0 ? (
          <div className="card p-12 text-center">
            <Bell className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="font-medium text-slate-600">Tidak ada notifikasi</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifs.map(n => (
              <div key={n.id} className={`card p-4 flex items-start gap-4 transition ${!n.is_read ? 'border-brand-200 bg-brand-50/50' : ''}`}>
                <span className="text-xl mt-0.5">{TIPE_ICON[n.tipe] || '🔔'}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${!n.is_read ? 'text-slate-800' : 'text-slate-600'}`}>{n.judul}</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.pesan}</p>
                  <p className="text-xs text-slate-400 mt-1.5">
                    {new Date(n.created_at).toLocaleDateString('id-ID', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })}
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {!n.is_read && (
                    <button onClick={() => handleRead(n.id)} title="Tandai dibaca"
                      className="p-1.5 hover:bg-slate-100 rounded-lg transition text-slate-400 hover:text-brand-600">
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                  <button onClick={() => handleDelete(n.id)} title="Hapus"
                    className="p-1.5 hover:bg-red-50 rounded-lg transition text-slate-400 hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
