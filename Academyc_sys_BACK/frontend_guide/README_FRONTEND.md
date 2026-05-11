# Plan de Implementacion Frontend para Sistema Academico

Este documento detalla el analisis del backend actual y la propuesta de arquitectura para el desarrollo de un frontend funcional, profesional y totalmente integrado.

## Analisis de la Arquitectura Backend

El sistema backend esta construido bajo una arquitectura de capas (Hexagonal/Clean Architecture) que separa las responsabilidades de manera clara:

1. Capa de Presentacion: Controladores que gestionan las peticiones HTTP y validan la entrada inicial.
2. Capa de Aplicacion: Casos de uso que orquestan la logica de negocio compleja, como el registro simultaneo de usuario, alumno y matricula.
3. Capa de Dominio: Entidades que definen la estructura de datos que fluye hacia el exterior, garantizando que el frontend reciba exactamente lo que necesita.
4. Capa de Datos: Repositorios basados en Sequelize que gestionan la persistencia en MySQL.

Los modulos principales expuestos son: Auth, Users, Careers, Courses, Enrollments, Students y Teachers.

## Propuesta de Estructura para el Frontend

Se propone el uso de React con Vite para garantizar un rendimiento optimo y una experiencia de desarrollo agil. La estructura se dividira en modulos funcionales que reflejen la arquitectura del backend.

### Organizacion de Carpetas

src/
  api/ (Configuracion de Axios y servicios para cada entidad)
  components/ (Componentes reutilizables: botones, tablas, formularios, modales)
  context/ (Gestion de estado global para autenticacion y temas)
  hooks/ (Hooks personalizados para peticiones de datos y logica compartida)
  layouts/ (Plantillas para paginas publicas y dashboard privado)
  pages/ (Vistas principales de la aplicacion)
  routes/ (Definicion de rutas publicas y protegidas por roles)
  utils/ (Helpers para formateo de fechas, validaciones y constantes)

## Mapeo de Modulos y Funcionalidades

### 1. Modulo de Autenticacion
- Login de usuarios con persistencia en localStorage/Cookies.
- Proteccion de rutas segun el rol del usuario (Admin, Teacher, Student).
- Gestion de perfil y cierre de sesion.

### 2. Modulo Academico (Careers y Courses)
- Listado de carreras con filtros de busqueda global y por nombre.
- Gestion de cursos vinculados a carreras, mostrando horarios y fechas de inicio/fin.
- Creacion y edicion de mallas curriculares.

### 3. Modulo de Matriculas (Enrollments)
- Formulario publico de inscripcion: Registro de usuario y matricula en un solo paso.
- Panel de administracion: Listado de matriculados con busqueda por nombre de alumno o carrera.
- Gestion de estados de matricula (Activa, Completada, Anulada).

### 4. Modulo de Personas (Students y Teachers)
- Gestion de expedientes de alumnos y docentes.
- Integracion con el sistema de busqueda por DNI para autocompletado de nombres.
- Filtros avanzados por apellidos, correo y codigos internos.

## Estrategia de Implementacion Tecnologica

### Gestion de Estado y Datos
- Uso de React Query o SWR para la gestion de cache y estados de carga, asegurando que la interfaz sea fluida.
- Centralizacion de las peticiones API en una instancia de Axios con interceptores para el manejo automatico de tokens JWT.

### Diseño y Experiencia de Usuario
- Implementacion de un Dashboard responsivo basado en Tailwind CSS.
- Uso de componentes de feedback: Notificaciones (Toasts) para confirmaciones de guardado y mensajes de error detallados.
- Implementacion de la busqueda global (Global Search) en todas las tablas para facilitar el acceso a la informacion.

### Seguridad
- Validacion de formularios en el lado del cliente antes del envio.
- Interceptores de error 401 para redireccion automatica al login cuando el token expira.
- Sanitizacion de datos antes de ser mostrados en el DOM.

## Conclusion

El frontend sera una SPA (Single Page Application) diseñada para consumir la API actual de forma eficiente. La arquitectura propuesta garantiza escalabilidad y facilidad de mantenimiento, permitiendo que cada modulo del backend tenga su representacion correspondiente y funcional en la interfaz de usuario.


# Guia de Implementacion y Referencia de API

