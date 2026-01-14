'use client';

import { useState } from 'react';
import { useReservas } from '@/hooks/useReservas';
import { useEspacios } from '@/hooks/useEspacios';
import { useAuthStore } from '@/stores/auth.store';
import { Reserva, Espacio } from '@/types';
import { Calendar, Clock, MapPin, X, History, CheckCircle, Filter } from 'lucide-react';

export default function ReservasPage() {
  const { usuario } = useAuthStore();
  const isAdmin = usuario?.rol === 'administrador';
  const { reservas, isLoading, error, cancelarReserva, aprobarReserva, rechazarReserva } = useReservas(isAdmin ? undefined : usuario?.id);
  const { espacios } = useEspacios();
  const [filtroEstado, setFiltroEstado] = useState<string>('todas');


  const reservasFiltradas = reservas.filter(reserva => {
    if (filtroEstado === 'todas') return true;
    return reserva.estado === filtroEstado;
  });

  const getEspacioNombre = (espacioId: string) => {
    const espacio = espacios.find((e: Espacio) => e.id === espacioId);
    return espacio ? espacio.nombre : 'Espacio desconocido';
  };

  const handleCancelar = (id: string) => {
    if (confirm('¿Estás seguro de que quieres cancelar esta reserva?')) {
      cancelarReserva(id);
    }
  };

  const handleAprobar = (id: string) => {
    if (confirm('¿Estás seguro de que quieres aprobar esta reserva?')) {
      aprobarReserva(id);
    }
  };

  const handleRechazar = (id: string) => {
    if (confirm('¿Estás seguro de que quieres rechazar esta reserva?')) {
      rechazarReserva(id);
    }
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Calendar className="w-10 h-10 text-indigo-600 mr-4" />
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {isAdmin ? 'Gestionar Reservas' : 'Mis Reservas'}
              </h1>
              <p className="text-gray-600 text-lg">
                {isAdmin ? 'Administra todas las reservas del sistema' : 'Gestiona tus reservas activas y revisa tu historial'}
              </p>
            </div>
          </div>
          <div className="flex items-center bg-white/90 backdrop-blur-lg rounded-2xl p-2 shadow-lg border border-white/40">
            <Filter className="w-5 h-5 text-indigo-600 mr-3" />
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-gray-700 font-medium"
            >
              <option value="todas">Todas las reservas</option>
              <option value="pendiente">Pendientes</option>
              <option value="aprobada">Aprobadas</option>
              <option value="rechazada">Rechazadas</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando reservas...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-red-600">{error.message}</p>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Todas las Reservas */}
          <div>
            <div className="flex items-center mb-6">
              <Calendar className="w-6 h-6 text-indigo-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">
                {isAdmin ? 'Todas las Reservas' : 'Todas mis Reservas'}
              </h2>
            </div>
            {reservasFiltradas.length === 0 ? (
              <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-8 text-center shadow-xl border border-white/40">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No tienes reservas registradas.</p>
                <p className="text-gray-500 mt-2">¡Explora los espacios disponibles para hacer tu primera reserva!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {reservasFiltradas.map((reserva: Reserva) => {
                  const isFuture = new Date(reserva.fechaFin) > new Date();
                  const statusColor = {
                    pendiente: 'bg-yellow-500',
                    aprobada: 'bg-green-500',
                    rechazada: 'bg-red-500'
                  }[reserva.estado] || 'bg-gray-500';

                  return (
                    <div key={reserva.id} className={`bg-white/95 backdrop-blur-lg overflow-hidden shadow-xl rounded-2xl border border-white/40 hover:shadow-2xl transition-all duration-300 ${!isFuture ? 'opacity-75' : ''}`}>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <div className={`w-10 h-10 ${statusColor} rounded-xl flex items-center justify-center mr-3`}>
                              {reserva.estado === 'pendiente' && <Clock className="w-5 h-5 text-white" />}
                              {reserva.estado === 'aprobada' && <CheckCircle className="w-5 h-5 text-white" />}
                              {reserva.estado === 'rechazada' && <X className="w-5 h-5 text-white" />}
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-gray-900">
                                {isFuture ? 'Reserva Activa' : 'Reserva Completada'}
                              </h3>
                              <p className={`text-sm font-medium capitalize ${
                                reserva.estado === 'pendiente' ? 'text-yellow-600' :
                                reserva.estado === 'aprobada' ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {reserva.estado}
                              </p>
                            </div>
                          </div>
                          {!isFuture && (
                            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                              Completada
                            </div>
                          )}
                        </div>

                        <div className="space-y-3 mb-6">
                          <div className="flex items-center text-gray-700 bg-gray-50 px-4 py-3 rounded-xl">
                            <MapPin className="w-4 h-4 mr-3 text-indigo-500" />
                            <span className="font-medium">{getEspacioNombre(reserva.espacioId)}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-blue-50 px-3 py-2 rounded-lg">
                              <p className="text-xs text-blue-600 font-medium">INICIO</p>
                              <p className="text-sm font-semibold text-gray-900">
                                {new Date(reserva.fechaInicio).toLocaleDateString()}
                              </p>
                              <p className="text-xs text-gray-600">
                                {new Date(reserva.fechaInicio).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </p>
                            </div>
                            <div className="bg-purple-50 px-3 py-2 rounded-lg">
                              <p className="text-xs text-purple-600 font-medium">FIN</p>
                              <p className="text-sm font-semibold text-gray-900">
                                {new Date(reserva.fechaFin).toLocaleDateString()}
                              </p>
                              <p className="text-xs text-gray-600">
                                {new Date(reserva.fechaFin).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </p>
                            </div>
                          </div>
                        </div>

                        {isFuture && reserva.estado === 'pendiente' && (
                          <div className="space-y-2">
                            {isAdmin ? (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleAprobar(reserva.id)}
                                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Aprobar
                                </button>
                                <button
                                  onClick={() => handleRechazar(reserva.id)}
                                  className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
                                >
                                  <X className="w-4 h-4 mr-2" />
                                  Rechazar
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleCancelar(reserva.id)}
                                className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
                              >
                                <X className="w-4 h-4 mr-2" />
                                Cancelar Reserva
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}