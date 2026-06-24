'use client';

import { useState, useEffect } from "react";
import { Calendar, ArrowRight, Bookmark } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

const formatFee = (fee) => {
  if (fee === 0 || !fee) return 'Gratis';
  return `Rp ${fee.toLocaleString('id-ID')}`;
};

const getTagColor = (category) => {
  const cat = category?.toLowerCase() || '';
  if (cat.includes('teknologi')) return 'bg-blue-100 text-blue-700';
  if (cat.includes('sains')) return 'bg-purple-100 text-purple-700';
  if (cat.includes('olahraga')) return 'bg-orange-100 text-orange-700';
  if (cat.includes('seni')) return 'bg-rose-100 text-rose-700';
  return 'bg-indigo-100 text-indigo-700'; 
};

export default function RecommendedLomba() {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const response = await api.get('/lomba?limit=3'); 
        setCompetitions(response.data.data);
      } catch (error) {
        console.error("Gagal mengambil data lomba:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompetitions();
  }, []);

  return (
    <section className="py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="max-w-2xl">
          <span className="text-secondary font-label-lg uppercase tracking-widest mb-2 block">Pilihan Terbaik</span>
          <h2 className="font-display text-headline-lg md:text-display-md text-primary mb-4 leading-tight">Rekomendasi Lomba</h2>
          <p className="font-sans text-body-lg text-on-surface-variant">Kompetisi bergengsi pilihan kami yang paling sesuai dengan tren saat ini. Jangan lewatkan kesempatanmu!</p>
        </div>
        <Link href="/explore" className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary px-6 py-3.5 rounded-xl font-label-lg hover:opacity-90 active:scale-95 transition-all shrink-0 shadow-sm hover:shadow-md">
          Lihat Semua Lomba <ArrowRight className="h-5 w-5" />
        </Link>
      </div>

      {/* Menampilkan animasi loading saat menarik data */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
        </div>
      ) : competitions.length === 0 ? (
        <div className="text-center font-sans text-body-md text-on-surface-variant py-12 bg-white rounded-3xl border border-outline-variant/40">
          Belum ada lomba yang terverifikasi saat ini.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {competitions.map((comp) => {
            const uploadUrl = process.env.NEXT_PUBLIC_UPLOAD_URL || 'http://localhost:5000/uploads';
            const imgSrc = comp.poster ? `${uploadUrl}/posters/${comp.poster}` : "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1080";
            return (
              <div key={comp.id} className="bg-white rounded-3xl border border-outline-variant/60 overflow-hidden shadow-sm hover:shadow-xl hover:border-secondary/40 transition-all duration-300 group flex flex-col">
                <div className="relative h-56 overflow-hidden bg-surface-container">
                  {/* Fallback image jika poster dari database kosong/null */}
                  <img 
                    src={imgSrc} 
                    alt={comp.judul} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1.5 rounded-lg font-label-md bg-white/90 backdrop-blur-sm text-primary uppercase shadow-sm">
                      {comp.tingkat}
                    </span>
                  </div>
                  <button className="absolute top-4 right-4 h-10 w-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-on-surface-variant hover:text-secondary hover:bg-white transition-colors shadow-sm">
                    <Bookmark className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-center mb-3">
                    <span className={`px-3 py-1 rounded-md font-label-sm ${getTagColor(comp.kategori)}`}>
                      {/* Mengganti underscore dengan spasi (teknologi_digital -> teknologi digital) */}
                      {comp.kategori.replace('_', ' ')}
                    </span>
                    <span className="text-secondary font-bold text-sm bg-surface-container-high/60 px-3 py-1 rounded-md">
                      {formatFee(comp.biaya_pendaftaran)}
                    </span>
                  </div>
                  
                  <h3 className="font-display text-headline-sm text-primary mb-2 line-clamp-2 group-hover:text-secondary transition-colors leading-snug">
                    {comp.judul}
                  </h3>
                  <p className="font-sans text-body-sm text-on-surface-variant mb-5">
                    Oleh {comp.nama_penyelenggara}
                  </p>
                  
                  <div className="space-y-3 mb-6 mt-auto">
                    <div className="flex items-center gap-3 font-sans text-body-sm text-on-surface-variant">
                      <Calendar className="h-4 w-4 text-on-surface-variant/70 shrink-0" />
                      <span>Daftar s.d. {new Date(comp.deadline_pendaftaran).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric'})}</span>
                    </div>
                  </div>
                  
                  <Link href={`/lomba/${comp.id}`} className="block w-full text-center py-3 rounded-xl border border-outline-variant text-primary font-label-lg hover:border-secondary hover:text-secondary hover:bg-surface transition-all">
                    Detail Lomba
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}