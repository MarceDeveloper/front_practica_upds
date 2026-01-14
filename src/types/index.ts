export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: 'miembro' | 'administrador';
}

export interface Espacio {
  id: string;
  nombre: string;
  capacidad: number;
  tipo: string;
  descripcion: string;
}

export interface Reserva {
  id: string;
  usuarioId: string;
  espacioId: string;
  fechaInicio: Date;
  fechaFin: Date;
  estado: string;
}

export interface CrearUsuarioDto {
  nombre: string;
  email: string;
  contrasena: string;
  rol: 'miembro' | 'administrador';
}

export interface IniciarSesionDto {
  email: string;
  contrasena: string;
}

export interface CrearEspacioDto {
  nombre: string;
  capacidad: number;
  tipo: string;
  descripcion: string;
}

export interface EditarEspacioDto {
  nombre?: string;
  capacidad?: number;
  tipo?: string;
  descripcion?: string;
}

export interface CrearReservaDto {
  usuarioId: string;
  espacioId: string;
  fechaInicio: Date;
  fechaFin: Date;
}

export interface FiltrosEspacio {
  tipo?: string;
  capacidadMin?: number;
  capacidadMax?: number;
  nombre?: string;
}

export interface CambiarContrasenaDto {
  contrasenaActual: string;
  nuevaContrasena: string;
}

export interface Reporte {
  id: string;
  titulo: string;
  descripcion: string;
  fechaGeneracion: Date;
  datos: any;
}