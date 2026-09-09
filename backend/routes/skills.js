import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { getSkills, saveSkills } from "../services/dataStore.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();

// GET /api/skills -> { categories: [...] }
router.get("/", async (req, res) => {
  try {
    const data = await getSkills();
    res.json(data);
  } catch (error) {
    console.error("Error obteniendo skills:", error);
    res.status(500).json({ message: "Error obteniendo las skills." });
  }
});

// POST /api/skills/categories -> crea categoría { name }
router.post("/categories", requireAdmin, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "El nombre es requerido." });

    const { categories } = await getSkills();
    const newCategory = { id: uuidv4(), name, skills: [] };
    categories.push(newCategory);
    await saveSkills(categories);

    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Error creando categoría:", error);
    res.status(500).json({ message: "Error creando la categoría." });
  }
});

// PUT /api/skills/categories/:id -> edita nombre de categoría
router.put("/categories/:id", requireAdmin, async (req, res) => {
  try {
    const { name } = req.body;
    const { categories } = await getSkills();
    const category = categories.find((c) => c.id === req.params.id);

    if (!category) return res.status(404).json({ message: "Categoría no encontrada." });

    category.name = name ?? category.name;
    await saveSkills(categories);

    res.json(category);
  } catch (error) {
    console.error("Error editando categoría:", error);
    res.status(500).json({ message: "Error editando la categoría." });
  }
});

// DELETE /api/skills/categories/:id
router.delete("/categories/:id", requireAdmin, async (req, res) => {
  try {
    const { categories } = await getSkills();
    const filtered = categories.filter((c) => c.id !== req.params.id);

    if (filtered.length === categories.length) {
      return res.status(404).json({ message: "Categoría no encontrada." });
    }

    await saveSkills(filtered);
    res.status(204).send();
  } catch (error) {
    console.error("Error eliminando categoría:", error);
    res.status(500).json({ message: "Error eliminando la categoría." });
  }
});

// POST /api/skills/categories/:categoryId/items -> añade skill { name, imageUrl, isLanguage, proficiency }
router.post("/categories/:categoryId/items", requireAdmin, async (req, res) => {
  try {
    const { name, imageUrl, isLanguage, proficiency } = req.body;
    const { categories } = await getSkills();
    const category = categories.find((c) => c.id === req.params.categoryId);

    if (!category) return res.status(404).json({ message: "Categoría no encontrada." });

    const newSkill = {
      id: uuidv4(),
      name,
      imageUrl,
      isLanguage: Boolean(isLanguage),
      proficiency: Number(proficiency) || 0,
    };
    category.skills.push(newSkill);
    await saveSkills(categories);

    res.status(201).json(newSkill);
  } catch (error) {
    console.error("Error añadiendo skill:", error);
    res.status(500).json({ message: "Error añadiendo la skill." });
  }
});

// PUT /api/skills/categories/:categoryId/items/:skillId -> edita skill
router.put("/categories/:categoryId/items/:skillId", requireAdmin, async (req, res) => {
  try {
    const { name, imageUrl, isLanguage, proficiency } = req.body;
    const { categories } = await getSkills();
    const category = categories.find((c) => c.id === req.params.categoryId);

    if (!category) return res.status(404).json({ message: "Categoría no encontrada." });

    const skill = category.skills.find((s) => s.id === req.params.skillId);
    if (!skill) return res.status(404).json({ message: "Skill no encontrada." });

    skill.name = name ?? skill.name;
    skill.imageUrl = imageUrl ?? skill.imageUrl;
    skill.isLanguage = isLanguage !== undefined ? Boolean(isLanguage) : skill.isLanguage;
    skill.proficiency = proficiency !== undefined ? Number(proficiency) : skill.proficiency;

    await saveSkills(categories);
    res.json(skill);
  } catch (error) {
    console.error("Error editando skill:", error);
    res.status(500).json({ message: "Error editando la skill." });
  }
});

// DELETE /api/skills/categories/:categoryId/items/:skillId
router.delete("/categories/:categoryId/items/:skillId", requireAdmin, async (req, res) => {
  try {
    const { categories } = await getSkills();
    const category = categories.find((c) => c.id === req.params.categoryId);

    if (!category) return res.status(404).json({ message: "Categoría no encontrada." });

    const before = category.skills.length;
    category.skills = category.skills.filter((s) => s.id !== req.params.skillId);

    if (category.skills.length === before) {
      return res.status(404).json({ message: "Skill no encontrada." });
    }

    await saveSkills(categories);
    res.status(204).send();
  } catch (error) {
    console.error("Error eliminando skill:", error);
    res.status(500).json({ message: "Error eliminando la skill." });
  }
});

export default router;
