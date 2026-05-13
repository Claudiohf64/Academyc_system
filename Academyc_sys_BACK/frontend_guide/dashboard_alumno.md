# Flujo del Dashboard: Perfil Alumno

Este documento describe la interfaz y funcionalidades que verá el alumno al iniciar sesión.

## 1. Diseño General (Layout)
- **Panel Izquierdo (Sidebar)**: Plegable, contiene los botones de navegación.
- **Cabecera (Header)**: Arriba a la derecha muestra el nombre del alumno y su rol. Al hacer clic, despliega la opción de "Cerrar Sesión".
- **Área de Contenido**: A la derecha del sidebar, donde se cargan las diferentes vistas.

## 2. Secciones del Panel

### A. Mi Perfil (Botón Usuario)
- **Contenido**: Muestra los datos completos del alumno (DNI, Nombres, Apellidos, Teléfono, Dirección, Email).
- **Relaciones**: Lista las carreras en las que el alumno se encuentra matriculado actualmente.

### B. Mi Horario
- **Funcionalidad**: Lista de cursos pertenecientes a la carrera del alumno.
- **Filtros**: 
    - Debe permitir filtrar por la carrera (en caso de tener más de una).
    - Debe permitir filtrar por fecha.
- **Orden**: Los cursos deben aparecer ordenados cronológicamente por su fecha de inicio.
- **Visualización**: Formato de lista detallada, incluyendo el **nombre del docente** responsable.

### C. Mis Cursos
- **Visualización**: Tarjetas (Cards) de todos los cursos de su carrera.
- **Detalle**: Las tarjetas muestran información del curso (créditos, descripción, horario, **nombre del docente**) pero **no tienen redirección**. Son meramente informativas.

## 3. Requerimientos Técnicos del Backend
- El endpoint `/auth/me` debe ser capaz de retornar no solo los datos de `User`, sino también los datos de `Student` y sus `Enrollments` (incluyendo las `Careers`).
- El endpoint de `courses` debe soportar el filtrado por `career_id` y ordenamiento por fecha.
