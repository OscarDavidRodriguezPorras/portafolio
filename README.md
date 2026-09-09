# 💻 Portafolio Web Full-Stack

Portafolio profesional desarrollado con **HTML5, CSS3 y JavaScript Vanilla** en el frontend, y un **backend propio en Node.js + Express** conectado a **Google Drive** como base de datos. Todo el contenido (skills, tecnologías y proyectos) se administra en tiempo real desde la propia interfaz web, sin tocar el código fuente.

---

## 🚀 Características

- 🎨 Diseño moderno, responsivo y con temática oscura (estilo terminal).
- 👤 Sección de presentación personal y "Sobre Mí".
- 🛠️ Gestión dinámica de Skills, organizadas por categorías (Backend, Frontend, Base de Datos, Tools & Platforms).
- 📊 Barras de nivel de dominio por tecnología.
- 📂 Gestión dinámica de proyectos destacados, con imagen, resumen, descripción detallada y link a GitHub.
- 🔐 Modo administrador protegido con autenticación por token (JWT) — la contraseña nunca viaja expuesta en el navegador.
- ☁️ Backend propio (Node.js + Express) desplegado en Render.
- 📄 Google Drive como base de datos: los datos se guardan como archivos JSON en la nube, editables desde el panel admin y sin costo.
- 📱 Compatible con dispositivos móviles.

---

## 🖼️ Vista Previa

### Página Principal
![Inicio](/img/pagina_principal.png)

### Sobre Mí
![Sobre Mi](/img/sobre_mi.png)

### Skills Dinámicas
![Skills](/img/skills.png)

### Proyectos Destacados
![Proyectos](/img/proyectos.png)

---

## 🏗️ Arquitectura

```
┌─────────────────────┐        HTTPS / REST API        ┌──────────────────────┐        Google Drive API        ┌─────────────────┐
│   Frontend           │  ───────────────────────────►  │   Backend             │  ───────────────────────────►  │   Google Drive    │
│   (GitHub Pages)     │  ◄───────────────────────────  │   (Render)             │  ◄───────────────────────────  │   skills.json      │
│   HTML + CSS + JS     │                                 │   Node.js + Express    │                                 │   projects.json    │
└─────────────────────┘                                 └──────────────────────┘                                 └─────────────────┘
```

- **Frontend:** archivos estáticos servidos por GitHub Pages. `script.js` consume la API a través de `api.js`.
- **Backend:** API REST en Node.js/Express, con autenticación JWT para las operaciones de escritura (crear, editar, eliminar).
- **Base de datos:** dos archivos JSON (`skills.json` y `projects.json`) alojados en Google Drive, leídos y actualizados por el backend mediante una cuenta de servicio de Google.

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- HTML5
- CSS3
- JavaScript (Vanilla, ES Modules)

### Backend
- Node.js
- Express.js
- JSON Web Tokens (JWT) para autenticación
- Google APIs (googleapis) para la integración con Drive

### Base de Datos
- Google Drive (archivos JSON como almacenamiento)

### Infraestructura
- GitHub Pages (hosting del frontend)
- Render (hosting del backend)

### Control de Versiones
- Git & GitHub

---

## ⚙️ Funcionalidades Administrativas

Al iniciar sesión como administrador (protegido por contraseña + token JWT), es posible:

### Gestión de Skills
- Crear, editar y eliminar categorías (Backend, Frontend, Base de Datos, Tools & Platforms, etc.).
- Añadir, editar y eliminar tecnologías dentro de cada categoría, con ícono, nombre y porcentaje de dominio.

### Gestión de Proyectos
- Crear nuevos proyectos con título, tecnologías usadas, link al repositorio, imagen, resumen y descripción detallada.
- Editar o eliminar proyectos existentes.

Todos los cambios se guardan automáticamente en Google Drive a través del backend, y se reflejan al instante en la página sin necesidad de recargar.

---

## 📂 Estructura del Proyecto

```
📦 mi-portafolio
├── index.html
├── styles.css
├── script.js
├── api.js
├── imagen-perfil.png, logan.png, etc.
│
└── backend/
    ├── server.js
    ├── routes/
    │   ├── auth.js
    │   ├── skills.js
    │   └── projects.js
    ├── services/
    │   ├── dataStore.js
    │   └── driveStore.js
    ├── middleware/
    │   └── requireAdmin.js
    ├── config/
    │   └── drive.js
    ├── package.json
    └── README.md   ← instrucciones detalladas de configuración del backend
```

---

## 🔌 API

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/auth/login` | No | Inicia sesión de administrador |
| GET | `/api/skills` | No | Lista categorías y skills |
| POST/PUT/DELETE | `/api/skills/categories/...` | Sí | CRUD de categorías y skills |
| GET | `/api/projects` | No | Lista proyectos |
| POST/PUT/DELETE | `/api/projects/...` | Sí | CRUD de proyectos |

Ver detalle completo de endpoints en [`backend/README.md`](./backend/README.md).

---

## 🎯 Objetivo del Proyecto

Este portafolio fue desarrollado con el objetivo de:

- Mostrar mis habilidades como desarrollador full-stack.
- Aplicar conocimientos de HTML, CSS, JavaScript, Node.js y Express.
- Implementar una arquitectura desacoplada frontend/backend con autenticación.
- Integrar una API externa (Google Drive) como solución de almacenamiento.
- Facilitar la actualización del contenido sin modificar el código fuente.

---

## 👨‍💻 Autor

**Oscar David Rodríguez Porras**

- Backend Developer
- Bases de Datos
- Python Developer

GitHub: [OscarDavidRodriguezPorras](https://github.com/OscarDavidRodriguezPorras)

---

## 📄 Licencia

Este proyecto es de uso personal y académico.