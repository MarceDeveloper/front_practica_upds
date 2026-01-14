'use client';

import { useState } from 'react';
import { useUsuarios } from '@/hooks/useUsuarios';
import { Usuario } from '@/types';
import { useAuthStore } from '@/stores/auth.store';
import { UsuarioForm } from '@/components/UsuarioForm';

export default function UsuariosPage() {
  const { usuario: currentUser } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | undefined>();

  const { usuarios, isLoading, error, eliminarUsuario } = useUsuarios();

  const isAdmin = currentUser?.rol === 'administrador';

  if (!isAdmin) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="text-center py-12">
          <p className="text-gray-600">No tienes permisos para acceder a esta página.</p>
        </div>
      </div>
    );
  }

  const handleCrear = () => {
    setUsuarioSeleccionado(undefined);
    setShowModal(true);
  };

  const handleEditar = (usuario: Usuario) => {
    setUsuarioSeleccionado(usuario);
    setShowModal(true);
  };

  const handleEliminar = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      eliminarUsuario(id);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setUsuarioSeleccionado(undefined);
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Usuarios</h1>
        <button
          onClick={handleCrear}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Crear Usuario
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Cargando usuarios...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-600">{error.message}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {usuarios.map((usuario: Usuario) => (
            <div key={usuario.id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {usuario.nombre}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {usuario.email}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Rol: {usuario.rol}
                </p>
                <div className="flex justify-between">
                  <button
                    onClick={() => handleEditar(usuario)}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(usuario.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <UsuarioForm
          usuario={usuarioSeleccionado}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}