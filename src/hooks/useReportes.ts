import { useMutation, useQuery } from '@tanstack/react-query';
import { ReportesRepository } from '@/repositories/reportes.repository';

const reportesRepository = new ReportesRepository();

export const useReportes = (fechaInicio?: Date, fechaFin?: Date) => {
  const { data: reporteReservas, isLoading: isLoadingReservas, refetch: refetchReservas } = useQuery({
    queryKey: ['reporte-reservas', fechaInicio, fechaFin],
    queryFn: () => reportesRepository.obtenerReservas(fechaInicio, fechaFin),
    enabled: false, // Solo se ejecuta manualmente
  });

  const { data: reporteEspacios, isLoading: isLoadingEspacios, refetch: refetchEspacios } = useQuery({
    queryKey: ['reporte-espacios', fechaInicio, fechaFin],
    queryFn: () => reportesRepository.obtenerEspaciosMasReservados(fechaInicio, fechaFin),
    enabled: false,
  });

  const { data: reporteUso, isLoading: isLoadingUso, refetch: refetchUso } = useQuery({
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
    refetchReservas();
  };

  const generarReporteEspacios = () => {
    refetchEspacios();
  };

  const generarReporteUso = () => {
    refetchUso();
  };

  const exportarReporte = (formato: 'pdf' | 'excel', options?: any) => {
    exportarMutation.mutate({ formato, fechaInicio, fechaFin }, options);
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