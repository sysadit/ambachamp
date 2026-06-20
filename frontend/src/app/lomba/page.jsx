'use client';
// src/app/lomba/page.jsx — Sesuai desain gambar 4

import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/layout/Navbar';
import LombaCard from '@/components/lomba/LombaCard';
import { lombaAPI } from '@/lib/api';
import { Search, SlidersHorizontal, Loader2, Trophy } from 'lucide-react';

const KATEGORI_OPTS = ['Semua', 'Teknologi & Digital', 'Sains & Riset', 'Olahraga', 'Seni & Kreatif'];
const TINGKAT_OPTS  = ['Internasional', 'Nasional', 'Provinsi', 'Mahasiswa/Universitas'];

const KATEGORI_MAP = {
  'Teknologi & Digital': 'teknologi_digital',
  'Sains & Riset':       'sains_riset',
  'Olahraga':            'olahraga',
  'Seni & Kreatif':      'seni_kreatif',
};

export default function LombaPage() {
  const [lombaList, setLombaList]   = useState([]);
  const [loading,   setLoading]     = useState(true);
  const [keyword,   setKeyword]     = useState('');
  const [katFilter, setKatFilter]   = useState('Semua');
  const [tingkat,   setTingkat]     = useState([]);
  const [gratis,    setGratis]      = useState(false);

  const fetchLomba = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        keyword:  keyword || undefined,
        kategori: KATEGORI_MAP[katFilter] || undefined,
        tingkat:  tingkat.length === 1
          ? (tingkat[0] === 'Internasional' ? 'internasional'
            : tingkat[0] === 'Nasional'     ? 'nasional'
            : 'kampus')
          : undefined,
        gratis: gratis ? '1' : undefined,
      };
      const res = await lombaAPI.getAll(params);
      setLombaList(res.data.data || []);
    } catch { setLombaList([]); }
    finally   { setLoading(false); }
  }, [keyword, katFilter, tingkat, gratis]);

  useEffect(() => {
    const t = setTimeout(fetchLomba, 350);
    return () => clearTimeout(t);
  }, [fetchLomba]);

  const toggleTingkat = (v) =>
    setTingkat(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* Search bar */}
      <div className="bg-white border-b border-gray-100 py-4">
        <div className="container-main flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama lomba atau penyelenggara..."
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              className="input-base pl-11 text-sm"
            />
          </div>
          <button className="btn-primary px-6 text-sm">
            <Search className="h-4 w-4" /> Cari
          </button>
        </div>
      </div>

      <div className="container-main py-6 flex gap-6 flex-1">

        {/* ── Sidebar Filter ── */}
        <aside className="w-52 flex-shrink-0 hidden md:block">
          <div className="card p-5 sticky top-20">
            <div className="flex items-center gap-2 mb-5">
              <SlidersHorizontal className="h-4 w-4 text-brand-600" />
              <span className="font-semibold text-gray-800 text-sm">Filter Pencarian</span>
            </div>

            {/* Kategori */}
            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Kategori</p>
              <div className="space-y-2">
                {KATEGORI_OPTS.map(k => (
                  <label key={k} className="flex items-center gap-2 cursor-pointer group">
                    <input type="radio" name="kategori" value={k}
                      checked={katFilter === k}
                      onChange={() => setKatFilter(k)}
                      className="accent-brand-600 w-4 h-4" />
                    <span className={`text-sm transition ${katFilter === k ? 'text-brand-700 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>
                      {k}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tingkat Wilayah */}
            <div className="mb-5 pt-4 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Tingkat Wilayah</p>
              <div className="space-y-2">
                {TINGKAT_OPTS.map(t => (
                  <label key={t} className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" checked={tingkat.includes(t)}
                      onChange={() => toggleTingkat(t)}
                      className="accent-brand-600 w-4 h-4 rounded" />
                    <span className={`text-sm transition ${tingkat.includes(t) ? 'text-brand-700 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>
                      {t}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Biaya */}
            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Biaya Pendaftaran</p>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={gratis} onChange={e => setGratis(e.target.checked)}
                  className="accent-brand-600 w-4 h-4 rounded" />
                <span className="text-sm text-gray-600">Gratis saja</span>
              </label>
            </div>

            {(katFilter !== 'Semua' || tingkat.length || gratis) && (
              <button onClick={() => { setKatFilter('Semua'); setTingkat([]); setGratis(false); }}
                className="mt-4 text-xs text-red-500 hover:text-red-700 font-medium">
                Reset Filter
              </button>
            )}
          </div>
        </aside>

        {/* ── Lomba Grid ── */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="card p-16 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-brand-400 mx-auto" />
            </div>
          ) : lombaList.length === 0 ? (
            <div className="card p-16 text-center">
              <Trophy className="h-12 w-12 text-gray-200 mx-auto mb-3" />
              <p className="font-semibold text-gray-500">Belum ada lomba yang sesuai</p>
              <p className="text-sm text-gray-400 mt-1">Coba ubah kata kunci atau filter</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-400 mb-4">{lombaList.length} lomba ditemukan</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {lombaList.map(l => <LombaCard key={l.id} lomba={l} />)}
              </div>
            </>
          )}
        </div>
      </div>

      <footer className="border-t border-gray-100 py-4 text-center text-xs text-gray-400">
        © 2026 AmbaChamp. Platform Penyedia Informasi Lomba & Kolaborasi.
      </footer>
    </div>
  );
}
