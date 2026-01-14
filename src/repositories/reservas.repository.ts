import api from '@/lib/axios';
import { Reserva, CrearReservaDto } from '@/types';

export class ReservasRepository {
  async obtenerTodas(): Promise<Reserva[]> {
    const response = await api.get('/reservas');
    return response.data;
  }

  async obtenerPorUsuario(userId: string): Promise<Reserva[]> {
    const response = await api.get(`/reservas/usuario/${userId}`);
    return response.data;
  }

  async obtenerPorId(id: string): Promise<Reserva> {
    const response = await api.get(`/reservas/${id}`);
    return response.data;
  }

  async crear(reserva: CrearReservaDto): Promise<Reserva> {
    const response = await api.post('/reservas', reserva);
    return response.data;
  }

  async cancelar(id: string): Promise<void> {
    await api.post('/reservas/cancelar', { id });
  }
}