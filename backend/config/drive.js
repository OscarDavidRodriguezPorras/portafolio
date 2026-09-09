import { google } from "googleapis";

let driveClient = null;

/**
 * Crea (una sola vez) y devuelve un cliente autenticado de la API de Google Drive,
 * usando las credenciales de una cuenta de servicio.
 */
export function getDriveClient() {
  if (driveClient) return driveClient;

  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: ["https://www.googleapis.com/auth/drive"],
  });

  driveClient = google.drive({ version: "v3", auth });
  return driveClient;
}
