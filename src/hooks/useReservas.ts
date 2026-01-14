import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ReservasRepository } from '@/repositories/reservas.repository';
import { CrearReservaDto, Reserva } from '@/types';

const reservasRepository = new ReservasRepository();

export const useReservas = (userId?: string) => {
  const queryClient = useQueryClient();

  const { data: reservasData, isLoading, error } = useQuery({
    queryKey: userId ? ['reservas', 'user', userId] : ['reservas', 'all'],
    queryFn: async () => {
      if (userId) {
        const result = await reservasRepository.obtenerPorUsuario(userId);
        return [
          ...((result as any)?.futuras || []),
          ...((result as any)?.pasadas || [])
        ];
      } else {
        // For admin dashboard, get all reservations
        const result = await reservasRepository.obtenerTodas();
        return result;
      }
    },
    refetchOnMount: 'always',
  });

  const reservasArray = Array.isArray(reservasData) ? reservasData : [];

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

  const aprobarMutation = useMutation({
    mutationFn: (id: string) => reservasRepository.aprobar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservas'] });
    },
  });

  const rechazarMutation = useMutation({
    mutationFn: (id: string) => reservasRepository.rechazar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservas'] });
    },
  });

  const reservasFuturas = reservasArray.filter(r => new Date(r.fechaFin) > new Date());
  const reservasPasadas = reservasArray.filter(r => new Date(r.fechaFin) <= new Date());

  return {
    reservas: reservasArray,
    reservasFuturas,
    reservasPasadas,
    isLoading,
    error,
    crearReserva: crearMutation.mutate,
    cancelarReserva: cancelarMutation.mutate,
    aprobarReserva: aprobarMutation.mutate,
    rechazarReserva: rechazarMutation.mutate,
    isCreating: crearMutation.isPending,
    isCanceling: cancelarMutation.isPending,
    isApproving: aprobarMutation.isPending,
    isRejecting: rechazarMutation.isPending,
  };
};