'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import { Trophy, Mail, Lock, ArrowRight, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
  // --- LOGIKA LAMA YANG DIPERTAHANKAN ---
  const { login } = useAuth();
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setError(''); 
    setLoading(true);
    try { 
      await login(data.email, data.password); 
    } catch (err) { 
      setError(err.response?.data?.message || 'Email atau password salah.'); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    // --- DESAIN BARU ---
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="p-8 sm:p-10">
          
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2 text-indigo-600">
              <div className="h-12 w-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
                <Trophy className="h-7 w-7" />
              </div>
            </Link>
          </div>
          
          <h2 className="text-3xl font-extrabold text-slate-900 text-center mb-2">Selamat Datang Kembali</h2>
          <p className="text-slate-500 text-center mb-8">Masuk ke akun AmbaChamp kamu</p>

          {/* Menampilkan Error dari kode lama */}
          {error && (
            <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5">
              <AlertCircle className="h-4 w-4 flex-shrink-0" /> {error}
            </div>
          )}

          {/* Form menggunakan handleSubmit dari react-hook-form */}
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            
            {/* Input Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input 
                  type="email" 
                  placeholder="nama@kampus.ac.id" 
                  className={`w-full pl-12 pr-4 py-3.5 rounded-2xl border ${errors.email ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500'} shadow-sm font-medium bg-slate-50 focus:bg-white transition-colors`}
                  {...register('email', {
                    required: 'Email wajib diisi.',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Format email tidak valid.' }
                  })}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email.message}</p>}
            </div>

            {/* Input Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-slate-700">Password</label>
                <Link href="#" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">Lupa Password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input 
                  type={showPw ? 'text' : 'password'} 
                  placeholder="••••••••" 
                  className={`w-full pl-12 pr-12 py-3.5 rounded-2xl border ${errors.password ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500'} shadow-sm font-medium bg-slate-50 focus:bg-white transition-colors`}
                  {...register('password', { required: 'Password wajib diisi.' })}
                />
                
                {/* Toggle Lihat Password dari kode lama */}
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.password.message}</p>}
            </div>

            {/* Tombol Submit dengan State Loading */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-md flex items-center justify-center gap-2 mt-8 group disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader2 className="h-5 w-5 animate-spin" /> Memproses...</>
              ) : (
                <>Masuk Sekarang <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          {/* Navigasi Register */}
          <div className="mt-8 text-center text-sm font-medium text-slate-600">
            Belum punya akun?{' '}
            <Link href="/auth/register" className="text-indigo-600 hover:text-indigo-700 hover:underline">
              Daftar di sini
            </Link>
          </div>
        </div>
        
        {/* Footer Card */}
        <div className="bg-slate-50 p-6 border-t border-slate-100 text-center">
          <Link href="/" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}