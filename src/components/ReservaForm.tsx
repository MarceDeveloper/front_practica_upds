'use client';

import { useState, useEffect } from 'react';
import { useReservas } from '@/hooks/useReservas';
import { useEspacios } from '@/hooks/useEspacios';
import { useAuthStore } from '@/stores/auth.store';
import { CrearReservaDto } from '@/types';

interface ReservaFormProps {
  espacioId?: string;
  onClose: () => void;
}

export const ReservaForm = ({ espacioId, onClose }: ReservaFormProps) => {
  const { usuario } = useAuthStore();
  const [formData, setFormData] = useState<CrearReservaDto>({
    usuarioId: usuario?.id || '',
    espacioId: espacioId || '',
    fechaInicio: new Date(),
    fechaFin: new Date(),
  });

  const { espacios } = useEspacios();
  const { crearReserva, isCreating } = useReservas();

  useEffect(() => {
    if (usuario) {
      setFormData(prev => ({ ...prev, usuarioId: usuario.id }));
    }
    if (espacioId) {
      setFormData(prev => ({ ...prev, espacioId }));
    }
  }, [usuario, espacioId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    crearReserva(formData);
    onClose();
  };

  const handleEspacioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      espacioId: e.target.value,
    }));
  };

  const handleFechaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: new Date(value),
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Nueva Reserva</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {!espacioId && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Espacio</label>
              <select
                value={formData.espacioId}
                onChange={handleEspacioChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                required
              >
                <option value="">Seleccionar espacio</option>
                {espacios.map((espacio) => (
                  <option key={espacio.id} value={espacio.id}>
                    {espacio.nombre} - {espacio.tipo} (Capacidad: {espacio.capacidad})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Fecha y Hora de Inicio</label>
            <input
              type="datetime-local"
              name="fechaInicio"
              value={formData.fechaInicio.toISOString().slice(0, 16)}
              onChange={handleFechaChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Fecha y Hora de Fin</label>
            <input
              type="datetime-local"
              name="fechaFin"
              value={formData.fechaFin.toISOString().slice(0, 16)}
              onChange={handleFechaChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {isCreating ? 'Creando...' : 'Crear Reserva'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};