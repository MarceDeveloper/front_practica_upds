'use client';

import { useAuthStore } from '@/stores/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Home, Building2, Calendar, Users, BarChart3, LogOut, User } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { usuario, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isAdmin = usuario?.rol === 'administrador';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-72 bg-white/80 backdrop-blur-lg shadow-2xl min-h-screen border-r border-white/20">
          <div className="flex items-center justify-center h-20 bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
            <h1 className="text-2xl font-bold text-white tracking-wide">SREO</h1>
          </div>
          <nav className="mt-10">
            <div className="px-6 space-y-3">
              <Link
                href="/dashboard"
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-700 rounded-xl transition-all duration-200 group"
              >
                <Home className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Inicio</span>
              </Link>
              <Link
                href="/dashboard/espacios"
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-700 rounded-xl transition-all duration-200 group"
              >
                <Building2 className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Espacios</span>
              </Link>
              <Link
                href="/dashboard/reservas"
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-700 rounded-xl transition-all duration-200 group"
              >
                <Calendar className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                <span className="font-medium"> {usuario?.rol === 'administrador' ? 'Reservas' : 'Mis Reservas'}</span>
              </Link>
              <Link
                href="/dashboard/perfil"
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-700 rounded-xl transition-all duration-200 group"
              >
                <User className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Mi Perfil</span>
              </Link>
              {isAdmin && (
                <>
                  <Link
                    href="/dashboard/usuarios"
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-700 rounded-xl transition-all duration-200 group"
                  >
                    <Users className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Usuarios</span>
                  </Link>
                  <Link
                    href="/dashboard/reportes"
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-700 rounded-xl transition-all duration-200 group"
                  >
                    <BarChart3 className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Reportes</span>
                  </Link>
                </>
              )}
            </div>
          </nav>
          <div className="absolute bottom-0 w-72 p-6">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4 shadow-lg">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{usuario?.nombre}</p>
                  <p className="text-xs text-gray-600 capitalize">{usuario?.rol}</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full mt-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <main className="p-10">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}