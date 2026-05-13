# Explicación del Flujo de Alumno (Matrícula Rápida)

Este documento describe el flujo de experiencia de usuario (UX) diseñado para el proceso de inscripción de nuevos alumnos.

## 1. Pantalla de Inicio (Login)
- Se presenta un formulario estándar de acceso (Email / Password).
- En la parte superior derecha (u otra esquina destacada) se ubica el botón **"¡MATRICÚLATE YA!"**.

## 2. Galería de Carreras
Al hacer clic en el botón de matrícula, el sistema redirige a una vista de selección:
- Se muestran tarjetas visuales de las carreras disponibles.
- Cada tarjeta incluye:
    - **Imagen de la carrera** (obtenida del campo `imagen_url`).
    - Nombre de la carrera.
    - Breve descripción.
    - Duración aproximada.
- El usuario selecciona la carrera de su interés.

## 3. Formulario de Registro e Inscripción
Tras seleccionar la carrera, el sistema muestra el formulario final:
- **Datos Personales**:
    - DNI (obligatorio).
    - Teléfono.
    - Dirección.
- **Datos de Usuario**:
    - Email.
    - Contraseña.
- **Dato Mapeado**:
    - La carrera elegida ya aparece pre-seleccionada o bloqueada en el formulario (basado en el `career_id` seleccionado previamente).

## 4. Proceso Técnico (Backend)
- El frontend envía una petición `POST` al endpoint `/api/enrollments/register`.
- El backend realiza una **transacción atómica**:
    1. Crea el registro en `users` con rol `alumno`.
    2. Crea el registro en `students` con la información personal y vincula el `user_id`.
    3. Crea la matrícula en `enrollments` vinculando al estudiante con la carrera.
- El sistema devuelve el Token JWT para que el alumno inicie sesión inmediatamente después del registro.
