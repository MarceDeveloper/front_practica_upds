'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { useAuth } from '@/hooks/useAuth';
import { User, Lock, Mail, Shield, CheckCircle, AlertCircle } from 'lucide-react';

export default function PerfilPage() {
  const { usuario } = useAuthStore();
  const { changePassword, isLoadingChangePassword, changePasswordError } = useAuth();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    contrasenaActual: '',
    nuevaContrasena: '',
    confirmarContrasena: ''
  });
  const [successMessage, setSuccessMessage] = useState('');

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.nuevaContrasena !== passwordData.confirmarContrasena) {
      alert('Las contraseñas nuevas no coinciden');
      return;
    }

    changePassword({
      contrasenaActual: passwordData.contrasenaActual,
      nuevaContrasena: passwordData.nuevaContrasena
    }, {
      onSuccess: () => {
        setSuccessMessage('Contraseña actualizada exitosamente');
        setPasswordData({
          contrasenaActual: '',
          nuevaContrasena: '',
          confirmarContrasena: ''
        });
        setShowPasswordForm(false);
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-10">
        <div className="flex items-center mb-3">
          <User className="w-10 h-10 text-indigo-600 mr-4" />
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Mi Perfil
          </h1>
        </div>
        <p className="text-gray-600 text-lg ml-14">Gestiona tu información personal y configuración de cuenta</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Información del Perfil */}
        <div className="bg-white/95 backdrop-blur-lg shadow-xl rounded-2xl border border-white/40 p-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
              <User className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Información Personal</h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center p-4 bg-gray-50 rounded-xl">
              <Mail className="w-5 h-5 text-indigo-500 mr-4" />
              <div>
                <p className="text-sm text-gray-600">Correo Electrónico</p>
                <p className="font-semibold text-gray-900">{usuario?.email}</p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-gray-50 rounded-xl">
              <User className="w-5 h-5 text-indigo-500 mr-4" />
              <div>
                <p className="text-sm text-gray-600">Nombre Completo</p>
                <p className="font-semibold text-gray-900">{usuario?.nombre}</p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-gray-50 rounded-xl">
              <Shield className="w-5 h-5 text-indigo-500 mr-4" />
              <div>
                <p className="text-sm text-gray-600">Tipo de Usuario</p>
                <p className="font-semibold text-gray-900 capitalize">{usuario?.rol}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Cambiar Contraseña */}
        <div className="bg-white/95 backdrop-blur-lg shadow-xl rounded-2xl border border-white/40 p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Seguridad</h2>
            </div>
            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            >
              {showPasswordForm ? 'Cancelar' : 'Cambiar Contraseña'}
            </button>
          </div>

          {showPasswordForm ? (
            <form onSubmit={handlePasswordChange} className="space-y-4">
              {successMessage && (
                <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-green-800 font-medium">{successMessage}</span>
                </div>
              )}

              {changePasswordError && (
                <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                  <span className="text-red-800 font-medium">Error al cambiar contraseña</span>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña Actual
                </label>
                <input
                  type="password"
                  name="contrasenaActual"
                  value={passwordData.contrasenaActual}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  name="nuevaContrasena"
                  value={passwordData.nuevaContrasena}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Nueva Contraseña
                </label>
                <input
                  type="password"
                  name="confirmarContrasena"
                  value={passwordData.confirmarContrasena}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoadingChangePassword}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoadingChangePassword ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Actualizando...
                  </>
                ) : (
                  'Actualizar Contraseña'
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-8">
              <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                Mantén tu cuenta segura cambiando tu contraseña regularmente.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}