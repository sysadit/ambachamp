'use client';

import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LombaCard from '@/components/lomba/LombaCard';
import { lombaAPI } from '@/lib/api';
import { Search, Filter, Loader2, Trophy } from 'lucide-react';

const KATEGORI_OPTS = ['Semua', 'Teknologi & Digital', 'Sains & Riset', 'Olahraga', 'Seni & Kreatif'];
const KATEGORI_MAP = {
  'Teknologi & Digital': 'teknologi_digital',
  'Sains & Riset':       'sains_riset',
  'Olahraga':            'olahraga',
  'Seni & Kreatif':      'seni_kreatif',
};
const TINGKAT_OPTS = [
  { label: 'Internasional', value: 'internasional' },
  { label: 'Nasional',      value: 'nasional' },
  { label: 'Mahasiswa/Universitas', value: 'kampus' },
];

export default function ExplorePage() {
  const [lombaList, setLombaList] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [keyword, setKeyword]   = useState('');
  const [katFilter, setKatFilter] = useState('Semua');
  const [tingkat, setTingkat]   = useState('');
  const [biaya, setBiaya]       = useState('Semua Biaya');

  const fetchLomba = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        keyword: keyword || undefined,
        kategori: KATEGORI_MAP[katFilter] || undefined,
        tingkat: tingkat || undefined,
        gratis: biaya === 'Gratis' ? '1' : undefined,
      };
      const res = await lombaAPI.getAll(params);
      setLombaList(res.data.data || []);
    } catch {
      setLombaList([]);
    } finally {
      setLoading(false);
    }
  }, [keyword, katFilter, tingkat, biaya]);

  useEffect(() => { fetchLomba(); }, [katFilter, tingkat, biaya]);

  const onSearch = () => fetchLomba();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">Eksplorasi Lomba</h1>
          <p className="text-slate-600 mt-2 text-lg">Temukan kompetisi yang tepat untuk mengasah potensimu dan bangun portofolio terbaikmu.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 flex-shrink-0 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-24">
              <div className="flex items-center gap-2 mb-6 text-slate-900">
                <Filter className="h-5 w-5" />
                <h2 className="font-bold text-lg">Filter Pencarian</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-3">Kategori</label>
                  <div className="space-y-3">
                    {KATEGORI_OPTS.map(cat => (
                      <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                        <input type="radio" name="kategori" value={cat}
                          checked={katFilter === cat}
                          onChange={() => setKatFilter(cat)}
                          className="w-4 h-4 border-slate-300 text-indigo-600 focus:ring-indigo-600" />
                        <span className="text-slate-600 font-medium group-hover:text-slate-900 transition-colors">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <label className="block text-sm font-bold text-slate-800 mb-3">Tingkat Wilayah</label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="radio" name="tingkat" checked={tingkat === ''} onChange={() => setTingkat('')}
                        className="w-4 h-4 border-slate-300 text-indigo-600 focus:ring-indigo-600" />
                      <span className="text-slate-600 font-medium group-hover:text-slate-900">Semua</span>
                    </label>
                    {TINGKAT_OPTS.map(lv => (
                      <label key={lv.value} className="flex items-center gap-3 cursor-pointer group">
                        <input type="radio" name="tingkat" checked={tingkat === lv.value} onChange={() => setTingkat(lv.value)}
                          className="w-4 h-4 border-slate-300 text-indigo-600 focus:ring-indigo-600" />
                        <span className="text-slate-600 font-medium group-hover:text-slate-900 transition-colors">{lv.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <label className="block text-sm font-bold text-slate-800 mb-3">Biaya Pendaftaran</label>
                  <select value={biaya} onChange={(e) => setBiaya(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 px-3 text-slate-700 font-medium shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:bg-white transition-colors cursor-pointer outline-none">
                    <option>Semua Biaya</option>
                    <option>Gratis</option>
                  </select>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && onSearch()}
                  placeholder="Cari nama lomba atau penyelenggara..."
                  className="w-full pl-14 pr-4 py-4 rounded-2xl border border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-slate-900 font-medium bg-white transition-colors outline-none"
                />
              </div>
              <button onClick={onSearch}
                className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-md active:scale-95 w-full sm:w-auto">
                Cari
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-indigo-400" /></div>
            ) : lombaList.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 py-20 text-center">
                <Trophy className="h-12 w-12 text-slate-200 mx-auto mb-3" />
                <p className="font-semibold text-slate-500">Belum ada lomba ditemukan</p>
                <p className="text-sm text-slate-400 mt-1">Coba ubah filter atau kata kunci pencarian.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {lombaList.map(l => <LombaCard key={l.id} lomba={l} />)}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
