import { Router } from "express";
import { db } from "../db/database.js";

const router = Router();

// get all classes
router.get("/", (req, res) => {
  db.all("SELECT * FROM classes", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// create class
router.post("/", (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "name required" });

  db.run("INSERT INTO classes (name) VALUES (?)", [name], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.status(201).json({ id: this.lastID, name });
  });
});

// delete class
router.delete("/:id", (req, res) => {
  db.run("DELETE FROM classes WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

export default router;
