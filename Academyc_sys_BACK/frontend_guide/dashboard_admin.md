# Flujo del Dashboard: Perfil Administrador

Este documento describe la interfaz y funcionalidades que tendrá el usuario con rol Administrador.

## 1. Diseño General (Layout)
- **Consistencia**: Sidebar completo con todas las opciones de gestión.

## 2. Secciones de Gestión (Paneles CRUD)

### A. Gestión de Carreras
- **Lista**: Tabla con todas las carreras.
- **Búsqueda**: Barra de búsqueda general que filtre por nombre.
- **Acciones**:
    - **Crear**: Botón para abrir formulario de nueva carrera (incluyendo imagen).
    - **Editar**: Modificar datos existentes.
    - **Eliminar**: Botón con **Modal de Confirmación** que advierta sobre la pérdida de datos vinculados.

### B. Gestión de Cursos
- **Funcionalidad**: Idéntica a Carreras.
- **Extras**: Al crear/editar, permite seleccionar la Carrera y el Docente asignado mediante dropdowns.

### C. Gestión de Docentes
- **Registro Exclusivo**: El administrador es el único con acceso al botón de "Registrar Docente".
- **Búsqueda**: Filtros por DNI, nombres y especialidad.
- **Acciones**: Crear (con DNI), editar perfil y dar de baja (activo/inactivo).

### D. Gestión de Estudiantes
- **Lista**: Ver todos los alumnos matriculados.
- **Acciones**: Ver perfil completo del estudiante, ver en qué carreras está inscrito y dar de baja si es necesario.

## 3. Requerimientos Técnicos del Backend
- El endpoint `POST /teachers/register` debe estar restringido exclusivamente al rol `admin`.
- Todos los listados deben soportar los filtros de búsqueda que ya usa el sistema.
- Se debe asegurar que las eliminaciones manejen la integridad referencial (ej. no borrar una carrera con cursos activos sin advertir).
