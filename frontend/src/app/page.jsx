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

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#05050f] text-white font-sans">

      {/* ── NAVBAR (landing dark) ───────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#05050f]/80 backdrop-blur-xl">
        <div className="container-main flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold text-white">
            <Trophy className="h-6 w-6 text-brand-400" />
            <span className="text-white">AMBA<span className="text-brand-400">Champ</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            <Link href="/"          className="px-4 py-2 text-sm text-white/70 hover:text-white transition rounded-lg hover:bg-white/5">Home</Link>
            <a href="#about"        className="px-4 py-2 text-sm text-white/70 hover:text-white transition rounded-lg hover:bg-white/5">About</a>
            <a href="#contact"      className="px-4 py-2 text-sm text-white/70 hover:text-white transition rounded-lg hover:bg-white/5">Contact Us</a>
            <a href="#faq"          className="px-4 py-2 text-sm text-white/70 hover:text-white transition rounded-lg hover:bg-white/5">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login"    className="px-4 py-2 text-sm text-white/80 hover:text-white transition">Login</Link>
            <Link href="/auth/register" className="btn-primary text-sm">Daftar</Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-[88vh] flex items-end overflow-hidden">
        {/* Background — dark with subtle grid */}
        <div className="absolute inset-0 bg-[#05050f]">
          <div className="absolute inset-0" style={{ backgroundImage:'radial-gradient(circle at 20% 50%, rgba(124,58,237,.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139,92,246,.08) 0%, transparent 40%)' }} />
        </div>

        <div className="container-main relative z-10 pb-24 pt-20">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-700/40 bg-brand-900/30 px-4 py-1.5 text-xs font-medium text-brand-300 mb-6">
              <Zap className="h-3 w-3" />
              Platform No. 1 untuk Mahasiswa Berprestasi
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-5">
              Semua Bisa Jadi <span className="text-brand-400">Champion!</span>
            </h1>
            <p className="text-white/60 text-base leading-relaxed mb-8">
              Platform kompetisi terlengkap untuk mahasiswa dan profesional. Temukan peluang global, bentuk tim impian, dan tunjukkan keahlian Anda di panggung dunia.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/auth/register" className="btn-primary text-sm px-6 py-3">
                Daftar Sekarang
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/lomba" className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-white/80 hover:border-white/30 hover:text-white transition">
                <Search className="h-4 w-4" />
                Lihat Panduan
              </Link>
            </div>
          </div>
        </div>

        {/* Floating image */}
        <div className="absolute right-8 bottom-8 hidden lg:block">
          <div className="w-64 h-44 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80"
              alt="Team working" className="w-full h-full object-cover opacity-90" />
          </div>
        </div>
      </section>

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

      {/* ── TESTIMONIALS ─────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="container-main">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Apa Kata Para Juara?</h2>
            <p className="text-gray-500 text-sm">Kisah sukses dari mereka yang berhasil melempar batas dan membangun koneksi melalui AMBAChamp.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="card p-6">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-5 line-clamp-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-gray-400 text-xs">{t.role}</p>
                  </div>
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

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="bg-[#05050f] border-t border-white/5">
        <div className="container-main py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="h-6 w-6 text-brand-400" />
                <span className="font-bold text-white text-lg">AMBAchamp</span>
              </div>
              <p className="text-white/40 text-sm leading-relaxed">Platform kompetisi terlengkap untuk mahasiswa dan profesional.</p>
            </div>
            {[
              { title:'Platform', links:['Cari Lomba', 'Teammate Finder', 'Verifikasi Admin', 'Dashboard'] },
              { title:'Company',  links:['About', 'Careers', 'Blog', 'Newsletter'] },
              { title:'Contact',  links:['Support', 'Privacy Policy', 'Terms of Service'] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="text-white font-semibold text-sm mb-4">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map(l => (
                    <li key={l}><Link href="#" className="text-white/40 hover:text-white/80 text-sm transition">{l}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-white/30 text-xs">© 2026 AMBAchamp. Causing MBA Excellence.</p>
            <div className="flex gap-4">
              <Link href="#" className="text-white/30 hover:text-white/60 text-xs transition">Privacy Policy</Link>
              <Link href="#" className="text-white/30 hover:text-white/60 text-xs transition">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
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
