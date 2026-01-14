'use client';

import { useState } from 'react';
import { useUsuarios } from '@/hooks/useUsuarios';
import { CambiarContrasenaDto } from '@/types';

interface CambiarContrasenaFormProps {
  usuarioId: string;
  onClose: () => void;
}

export const CambiarContrasenaForm = ({ usuarioId, onClose }: CambiarContrasenaFormProps) => {
  const [formData, setFormData] = useState<CambiarContrasenaDto>({
    contrasenaActual: '',
    nuevaContrasena: '',
  });

  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const { cambiarContrasena, isChangingPassword } = useUsuarios();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.nuevaContrasena !== confirmarContrasena) {
      alert('Las contraseñas no coinciden');
      return;
    }

    cambiarContrasena({ id: usuarioId, data: formData });
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'confirmarContrasena') {
      setConfirmarContrasena(value);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Cambiar Contraseña</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Contraseña Actual</label>
            <input
              type="password"
              name="contrasenaActual"
              value={formData.contrasenaActual}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Nueva Contraseña</label>
            <input
              type="password"
              name="nuevaContrasena"
              value={formData.nuevaContrasena}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Confirmar Nueva Contraseña</label>
            <input
              type="password"
              name="confirmarContrasena"
              value={confirmarContrasena}
              onChange={handleChange}
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
              disabled={isChangingPassword}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              {isChangingPassword ? 'Cambiando...' : 'Cambiar Contraseña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};