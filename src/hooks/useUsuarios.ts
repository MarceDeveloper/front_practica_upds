import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UsuariosRepository } from '@/repositories/usuarios.repository';
import { CrearUsuarioDto, EditarUsuarioDto, CambiarContrasenaDto } from '@/types';

const usuariosRepository = new UsuariosRepository();

export const useUsuarios = () => {
  const queryClient = useQueryClient();

  const { data: usuarios, isLoading, error } = useQuery({
    queryKey: ['usuarios'],
    queryFn: () => usuariosRepository.obtenerTodos(),
  });

  const crearMutation = useMutation({
    mutationFn: (usuario: CrearUsuarioDto) => usuariosRepository.crear(usuario),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
  });

  const actualizarMutation = useMutation({
    mutationFn: ({ id, usuario }: { id: string; usuario: EditarUsuarioDto }) =>
      usuariosRepository.actualizar(id, usuario),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
  });

  const eliminarMutation = useMutation({
    mutationFn: (id: string) => usuariosRepository.eliminar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
  });

  const cambiarContrasenaMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CambiarContrasenaDto }) =>
      usuariosRepository.cambiarContrasena(id, data),
  });

  return {
    usuarios: usuarios || [],
    isLoading,
    error,
    crearUsuario: crearMutation.mutate,
    actualizarUsuario: actualizarMutation.mutate,
    eliminarUsuario: eliminarMutation.mutate,
    cambiarContrasena: cambiarContrasenaMutation.mutate,
    isCreating: crearMutation.isPending,
    isUpdating: actualizarMutation.isPending,
    isDeleting: eliminarMutation.isPending,
    isChangingPassword: cambiarContrasenaMutation.isPending,
  };
};