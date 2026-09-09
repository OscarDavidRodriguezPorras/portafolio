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

## 7. Desplegar en producción (Render)

Este backend necesita un servidor que corra Node de forma persistente (no
un hosting estático). Vamos a usar **Render** (tiene plan gratuito).

### 7.1 Sube el código a GitHub

1. Crea un repositorio nuevo en [github.com](https://github.com) (puede ser
   privado).
2. Sube tu carpeta `backend/` (o todo `mi_portafolio/` si la tienes anidada
   ahí dentro — Render te va a dejar elegir la subcarpeta más adelante).
3. **Verifica que `.env` y `service-account.json` NO se suban** — el
   `.gitignore` que incluí ya los excluye, pero confírmalo revisando los
   archivos que aparecen en tu commit antes de subir.

Si nunca has usado git desde la terminal, puedes usar
[GitHub Desktop](https://desktop.github.com/) — es una app con interfaz
gráfica que hace lo mismo sin comandos.

### 7.2 Crea el servicio en Render

1. Ve a [render.com](https://render.com) y crea una cuenta (puedes usar tu
   cuenta de GitHub para entrar más rápido).
2. Clic en **New → Web Service**.
3. Conecta tu repositorio de GitHub.
4. Si tu `backend/` está anidada dentro de otra carpeta (ej.
   `mi_portafolio/backend`), en **Root Directory** escribe: `backend`
   (o la ruta relativa correspondiente). Si subiste solo el contenido de
   `backend/` como raíz del repo, deja este campo vacío.
5. Configura:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
6. NO le des a "Create" todavía — primero baja a la sección **Environment
   Variables** (siguiente paso).

### 7.3 Configura las variables de entorno en Render

Agrega estas variables (botón **Add Environment Variable**):

| Variable | Valor |
|---|---|
| `ADMIN_PASSWORD` | tu contraseña de administrador |
| `JWT_SECRET` | la misma cadena larga que usas en local |
| `DRIVE_SKILLS_FILE_ID` | el ID de tu skills.json |
| `DRIVE_PROJECTS_FILE_ID` | el ID de tu projects.json |
| `FRONTEND_URL` | la URL donde publiques tu portafolio (ej. `https://tuusuario.github.io`). Si aún no la tienes, deja `*` por ahora y actualízalo después. |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | pega aquí el **contenido completo** de tu `service-account.json` (todo el JSON, en una sola variable) |

Para la última: abre tu `service-account.json` local con el Bloc de notas,
selecciona todo (Ctrl+A), cópialo (Ctrl+C), y pégalo tal cual como el
valor de esa variable en Render. No necesitas quitarle los saltos de línea
ni nada, Render acepta texto largo en el valor.

(`PORT` no hace falta configurarlo — Render lo asigna automáticamente y
nuestro `server.js` ya usa `process.env.PORT` si existe.)

### 7.4 Despliega

1. Clic en **Create Web Service**. Render va a instalar dependencias y
   arrancar el servidor — puedes ver el progreso en los logs, en vivo.
2. Cuando termine, verás una URL pública como
   `https://portafolio-backend-xxxx.onrender.com`.
3. Pruébala: abre `https://tu-url.onrender.com/api/health` en el navegador,
   deberías ver `{"status":"ok"}`.

⚠️ En el plan gratuito, Render "duerme" el servicio tras ~15 minutos sin
uso, y la primera petición después de eso tarda unos segundos extra en
responder mientras despierta. Es normal, no es un error.

### 7.5 Conecta tu frontend a la URL de producción

En tu `frontend/api.js`, cambia:
```js
export const API_BASE = "http://localhost:4000/api";
```
por:
```js
export const API_BASE = "https://tu-url.onrender.com/api";
```

Y si en el paso 7.3 dejaste `FRONTEND_URL=*`, ahora que ya tengas tu
portafolio publicado (GitHub Pages, Vercel, Netlify...), vuelve a Render →
tu servicio → Environment → actualiza `FRONTEND_URL` con la URL real de tu
portafolio, para que CORS solo permita peticiones desde ahí.

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
