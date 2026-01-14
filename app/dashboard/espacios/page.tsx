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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestión de Espacios</h1>
          <p className="text-gray-600">Administra y reserva espacios disponibles en el sistema</p>
        </div>
        {isAdmin && (
          <button
            onClick={handleCrear}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center"
          >
            <span className="mr-2">➕</span>
            Crear Nuevo Espacio
          </button>
        )}
      </div>

      {/* Filtros */}
      <div className="bg-white shadow-lg rounded-xl p-6 mb-8 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <span className="mr-2">🔍</span>
          Filtros de Búsqueda
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Espacio
            </label>
            <select
              id="tipo"
              name="tipo"
              value={filtros.tipo}
              onChange={handleFiltroChange}
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
            >
              <option value="">Todos los tipos</option>
              <option value="aula">Aula</option>
              <option value="laboratorio">Laboratorio</option>
              <option value="auditorio">Auditorio</option>
              <option value="sala_reunion">Sala de Reunión</option>
            </select>
          </div>
          <div>
            <label htmlFor="capacidadMin" className="block text-sm font-medium text-gray-700 mb-2">
              Capacidad Mínima
            </label>
            <input
              type="number"
              id="capacidadMin"
              name="capacidadMin"
              value={filtros.capacidadMin || ''}
              onChange={handleFiltroChange}
              placeholder="Ej: 10"
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="capacidadMax" className="block text-sm font-medium text-gray-700 mb-2">
              Capacidad Máxima
            </label>
            <input
              type="number"
              id="capacidadMax"
              name="capacidadMax"
              value={filtros.capacidadMax || ''}
              onChange={handleFiltroChange}
              placeholder="Ej: 50"
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Espacio
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={filtros.nombre}
              onChange={handleFiltroChange}
              placeholder="Buscar por nombre..."
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {espacios.map((espacio: Espacio) => (
            <div key={espacio.id} className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl">🏢</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {espacio.nombre}
                    </h3>
                    <p className="text-sm text-indigo-600 font-medium capitalize">
                      {espacio.tipo}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-gray-600">
                    <span className="mr-2">👥</span>
                    <span className="text-sm">Capacidad: {espacio.capacidad} personas</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {espacio.descripcion}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => handleReservar(espacio.id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center"
                  >
                    <span className="mr-1">📅</span>
                    Reservar
                  </button>
                  {isAdmin && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditar(espacio)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center"
                      >
                        <span className="mr-1">✏️</span>
                        Editar
                      </button>
                      <button
                        onClick={() => handleEliminar(espacio.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center"
                      >
                        <span className="mr-1">🗑️</span>
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