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
import Testimonials from '@/components/landing/Testimonials';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col">

      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-8 pb-12">
        
        <Hero />

        <div className="mt-20">
          <Testimonials />
        </div>

      </main>

      {/* ── STATS BAR ───────────────────────────────────── */}
      <section className="bg-[#0a0a1a] border-y border-white/5">
        <div className="container-main py-6">
          <div className="grid grid-cols-3 gap-4 md:gap-8 divide-x divide-white/10">
            {STATS.map(s => (
              <div key={s.label} className="text-center px-4">
                <p className="text-2xl md:text-3xl font-bold text-white mb-0.5">{s.value}</p>
                <p className="text-xs text-white/40 uppercase tracking-wider font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="container-main">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Bagaimana AMBAChamp Bekerja</h2>
            <p className="text-gray-500 text-sm">Langkah mudah untuk memulai perjalanan kompetisi Anda dan awal hingunga menjadi juara.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STEPS.map((step, i) => (
              <div key={step.label} className="text-center group">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-brand-50 flex items-center justify-center group-hover:bg-brand-100 transition">
                  <step.icon className="h-7 w-7 text-brand-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{step.label}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED COMPETITIONS ────────────────────────── */}
      <section className="bg-gray-50 py-20">
        <div className="container-main">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Kompetisi Unggulan</h2>
              <p className="text-gray-500 text-sm">Jadilah kompetitor terbaik dari ini di berbagai kategori.</p>
            </div>
            <Link href="/lomba" className="text-sm text-brand-600 font-semibold hover:text-brand-700 flex items-center gap-1">
              Lihat Semua <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Big feature card + right column */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            {/* Large featured card */}
            <div className="lg:col-span-2 relative rounded-2xl overflow-hidden h-72 group">
              <img src={FEATURED[0].img} alt={FEATURED[0].title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <span className="badge bg-green-500 text-white mb-2">Business Corp</span>
                <div className="flex items-center gap-2 text-xs text-white/70 mb-2">
                  <span className="badge bg-white/20 text-white">⏰ {FEATURED[0].days}</span>
                </div>
                <h3 className="text-white font-bold text-xl mb-1">{FEATURED[0].title}</h3>
                <div className="flex items-center gap-3">
                  <span className="text-amber-400 text-sm font-semibold">{FEATURED[0].prize}</span>
                  <Link href={`/lomba/${FEATURED[0].id}`} className="btn-primary text-xs px-4 py-2">Ikuti Sekarang</Link>
                </div>
              </div>
            </div>

            {/* Right card */}
            <div className="relative rounded-2xl overflow-hidden h-72 group">
              <img src={FEATURED[1].img} alt={FEATURED[1].title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4">
                <span className="badge bg-blue-500 text-white mb-2">Tech & AI</span>
                <h3 className="text-white font-semibold text-sm mb-1">{FEATURED[1].title}</h3>
                <p className="text-white/60 text-xs flex items-center gap-1">
                  <span>📅</span> {FEATURED[1].deadline}
                  <ChevronRight className="h-3 w-3 ml-auto" />
                </p>
              </div>
            </div>
          </div>

          {/* Bottom 3 cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {FEATURED.slice(2).map(f => (
              <div key={f.id} className="card-hover overflow-hidden group">
                <div className="h-32 relative overflow-hidden">
                  <img src={f.img} alt={f.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className={`absolute top-3 left-3 badge text-white ${CATEGORY_COLOR[f.category] || 'bg-gray-500'}`}>{f.category}</span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-sm mb-3 line-clamp-2">{f.title}</h3>
                  <Link href={`/lomba/${f.id}`} className="btn-secondary text-xs w-full">Detail</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="bg-[#05050f] py-20">
        <div className="container-main text-center">
          <h2 className="text-3xl font-bold text-white mb-3">Siap Menjadi Juara Berikutnya?</h2>
          <p className="text-white/50 text-sm mb-8 max-w-md mx-auto">Bergabung dengan ribuan mahasiswa ambisius Indonesia dan raih berbagai prestasi Anda bersama kami.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/auth/register" className="btn-primary px-8 py-3 text-sm">
              Daftar Gratis Sekarang
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/lomba" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-8 py-3 text-sm font-semibold text-white/70 hover:border-white/30 hover:text-white transition">
              Halaman Tim Kami
            </Link>
          </div>
        </div>
      </section>

      {/* ── ABOUT ────────────────────────────────────────── */}
      <section id="about" className="bg-white py-20">
        <div className="container-main">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-sm font-semibold text-brand-600 uppercase tracking-wider">Tentang Kami</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-5">Apa itu AMBAChamp?</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              AMBAChamp adalah platform informasi lomba yang dibuat untuk mempermudah mahasiswa menemukan kompetisi yang valid dan terpercaya. Lewat satu platform, mahasiswa bisa menjelajahi lomba sesuai bidangnya, menyimpan lomba favorit, sampai mencari rekan satu tim lintas disiplin.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Kami juga membantu penyelenggara menjangkau lebih banyak peserta, dengan jaminan setiap informasi diverifikasi admin sebelum tayang. Tujuannya satu: bikin setiap mahasiswa punya kesempatan yang sama untuk berprestasi.
            </p>
          </div>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────── */}
      <section id="contact" className="bg-[#0a0a1a] py-20 text-white">
        <div className="container-main">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-brand-400 uppercase tracking-wider">Hubungi Kami</span>
            <h2 className="text-3xl font-bold mt-2">Punya Pertanyaan?</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-4xl mx-auto">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
              <Phone className="h-6 w-6 text-brand-400 mx-auto mb-3" />
              <p className="text-xs text-white/40 mb-1">Telepon</p>
              <p className="text-sm font-medium">+62 21 1234567</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
              <Mail className="h-6 w-6 text-brand-400 mx-auto mb-3" />
              <p className="text-xs text-white/40 mb-1">Email</p>
              <p className="text-sm font-medium break-all">ambachamp@outlook.com</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
              <Instagram className="h-6 w-6 text-brand-400 mx-auto mb-3" />
              <p className="text-xs text-white/40 mb-1">Instagram</p>
              <p className="text-sm font-medium">@capuchino4life</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
              <MapPin className="h-6 w-6 text-brand-400 mx-auto mb-3" />
              <p className="text-xs text-white/40 mb-1">Kantor</p>
              <p className="text-sm font-medium">Jl. Prof Lafran Pane / RTM Kelapa Dua, Depok</p>
            </div>
          </div>
        </div>
      </section>

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

      <Footer />
    </div>
  );
}

// satu baris FAQ yang bisa dibuka-tutup
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
