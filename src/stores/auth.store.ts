import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: string;
}

interface AuthState {
  usuario: Usuario | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (usuario: Usuario, token: string) => void;
  logout: () => void;
  updateUsuario: (usuario: Partial<Usuario>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      usuario: null,
      token: null,
      isAuthenticated: false,

      login: (usuario: Usuario, token: string) => {
        localStorage.setItem('token', token);
        set({ usuario, token, isAuthenticated: true });
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ usuario: null, token: null, isAuthenticated: false });
      },

      updateUsuario: (updates: Partial<Usuario>) => {
        const currentUsuario = get().usuario;
        if (currentUsuario) {
          set({ usuario: { ...currentUsuario, ...updates } });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        usuario: state.usuario,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);