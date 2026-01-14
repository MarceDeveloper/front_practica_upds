import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { EspaciosRepository } from '@/repositories/espacios.repository';
import { CrearEspacioDto, EditarEspacioDto, FiltrosEspacio } from '@/types';

const espaciosRepository = new EspaciosRepository();

export const useEspacios = (filtros?: FiltrosEspacio) => {
  const queryClient = useQueryClient();

  const { data: espacios, isLoading, error } = useQuery({
    queryKey: ['espacios', filtros],
    queryFn: () => espaciosRepository.obtenerTodos(filtros),
  });

  const crearMutation = useMutation({
    mutationFn: (espacio: CrearEspacioDto) => espaciosRepository.crear(espacio),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['espacios'] });
    },
  });

  const actualizarMutation = useMutation({
    mutationFn: ({ id, espacio }: { id: string; espacio: EditarEspacioDto }) =>
      espaciosRepository.actualizar(id, espacio),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['espacios'] });
    },
  });

  const eliminarMutation = useMutation({
    mutationFn: (id: string) => espaciosRepository.eliminar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['espacios'] });
    },
  });

  return {
    espacios: espacios || [],
    isLoading,
    error,
    crearEspacio: crearMutation.mutate,
    actualizarEspacio: actualizarMutation.mutate,
    eliminarEspacio: eliminarMutation.mutate,
    isCreating: crearMutation.isPending,
    isUpdating: actualizarMutation.isPending,
    isDeleting: eliminarMutation.isPending,
  };
};