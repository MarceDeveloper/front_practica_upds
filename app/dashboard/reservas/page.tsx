'use client';

import { useReservas } from '@/hooks/useReservas';
import { useEspacios } from '@/hooks/useEspacios';
import { Reserva, Espacio } from '@/types';
import { Calendar, Clock, MapPin, X, History, CheckCircle } from 'lucide-react';

export default function ReservasPage() {
  const { reservasFuturas, reservasPasadas, isLoading, error, cancelarReserva } = useReservas();
  const { espacios } = useEspacios();

  const getEspacioNombre = (espacioId: string) => {
    const espacio = espacios.find((e: Espacio) => e.id === espacioId);
    return espacio ? espacio.nombre : 'Espacio desconocido';
  };

  const handleCancelar = (id: string) => {
    if (confirm('¿Estás seguro de que quieres cancelar esta reserva?')) {
      cancelarReserva(id);
    }
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-10">
        <div className="flex items-center mb-3">
          <Calendar className="w-10 h-10 text-indigo-600 mr-4" />
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Mis Reservas
          </h1>
        </div>
        <p className="text-gray-600 text-lg ml-14">Gestiona tus reservas activas y revisa tu historial</p>
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
          {/* Reservas Futuras */}
          <div>
            <div className="flex items-center mb-6">
              <Clock className="w-6 h-6 text-green-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">Reservas Activas</h2>
            </div>
            {reservasFuturas.length === 0 ? (
              <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-8 text-center shadow-xl border border-white/40">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No tienes reservas activas en este momento.</p>
                <p className="text-gray-500 mt-2">¡Explora los espacios disponibles para hacer una reserva!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {reservasFuturas.map((reserva: Reserva) => (
                  <div key={reserva.id} className="bg-white/95 backdrop-blur-lg overflow-hidden shadow-xl rounded-2xl border border-white/40 hover:shadow-2xl transition-all duration-300">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-3">
                            <CheckCircle className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">Reserva Activa</h3>
                            <p className="text-sm text-green-600 font-medium">Confirmada</p>
                          </div>
                        </div>
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

                      <button
                        onClick={() => handleCancelar(reserva.id)}
                        className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancelar Reserva
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reservas Pasadas */}
          <div>
            <div className="flex items-center mb-6">
              <History className="w-6 h-6 text-gray-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">Historial de Reservas</h2>
            </div>
            {reservasPasadas.length === 0 ? (
              <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-8 text-center shadow-xl border border-white/40">
                <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">Aún no tienes reservas completadas.</p>
                <p className="text-gray-500 mt-2">Tu historial aparecerá aquí una vez que completes tus reservas.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {reservasPasadas.map((reserva: Reserva) => (
                  <div key={reserva.id} className="bg-white/95 backdrop-blur-lg overflow-hidden shadow-xl rounded-2xl border border-white/40 opacity-75">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl flex items-center justify-center mr-3">
                            <History className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">Reserva Completada</h3>
                            <p className="text-sm text-gray-600 font-medium capitalize">{reserva.estado}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
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
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}