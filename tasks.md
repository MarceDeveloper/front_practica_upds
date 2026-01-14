# Tareas del Frontend - Sistema SREO

## Tecnologías Definidas
- **Framework**: Next.js 16 (App Router)
- **Estilos**: Tailwind CSS 4
- **Cliente HTTP**: Axios
- **Gestión de Estado**: Zustand (para estado global simple)
- **Obtención de Datos**: TanStack Query (React Query) para manejo de datos y caché
- **TypeScript**: Ya configurado
- **Linting**: ESLint configurado

## Patrón de Diseño Propuesto
**Patrón Repository** para la capa de datos:
- Centralizar todas las llamadas a la API en repositorios
- Abstraer la lógica de HTTP en servicios reutilizables
- Facilitar testing y cambios en la implementación

## Tareas Pendientes

### 1. Configuración Inicial
- [x] Instalar dependencias adicionales (axios, @tanstack/react-query, zustand)
- [x] Configurar Axios con URL base del backend
- [x] Configurar proveedor de TanStack Query
- [x] Configurar store de Zustand para autenticación

### 2. Estructura de Carpetas
- [x] Crear estructura de carpetas (components, pages, services, hooks, stores, types)
- [x] Definir tipos TypeScript basados en DTOs del backend

### 3. Autenticación
- [ ] Implementar formularios de login/registro
- [ ] Crear hook useAuth para manejo de sesión
- [ ] Proteger rutas con middleware

### 4. Gestión de Espacios
- [ ] Página de listado de espacios con filtros
- [ ] Formulario de creación/edición de espacios
- [ ] Funcionalidad de eliminación de espacios

### 5. Gestión de Reservas
- [ ] Página de reservas del usuario (historial y futuras)
- [ ] Formulario de nueva reserva
- [ ] Funcionalidad de cancelar reserva

### 6. Gestión de Usuarios (Admin)
- [ ] Página de listado de usuarios
- [ ] Formulario de edición de usuarios
- [ ] Funcionalidad de eliminación de usuarios
- [ ] Cambio de contraseña

### 7. Reportes
- [ ] Página de reportes con filtros
- [ ] Exportar reportes a PDF/Excel

### 8. UI/UX
- [ ] Diseño responsivo con Tailwind
- [ ] Componentes reutilizables (botones, modales, tablas)
- [ ] Manejo de errores y estados de carga

### 9. Testing
- [ ] Configurar Jest y React Testing Library
- [ ] Tests unitarios para hooks y servicios
- [ ] Tests de integración para componentes

### 10. Despliegue
- [ ] Configurar build para producción
- [ ] Integrar con backend en producción

## Comunicación con Backend
- URL Base: `http://localhost:3001` (desarrollo)
- Endpoints principales:
  - Auth: `/auth/login`, `/auth/register`
  - Espacios: `/espacios`
  - Reservas: `/reservas`
  - Usuarios: `/usuarios`
  - Reportes: `/reportes`

## Notas Adicionales
- Usar patrón Repository para mantener consistencia con backend
- Implementar manejo de errores global
- Mantener separación de responsabilidades (UI, lógica, datos)