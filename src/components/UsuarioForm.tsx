import { useState, useEffect } from 'react';
import { useUsuarios } from '@/hooks/useUsuarios';
import { CrearUsuarioDto, EditarUsuarioDto, Usuario } from '@/types';

interface UsuarioFormProps {
  usuario?: Usuario;
  onClose: () => void;
}

export const UsuarioForm = ({ usuario, onClose }: UsuarioFormProps) => {
  const [formData, setFormData] = useState<CrearUsuarioDto | EditarUsuarioDto>({
    nombre: '',
    email: '',
    rol: 'miembro',
  });

  const { crearUsuario, actualizarUsuario, isCreating, isUpdating } = useUsuarios();

  useEffect(() => {
    if (usuario) {
      setFormData({
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      });
    } else {
      setFormData({
        nombre: '',
        email: '',
        contrasena: '',
        rol: 'miembro',
      });
    }
  }, [usuario]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (usuario) {
      actualizarUsuario({ id: usuario.id, usuario: formData as EditarUsuarioDto });
    } else {
      crearUsuario(formData as CrearUsuarioDto);
    }

    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const isLoading = isCreating || isUpdating;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">
            {usuario ? 'Editar Usuario' : 'Crear Usuario'}
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
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {!usuario && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Contraseña</label>
              <input
                type="password"
                name="contrasena"
                value={(formData as CrearUsuarioDto).contrasena || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                required={!usuario}
              />
            </div>
          )}

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Rol</label>
            <select
              name="rol"
              value={formData.rol}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            >
              <option value="miembro">Miembro</option>
              <option value="administrador">Administrador</option>
            </select>
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
              {isLoading ? 'Guardando...' : (usuario ? 'Actualizar' : 'Crear')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};