'use client';
// src/app/wishlist/page.jsx

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import LombaCard from '@/components/lomba/LombaCard';
import { wishlistAPI } from '@/lib/api';
import { Bookmark, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [wishlist, setWishlist] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/login');
  }, [user, authLoading]);

  const fetchWishlist = () => {
    wishlistAPI.getAll()
      .then(r => setWishlist(r.data.data || []))
      .catch(() => setWishlist([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { if (user) fetchWishlist(); }, [user]);

  if (authLoading || !user) return null;

  return (
    <DashboardLayout title="Wishlist Lomba">
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-7 w-7 animate-spin text-brand-400" /></div>
      ) : wishlist.length === 0 ? (
        <div className="card p-12 text-center">
          <Bookmark className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="font-medium text-slate-600 mb-1">Wishlist masih kosong</p>
          <p className="text-sm text-slate-400 mb-4">Simpan lomba favoritmu dari halaman daftar lomba.</p>
          <Link href="/lomba" className="btn-primary">Cari Lomba Sekarang</Link>
        </div>
      ) : (
        <>
          <p className="text-sm text-slate-500 mb-4">{wishlist.length} lomba tersimpan</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {wishlist.map(l => (
              <LombaCard key={l.id} lomba={l} inWishlist={true} onWishlistChange={fetchWishlist} />
            ))}
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
