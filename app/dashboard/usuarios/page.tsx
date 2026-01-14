'use client';

import { useState } from 'react';
import { useUsuarios } from '@/hooks/useUsuarios';
import { Usuario } from '@/types';
import { useAuthStore } from '@/stores/auth.store';
import { UsuarioForm } from '@/components/UsuarioForm';
import { Button } from '@/components/ui/Button';

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
        <Button
          onClick={handleCrear}
          variant="primary"
          size="md"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Crear Usuario
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Cargando usuarios...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-600">{error.message}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {usuarios.map((usuario: Usuario) => (
            <div key={usuario.id} className="bg-white overflow-hidden shadow-lg rounded-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {usuario.nombre}
                    </h3>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {usuario.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Rol: {usuario.rol}
                  </div>
                </div>
                <div className="flex justify-between mt-6 space-x-2">
                  <Button
                    onClick={() => handleEditar(usuario)}
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editar
                  </Button>
                  <Button
                    onClick={() => handleEliminar(usuario.id)}
                    variant="danger"
                    size="sm"
                    className="flex-1"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Eliminar
                  </Button>
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