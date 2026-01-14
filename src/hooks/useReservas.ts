import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ReservasRepository } from '@/repositories/reservas.repository';
import { CrearReservaDto, Reserva } from '@/types';

const reservasRepository = new ReservasRepository();

export const useReservas = (userId?: string) => {
  const queryClient = useQueryClient();

  const { data: reservasData, isLoading, error } = useQuery({
    queryKey: ['reservas', userId],
    queryFn: async () => {
      if (!userId) return { futuras: [], pasadas: [] };
      const result = await reservasRepository.obtenerPorUsuario(userId);
      return result;
    },
    enabled: !!userId,
    refetchOnMount: 'always',
  });

  const reservasArray = [
    ...((reservasData as any)?.futuras || []),
    ...((reservasData as any)?.pasadas || [])
  ];

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
    isCreating: crearMutation.isPending,
    isCanceling: cancelarMutation.isPending,
  };
};