Este documento proporciona una hoja de ruta detallada para el desarrollo del frontend y una explicacion técnica de como interactuar con cada uno de los endpoints del backend.

## Hoja de Ruta de Implementacion (Paso a Paso)

### Fase 1: Configuracion Base
1. Inicializar el proyecto con Vite y React.
2. Instalar dependencias core: Axios, React Router Dom, Tailwind CSS.
3. Configurar la instancia de Axios en src/api/axios.js con la baseURL http://localhost:3000/api.
4. Implementar interceptores de Axios para adjuntar el token JWT (Bearer Token) en cada peticion.

### Fase 2: Autenticacion y Estado Global
1. Crear el AuthContext para gestionar el estado del usuario (token, id, rol).
2. Implementar la pagina de Login consumiendo /auth/login.
3. Implementar el hook useAuth para proteger rutas privadas.
4. Crear componentes de Layout (Sidebar, Navbar) que se muestren solo tras el login.

### Fase 3: Modulo de Carreras y Cursos
1. Crear servicios de API para Careers y Courses.
2. Implementar el listado de Carreras con la opcion de "Cargar Todo" y "Busqueda Global".
3. Al seleccionar una Carrera, cargar sus Cursos vinculados usando el filtro ?career_id=.

### Fase 4: Modulo de Matriculas y Alumnos
1. Implementar el formulario publico de "Inscripcion Rapida" usando /enrollments/register.
2. Crear la vista administrativa de Matriculas con filtros por DNI y Nombre del Alumno.
3. Implementar la funcionalidad de actualizacion de estado (Activa/Completada/Anulada).

### Fase 5: Modulo de Docentes y Usuarios
1. Implementar el registro de docentes con busqueda automatica por DNI.
2. Crear la gestion de usuarios del sistema (solo para rol Admin).

## Referencia Detallada de Endpoints

### 1. Autenticacion (Auth)
- POST /auth/login: Recibe email y password. Devuelve token y datos del usuario. Uso: Inicio de sesion.
- GET /auth/me: Requiere token. Devuelve los datos del usuario actual. Uso: Persistencia de sesion al recargar.

### 2. Carreras (Careers)
- GET /careers: Lista todas las carreras. Soporta filtros ?search= y ?nombre=. Uso: Menus de seleccion y tablas.
- POST /careers: Crea una nueva carrera. Requiere nombre, duracion_meses y descripcion.
- GET /careers/:id: Obtiene detalle de una carrera especifica.
- PUT /careers/:id: Actualiza datos de una carrera.
- DELETE /careers/:id: Elimina una carrera (borrado fisico).

### 3. Cursos (Courses)
- GET /courses: Lista cursos. Filtros clave: ?career_id= (para ver cursos de una carrera) y ?search=.
- POST /courses: Crea un curso vinculado a una carrera. Incluye campos de horario y dias.
- GET /courses/:id: Detalle de curso.
- PUT /courses/:id: Actualizar horario o creditos.

### 4. Matriculas (Enrollments)
- POST /enrollments/register: Endpoint publico. Crea usuario + alumno + matricula en una sola transaccion. Uso: Formulario de nuevos alumnos.
- GET /enrollments: Listado administrativo. Filtros: ?student_name=, ?student_dni=, ?career_name=.
- PUT /enrollments/:id: Cambiar el estado de la matricula.

### 5. Alumnos y Docentes (Students / Teachers)
- GET /students: Lista de alumnos con sus datos personales y usuario vinculado.
- GET /teachers: Lista de docentes.
- GET /students/dni/:dni: Busca datos en la API externa y base local. Uso: Autocompletado de formularios.
- POST /teachers/register: Registro rapido de docente mediante DNI.

### 6. Usuarios (Users)
- GET /users: Gestion de cuentas de usuario. Filtros: ?role=, ?activo=. Uso: Control de acceso al sistema.

## Consejos para la Integracion
- Manejo de IDs: Siempre usa los IDs devueltos por la API para las operaciones de actualizacion (PUT) y eliminacion (DELETE).
- Carga de Datos: Usa el parametro ?search= para implementar buscadores "vivos" (live search) que consulten mientras el usuario escribe.
- Feedback al Usuario: Muestra estados de "Cargando..." mientras las peticiones de red estan en curso para evitar que la interfaz parezca congelada.
