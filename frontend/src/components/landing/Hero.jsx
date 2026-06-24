import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Hero() {
  const { user } = useAuth();

  return (
    <section className="relative pt-12 pb-xxl flex items-center transition-all font-sans">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-xl items-center relative">
        <div className="z-10 space-y-lg">
          <div className="inline-flex items-center gap-2 bg-secondary-fixed px-md py-1.5 rounded-full">
            <span className="material-symbols-outlined text-on-secondary-fixed text-sm">stars</span>
            <span className="text-label-md text-on-secondary-fixed">Platform No. 1 untuk Mahasiswa Berprestasi</span>
          </div>
          
          <h1 className="font-display text-display-lg text-primary leading-tight">
            Raih Prestasi,<br/>
            <span className="text-gradient">Bangun Koneksi.</span>
          </h1>
          
          <p className="text-body-lg text-on-surface-variant max-w-xl">
            Platform kompetisi terlengkap untuk mahasiswa dan profesional. Temukan peluang global, bentuk tim impian, dan tunjukkan keahlian Anda di panggung dunia.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-md">
            <Link 
              href={user ? "/explore" : "/auth/register"}
              className="bg-primary text-on-primary px-xl py-4 rounded-xl text-label-lg shadow-lg hover:shadow-xl transition-all text-center"
            >
              {user ? "Eksplorasi Lomba" : "Daftar Sekarang"}
            </Link>
            <Link 
              href="/#tentang-kami"
              className="border border-outline-variant bg-surface text-primary px-xl py-4 rounded-xl text-label-lg hover:bg-surface-container-low transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">info</span>
              Pelajari Fitur
            </Link>
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="animate-float">
            <div className="relative z-10 glass-card p-4 rounded-3xl shadow-2xl overflow-hidden aspect-[4/3]">
              <img 
                alt="MBA students collaborating around a sleek conference table in a sunlit, modern university building." 
                className="w-full h-full object-cover rounded-2xl shadow-inner" 
                src="/images/hero_collaboration.png" 
              />
            </div>
            {/* Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary-container/20 blur-3xl rounded-full"></div>
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-primary-container/10 blur-3xl rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
}