import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-primary text-on-primary border-t border-on-primary-fixed-variant/20 transition-all font-sans">
      <div className="max-w-container-max mx-auto py-xxl px-gutter">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-lg mb-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img alt="AMBAChamp Logo" className="h-8 w-auto brightness-0 invert" src="/images/logo-ambachamp.png" />
              <span className="font-display font-bold text-headline-sm text-on-primary">AMBAChamp</span>
            </div>
            <p className="text-on-primary-container text-body-sm leading-relaxed">
              Platform kompetisi terlengkap untuk mahasiswa dan profesional.
            </p>
          </div>
          {[
            { title:'Platform', links:['Cari Lomba', 'Teammate Finder', 'Verifikasi Admin', 'Dashboard'] },
            { title:'Company',  links:['About', 'Careers', 'Blog', 'Newsletter'] },
            { title:'Contact',  links:['Support', 'Privacy Policy', 'Terms of Service'] },
          ].map(col => (
            <div key={col.title} className="space-y-md">
              <h4 className="font-label-lg text-label-lg text-on-primary">{col.title}</h4>
              <ul className="space-y-sm">
                {col.links.map(l => (
                  <li key={l}>
                    <Link href="#" className="text-on-primary-container hover:text-on-primary text-body-sm transition-colors">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-on-primary-fixed-variant/10 pt-lg flex flex-col md:flex-row items-center justify-between gap-md text-label-sm text-on-primary-container">
          <p>© 2026 AMBAChamp. Raih Prestasi, Bangun Koneksi.</p>
          <div className="flex gap-lg">
            <Link href="#" className="hover:text-on-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-on-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}