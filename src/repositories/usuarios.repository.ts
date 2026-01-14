import api from '@/lib/axios';
import { Usuario, CrearUsuarioDto, EditarUsuarioDto, CambiarContrasenaDto } from '@/types';

export class UsuariosRepository {
  async obtenerTodos(): Promise<Usuario[]> {
    const response = await api.get('/usuarios');
    return response.data;
  }

  async obtenerPorId(id: string): Promise<Usuario> {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  }

  async crear(usuario: CrearUsuarioDto): Promise<Usuario> {
    const response = await api.post('/usuarios', usuario);
    return response.data;
  }

  async actualizar(id: string, usuario: EditarUsuarioDto): Promise<Usuario> {
    const response = await api.put(`/usuarios/${id}`, usuario);
    return response.data;
  }

  async eliminar(id: string): Promise<void> {
    await api.delete(`/usuarios/${id}`);
  }

  async cambiarContrasena(id: string, data: CambiarContrasenaDto): Promise<void> {
    await api.patch(`/usuarios/${id}/cambiar-contrasena`, data);
  }
}