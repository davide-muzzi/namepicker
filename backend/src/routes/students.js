import { Router } from "express";
import { db } from "../db/database.js";

const router = Router();

// get students by class
router.get("/class/:classId", (req, res) => {
  db.all(
    "SELECT * FROM students WHERE class_id = ?",
    [req.params.classId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// create student
router.post("/", (req, res) => {
  const { name, class_id } = req.body;
  if (!name || !class_id)
    return res.status(400).json({ error: "name and class_id required" });

  db.run(
    "INSERT INTO students (name, class_id) VALUES (?, ?)",
    [name, class_id],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.status(201).json({ id: this.lastID, name, class_id });
    }
  );
});

// delete student
router.delete("/:id", (req, res) => {
  db.run("DELETE FROM students WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// update student
router.put("/:id", (req, res) => {
  const { name, class_id } = req.body;

  if (!name && !class_id) {
    return res.status(400).json({
      error: "name or class_id required",
    });
  }

  const fields = [];
  const values = [];

  if (name) {
    fields.push("name = ?");
    values.push(name);
  }

  if (class_id) {
    const parsedClassId = Number(class_id);
    if (!Number.isInteger(parsedClassId) || parsedClassId <= 0) {
      return res.status(400).json({
        error: "class_id must be a positive integer",
      });
    }

    fields.push("class_id = ?");
    values.push(parsedClassId);
  }

  values.push(req.params.id);

  db.run(
    `UPDATE students SET ${fields.join(", ")} WHERE id = ?`,
    values,
    function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: "student not found" });
      }

      res.json({ updated: this.changes });
    }
  );
});


export default router;
