import { google } from "googleapis";

let driveClient = null;

/**
 * Crea (una sola vez) y devuelve un cliente autenticado de la API de Google Drive,
 * usando las credenciales de una cuenta de servicio.
 *
 * Soporta dos formas de dar las credenciales:
 * 1. GOOGLE_SERVICE_ACCOUNT_JSON: el contenido completo del JSON de la cuenta
 *    de servicio, pegado como texto en una variable de entorno (ideal para
 *    Render/Railway u otros hosts donde no subes archivos al repo).
 * 2. GOOGLE_APPLICATION_CREDENTIALS: ruta a un archivo .json en disco
 *    (ideal para desarrollo local).
 */
export function getDriveClient() {
  if (driveClient) return driveClient;

  const scopes = ["https://www.googleapis.com/auth/drive"];
  let auth;

  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    auth = new google.auth.GoogleAuth({ credentials, scopes });
  } else {
    auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      scopes,
    });
  }

  driveClient = google.drive({ version: "v3", auth });
  return driveClient;
}
