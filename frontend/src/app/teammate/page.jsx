'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Users, Plus, ShieldCheck } from "lucide-react";

const mockRequests = [
  { id: 1, competition: "Nasional Hackathon 2026", role: "Frontend Developer", description: "Kami butuh satu orang lagi yang jago React/Tailwind untuk melengkapi tim. Ide sudah matang.", author: "Budi Santoso", date: "2 hari yang lalu" },
  { id: 2, competition: "Business Plan Competition UGM", role: "Financial Analyst", description: "Mencari teman dari jurusan akuntansi/manajemen yang bisa buat proyeksi finansial 3 tahun.", author: "Siti Rahma", date: "5 jam yang lalu" },
  { id: 3, competition: "UI/UX Design UI Connect", role: "UX Researcher", description: "Tim desain kami butuh researcher untuk validasi ide aplikasi e-waste. Figma sudah siap.", author: "Ahmad Rizki", date: "Baru saja" },
];

export default function TeammatesPage() {
  // State untuk mengatur tab yang aktif
  const [activeTab, setActiveTab] = useState('cari-anggota');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <Navbar />

      {/* Main Container */}
      <main className="flex-grow w-full py-10 px-4 sm:px-6 lg:px-8">
        
        {/* Wrapper khusus untuk membatasi lebar konten Teammate agar rapi di tengah */}
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-8 sm:p-12 text-white flex flex-col sm:flex-row items-center justify-between gap-8 shadow-lg">
            <div className="max-w-xl text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">Teammate Finder</h1>
              <p className="text-indigo-100 text-lg">
                Tidak punya tim? Jangan jadikan alasan untuk tidak ikut lomba. Cari rekan setim atau buka lowongan untuk timmu di sini.
              </p>
            </div>
            <button className="shrink-0 bg-white text-indigo-600 px-6 py-4 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-md w-full sm:w-auto justify-center">
              <Plus className="h-5 w-5" /> Buat Lowongan Tim
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-4 border-b border-slate-200 overflow-x-auto hide-scrollbar">
            <button 
              onClick={() => setActiveTab('cari-anggota')}
              className={`px-6 py-4 font-bold whitespace-nowrap transition-colors ${
                activeTab === 'cari-anggota' 
                  ? 'border-b-2 border-indigo-600 text-indigo-600' 
                  : 'border-b-2 border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Cari Anggota (Looking for Members)
            </button>
            <button 
              onClick={() => setActiveTab('cari-tim')}
              className={`px-6 py-4 font-bold whitespace-nowrap transition-colors ${
                activeTab === 'cari-tim' 
                  ? 'border-b-2 border-indigo-600 text-indigo-600' 
                  : 'border-b-2 border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Cari Tim (Looking for Team)
            </button>
          </div>

          {/* List Requests */}
          <div className="space-y-4">
            {mockRequests.map(req => (
              <div key={req.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between hover:border-indigo-200 hover:shadow-md transition-all">
                
                <div className="flex-1 space-y-3 w-full">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="bg-purple-100 text-purple-700 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide">
                      Dibutuhkan: {req.role}
                    </span>
                    <span className="text-slate-400 text-sm font-medium">{req.date}</span>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-xl text-slate-900">{req.competition}</h3>
                    <p className="text-slate-600 mt-2 line-clamp-2 leading-relaxed">{req.description}</p>
                  </div>
                  
                  <div className="flex items-center gap-2.5 text-sm text-slate-500 font-medium pt-2">
                    <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                      <Users className="h-3.5 w-3.5 text-slate-400" />
                    </div>
                    Diposting oleh <span className="text-slate-700 font-semibold">{req.author}</span>
                  </div>
                </div>

                <button className="w-full sm:w-auto shrink-0 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white px-8 py-3.5 rounded-xl font-bold transition-colors">
                  Lamar Posisi
                </button>
                
              </div>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}