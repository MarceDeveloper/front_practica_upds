import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ReservasRepository } from '@/repositories/reservas.repository';
import { CrearReservaDto } from '@/types';

const reservasRepository = new ReservasRepository();

export const useReservas = () => {
  const queryClient = useQueryClient();

  const { data: reservas, isLoading, error } = useQuery({
    queryKey: ['reservas'],
    queryFn: () => reservasRepository.obtenerPorUsuario(),
  });

  const crearMutation = useMutation({
    mutationFn: (reserva: CrearReservaDto) => reservasRepository.crear(reserva),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservas'] });
    },
  });

  const cancelarMutation = useMutation({
    mutationFn: (id: string) => reservasRepository.cancelar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservas'] });
    },
  });

  const reservasFuturas = reservas?.filter(r => new Date(r.fechaFin) > new Date()) || [];
  const reservasPasadas = reservas?.filter(r => new Date(r.fechaFin) <= new Date()) || [];

  return {
    reservas: reservas || [],
    reservasFuturas,
    reservasPasadas,
    isLoading,
    error,
    crearReserva: crearMutation.mutate,
    cancelarReserva: cancelarMutation.mutate,
    isCreating: crearMutation.isPending,
    isCanceling: cancelarMutation.isPending,
  };
};