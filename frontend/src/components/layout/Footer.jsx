// src/components/layout/Footer.jsx
import Link from 'next/link';
import { Trophy } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-auto">
      <div className="container-main py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-lg mb-3">
              <Trophy className="h-6 w-6 text-accent-500" />
              <span>AMBA<span className="text-accent-500">champ</span></span>
            </div>
            <p className="text-sm leading-relaxed">
              Platform informasi lomba mahasiswa. Temukan kompetisi, verifikasi info, dan cari rekan tim terbaikmu.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Navigasi</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/lomba"    className="hover:text-white transition">Cari Lomba</Link></li>
              <li><Link href="/teammate" className="hover:text-white transition">Cari Tim</Link></li>
              <li><Link href="/auth/register" className="hover:text-white transition">Daftar Akun</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Tentang</h4>
            <ul className="space-y-2 text-sm">
              <li>Capuchino4life — Kelompok 4</li>
              <li>Program Studi Teknik Informatika</li>
              <li>STT Nurul Fikri</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs">
          © 2025 AMBAchamp. Dibuat dengan ❤️ oleh Capuchino4life untuk tugas Manajemen Proyek.
        </div>
      </div>
    </footer>
  );
}
