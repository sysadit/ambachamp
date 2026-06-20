import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

export const metadata = {
  title: 'AMBAchamp – Platform Informasi Lomba Mahasiswa',
  description: 'Temukan lomba, verifikasi info, dan cari rekan tim terbaikmu di AMBAchamp.',
  icons: { icon: '/favicon.ico' },
  other: {
    google: 'notranslate', // biar chrome ga auto-translate, soalnya bikin react crash (removeChild error)
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" translate="no">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
