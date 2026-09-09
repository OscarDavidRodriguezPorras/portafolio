import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { getProjects, saveProjects } from "../services/dataStore.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();

// GET /api/projects -> { projects: [...] }
router.get("/", async (req, res) => {
  try {
    const data = await getProjects();
    res.json(data);
  } catch (error) {
    console.error("Error obteniendo proyectos:", error);
    res.status(500).json({ message: "Error obteniendo los proyectos." });
  }
});

// POST /api/projects -> crea proyecto
router.post("/", requireAdmin, async (req, res) => {
  try {
    const { title, tag, description, imageUrl, tech, detailLink, detailDescription } = req.body;

    if (!title) return res.status(400).json({ message: "El título es requerido." });

    const { projects } = await getProjects();
    const newProject = {
      id: uuidv4(),
      title,
      tag,
      description,
      imageUrl,
      tech,
      detailLink,
      detailDescription,
    };
    projects.push(newProject);
    await saveProjects(projects);

    res.status(201).json(newProject);
  } catch (error) {
    console.error("Error creando proyecto:", error);
    res.status(500).json({ message: "Error creando el proyecto." });
  }
});

// PUT /api/projects/:id -> edita proyecto
router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const { projects } = await getProjects();
    const project = projects.find((p) => p.id === req.params.id);

    if (!project) return res.status(404).json({ message: "Proyecto no encontrado." });

    const { title, tag, description, imageUrl, tech, detailLink, detailDescription } = req.body;
    Object.assign(project, {
      title: title ?? project.title,
      tag: tag ?? project.tag,
      description: description ?? project.description,
      imageUrl: imageUrl ?? project.imageUrl,
      tech: tech ?? project.tech,
      detailLink: detailLink ?? project.detailLink,
      detailDescription: detailDescription ?? project.detailDescription,
    });

    await saveProjects(projects);
    res.json(project);
  } catch (error) {
    console.error("Error editando proyecto:", error);
    res.status(500).json({ message: "Error editando el proyecto." });
  }
});

// DELETE /api/projects/:id
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const { projects } = await getProjects();
    const filtered = projects.filter((p) => p.id !== req.params.id);

    if (filtered.length === projects.length) {
      return res.status(404).json({ message: "Proyecto no encontrado." });
    }

    await saveProjects(filtered);
    res.status(204).send();
  } catch (error) {
    console.error("Error eliminando proyecto:", error);
    res.status(500).json({ message: "Error eliminando el proyecto." });
  }
});

export default router;
