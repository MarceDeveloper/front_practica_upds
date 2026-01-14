'use client';

import { useState } from 'react';
import { useEspacios } from '@/hooks/useEspacios';
import { Espacio, FiltrosEspacio } from '@/types';
import { useAuthStore } from '@/stores/auth.store';
import { EspacioForm } from '@/components/EspacioForm';
import { ReservaForm } from '@/components/ReservaForm';
import { Modal } from '@/components/ui/Modal';

export default function EspaciosPage() {
  const { usuario } = useAuthStore();
  const [filtros, setFiltros] = useState<FiltrosEspacio>({
    tipo: '',
    capacidadMin: undefined,
    capacidadMax: undefined,
    nombre: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [showReservaModal, setShowReservaModal] = useState(false);
  const [espacioSeleccionado, setEspacioSeleccionado] = useState<Espacio | undefined>();
  const [espacioReserva, setEspacioReserva] = useState<string | undefined>();

  const { espacios, isLoading, error, eliminarEspacio } = useEspacios(filtros);

  const handleFiltroChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: name === 'capacidadMin' || name === 'capacidadMax'
        ? value ? parseInt(value) : undefined
        : value
    }));
  };

  const handleCrear = () => {
    setEspacioSeleccionado(undefined);
    setShowModal(true);
  };

  const handleEditar = (espacio: Espacio) => {
    setEspacioSeleccionado(espacio);
    setShowModal(true);
  };

  const handleEliminar = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este espacio?')) {
      eliminarEspacio(id);
    }
  };

  const handleReservar = (espacioId: string) => {
    setEspacioReserva(espacioId);
    setShowReservaModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEspacioSeleccionado(undefined);
  };

  const handleCloseReservaModal = () => {
    setShowReservaModal(false);
    setEspacioReserva(undefined);
  };

  const isAdmin = usuario?.rol === 'administrador';

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Espacios</h1>
        {isAdmin && (
          <button
            onClick={handleCrear}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Crear Espacio
          </button>
        )}
      </div>

      {/* Filtros */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">
              Tipo
            </label>
            <select
              id="tipo"
              name="tipo"
              value={filtros.tipo}
              onChange={handleFiltroChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Todos</option>
              <option value="aula">Aula</option>
              <option value="laboratorio">Laboratorio</option>
              <option value="auditorio">Auditorio</option>
              <option value="sala_reunion">Sala de Reunión</option>
            </select>
          </div>
          <div>
            <label htmlFor="capacidadMin" className="block text-sm font-medium text-gray-700">
              Capacidad mínima
            </label>
            <input
              type="number"
              id="capacidadMin"
              name="capacidadMin"
              value={filtros.capacidadMin || ''}
              onChange={handleFiltroChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="capacidadMax" className="block text-sm font-medium text-gray-700">
              Capacidad máxima
            </label>
            <input
              type="number"
              id="capacidadMax"
              name="capacidadMax"
              value={filtros.capacidadMax || ''}
              onChange={handleFiltroChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={filtros.nombre}
              onChange={handleFiltroChange}
              placeholder="Buscar por nombre"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Lista de espacios */}
      {isLoading ? (
        <div className="text-center py-12">Cargando espacios...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-600">{error.message}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {espacios.map((espacio: Espacio) => (
            <div key={espacio.id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {espacio.nombre}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Tipo: {espacio.tipo}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  Capacidad: {espacio.capacidad} personas
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  {espacio.descripcion}
                </p>
                <div className="flex justify-between">
                  <button
                    onClick={() => handleReservar(espacio.id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Reservar
                  </button>
                  {isAdmin && (
                    <div className="space-x-2">
                      <button
                        onClick={() => handleEditar(espacio)}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleEliminar(espacio.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <EspacioForm
          espacio={espacioSeleccionado}
          onClose={handleCloseModal}
        />
      )}

      {showReservaModal && (
        <ReservaForm
          espacioId={espacioReserva}
          onClose={handleCloseReservaModal}
        />
      )}
    </div>
  );
}