# Flujo del Dashboard: Perfil Docente

Este documento describe la interfaz y funcionalidades que verá el docente al iniciar sesión.

## 1. Diseño General (Layout)
- **Consistencia**: Mismo diseño que el Dashboard del Alumno (Sidebar plegable, Header con rol y nombre).

## 2. Secciones del Panel

### A. Mi Perfil (Botón Usuario)
- **Contenido**: Datos personales del docente (DNI, Nombres, Apellidos, Celular, Dirección).
- **Carga Académica**:
    - Listado de **Cursos** que tiene asignados.
    - Listado de **Carreras** en las que enseña (basado en sus cursos).

### B. Mi Horario
- **Funcionalidad**: Vista cronológica de sus clases.
- **Detalle**: Muestra el nombre del curso, la carrera, el horario y los días de clase.

### C. Mis Cursos (Gestión de Alumnos)
- **Visualización**: Tarjetas de los cursos que dicta.
- **Filtros**: Por carrera.
- **Interacción**: A diferencia del alumno, aquí el docente **SÍ puede hacer clic** en la tarjeta.
- **Vista de Detalle**: Al hacer clic, se muestra el listado de todos los estudiantes inscritos en la carrera correspondiente a ese curso.
- **Datos del Alumno**: DNI, Nombres Completos y Correo.

## 3. Requerimientos Técnicos del Backend
- El endpoint `/auth/me` debe incluir el perfil de `Teacher` y sus `Courses`.
- Endpoint para listar alumnos por curso: `GET /courses/:id/students`.
    - Lógica: Obtener la `career_id` del curso y luego buscar todos los alumnos matriculados en esa carrera.
