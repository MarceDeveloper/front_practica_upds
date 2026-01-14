'use client';

import { useState, useEffect } from 'react';
import { useReportes } from '@/hooks/useReportes';
import { Button } from '@/components/ui/Button';

export const ReportesPage = () => {
   const [fechaInicio, setFechaInicio] = useState('');
   const [fechaFin, setFechaFin] = useState('');
   const [tipoReporte, setTipoReporte] = useState<'reservas' | 'espacios' | 'uso'>('reservas');

   useEffect(() => {
     const today = new Date();
     const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

     const formatDate = (date: Date) => {
       return date.toISOString().split('T')[0];
     };

     setFechaInicio(formatDate(startOfMonth));
     setFechaFin(formatDate(today));
   }, []);

  const {
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
    isExporting,
  } = useReportes(
    fechaInicio ? new Date(fechaInicio) : undefined,
    fechaFin ? new Date(fechaFin) : undefined
  );

  const handleGenerarReporte = () => {
    if (tipoReporte === 'reservas') {
      generarReporteReservas();
    } else if (tipoReporte === 'espacios') {
      generarReporteEspacios();
    } else if (tipoReporte === 'uso') {
      generarReporteUso();
    }
  };

  const handleExportar = (formato: 'pdf' | 'excel') => {
    exportarReporte(formato, {
      onSuccess: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reservas.${formato === 'excel' ? 'csv' : 'pdf'}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
    });
  };

  const isLoading = isLoadingReservas || isLoadingEspacios || isLoadingUso;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Reportes</h1>

      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filtros
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Tipo de Reporte</label>
            <select
              value={tipoReporte}
              onChange={(e) => setTipoReporte(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="reservas">Reservas</option>
              <option value="espacios">Espacios Más Reservados</option>
              <option value="uso">Uso por Tipo</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2 font-medium flex items-center">
              <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Fecha Inicio
            </label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2 font-medium flex items-center">
              <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Fecha Fin
            </label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-4">
          <Button
            onClick={handleGenerarReporte}
            disabled={isLoading}
            variant="primary"
            size="md"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            {isLoading ? 'Generando...' : 'Generar Reporte'}
          </Button>
          <Button
            onClick={() => handleExportar('pdf')}
            disabled={isExporting}
            variant="danger"
            size="md"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {isExporting ? 'Exportando...' : 'Exportar PDF'}
          </Button>
          <Button
            onClick={() => handleExportar('excel')}
            disabled={isExporting}
            variant="success"
            size="md"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            {isExporting ? 'Exportando...' : 'Exportar Excel'}
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Resultado del Reporte
        </h2>

        {isLoading && (
          <div className="text-center py-8">Cargando reporte...</div>
        )}

        {!isLoading && !reporteReservas && !reporteEspacios && !reporteUso && (
          <div className="text-center py-8 text-gray-500">
            Selecciona los filtros y genera un reporte
          </div>
        )}

        {reporteReservas && tipoReporte === 'reservas' && (
           <div>
             <h3 className="text-lg font-medium mb-4">Reporte de Reservas</h3>
             <div className="overflow-x-auto">
               <table className="min-w-full bg-white border border-gray-300">
                 <thead>
                   <tr className="bg-gray-50">
                     <th className="px-4 py-2 border-b text-left">ID</th>
                     <th className="px-4 py-2 border-b text-left">Usuario</th>
                     <th className="px-4 py-2 border-b text-left">Espacio</th>
                     <th className="px-4 py-2 border-b text-left">Fecha Inicio</th>
                     <th className="px-4 py-2 border-b text-left">Fecha Fin</th>
                     <th className="px-4 py-2 border-b text-left">Estado</th>
                   </tr>
                 </thead>
                 <tbody>
                   {Array.isArray(reporteReservas.datos) && reporteReservas.datos.map((reserva: any, index: number) => (
                     <tr key={index} className="hover:bg-gray-50">
                       <td className="px-4 py-2 border-b">{reserva.id}</td>
                       <td className="px-4 py-2 border-b">{reserva.usuario?.nombre || 'N/A'}</td>
                       <td className="px-4 py-2 border-b">{reserva.espacio?.nombre || 'N/A'}</td>
                       <td className="px-4 py-2 border-b">{new Date(reserva.fechaInicio).toLocaleString()}</td>
                       <td className="px-4 py-2 border-b">{new Date(reserva.fechaFin).toLocaleString()}</td>
                       <td className="px-4 py-2 border-b">{reserva.estado}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </div>
         )}

         {reporteEspacios && tipoReporte === 'espacios' && (
           <div>
             <h3 className="text-lg font-medium mb-4">Espacios Más Reservados</h3>
             <div className="overflow-x-auto">
               <table className="min-w-full bg-white border border-gray-300">
                 <thead>
                   <tr className="bg-gray-50">
                     <th className="px-4 py-2 border-b text-left">Espacio</th>
                     <th className="px-4 py-2 border-b text-left">Tipo</th>
                     <th className="px-4 py-2 border-b text-left">Total Reservas</th>
                   </tr>
                 </thead>
                 <tbody>
                   {Array.isArray(reporteEspacios.datos) && reporteEspacios.datos.map((espacio: any, index: number) => (
                     <tr key={index} className="hover:bg-gray-50">
                       <td className="px-4 py-2 border-b">{espacio.nombre}</td>
                       <td className="px-4 py-2 border-b">{espacio.tipo}</td>
                       <td className="px-4 py-2 border-b">{espacio.totalReservas}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </div>
         )}

         {reporteUso && tipoReporte === 'uso' && (
           <div>
             <h3 className="text-lg font-medium mb-4">Uso por Tipo de Espacio</h3>
             <div className="overflow-x-auto">
               <table className="min-w-full bg-white border border-gray-300">
                 <thead>
                   <tr className="bg-gray-50">
                     <th className="px-4 py-2 border-b text-left">Tipo</th>
                     <th className="px-4 py-2 border-b text-left">Total Horas</th>
                     <th className="px-4 py-2 border-b text-left">Total Reservas</th>
                   </tr>
                 </thead>
                 <tbody>
                   {Array.isArray(reporteUso.datos) && reporteUso.datos.map((uso: any, index: number) => (
                     <tr key={index} className="hover:bg-gray-50">
                       <td className="px-4 py-2 border-b">{uso.tipo}</td>
                       <td className="px-4 py-2 border-b">{uso.totalHoras}</td>
                       <td className="px-4 py-2 border-b">{uso.totalReservas}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </div>
         )}
      </div>
    </div>
  );
};