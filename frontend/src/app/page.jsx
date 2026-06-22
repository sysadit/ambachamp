'use client';
// src/app/page.jsx — Landing Page AMBAchamp (Dark Theme sesuai desain)

import { useState } from 'react';
import Link from 'next/link';
import {
  Trophy, Search, ShieldCheck, Users, Bell, ArrowRight,
  Star, ChevronRight, Medal, Target, TrendingUp, Zap,
  Phone, Mail, Instagram, MapPin
} from 'lucide-react';

const FAQ_ITEMS = [
  { q: 'Apa itu AMBAChamp?', a: 'AMBAChamp adalah platform informasi lomba untuk mahasiswa. Kamu bisa cari lomba, simpan ke wishlist, sampai cari rekan tim dalam satu tempat.' },
  { q: 'Apakah gratis untuk mahasiswa?', a: 'Ya, pendaftaran dan semua fitur inti untuk mahasiswa gratis. Kamu cukup daftar pakai email.' },
  { q: 'Bagaimana cara penyelenggara memasang lomba?', a: 'Daftar sebagai penyelenggara, lalu unggah informasi lomba lewat dashboard. Setelah diverifikasi admin, lomba langsung tampil ke mahasiswa.' },
  { q: 'Apakah informasi lombanya terjamin?', a: 'Setiap lomba yang masuk diverifikasi admin dulu sebelum dipublikasikan, jadi informasi yang tampil sudah dicek keasliannya.' },
];

const STATS = [
  { value: '1000+', label: 'ACTIVE COMPETITIONS' },
  { value: '50k+',  label: 'GLOBAL USERS' },
  { value: '100+',  label: 'UNIVERSITIES PARTNERED' },
];

const STEPS = [
  { icon: Search,  label: 'Find',    desc: 'Temukan ribuan event & kompetisi sesuai bidang dan keahlian Anda.' },
  { icon: Users,   label: 'Connect', desc: 'Jadikan teman menginspirasi dan rekan-tim yang paling cocok dengan kompetisi Anda.' },
  { icon: Target,  label: 'Compete', desc: 'Ikuti kontes online atau offline yang sempurna untuk menempa dan mengembangkan diri.' },
  { icon: Medal,   label: 'Win',     desc: 'Dari pengalaman, tambah skills, dan isi portofolio profesional Anda.' },
];

const FEATURED = [
  { id:1, title:'Global Business Strategy Challenge 2024', org:'Business Corp', category:'Business Corp', prize:'Prize Pool $3,000', days:'3 Hari lagi', img:'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80', featured:true },
  { id:2, title:'InnovateAI Hackathon: Future of FinTech', org:'Tech AI',       category:'Tech & AI',    deadline:'245 Tasktop', img:'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=600&q=80' },
  { id:3, title:'Brand Excellence Challenge: Gen-Z Market',org:'Marketing',     category:'Marketing',    img:'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80' },
  { id:4, title:'Asia Investment Analysis Competition',    org:'Finance',        category:'Finance',      img:'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80' },
  { id:5, title:'UI/UX Revamp Challenge: Smart Cities',   org:'Design Studio',  category:'Design',       img:'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=600&q=80' },
];

const TESTIMONIALS = [
  { name:'Sandi Ackari',    role:'Winner, Business Strategy Challenge', text:'Melalui AMBAchamp, saya menemukan kesempatan bisnis yang luar biasa dan tim yang luar biasa bersama kami. Memenangkan kompetisi yang memberikan peluang kami melanjutkan karir di Management Consulting.' },
  { name:'Andi Pulena',     role:'Winner, Tech Innovation Expo',        text:'Fitur Teammate Finder sangat membantu saya menemukan developer handal dan ahli yang melengkapi keahlian. Hasilnya, produk kami mendapatkan angel funding dari salah satu VC terkemuka.' },
  { name:'Jessyca Stong',   role:'2nd Place, Global Marketing Hub',     text:'Interface platform yang sangat user-friendly dan memberikan banyak peluang kompetisi tanpa batas. Tidak ada lagi yang terpaku pada keterbatasan mencari kesempatan.' },
];

const CATEGORY_COLOR = {
  'Business Corp': 'bg-green-500',
  'Tech & AI':     'bg-blue-500',
  'Marketing':     'bg-pink-500',
  'Finance':       'bg-amber-500',
  'Design':        'bg-purple-500',
};

import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/landing/Hero';
import Stats from '@/components/landing/Stats';
import Kategori from '@/components/landing/Kategori';
import TentangKami from '@/components/landing/TentangKami';
import Testimonials from '@/components/landing/Testimonials';
import RecommendedLomba from '@/components/landing/RecomendedLomba';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col">

      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-8 pb-12">
        
        <Hero />

        <Stats />

        <div className="mt-24" id="kategori">
          <Kategori />
        </div>

        <div className="mt-24">
          <RecommendedLomba />
        </div>

        <div className="mt-20" id="tentang-kami">
          <TentangKami />
        </div>

        <div className="mt-20">
          <Testimonials />
        </div>

        {/* ── FAQ ──────────────────────────────────────────── */}
      <section id="faq" className="bg-white py-20">
        <div className="container-main">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-brand-600 uppercase tracking-wider">FAQ</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">Pertanyaan yang Sering Ditanya</h2>
          </div>
          <div className="max-w-2xl mx-auto divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
            {FAQ_ITEMS.map((item, i) => (
              <FaqRow key={i} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      </main>

      <Footer />
    </div>
  );
}

function FaqRow({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-gray-50 transition"
      >
        <span className="text-sm font-semibold text-gray-800">{q}</span>
        <span className="text-brand-500 text-xl leading-none flex-shrink-0">{open ? '−' : '+'}</span>
      </button>
      {open && <p className="px-5 pb-4 text-sm text-gray-500 leading-relaxed">{a}</p>}
    </div>
  );
}
