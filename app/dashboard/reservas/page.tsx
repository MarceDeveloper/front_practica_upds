'use client';

import { useReservas } from '@/hooks/useReservas';
import { Reserva } from '@/types';

export default function ReservasPage() {
  const { reservasFuturas, reservasPasadas, isLoading, error, cancelarReserva } = useReservas();

  const handleCancelar = (id: string) => {
    if (confirm('¿Estás seguro de que quieres cancelar esta reserva?')) {
      cancelarReserva(id);
    }
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Mis Reservas</h1>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Cargando reservas...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-600">{error.message}</div>
      ) : (
        <div className="space-y-8">
          {/* Reservas Futuras */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Reservas Futuras</h2>
            {reservasFuturas.length === 0 ? (
              <p className="text-gray-600">No tienes reservas futuras.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reservasFuturas.map((reserva: Reserva) => (
                  <div key={reserva.id} className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Reserva #{reserva.id}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Espacio ID: {reserva.espacioId}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        Inicio: {new Date(reserva.fechaInicio).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        Fin: {new Date(reserva.fechaFin).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600 mb-4">
                        Estado: {reserva.estado}
                      </p>
                      <button
                        onClick={() => handleCancelar(reserva.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reservas Pasadas */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Historial de Reservas</h2>
            {reservasPasadas.length === 0 ? (
              <p className="text-gray-600">No tienes reservas pasadas.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reservasPasadas.map((reserva: Reserva) => (
                  <div key={reserva.id} className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Reserva #{reserva.id}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Espacio ID: {reserva.espacioId}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        Inicio: {new Date(reserva.fechaInicio).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        Fin: {new Date(reserva.fechaFin).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600 mb-4">
                        Estado: {reserva.estado}
                      </p>
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