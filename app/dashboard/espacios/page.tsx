'use client';

import { useState } from 'react';
import { useEspacios } from '@/hooks/useEspacios';
import { Espacio, FiltrosEspacio } from '@/types';
import { useAuthStore } from '@/stores/auth.store';
import { EspacioForm } from '@/components/EspacioForm';
import { ReservaForm } from '@/components/ReservaForm';
import { Modal } from '@/components/ui/Modal';
import { Plus, Search, Users, MapPin, Calendar, Edit, Trash2, Building } from 'lucide-react';

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
      <div className="flex justify-between items-center mb-10">
        <div>
          <div className="flex items-center mb-3">
            <Building className="w-10 h-10 text-indigo-600 mr-4" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Gestión de Espacios
            </h1>
          </div>
          <p className="text-gray-600 text-lg ml-14">Administra y reserva espacios disponibles en el sistema</p>
        </div>
        {isAdmin && (
          <button
            onClick={handleCrear}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center transform hover:scale-105"
          >
            <Plus className="w-5 h-5 mr-3" />
            Crear Nuevo Espacio
          </button>
        )}
      </div>

      {/* Filtros */}
      <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl p-8 mb-10 border border-white/20">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
          <Search className="w-6 h-6 mr-3 text-indigo-600" />
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
            <div key={espacio.id} className="bg-white/95 backdrop-blur-lg overflow-hidden shadow-xl rounded-2xl border border-white/40 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mr-4 shadow-md">
                      <Building className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {espacio.nombre}
                      </h3>
                      <p className="text-xs text-indigo-600 font-medium capitalize bg-indigo-50 px-2 py-1 rounded-lg inline-block mt-1">
                        {espacio.tipo}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                    <Users className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">{espacio.capacidad}</span>
                  </div>
                </div>

                <div className="mb-5">
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                    {espacio.descripcion}
                  </p>
                </div>

                <div className="flex flex-col space-y-3">
                  <button
                    onClick={() => handleReservar(espacio.id)}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Reservar Espacio
                  </button>
                  {isAdmin && (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleEditar(espacio)}
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-2 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Editar
                      </button>
                      <button
                        onClick={() => handleEliminar(espacio.id)}
                        className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-2 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
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