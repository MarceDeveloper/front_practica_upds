'use client';

import { useAuthStore } from '@/stores/auth.store';

export default function DashboardPage() {
  const { usuario } = useAuthStore();

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Bienvenido al Sistema SREO
        </h1>
        <p className="text-gray-600 mb-6">
          Sistema de Reservas de Espacios y Objetos
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-blue-900 mb-2">Espacios</h3>
            <p className="text-blue-700 mb-4">
              Gestiona los espacios disponibles para reservas.
            </p>
            <a
              href="/dashboard/espacios"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Ver espacios →
            </a>
          </div>

          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-green-900 mb-2">Reservas</h3>
            <p className="text-green-700 mb-4">
              Administra tus reservas y consulta el historial.
            </p>
            <a
              href="/dashboard/reservas"
              className="text-green-600 hover:text-green-800 font-medium"
            >
              Ver reservas →
            </a>
          </div>

          {usuario?.rol === 'administrador' && (
            <>
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-purple-900 mb-2">Usuarios</h3>
                <p className="text-purple-700 mb-4">
                  Gestiona los usuarios del sistema.
                </p>
                <a
                  href="/dashboard/usuarios"
                  className="text-purple-600 hover:text-purple-800 font-medium"
                >
                  Ver usuarios →
                </a>
              </div>

              <div className="bg-orange-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-orange-900 mb-2">Reportes</h3>
                <p className="text-orange-700 mb-4">
                  Genera reportes y estadísticas.
                </p>
                <a
                  href="/dashboard/reportes"
                  className="text-orange-600 hover:text-orange-800 font-medium"
                >
                  Ver reportes →
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}