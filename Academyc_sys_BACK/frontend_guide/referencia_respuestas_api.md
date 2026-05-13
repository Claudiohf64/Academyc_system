# Guía de Referencia de Respuestas API (Para Bruno)

Este documento detalla la estructura de los datos que devuelve cada endpoint del sistema para facilitar la integración con React.

---

## 1. Autenticación y Perfil

### `POST /api/auth/login`
- **Uso**: Iniciar sesión.
- **Respuesta**:
```json
{
  "token": "JWT_TOKEN_HERE",
  "user": { "id": 1, "email": "admin@test.com", "role": "admin" }
}
```

### `GET /api/auth/me`
- **Uso**: Obtener datos del usuario logueado y su perfil (Alumno o Docente).
- **Respuesta (Alumno)**:
```json
{
  "id": 1, "email": "alumno@test.com", "role": "alumno",
  "student": {
    "id": 5, "dni": "70001122", "nombres": "Juan", "apellido_paterno": "Perez",
    "enrollments": [
      { "id": 10, "career": { "nombre": "Diseño Gráfico", "imagen_url": "..." } }
    ]
  }
}
```
- **Respuesta (Docente)**:
```json
{
  "id": 2, "email": "docente@test.com", "role": "docente",
  "teacher": {
    "id": 3, "cod_docente": "DOC-001", "nombres": "Carlos",
    "courses": [
      { "id": 1, "nombre": "Arte", "career": { "nombre": "Diseño" } }
    ]
  }
}
```

---

## 2. Usuarios (Users)

### `GET /api/users`
- **Filtros**: `?search=`, `?role=`, `?activo=`.
- **Respuesta**: Lista de objetos de usuario.
```json
[
  { "id": 1, "nombres": "Juan Perez", "email": "juan@test.com", "role": "admin", "activo": true }
]
```

### `POST /api/users`
- **Respuesta**: Objeto del usuario creado.

---

## 3. Carreras (Careers)

### `GET /api/careers`
- **Filtros**: `?search=`, `?nombre=`, `?activo=`.
- **Respuesta**:
```json
[
  {
    "id": 1,
    "nombre": "Diseño Gráfico",
    "duracion_meses": 36,
    "imagen_url": "https://...",
    "descripcion": "...",
    "activo": true
  }
]
```

---

## 4. Cursos (Courses)

### `GET /api/courses`
- **Filtros**: `?search=`, `?career_id=`, `?teacher_id=`.
- **Respuesta**:
```json
[
  {
    "id": 1,
    "nombre": "Matemática I",
    "fecha_inicio": "2026-05-20",
    "horario": "08:00 - 10:00",
    "career": { "id": 1, "nombre": "Ingeniería" },
    "teacher": { "id": 3, "nombres": "Carlos" }
  }
]
```

### `GET /api/courses/:id/students`
- **Uso**: Lista de alumnos inscritos en la carrera de este curso.
- **Respuesta**:
```json
[
  {
    "id": 5, "dni": "70001122", "nombres": "Juan", "apellido_paterno": "Perez",
    "user": { "email": "juan@test.com" }
  }
]
```

---

## 5. Matrículas (Enrollments)

### `POST /api/enrollments/register`
- **Uso**: Registro público de alumno + matrícula automática.
- **Respuesta**:
```json
{
  "message": "Alumno registrado y matriculado con éxito",
  "token": "JWT_TOKEN",
  "user": { "id": 1, "email": "nuevo@test.com" },
  "student": { "id": 5, "dni": "70001122" },
  "enrollment": { "id": 10, "career_id": 1, "estado": "activa" }
}
```

### `GET /api/enrollments`
- **Filtros**: `?student_name=`, `?student_dni=`, `?career_name=`, `?estado=`.
- **Respuesta**:
```json
[
  {
    "id": 1,
    "estado": "activa",
    "student": { "nombres": "Juan", "dni": "70001122" },
    "career": { "nombre": "Diseño" }
  }
]
```

---

## 6. Alumnos (Students)

### `GET /api/students`
- **Filtros**: `?search=`, `?dni=`, `?email=`.
- **Respuesta**: Lista de alumnos con su usuario vinculado.

### `GET /api/students/dni/:dni`
- **Uso**: Buscar datos de persona por DNI (API externa + Local).
- **Respuesta**:
```json
{
  "dni": "70001122",
  "nombres": "JUAN CARLOS",
  "apellido_paterno": "PEREZ",
  "apellido_materno": "GARCIA"
}
```

---

## 7. Docentes (Teachers)

### `GET /api/teachers`
- **Filtros**: `?search=`, `?cod_docente=`.
- **Respuesta**: Lista de docentes.

### `POST /api/teachers/register` (Admin Only)
- **Uso**: Registro rápido de docente por DNI.
- **Respuesta**:
```json
{
  "message": "Docente registrado con éxito",
  "teacher": { "id": 1, "cod_docente": "DOC-2026-001", "nombres": "..." }
}
```

---

## 8. Formatos Generales de Error

Cuando algo falla, la API siempre responde así:
```json
{
  "status": "error",
  "message": "Descripción del error para mostrar al usuario",
  "code": "AUTH_INVALID_CREDENTIALS" 
}
```
