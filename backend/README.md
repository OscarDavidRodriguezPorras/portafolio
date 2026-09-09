# Backend del Portafolio (Node.js + Express + Google Drive)

Este backend reemplaza a Firebase. Guarda tus skills y proyectos como dos
archivos JSON (`skills.json` y `projects.json`) dentro de una carpeta de tu
Google Drive, y expone una API REST que tu portafolio consume.

## 1. Instalar dependencias

```bash
cd backend
npm install
```

## 2. Crear la cuenta de servicio de Google (para acceder a Drive)

1. Ve a [console.cloud.google.com](https://console.cloud.google.com/) y crea
   un proyecto nuevo (o usa uno existente).
2. En el menú, ve a **APIs y servicios → Biblioteca**, busca **Google Drive
   API** y haz clic en **Habilitar**.
3. Ve a **APIs y servicios → Credenciales → Crear credenciales → Cuenta de
   servicio**.
   - Ponle un nombre (ej. `portafolio-backend`).
   - No necesita roles a nivel de proyecto, puedes omitir ese paso.
4. Una vez creada, entra a la cuenta de servicio → pestaña **Claves →
   Agregar clave → Crear clave nueva → JSON**. Se descargará un archivo
   `.json`.
5. Copia ese archivo a `backend/service-account.json` (o donde prefieras, y
   apunta `GOOGLE_APPLICATION_CREDENTIALS` en tu `.env` a esa ruta).
6. Abre el archivo JSON y copia el valor de `"client_email"` (algo como
   `portafolio-backend@tu-proyecto.iam.gserviceaccount.com`). Lo necesitas en
   el siguiente paso.

## 3. Crear los archivos skills.json y projects.json (y compartirlos)

⚠️ **Importante:** las cuentas de servicio de Google **no tienen almacenamiento
propio**, así que no pueden crear archivos nuevos en tu Drive personal
(solo pueden hacerlo en "Shared Drives", una función exclusiva de Google
Workspace). Por eso, tú creas los archivos con tu cuenta normal (que sí
tiene cuota) y solo le das permiso a la cuenta de servicio para *editarlos*.

1. En tu computadora, crea dos archivos de texto con estos nombres y
   contenido exactos:

   **skills.json**
   ```json
   { "categories": [] }
   ```

   **projects.json**
   ```json
   { "projects": [] }
   ```

2. Ve a tu Google Drive normal, crea una carpeta (ej. `portafolio-data`) y
   sube ahí esos dos archivos (arrastrarlos o "Nuevo → Subir archivo").

3. Para **cada archivo** (skills.json y projects.json): clic derecho →
   **Compartir** → pega el `client_email` de tu cuenta de servicio (lo
   encuentras en tu `service-account.json`, algo como
   `portafolio-backend@tu-proyecto.iam.gserviceaccount.com`) → dale permiso
   de **Editor**.

4. Abre cada archivo en Drive y copia su ID desde la URL:
   `https://drive.google.com/file/d/ESTE_ES_EL_ID/view`
   Vas a necesitar ambos IDs en el siguiente paso.

## 4. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env` y completa:
- `ADMIN_PASSWORD`: tu nueva contraseña de administrador.
- `JWT_SECRET`: una cadena larga y aleatoria (puedes generarla con
  `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`).
- `GOOGLE_APPLICATION_CREDENTIALS`: ruta al JSON de la cuenta de servicio.
- `DRIVE_SKILLS_FILE_ID`: el ID de `skills.json` que copiaste en el paso 3.
- `DRIVE_PROJECTS_FILE_ID`: el ID de `projects.json` que copiaste en el paso 3.
- `FRONTEND_URL`: la URL desde donde se sirve tu portafolio (para CORS).

## 5. Correr el backend

```bash
npm run dev     # con recarga automática al guardar cambios
# o
npm start
```

Deberías ver: `✅ Backend del portafolio corriendo en http://localhost:4000`

Prueba que responda:
```bash
curl http://localhost:4000/api/health
```

## 6. Conectar el frontend

En `frontend/api.js`, cambia:
```js
export const API_BASE = "http://localhost:4000/api";
```
por la URL de tu backend cuando lo despliegues (paso 7).

## 7. Desplegar en producción

Este backend necesita un servidor que corra Node de forma persistente (no un
hosting estático). Opciones gratuitas/sencillas: **Render**, **Railway** o
**Fly.io**.

Pasos generales (con Render, por ejemplo):
1. Sube la carpeta `backend/` a un repositorio de GitHub (NO subas
   `service-account.json` ni `.env` — agrégalos a `.gitignore`).
2. En Render: **New → Web Service**, conecta el repo.
   - Build command: `npm install`
   - Start command: `npm start`
3. En la sección **Environment**, agrega las mismas variables del `.env`
   (para `GOOGLE_APPLICATION_CREDENTIALS`, puedes pegar el contenido del
   JSON completo en una variable de entorno tipo "Secret File", o usar la
   variante de credenciales JSON en línea — dime si quieres que te ayude a
   adaptar `config/drive.js` para leer las credenciales desde una variable
   de entorno en vez de un archivo).
4. Una vez desplegado, copia la URL pública (ej.
   `https://portafolio-backend.onrender.com`) y actualiza `API_BASE` en
   `frontend/api.js` a `https://portafolio-backend.onrender.com/api`.
5. Actualiza `FRONTEND_URL` en las variables de entorno de Render para que
   apunte al dominio real donde vive tu portafolio (GitHub Pages, Vercel,
   etc.), así CORS solo permite tu sitio.

## Endpoints disponibles

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/auth/login` | No | `{ password }` → `{ token }` |
| GET | `/api/skills` | No | Lista categorías y skills |
| POST | `/api/skills/categories` | Sí | `{ name }` |
| PUT | `/api/skills/categories/:id` | Sí | `{ name }` |
| DELETE | `/api/skills/categories/:id` | Sí | — |
| POST | `/api/skills/categories/:categoryId/items` | Sí | `{ name, imageUrl, isLanguage, proficiency }` |
| PUT | `/api/skills/categories/:categoryId/items/:skillId` | Sí | ídem |
| DELETE | `/api/skills/categories/:categoryId/items/:skillId` | Sí | — |
| GET | `/api/projects` | No | Lista proyectos |
| POST | `/api/projects` | Sí | `{ title, tag, description, imageUrl, tech, detailLink, detailDescription }` |
| PUT | `/api/projects/:id` | Sí | ídem |
| DELETE | `/api/projects/:id` | Sí | — |

Las rutas marcadas "Sí" requieren el header
`Authorization: Bearer <token>` obtenido en el login.

## Notas de seguridad

- La contraseña de administrador ya **no** vive en el código del navegador
  (antes estaba escrita en texto plano en `script.js`). Ahora se valida en
  el servidor y solo se emite un token temporal (12h) si es correcta.
- El archivo `service-account.json` da acceso de escritura a tu Drive: no lo
  subas nunca a un repositorio público. Agrégalo a `.gitignore`.
