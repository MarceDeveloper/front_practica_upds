import { useMutation, useQuery } from '@tanstack/react-query';
import { ReportesRepository } from '@/repositories/reportes.repository';

const reportesRepository = new ReportesRepository();

export const useReportes = (fechaInicio?: Date, fechaFin?: Date) => {
  const { data: reporteReservas, isLoading: isLoadingReservas } = useQuery({
    queryKey: ['reporte-reservas', fechaInicio, fechaFin],
    queryFn: () => reportesRepository.obtenerReservas(fechaInicio, fechaFin),
    enabled: false, // Solo se ejecuta manualmente
  });

  const { data: reporteEspacios, isLoading: isLoadingEspacios } = useQuery({
    queryKey: ['reporte-espacios', fechaInicio, fechaFin],
    queryFn: () => reportesRepository.obtenerEspaciosMasReservados(fechaInicio, fechaFin),
    enabled: false,
  });

  const { data: reporteUso, isLoading: isLoadingUso } = useQuery({
    queryKey: ['reporte-uso', fechaInicio, fechaFin],
    queryFn: () => reportesRepository.obtenerUsoPorTipo(fechaInicio, fechaFin),
    enabled: false,
  });

  const exportarMutation = useMutation({
    mutationFn: ({ formato, fechaInicio, fechaFin }: {
      formato: 'pdf' | 'excel';
      fechaInicio?: Date;
      fechaFin?: Date;
    }) => reportesRepository.exportarReservas(formato, fechaInicio, fechaFin),
  });

  const generarReporteReservas = () => {
    // Trigger manual
  };

  const generarReporteEspacios = () => {
    // Trigger manual
  };

  const generarReporteUso = () => {
    // Trigger manual
  };

  const exportarReporte = (formato: 'pdf' | 'excel') => {
    exportarMutation.mutate({ formato, fechaInicio, fechaFin });
  };

  return {
    reporteReservas,
    reporteEspacios,
    reporteUso,
    isLoadingReservas,
    isLoadingEspacios,
    isLoadingUso,
    generarReporteReservas,
    generarReporteEspacios,
    generarReporteUso,
    exportarReporte,
    isExporting: exportarMutation.isPending,
  };
};