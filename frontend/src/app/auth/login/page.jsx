'use client';
// src/app/(auth)/login/page.jsx — Redesign violet theme

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import { Trophy, Eye, EyeOff, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { login }             = useAuth();
  const [showPw, setShowPw]   = useState(false);
  const [error,  setError]    = useState('');
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setError(''); setLoading(true);
    try   { await login(data.email, data.password); }
    catch (err) { setError(err.response?.data?.message || 'Email atau password salah.'); }
    finally     { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex w-1/2 bg-brand-gradient flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-white -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-white translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative text-center max-w-sm">
          <Trophy className="h-16 w-16 text-brand-200 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Selamat Datang di AMBAchamp</h2>
          <p className="text-brand-200 text-sm leading-relaxed">
            Platform kompetisi terlengkap untuk mahasiswa. Temukan lomba, cari tim, dan raih prestasi.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <Trophy className="h-7 w-7 text-brand-600" />
            <span className="font-bold text-brand-700 text-xl">AmbaChamp</span>
          </Link>

          <div className="card p-8">
            <div className="mb-7">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Masuk ke Akun</h1>
              <p className="text-gray-400 text-sm">Belum punya akun?{' '}
                <Link href="/auth/register" className="text-brand-600 font-semibold hover:text-brand-700">Daftar gratis</Link>
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5">
                <AlertCircle className="h-4 w-4 flex-shrink-0" /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                <input type="email" placeholder="nama@email.com"
                  className={`input-base ${errors.email ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''}`}
                  {...register('email', {
                    required: 'Email wajib diisi.',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Format email tidak valid.' }
                  })} />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} placeholder="Minimal 6 karakter"
                    className={`input-base pr-10 ${errors.password ? 'border-red-400' : ''}`}
                    {...register('password', { required: 'Password wajib diisi.' })} />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>

              <button type="submit" disabled={loading}
                className="btn-primary w-full py-3 mt-2 text-sm">
                {loading
                  ? <><Loader2 className="h-4 w-4 animate-spin" /> Memproses...</>
                  : <>Masuk <ArrowRight className="h-4 w-4" /></>
                }
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            © 2026 AMBAchamp · STT Nurul Fikri
          </p>
        </div>
      </div>
    </div>
  );
}
