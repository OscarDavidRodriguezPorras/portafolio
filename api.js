// ============================================
// CLIENTE DE API - reemplaza a firebase.js
// ============================================
// Cambia esta URL por la de tu backend cuando lo despliegues
// (por ejemplo: "https://tu-backend.onrender.com/api")
export const API_BASE = "https://portafolio-9n0f.onrender.com/api";

function getToken() {
  return sessionStorage.getItem("adminToken");
}

export function setToken(token) {
  sessionStorage.setItem("adminToken", token);
}

export function clearToken() {
  sessionStorage.removeItem("adminToken");
}

export function hasToken() {
  return Boolean(getToken());
}

/**
 * Helper genérico de fetch hacia el backend.
 * Añade automáticamente el token de administrador si existe.
 */
export async function apiRequest(path, { method = "GET", body } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;

  let data = null;
  try {
    data = await res.json();
  } catch (_) {
    // respuesta sin cuerpo JSON
  }

  if (!res.ok) {
    const message = (data && data.message) || `Error ${res.status}`;
    throw new Error(message);
  }

  return data;
}

// -------- Auth --------
export async function login(password) {
  const data = await apiRequest("/auth/login", { method: "POST", body: { password } });
  setToken(data.token);
  return data;
}

// -------- Skills --------
export function fetchSkills() {
  return apiRequest("/skills");
}

export function createSkillCategory(name) {
  return apiRequest("/skills/categories", { method: "POST", body: { name } });
}

export function updateSkillCategory(categoryId, name) {
  return apiRequest(`/skills/categories/${categoryId}`, { method: "PUT", body: { name } });
}

export function deleteSkillCategory(categoryId) {
  return apiRequest(`/skills/categories/${categoryId}`, { method: "DELETE" });
}

export function createSkillItem(categoryId, skill) {
  return apiRequest(`/skills/categories/${categoryId}/items`, { method: "POST", body: skill });
}

export function updateSkillItem(categoryId, skillId, skill) {
  return apiRequest(`/skills/categories/${categoryId}/items/${skillId}`, {
    method: "PUT",
    body: skill,
  });
}

export function deleteSkillItem(categoryId, skillId) {
  return apiRequest(`/skills/categories/${categoryId}/items/${skillId}`, { method: "DELETE" });
}

// -------- Projects --------
export function fetchProjects() {
  return apiRequest("/projects");
}

export function createProject(project) {
  return apiRequest("/projects", { method: "POST", body: project });
}

export function updateProject(projectId, project) {
  return apiRequest(`/projects/${projectId}`, { method: "PUT", body: project });
}

export function deleteProject(projectId) {
  return apiRequest(`/projects/${projectId}`, { method: "DELETE" });
}