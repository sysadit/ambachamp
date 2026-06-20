'use client';
// src/components/lomba/LombaCard.jsx

import Link from 'next/link';
import { MapPin, Clock, DollarSign, Bookmark, BookmarkCheck, ShieldCheck, Trophy } from 'lucide-react';
import { useState } from 'react';
import { wishlistAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const KATEGORI_CFG = {
  teknologi_digital: { label: 'Teknologi & Digital', cls: 'bg-blue-500 text-white' },
  sains_riset:       { label: 'Sains & Riset',       cls: 'bg-emerald-500 text-white' },
  olahraga:          { label: 'Olahraga',            cls: 'bg-orange-500 text-white' },
  seni_kreatif:      { label: 'Seni & Kreatif',      cls: 'bg-pink-500 text-white' },
};

const TINGKAT_ICON = {
  kampus:        '🏫',
  nasional:      '🇮🇩',
  internasional: '🌍',
};

export default function LombaCard({ lomba, inWishlist = false, onWishlistChange }) {
  const { user }      = useAuth();
  const [saved, setSaved]     = useState(inWishlist);
  const [savingWL, setSaving] = useState(false);

  const kat      = KATEGORI_CFG[lomba.kategori] || { label: 'Lainnya', cls: 'bg-gray-400 text-white' };
  const deadline = new Date(lomba.deadline_pendaftaran);
  const today    = new Date();
  const daysLeft = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
  const expired  = daysLeft < 0;

  const hasPoster = !!lomba.poster;
  const imgSrc    = hasPoster ? `${process.env.NEXT_PUBLIC_UPLOAD_URL}/posters/${lomba.poster}` : null;

  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user || user.role !== 'mahasiswa') return;
    setSaving(true);
    try {
      if (saved) { await wishlistAPI.remove(lomba.id); setSaved(false); }
      else       { await wishlistAPI.add(lomba.id);    setSaved(true); }
      onWishlistChange?.();
    } catch {}
    setSaving(false);
  };

  return (
    <Link href={`/lomba/${lomba.id}`}
      className="card-hover block overflow-hidden group">

      {/* Image */}
      <div className="relative h-40 overflow-hidden">
        {hasPoster ? (
          <img src={imgSrc} alt={lomba.judul}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-100 to-brand-50">
            <Trophy className="h-12 w-12 text-brand-300" />
          </div>
        )}

        {/* Category badge top-left */}
        <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${kat.cls}`}>
          {kat.label}
        </span>

        {/* Verified badge */}
        <span className="absolute top-3 right-3 flex items-center gap-1 bg-emerald-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
          <ShieldCheck className="h-3 w-3" />
          Verified
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1 line-clamp-2 group-hover:text-brand-700 transition">
          {lomba.judul}
        </h3>
        <p className="text-xs text-gray-400 mb-3">{lomba.nama_penyelenggara}</p>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-gray-400" />
            {TINGKAT_ICON[lomba.tingkat]} {lomba.tingkat?.charAt(0).toUpperCase() + lomba.tingkat?.slice(1)}
          </span>
          <span className="flex items-center gap-1">
            <DollarSign className="h-3.5 w-3.5 text-gray-400" />
            {lomba.biaya_pendaftaran === 0 ? 'Gratis' : `Rp ${parseInt(lomba.biaya_pendaftaran).toLocaleString('id-ID')}`}
          </span>
        </div>

        {/* Deadline + Bookmark */}
        <div className="flex items-center justify-between">
          <span className={`text-xs font-semibold ${expired ? 'text-red-500' : daysLeft <= 7 ? 'text-red-500' : 'text-red-500'}`}>
            Batas: {deadline.toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' })}
          </span>

          {/* Bookmark button */}
          {user?.role === 'mahasiswa' && (
            <button onClick={toggleWishlist} disabled={savingWL}
              className="p-1.5 rounded-xl hover:bg-brand-50 text-gray-400 hover:text-brand-600 transition">
              {saved
                ? <BookmarkCheck className="h-4 w-4 text-brand-600" />
                : <Bookmark className="h-4 w-4" />
              }
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
