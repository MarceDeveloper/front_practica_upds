'use client';

import { useState, useEffect } from 'react';
import { useReservas } from '@/hooks/useReservas';
import { useEspacios } from '@/hooks/useEspacios';
import { useAuthStore } from '@/stores/auth.store';
import { CrearReservaDto } from '@/types';
import { CheckCircle, AlertCircle, Building, Users } from 'lucide-react';

interface ReservaFormProps {
  espacioId?: string;
  onClose: () => void;
}

const formatLocalDateTime = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const ReservaForm = ({ espacioId, onClose }: ReservaFormProps) => {
  const { usuario } = useAuthStore();
  const [formData, setFormData] = useState<CrearReservaDto>({
    usuarioId: usuario?.id || '',
    espacioId: espacioId || '',
    fechaInicio: new Date(),
    fechaFin: new Date(),
  });
  const [fechaInicioStr, setFechaInicioStr] = useState('');
  const [fechaFinStr, setFechaFinStr] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [espacioSearch, setEspacioSearch] = useState('');

  const { espacios } = useEspacios();
  const { crearReserva, isCreating } = useReservas();

  useEffect(() => {
    if (usuario) {
      setFormData(prev => ({ ...prev, usuarioId: usuario.id }));
    }
    if (espacioId) {
      setFormData(prev => ({ ...prev, espacioId }));
    }
    // Initialize datetime strings in local time
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    setFechaInicioStr(formatLocalDateTime(now));
    setFechaFinStr(formatLocalDateTime(oneHourLater));
  }, [usuario, espacioId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    crearReserva(formData, {
      onSuccess: () => {
        setSuccessMessage('Reserva creada exitosamente');
        setTimeout(() => {
          onClose();
        }, 2000);
      },
      onError: (error: any) => {
        const message = error?.response?.data?.message || error?.message || 'Error al crear la reserva';
        setErrorMessage(message);
      }
    });
  };

  const handleEspacioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      espacioId: e.target.value,
    }));
  };

  const handleFechaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const date = new Date(value);

    if (name === 'fechaInicio') {
      setFechaInicioStr(value);
      setFormData(prev => ({ ...prev, fechaInicio: date }));
    } else if (name === 'fechaFin') {
      setFechaFinStr(value);
      setFormData(prev => ({ ...prev, fechaFin: date }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Nueva Reserva</h2>
        </div>
<form onSubmit={handleSubmit} className="p-6">
  {successMessage && (
    <div className="mb-4 flex items-center p-4 bg-green-50 border border-green-200 rounded-xl">
      <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
      <span className="text-green-800 font-medium">{successMessage}</span>
    </div>
  )}

  {errorMessage && (
    <div className="mb-4 flex items-center p-4 bg-red-50 border border-red-200 rounded-xl">
      <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
      <span className="text-red-800 font-medium">{errorMessage}</span>
    </div>
  )}

  {!espacioId && (
    <div className="mb-6">
      <label className="block text-gray-700 mb-4 text-lg font-semibold">Seleccionar Espacio</label>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar espacios por nombre o tipo..."
          value={espacioSearch}
          onChange={(e) => setEspacioSearch(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
        {espacios
          .filter(espacio =>
            espacio.nombre.toLowerCase().includes(espacioSearch.toLowerCase()) ||
            espacio.tipo.toLowerCase().includes(espacioSearch.toLowerCase())
          )
          .map((espacio) => (
          <div
            key={espacio.id}
            onClick={() => handleEspacioChange({ target: { value: espacio.id } } as any)}
            className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
              formData.espacioId === espacio.id
                ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                <Building className="w-4 h-4 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-900">{espacio.nombre}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2 capitalize">{espacio.tipo}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-1" />
                <span>Capacidad: {espacio.capacidad}</span>
              </div>
              {formData.espacioId === espacio.id && (
                <CheckCircle className="w-5 h-5 text-indigo-600" />
              )}
            </div>
          </div>
        ))}
      </div>
      {formData.espacioId === '' && (
        <p className="text-red-500 text-sm mt-2">Por favor selecciona un espacio</p>
      )}
    </div>
  )}

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Fecha y Hora de Inicio</label>
            <input
              type="datetime-local"
              name="fechaInicio"
              value={fechaInicioStr}
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
              value={fechaFinStr}
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
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creando...
                </>
              ) : (
                'Crear Reserva'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};