import { getDriveClient } from "../config/drive.js";

// Cola simple por archivo para evitar que dos escrituras concurrentes
// se pisen entre sí (lectura-modificación-escritura no es atómica en Drive).
const writeQueues = new Map();

function queueWrite(fileKey, task) {
  const previous = writeQueues.get(fileKey) || Promise.resolve();
  const next = previous.then(task, task);
  // Evita que un rechazo detenga las siguientes escrituras en la cola
  writeQueues.set(fileKey, next.catch(() => {}));
  return next;
}

/**
 * Lee y parsea el contenido JSON de un archivo de Drive.
 * IMPORTANTE: el archivo debe existir de antemano y ser propiedad de tu
 * cuenta normal de Google (no de la cuenta de servicio), compartido con
 * permiso de Editor hacia la cuenta de servicio. Las cuentas de servicio
 * no tienen cuota de almacenamiento propia, así que no pueden crear
 * archivos nuevos en un Drive personal, solo leer/editar los existentes.
 */
export async function readJsonFile(fileId, fallback) {
  const drive = getDriveClient();
  try {
    const res = await drive.files.get(
      { fileId, alt: "media" },
      { responseType: "json" }
    );
    return res.data ?? fallback;
  } catch (error) {
    console.error(`Error leyendo archivo de Drive (${fileId}):`, error.message);
    return fallback;
  }
}

/**
 * Sobrescribe el contenido de un archivo de Drive con un objeto JSON.
 * Las escrituras al mismo fileId se serializan entre sí.
 */
export async function writeJsonFile(fileId, data) {
  const drive = getDriveClient();
  return queueWrite(fileId, async () => {
    await drive.files.update({
      fileId,
      media: {
        mimeType: "application/json",
        body: JSON.stringify(data, null, 2),
      },
    });
    return data;
  });
}

