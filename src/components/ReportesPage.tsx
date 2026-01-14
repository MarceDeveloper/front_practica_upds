import { useState } from 'react';
import { useReportes } from '@/hooks/useReportes';

export const ReportesPage = () => {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [tipoReporte, setTipoReporte] = useState<'reservas' | 'espacios' | 'uso'>('reservas');

  const {
    reporteReservas,
    reporteEspacios,
    reporteUso,
    isLoadingReservas,
    isLoadingEspacios,
    isLoadingUso,
    exportarReporte,
    isExporting,
  } = useReportes(
    fechaInicio ? new Date(fechaInicio) : undefined,
    fechaFin ? new Date(fechaFin) : undefined
  );

  const handleGenerarReporte = () => {
    // Aquí se activarían las queries manualmente
    console.log('Generando reporte:', tipoReporte);
  };

  const handleExportar = (formato: 'pdf' | 'excel') => {
    exportarReporte(formato);
  };

  const isLoading = isLoadingReservas || isLoadingEspacios || isLoadingUso;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Reportes</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 mb-2">Tipo de Reporte</label>
            <select
              value={tipoReporte}
              onChange={(e) => setTipoReporte(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            >
              <option value="reservas">Reservas</option>
              <option value="espacios">Espacios Más Reservados</option>
              <option value="uso">Uso por Tipo</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Fecha Inicio</label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Fecha Fin</label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="mt-6 flex space-x-4">
          <button
            onClick={handleGenerarReporte}
            disabled={isLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? 'Generando...' : 'Generar Reporte'}
          </button>
          <button
            onClick={() => handleExportar('pdf')}
            disabled={isExporting}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
          >
            {isExporting ? 'Exportando...' : 'Exportar PDF'}
          </button>
          <button
            onClick={() => handleExportar('excel')}
            disabled={isExporting}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {isExporting ? 'Exportando...' : 'Exportar Excel'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Resultado del Reporte</h2>

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
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(reporteReservas, null, 2)}
            </pre>
          </div>
        )}

        {reporteEspacios && tipoReporte === 'espacios' && (
          <div>
            <h3 className="text-lg font-medium mb-4">Espacios Más Reservados</h3>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(reporteEspacios, null, 2)}
            </pre>
          </div>
        )}

        {reporteUso && tipoReporte === 'uso' && (
          <div>
            <h3 className="text-lg font-medium mb-4">Uso por Tipo de Espacio</h3>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(reporteUso, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};