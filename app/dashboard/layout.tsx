'use client';

import { useAuthStore } from '@/stores/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-screen">
          <div className="flex items-center justify-center h-16 bg-indigo-600">
            <h1 className="text-xl font-bold text-white">SREO</h1>
          </div>
          <nav className="mt-8">
            <div className="px-4 space-y-2">
              <Link
                href="/dashboard"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition-colors"
              >
                <span className="ml-2">🏠 Inicio</span>
              </Link>
              <Link
                href="/dashboard/espacios"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition-colors"
              >
                <span className="ml-2">🏢 Espacios</span>
              </Link>
              <Link
                href="/dashboard/reservas"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition-colors"
              >
                <span className="ml-2">📅 Mis Reservas</span>
              </Link>
              {isAdmin && (
                <>
                  <Link
                    href="/dashboard/usuarios"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition-colors"
                  >
                    <span className="ml-2">👥 Usuarios</span>
                  </Link>
                  <Link
                    href="/dashboard/reportes"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition-colors"
                  >
                    <span className="ml-2">📊 Reportes</span>
                  </Link>
                </>
              )}
            </div>
          </nav>
          <div className="absolute bottom-0 w-64 p-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-600">Usuario:</p>
              <p className="font-medium text-gray-900">{usuario?.nombre}</p>
              <p className="text-xs text-gray-500 capitalize">{usuario?.rol}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <main className="p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}