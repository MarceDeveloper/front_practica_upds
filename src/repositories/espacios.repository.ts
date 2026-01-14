import api from '@/lib/axios';
import { Espacio, CrearEspacioDto, EditarEspacioDto, FiltrosEspacio } from '@/types';

export class EspaciosRepository {
  async obtenerTodos(filtros?: FiltrosEspacio): Promise<Espacio[]> {
    const response = await api.get('/espacios', { params: filtros });
    return response.data;
  }

  async obtenerPorId(id: string): Promise<Espacio> {
    const response = await api.get(`/espacios/${id}`);
    return response.data;
  }

  async crear(espacio: CrearEspacioDto): Promise<Espacio> {
    const response = await api.post('/espacios', espacio);
    return response.data;
  }

  async actualizar(id: string, espacio: EditarEspacioDto): Promise<Espacio> {
    const response = await api.put(`/espacios/${id}`, espacio);
    return response.data;
  }

  async eliminar(id: string): Promise<void> {
    await api.delete(`/espacios/${id}`);
  }
}