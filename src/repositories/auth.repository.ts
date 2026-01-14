import api from '@/lib/axios';
import { Usuario, CrearUsuarioDto, IniciarSesionDto, CambiarContrasenaDto } from '@/types';

export class AuthRepository {
  async iniciarSesion(credenciales: IniciarSesionDto) {
    const response = await api.post('/auth/login', credenciales);
    console.log('Login response:', response.data);
    return response.data;
  }

  async registrarUsuario(usuario: CrearUsuarioDto) {
    const response = await api.post('/auth/register', usuario);
    return response.data;
  }

  async obtenerPerfil(): Promise<Usuario> {
    const response = await api.get('/auth/profile');
    return response.data;
  }

  async cambiarContrasena(data: CambiarContrasenaDto): Promise<void> {
    await api.post('/auth/change-password', data);
  }
}