'use client';

import { useAuthStore } from '@/stores/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Building2, Users, BarChart3, Calendar, TrendingUp, Activity } from 'lucide-react';
import { useEspacios } from '@/hooks/useEspacios';
import { useUsuarios } from '@/hooks/useUsuarios';
import { useReservas } from '@/hooks/useReservas';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function DashboardPage() {
  const { usuario } = useAuthStore();
  const router = useRouter();
  const { espacios } = useEspacios();
  const { usuarios } = useUsuarios();
  const { reservas } = useReservas();

  useEffect(() => {
    if (usuario?.rol === 'miembro') {
      router.push('/dashboard/reservas');
    }
  }, [usuario, router]);

  // Estadísticas
  const totalEspacios = espacios.length;
  const totalUsuarios = usuarios.length;
  const totalReservas = reservas.length;

  // Datos para gráfico de estado de reservas
  const reservasPorEstado = [
    { name: 'Pendientes', value: reservas.filter(r => r.estado === 'pendiente').length, color: '#fbbf24' },
    { name: 'Aprobadas', value: reservas.filter(r => r.estado === 'aprobada').length, color: '#10b981' },
    { name: 'Rechazadas', value: reservas.filter(r => r.estado === 'rechazada').length, color: '#ef4444' },
  ];

  // Datos para gráfico de reservas por mes (últimos 6 meses)
  const reservasPorMes = [];
  const ahora = new Date();
  for (let i = 5; i >= 0; i--) {
    const fecha = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);
    const mes = fecha.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
    const count = reservas.filter(r => {
      const fechaReserva = new Date(r.fechaInicio);
      return fechaReserva.getMonth() === fecha.getMonth() && fechaReserva.getFullYear() === fecha.getFullYear();
    }).length;
    reservasPorMes.push({ mes, reservas: count });
  }

  if (usuario?.rol === 'miembro') {
    return null; // Redirecting
  }

  // Para administradores, mostrar el dashboard con estadísticas
  return (
    <div className="space-y-8">
      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Espacios</p>
              <p className="text-3xl font-bold">{totalEspacios}</p>
            </div>
            <Building2 className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-2xl text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Usuarios</p>
              <p className="text-3xl font-bold">{totalUsuarios}</p>
            </div>
            <Users className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-2xl text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Total Reservas</p>
              <p className="text-3xl font-bold">{totalReservas}</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-2xl text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Reservas Activas</p>
              <p className="text-3xl font-bold">{reservas.filter(r => new Date(r.fechaFin) > new Date()).length}</p>
            </div>
            <Activity className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de estado de reservas */}
        <div className="bg-white/95 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/40">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 mr-3 text-indigo-600" />
            Estado de Reservas
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={reservasPorEstado}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {reservasPorEstado.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de reservas por mes */}
        <div className="bg-white/95 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/40">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <BarChart3 className="w-6 h-6 mr-3 text-indigo-600" />
            Reservas por Mes
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reservasPorMes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="reservas" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Enlaces de gestión */}
      <div className="bg-white/90 backdrop-blur-lg overflow-hidden shadow-xl rounded-2xl border border-white/40">
        <div className="px-8 py-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Gestión del Sistema
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <a
              href="/dashboard/espacios"
              className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200 hover:shadow-lg transition-all duration-300 group"
            >
              <Building2 className="w-10 h-10 text-blue-600 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-blue-900 mb-2">Espacios</h3>
              <p className="text-blue-700 text-sm">Gestionar espacios disponibles</p>
            </a>

            <a
              href="/dashboard/reservas"
              className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-2xl border border-green-200 hover:shadow-lg transition-all duration-300 group"
            >
              <Calendar className="w-10 h-10 text-green-600 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-green-900 mb-2">Reservas</h3>
              <p className="text-green-700 text-sm">Administrar todas las reservas</p>
            </a>

            <a
              href="/dashboard/usuarios"
              className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200 hover:shadow-lg transition-all duration-300 group"
            >
              <Users className="w-10 h-10 text-purple-600 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-purple-900 mb-2">Usuarios</h3>
              <p className="text-purple-700 text-sm">Gestionar usuarios del sistema</p>
            </a>

            <a
              href="/dashboard/reportes"
              className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-200 hover:shadow-lg transition-all duration-300 group"
            >
              <BarChart3 className="w-10 h-10 text-orange-600 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-orange-900 mb-2">Reportes</h3>
              <p className="text-orange-700 text-sm">Generar reportes y estadísticas</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}