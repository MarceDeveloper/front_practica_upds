import { useState, useEffect } from 'react';
import { useEspacios } from '@/hooks/useEspacios';
import { CrearEspacioDto, EditarEspacioDto, Espacio } from '@/types';

interface EspacioFormProps {
  espacio?: Espacio;
  onClose: () => void;
}

export const EspacioForm = ({ espacio, onClose }: EspacioFormProps) => {
  const [formData, setFormData] = useState<CrearEspacioDto | EditarEspacioDto>({
    nombre: '',
    capacidad: 0,
    tipo: '',
    descripcion: '',
  });

  const { crearEspacio, actualizarEspacio, isCreating, isUpdating } = useEspacios();

  useEffect(() => {
    if (espacio) {
      setFormData({
        nombre: espacio.nombre,
        capacidad: espacio.capacidad,
        tipo: espacio.tipo,
        descripcion: espacio.descripcion,
      });
    }
  }, [espacio]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (espacio) {
      actualizarEspacio({ id: espacio.id, espacio: formData as EditarEspacioDto });
    } else {
      crearEspacio(formData as CrearEspacioDto);
    }

    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacidad' ? parseInt(value) || 0 : value,
    }));
  };

  const isLoading = isCreating || isUpdating;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">
            {espacio ? 'Editar Espacio' : 'Crear Espacio'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Tipo</label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            >
              <option value="">Seleccionar tipo</option>
              <option value="aula">Aula</option>
              <option value="laboratorio">Laboratorio</option>
              <option value="auditorio">Auditorio</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Capacidad</label>
            <input
              type="number"
              name="capacidad"
              value={formData.capacidad}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              min="1"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows={3}
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
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {isLoading ? 'Guardando...' : (espacio ? 'Actualizar' : 'Crear')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};