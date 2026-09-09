import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import skillsRoutes from "./routes/skills.js";
import projectsRoutes from "./routes/projects.js";

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/projects", projectsRoutes);

// Manejador de errores genérico (por si algo se escapa de los try/catch)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Error interno del servidor." });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Backend del portafolio corriendo en http://localhost:${PORT}`);
});
