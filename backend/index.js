const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/usuarios", async (req, res) => {
  try {
    const [usuarios] = await db.query(
      "SELECT id, nombre, correo FROM usuarios ORDER BY id DESC",
    );

    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error al consultar los usuarios",
    });
  }
});

app.post("/usuarios", async (req, res) => {
  const nombre =
    typeof req.body?.nombre === "string" ? req.body.nombre.trim() : "";

  const correo =
    typeof req.body?.correo === "string" ? req.body.correo.trim() : "";

  if (
    !nombre ||
    nombre.length > 100 ||
    correo.length > 150 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)
  ) {
    return res.status(400).json({
      mensaje: "Ingresa un nombre y un correo válidos",
    });
  }

  try {
    const [resultado] = await db.execute(
      "INSERT INTO usuarios (nombre, correo) VALUES (?, ?)",
      [nombre, correo],
    );

    res.status(201).json({
      id: resultado.insertId,
      nombre,
      correo,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        mensaje: "El correo ya está registrado",
      });
    }

    console.error(error);
    res.status(500).json({
      mensaje: "Error al registrar el usuario",
    });
  }
});

app.delete("/usuarios/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({
      mensaje: "El identificador del usuario no es válido",
    });
  }

  try {
    const [resultado] = await db.execute("DELETE FROM usuarios WHERE id = ?", [
      id,
    ]);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado",
      });
    }

    res.json({
      mensaje: "Usuario eliminado correctamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error al eliminar el usuario",
    });
  }
});

app.listen(PORT, "127.0.0.1", () => {
  console.log(`Servidor disponible en http://localhost:${PORT}`);
});
