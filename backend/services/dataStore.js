import { readJsonFile, writeJsonFile } from "./driveStore.js";

const SKILLS_DEFAULT = { categories: [] };
const PROJECTS_DEFAULT = { projects: [] };

function getSkillsFileId() {
  const id = process.env.DRIVE_SKILLS_FILE_ID;
  if (!id) throw new Error("Falta DRIVE_SKILLS_FILE_ID en tu archivo .env");
  return id;
}

function getProjectsFileId() {
  const id = process.env.DRIVE_PROJECTS_FILE_ID;
  if (!id) throw new Error("Falta DRIVE_PROJECTS_FILE_ID en tu archivo .env");
  return id;
}

export async function getSkills() {
  const fileId = getSkillsFileId();
  const data = await readJsonFile(fileId, SKILLS_DEFAULT);
  return data.categories ? data : SKILLS_DEFAULT;
}

export async function saveSkills(categories) {
  const fileId = getSkillsFileId();
  await writeJsonFile(fileId, { categories });
  return categories;
}

export async function getProjects() {
  const fileId = getProjectsFileId();
  const data = await readJsonFile(fileId, PROJECTS_DEFAULT);
  return data.projects ? data : PROJECTS_DEFAULT;
}

export async function saveProjects(projects) {
  const fileId = getProjectsFileId();
  await writeJsonFile(fileId, { projects });
  return projects;
}

