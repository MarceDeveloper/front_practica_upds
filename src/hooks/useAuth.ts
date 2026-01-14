import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { AuthRepository } from '@/repositories/auth.repository';
import { useAuthStore } from '@/stores/auth.store';
import { CrearUsuarioDto, IniciarSesionDto, CambiarContrasenaDto } from '@/types';

const authRepository = new AuthRepository();

export const useAuth = () => {
  const { usuario, token, isAuthenticated, login, logout } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (credenciales: IniciarSesionDto) =>
      authRepository.iniciarSesion(credenciales),
    onSuccess: (data) => {
      console.log('Login success:', data);
      login(data.usuario, data.token);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (usuario: CrearUsuarioDto) =>
      authRepository.registrarUsuario(usuario),
    onSuccess: (data) => {
      login(data.usuario, data.token);
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: CambiarContrasenaDto) =>
      authRepository.cambiarContrasena(data),
  });

  const { data: perfil } = useQuery({
    queryKey: ['perfil'],
    queryFn: () => authRepository.obtenerPerfil(),
    enabled: isAuthenticated,
  });

  const handleLogout = () => {
    logout();
  };

  return {
    usuario: usuario || perfil,
    token,
    isAuthenticated,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    changePassword: changePasswordMutation.mutate,
    logout: handleLogout,
    isLoadingLogin: loginMutation.isPending,
    isLoadingRegister: registerMutation.isPending,
    isLoadingChangePassword: changePasswordMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    changePasswordError: changePasswordMutation.error,
  };
};