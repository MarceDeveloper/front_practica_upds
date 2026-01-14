import { useState } from 'react';
import { useReservas } from '@/hooks/useReservas';

export const ReservasList = () => {
  const [activeTab, setActiveTab] = useState<'futuras' | 'pasadas'>('futuras');
  const { reservasFuturas, reservasPasadas, isLoading, error, cancelarReserva, isCanceling } = useReservas();

  const handleCancelar = (id: string) => {
    if (confirm('¿Estás seguro de que quieres cancelar esta reserva?')) {
      cancelarReserva(id);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'confirmada':
        return 'bg-green-100 text-green-800';
      case 'cancelada':
        return 'bg-red-100 text-red-800';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) return <div className="text-center py-8">Cargando reservas...</div>;
  if (error) return <div className="text-center py-8 text-red-600">Error al cargar reservas</div>;

  const currentReservas = activeTab === 'futuras' ? reservasFuturas : reservasPasadas;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mis Reservas</h1>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('futuras')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'futuras'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Reservas Futuras ({reservasFuturas.length})
            </button>
            <button
              onClick={() => setActiveTab('pasadas')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pasadas'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Historial ({reservasPasadas.length})
            </button>
          </nav>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              {activeTab === 'futuras' ? 'Reservas Futuras' : 'Historial de Reservas'}
            </h2>
            {activeTab === 'futuras' && (
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Nueva Reserva
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Espacio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Inicio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Fin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                {activeTab === 'futuras' && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentReservas.map((reserva) => (
                <tr key={reserva.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Espacio {reserva.espacioId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(reserva.fechaInicio)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(reserva.fechaFin)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(reserva.estado)}`}>
                      {reserva.estado}
                    </span>
                  </td>
                  {activeTab === 'futuras' && reserva.estado !== 'cancelada' && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleCancelar(reserva.id)}
                        disabled={isCanceling}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      >
                        Cancelar
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {currentReservas.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {activeTab === 'futuras' ? 'No tienes reservas futuras' : 'No tienes reservas pasadas'}
          </div>
        )}
      </div>
    </div>
  );
};