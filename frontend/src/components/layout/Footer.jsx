import Link from 'next/link';
import { Trophy } from 'lucide-react';

export default function Footer() {
  return (
    /* ── FOOTER ───────────────────────────────────────── */

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

  );
}