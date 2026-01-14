import api from '@/lib/axios';
import { Reporte } from '@/types';

export class ReportesRepository {
  async obtenerReservas(fechaInicio?: Date, fechaFin?: Date): Promise<Reporte> {
    const params = new URLSearchParams();
    if (fechaInicio) params.append('fechaInicio', fechaInicio.toISOString());
    if (fechaFin) params.append('fechaFin', fechaFin.toISOString());

    const response = await api.get(`/reportes/reservas?${params}`);
    return response.data;
  }

  async obtenerEspaciosMasReservados(fechaInicio?: Date, fechaFin?: Date): Promise<Reporte> {
    const params = new URLSearchParams();
    if (fechaInicio) params.append('fechaInicio', fechaInicio.toISOString());
    if (fechaFin) params.append('fechaFin', fechaFin.toISOString());

    const response = await api.get(`/reportes/espacios-mas-reservados?${params}`);
    return response.data;
  }

  async obtenerUsoPorTipo(fechaInicio?: Date, fechaFin?: Date): Promise<Reporte> {
    const params = new URLSearchParams();
    if (fechaInicio) params.append('fechaInicio', fechaInicio.toISOString());
    if (fechaFin) params.append('fechaFin', fechaFin.toISOString());

    const response = await api.get(`/reportes/uso-por-tipo?${params}`);
    return response.data;
  }

  async exportarReservas(formato: 'pdf' | 'excel', fechaInicio?: Date, fechaFin?: Date): Promise<Blob> {
    const params = new URLSearchParams();
    params.append('formato', formato);
    if (fechaInicio) params.append('fechaInicio', fechaInicio.toISOString());
    if (fechaFin) params.append('fechaFin', fechaFin.toISOString());

    const response = await api.get(`/reportes/reservas/exportar?${params}`, {
      responseType: 'blob',
    });
    return response.data;
  }
}