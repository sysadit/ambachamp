'use client';
// src/context/AuthContext.jsx
// Context global untuk state user yang login

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Cek token di localStorage saat pertama load
  useEffect(() => {
    const token = localStorage.getItem('ambachamp_token');
    const saved = localStorage.getItem('ambachamp_user');
    if (token && saved) {
      try { setUser(JSON.parse(saved)); } catch {}
    }
    setLoading(false);
  }, []);

  // Login
  const login = useCallback(async (email, password) => {
    const res = await authAPI.login({ email, password });
    const { token, ...userData } = res.data.data;
    localStorage.setItem('ambachamp_token', token);
    localStorage.setItem('ambachamp_user', JSON.stringify(userData));
    setUser(userData);

    // Redirect sesuai role
    if (userData.role === 'admin')         router.push('/admin/dashboard');
    else if (userData.role === 'penyelenggara') router.push('/penyelenggara/dashboard');
    else router.push('/dashboard');

    return userData;
  }, [router]);

  // Register
  const register = useCallback(async (formData) => {
    const res = await authAPI.register(formData);
    const { token, ...userData } = res.data.data;
    localStorage.setItem('ambachamp_token', token);
    localStorage.setItem('ambachamp_user', JSON.stringify(userData));
    setUser(userData);
    router.push('/dashboard');
    return userData;
  }, [router]);

  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem('ambachamp_token');
    localStorage.removeItem('ambachamp_user');
    setUser(null);
    router.push('/auth/login');
  }, [router]);

  // Update user data (misal setelah edit profil)
  const updateUser = useCallback((newData) => {
    const updated = { ...user, ...newData };
    localStorage.setItem('ambachamp_user', JSON.stringify(updated));
    setUser(updated);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook supaya mudah dipakai di komponen manapun
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth harus dipakai di dalam AuthProvider');
  return ctx;
};
