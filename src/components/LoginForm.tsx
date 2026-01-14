'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { IniciarSesionDto } from '@/types';
import { Mail, Lock as LockIcon } from 'lucide-react';

export const LoginForm = () => {
  const [credenciales, setCredenciales] = useState<IniciarSesionDto>({
    email: '',
    contrasena: '',
  });

  const router = useRouter();
  const { login, isLoadingLogin, loginError, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(credenciales);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredenciales({
      ...credenciales,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {loginError && (
        <div className="p-4 bg-red-500/20 backdrop-blur-md border border-red-500/30 text-red-200 rounded-lg">
          Error al iniciar sesión. Verifica tus credenciales.
        </div>
      )}

      <div>
        <label className="block text-white text-sm font-medium mb-2">Email</label>
        <div className="relative">
          <input
            type="email"
            name="email"
            value={credenciales.email}
            onChange={handleChange}
            className="w-full pl-10 pr-3 py-3 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-white/70"
            placeholder="tu@email.com"
            required
          />
          <Mail className="absolute left-3 top-3.5 h-5 w-5 text-white/70" />
        </div>
      </div>

      <div>
        <label className="block text-white text-sm font-medium mb-2">Contraseña</label>
        <div className="relative">
          <input
            type="password"
            name="contrasena"
            value={credenciales.contrasena}
            onChange={handleChange}
            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="••••••••"
            required
          />
          <LockIcon className="absolute left-3 top-3.5 h-5 w-5 text-white/70" />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoadingLogin}
        className="w-full bg-white/20 backdrop-blur-md border border-white/30 text-white py-3 px-4 rounded-lg hover:bg-white/30 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none font-medium"
      >
        {isLoadingLogin ? 'Iniciando...' : 'Iniciar Sesión'}
      </button>
    </form>
  );
};