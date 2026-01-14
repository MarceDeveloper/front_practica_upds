'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { CrearUsuarioDto } from '@/types';

export const RegisterForm = () => {
  const [usuario, setUsuario] = useState<CrearUsuarioDto>({
    nombre: '',
    email: '',
    contrasena: '',
    rol: 'miembro',
  });

  const { register, isLoadingRegister, registerError } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register(usuario);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Registro</h2>

        {registerError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            Error al registrar usuario
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={usuario.nombre}
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
            value={usuario.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Contraseña</label>
          <input
            type="password"
            name="contrasena"
            value={usuario.contrasena}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Rol</label>
          <select
            name="rol"
            value={usuario.rol}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          >
            <option value="miembro">Miembro</option>
            <option value="administrador">Administrador</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoadingRegister}
          className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:opacity-50"
        >
          {isLoadingRegister ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
    </div>
  );
};