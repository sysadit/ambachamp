'use client';
// src/app/(auth)/register/page.jsx

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, AlertCircle, Loader2, CheckCircle, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const { register: registerAuth }  = useAuth();
  const [showPw,   setShowPw]       = useState(false);
  const [error,    setError]        = useState('');
  const [loading,  setLoading]      = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm({ defaultValues: { role: 'mahasiswa' } });
  const role = watch('role');
  const tipePenyelenggara = watch('tipe_penyelenggara');

  const onSubmit = async (data) => {
    setError(''); setLoading(true);
    try   { await registerAuth(data); }
    catch (err) { setError(err.response?.data?.message || 'Pendaftaran gagal. Coba lagi.'); }
    finally     { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 py-10">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <img alt="AMBAChamp Logo" className="h-8 w-auto object-contain" src="/images/logo-ambachamp.png" />
          <span className="font-bold text-brand-700 text-xl">AmbaChamp</span>
        </Link>

        <div className="card p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Buat Akun Baru</h1>
            <p className="text-gray-400 text-sm">Sudah punya akun?{' '}
              <Link href="/auth/login" className="text-brand-600 font-semibold hover:text-brand-700">Masuk di sini</Link>
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5">
              <AlertCircle className="h-4 w-4 flex-shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Role selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Daftar sebagai</label>
              <div className="grid grid-cols-2 gap-2">
                {['mahasiswa', 'penyelenggara'].map(r => (
                  <label key={r}
                    className={`flex items-center gap-2.5 border-2 rounded-xl px-4 py-3 cursor-pointer transition ${
                      role === r ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                    <input type="radio" value={r} {...register('role')} className="hidden" />
                    {role === r
                      ? <CheckCircle className="h-4 w-4 text-brand-600 flex-shrink-0" />
                      : <div className="h-4 w-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
                    }
                    <span className={`text-sm font-semibold capitalize ${role === r ? 'text-brand-700' : 'text-gray-600'}`}>{r}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nama Lengkap</label>
              <input type="text" placeholder="Nama lengkap kamu"
                className={`input-base ${errors.nama ? 'border-red-400' : ''}`}
                {...register('nama', { required: 'Nama wajib diisi.' })} />
              {errors.nama && <p className="text-red-500 text-xs mt-1">{errors.nama.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
              <input type="email" placeholder="nama@email.com"
                className={`input-base ${errors.email ? 'border-red-400' : ''}`}
                {...register('email', {
                  required: 'Email wajib diisi.',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'Format email tidak valid.' }
                })} />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {role === 'mahasiswa' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">NIM</label>
                  <input type="text" placeholder="011022XXXX" className="input-base" {...register('nim')} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Jurusan</label>
                  <input type="text" placeholder="Teknik Informatika" className="input-base" {...register('jurusan')} />
                </div>
              </div>
            )}

            {role === 'penyelenggara' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tipe Penyelenggara</label>
                  <select className="input-base" {...register('tipe_penyelenggara')}>
                    <option value="individu">Individu</option>
                    <option value="organisasi">Organisasi / Lembaga</option>
                  </select>
                </div>
                {tipePenyelenggara === 'organisasi' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nama Organisasi / Lembaga</label>
                    <input type="text" placeholder="Nama lembaga penyelenggara" className="input-base" {...register('nama_organisasi')} />
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} placeholder="Minimal 6 karakter"
                  className={`input-base pr-10 ${errors.password ? 'border-red-400' : ''}`}
                  {...register('password', {
                    required: 'Password wajib diisi.',
                    minLength: { value: 6, message: 'Password minimal 6 karakter.' }
                  })} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2 text-sm">
              {loading
                ? <><Loader2 className="h-4 w-4 animate-spin" /> Mendaftar...</>
                : <>Buat Akun <ArrowRight className="h-4 w-4" /></>
              }
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">© 2026 AMBAchamp · STT Nurul Fikri</p>
      </div>
    </div>
  );
}
